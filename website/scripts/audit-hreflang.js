/**
 * Hreflang Bidirectional Checker
 * Verifies hreflang tags are properly configured
 *
 * Usage: node scripts/audit-hreflang.js
 *
 * Checks:
 * 1. Bidirectional consistency (A→B means B→A)
 * 2. Missing translations (NO pages without EN, vice versa)
 * 3. Self-referencing hreflang tags
 * 4. URL validation (hreflang points to existing file)
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://thebackrom.com';

const issues = {
  missingBidirectional: [],
  missingSelfRef: [],
  brokenHreflangTarget: [],
  missingTranslation: [],
  noHreflangTags: []
};

const stats = {
  totalFiles: 0,
  withHreflang: 0,
  pairsChecked: 0
};

// Find all HTML files
function findHtmlFiles(dir, excludeDirs = ['node_modules', '.git', 'images', 'images-originals', 'scripts', 'docs']) {
  let files = [];
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory() && !excludeDirs.includes(item)) {
        files = files.concat(findHtmlFiles(fullPath, excludeDirs));
      } else if (item.endsWith('.html') && !item.includes('template')) {
        files.push(fullPath.replace(/\\/g, '/'));
      }
    }
  } catch (err) {
    // Skip inaccessible directories
  }
  return files;
}

// Extract hreflang tags from HTML
function extractHreflang(content) {
  const hreflangRegex = /<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']+)["'][^>]+href=["']([^"']+)["'][^>]*>/gi;
  const hreflangRegex2 = /<link[^>]+hreflang=["']([^"']+)["'][^>]+href=["']([^"']+)["'][^>]*>/gi;
  const hreflangRegex3 = /<link[^>]+href=["']([^"']+)["'][^>]+hreflang=["']([^"']+)["'][^>]*>/gi;

  const results = [];
  let match;

  // Try different attribute orders
  while ((match = hreflangRegex.exec(content)) !== null) {
    results.push({ lang: match[1], href: match[2] });
  }

  // Reset and try second pattern
  while ((match = hreflangRegex2.exec(content)) !== null) {
    // Check if not already added
    const exists = results.some(r => r.lang === match[1] && r.href === match[2]);
    if (!exists) {
      results.push({ lang: match[1], href: match[2] });
    }
  }

  // Try third pattern (href before hreflang)
  while ((match = hreflangRegex3.exec(content)) !== null) {
    const exists = results.some(r => r.lang === match[2] && r.href === match[1]);
    if (!exists) {
      results.push({ lang: match[2], href: match[1] });
    }
  }

  return results;
}

// Convert URL to local path
function urlToPath(url, baseDir) {
  let localPath = url
    .replace(BASE_URL, '')
    .replace(/^\//, '')
    .split('?')[0]
    .split('#')[0];

  // Handle empty path (root) or trailing slash - assume index.html
  if (localPath === '' || localPath.endsWith('/')) {
    localPath = (localPath || '') + 'index.html';
  }

  return path.join(baseDir, localPath);
}

// Get the expected EN counterpart for a NO page
function getExpectedEnPath(noPath) {
  const relativePath = noPath.replace(/^.*?website\//, '');

  // Map common patterns
  const mappings = [
    { no: /^plager\/(.+)$/, en: 'en/conditions/$1' },
    { no: /^blogg\/(.+)$/, en: 'en/blog/$1' },
    { no: /^tjeneste\/(.+)$/, en: 'en/services/$1' },
    { no: /^faq\/(.+)$/, en: 'en/faq/$1' },
    { no: /^behandlinger\/(.+)$/, en: 'en/treatments/$1' },
    { no: /^index\.html$/, en: 'en/index.html' },
    { no: /^about\.html$/, en: 'en/about.html' },
    { no: /^contact\.html$/, en: 'en/contact.html' },
    { no: /^priser\.html$/, en: 'en/prices.html' },
    { no: /^faq\.html$/, en: 'en/faq.html' },
    { no: /^services\.html$/, en: 'en/services.html' }
  ];

  for (const mapping of mappings) {
    if (mapping.no.test(relativePath)) {
      return relativePath.replace(mapping.no, mapping.en);
    }
  }

  return null;
}

// Get the expected NO counterpart for an EN page
function getExpectedNoPath(enPath) {
  const relativePath = enPath.replace(/^.*?website\//, '');

  // Map common patterns
  const mappings = [
    { en: /^en\/conditions\/(.+)$/, no: 'plager/$1' },
    { en: /^en\/blog\/(.+)$/, no: 'blogg/$1' },
    { en: /^en\/services\/(.+)$/, no: 'tjeneste/$1' },
    { en: /^en\/faq\/(.+)$/, no: 'faq/$1' },
    { en: /^en\/treatments\/(.+)$/, no: 'behandlinger/$1' },
    { en: /^en\/index\.html$/, no: 'index.html' },
    { en: /^en\/about\.html$/, no: 'about.html' },
    { en: /^en\/contact\.html$/, no: 'contact.html' },
    { en: /^en\/prices\.html$/, no: 'priser.html' },
    { en: /^en\/faq\.html$/, no: 'faq.html' },
    { en: /^en\/services\.html$/, no: 'services.html' }
  ];

  for (const mapping of mappings) {
    if (mapping.en.test(relativePath)) {
      return relativePath.replace(mapping.en, mapping.no);
    }
  }

  return null;
}

// Main analysis
function analyzeFile(filePath, allFiles, baseDir, hreflangMap) {
  const content = fs.readFileSync(filePath, 'utf8');
  const hreflangTags = extractHreflang(content);
  const relativePath = filePath.replace(/^.*?website[\\/]/, '').replace(/\\/g, '/');
  const isEnglish = relativePath.startsWith('en/');
  const currentLang = isEnglish ? 'en' : 'nb';

  // Skip certain pages that shouldn't have hreflang
  const skipPages = ['404.html', 'personvern.html', 'privacy-policy.html'];
  const fileName = path.basename(relativePath);
  if (skipPages.includes(fileName)) {
    return;
  }

  // Store hreflang info for bidirectional check
  hreflangMap.set(relativePath, hreflangTags);

  if (hreflangTags.length === 0) {
    issues.noHreflangTags.push(relativePath);
    return;
  }

  stats.withHreflang++;

  // Check for self-reference
  const hasSelfRef = hreflangTags.some(tag => {
    const targetPath = urlToPath(tag.href, baseDir);
    const targetRelative = targetPath.replace(/^.*?website[\\/]/, '').replace(/\\/g, '/');
    return targetRelative === relativePath && tag.lang === currentLang;
  });

  if (!hasSelfRef) {
    issues.missingSelfRef.push({
      file: relativePath,
      lang: currentLang
    });
  }

  // Check each hreflang target exists
  hreflangTags.forEach(tag => {
    const targetPath = urlToPath(tag.href, baseDir);
    if (!fs.existsSync(targetPath)) {
      issues.brokenHreflangTarget.push({
        file: relativePath,
        lang: tag.lang,
        target: tag.href
      });
    }
  });
}

// Check bidirectional consistency
function checkBidirectional(hreflangMap, baseDir) {
  for (const [sourcePath, tags] of hreflangMap) {
    tags.forEach(tag => {
      const targetPath = urlToPath(tag.href, baseDir);
      const targetRelative = targetPath.replace(/^.*?website[\\/]/, '').replace(/\\/g, '/');

      // Skip if target is self
      if (targetRelative === sourcePath) return;

      // Check if target has hreflang back to source
      // Try both forward and backslash variants for Windows compatibility
      let targetTags = hreflangMap.get(targetRelative);
      if (!targetTags) {
        targetTags = hreflangMap.get(targetRelative.replace(/\//g, '\\'));
      }
      if (!targetTags) {
        // Also try without leading path components
        for (const [key, value] of hreflangMap) {
          if (key.endsWith(targetRelative) || key.replace(/\\/g, '/').endsWith(targetRelative)) {
            targetTags = value;
            break;
          }
        }
      }
      if (!targetTags) {
        issues.missingBidirectional.push({
          source: sourcePath,
          target: targetRelative,
          reason: 'Target has no hreflang tags'
        });
        return;
      }

      // Determine source language from self-referencing hreflang or path
      // First, try to find a self-referencing hreflang tag (where href contains full source path)
      let currentLang = sourcePath.startsWith('en/') ? 'en' : 'nb';
      const selfRef = tags.find(t => t.href.includes(sourcePath));
      if (selfRef) {
        currentLang = selfRef.lang;
      }

      const sourceUrl = `${BASE_URL}/${sourcePath}`;
      const sourceUrlAlt = sourceUrl.replace(/\/index\.html$/, '/');
      const hasBacklink = targetTags.some(t => {
        if (t.lang !== currentLang) return false;
        // Check various URL formats
        const normalizedHref = t.href.replace(/\/$/, '/index.html');
        return t.href === sourceUrl ||
               t.href === sourceUrlAlt ||
               t.href === `/${sourcePath}` ||
               t.href.endsWith('/' + sourcePath) ||
               normalizedHref === sourceUrl ||
               t.href.includes(sourcePath);
      });

      if (!hasBacklink) {
        issues.missingBidirectional.push({
          source: sourcePath,
          target: targetRelative,
          reason: 'Target missing backlink to source'
        });
      }

      stats.pairsChecked++;
    });
  }
}

// Check for missing translations
function checkMissingTranslations(allFiles, baseDir) {
  const norwegianFiles = allFiles.filter(f => {
    const rel = f.replace(/^.*?website\//, '');
    return !rel.startsWith('en/') && !rel.includes('scripts/') && !rel.includes('node_modules/');
  });

  const englishFiles = allFiles.filter(f => {
    const rel = f.replace(/^.*?website\//, '');
    return rel.startsWith('en/');
  });

  // Check NO → EN
  norwegianFiles.forEach(noFile => {
    const relPath = noFile.replace(/^.*?website\//, '');
    const expectedEn = getExpectedEnPath(relPath);

    if (expectedEn) {
      const enPath = path.join(baseDir, expectedEn);
      if (!fs.existsSync(enPath)) {
        issues.missingTranslation.push({
          source: relPath,
          expectedTarget: expectedEn,
          direction: 'NO→EN'
        });
      }
    }
  });

  // Check EN → NO
  englishFiles.forEach(enFile => {
    const relPath = enFile.replace(/^.*?website\//, '');
    const expectedNo = getExpectedNoPath(relPath);

    if (expectedNo) {
      const noPath = path.join(baseDir, expectedNo);
      if (!fs.existsSync(noPath)) {
        issues.missingTranslation.push({
          source: relPath,
          expectedTarget: expectedNo,
          direction: 'EN→NO'
        });
      }
    }
  });
}

// Main
console.log('\nHreflang Bidirectional Audit');
console.log('='.repeat(50));
console.log('Scanning website for hreflang issues...\n');

const baseDir = path.join(__dirname, '..');
const allFiles = findHtmlFiles(baseDir);
stats.totalFiles = allFiles.length;

console.log(`Found ${allFiles.length} HTML files\n`);
console.log('Analyzing hreflang tags...');

const hreflangMap = new Map();

allFiles.forEach(file => analyzeFile(file, allFiles, baseDir, hreflangMap));

console.log('Checking bidirectional consistency...');
checkBidirectional(hreflangMap, baseDir);

console.log('Checking for missing translations...');
checkMissingTranslations(allFiles, baseDir);

// Generate report
const report = [];
report.push('# Hreflang Audit Report');
report.push('');
report.push(`**Generated:** ${new Date().toISOString().split('T')[0]}`);
report.push(`**Files scanned:** ${stats.totalFiles}`);
report.push(`**Files with hreflang:** ${stats.withHreflang}`);
report.push(`**Pairs checked:** ${stats.pairsChecked}`);
report.push('');
report.push('## Summary');
report.push('');
report.push('| Issue Type | Count |');
report.push('|------------|-------|');
report.push(`| Missing bidirectional links | ${issues.missingBidirectional.length} |`);
report.push(`| Missing self-reference | ${issues.missingSelfRef.length} |`);
report.push(`| Broken hreflang targets | ${issues.brokenHreflangTarget.length} |`);
report.push(`| Pages without hreflang | ${issues.noHreflangTags.length} |`);
report.push(`| Missing translations | ${issues.missingTranslation.length} |`);
report.push('');

// Broken targets (critical)
report.push('## Critical: Broken Hreflang Targets');
report.push('');
if (issues.brokenHreflangTarget.length === 0) {
  report.push('✅ All hreflang targets point to existing files');
} else {
  report.push(`❌ ${issues.brokenHreflangTarget.length} hreflang tag(s) point to non-existent files`);
  report.push('');
  report.push('| Source File | Language | Target URL |');
  report.push('|-------------|----------|------------|');
  issues.brokenHreflangTarget.forEach(issue => {
    report.push(`| ${issue.file} | ${issue.lang} | ${issue.target} |`);
  });
}
report.push('');

// Missing bidirectional
report.push('## Missing Bidirectional Links');
report.push('');
if (issues.missingBidirectional.length === 0) {
  report.push('✅ All hreflang links are bidirectional');
} else {
  report.push(`⚠️ ${issues.missingBidirectional.length} hreflang pair(s) missing bidirectional link`);
  report.push('');
  report.push('| Source | Target | Reason |');
  report.push('|--------|--------|--------|');
  issues.missingBidirectional.slice(0, 30).forEach(issue => {
    report.push(`| ${issue.source} | ${issue.target} | ${issue.reason} |`);
  });
  if (issues.missingBidirectional.length > 30) {
    report.push('');
    report.push(`... and ${issues.missingBidirectional.length - 30} more`);
  }
}
report.push('');

// Missing self-reference
report.push('## Missing Self-Reference');
report.push('');
if (issues.missingSelfRef.length === 0) {
  report.push('✅ All pages have self-referencing hreflang');
} else {
  report.push(`ℹ️ ${issues.missingSelfRef.length} page(s) missing self-referencing hreflang`);
  report.push('');
  report.push('SEO best practice is to include a self-referencing hreflang tag.');
  report.push('');
  issues.missingSelfRef.slice(0, 20).forEach(issue => {
    report.push(`- ${issue.file} (${issue.lang})`);
  });
  if (issues.missingSelfRef.length > 20) {
    report.push(`- ... and ${issues.missingSelfRef.length - 20} more`);
  }
}
report.push('');

// Missing translations
report.push('## Missing Translations');
report.push('');
if (issues.missingTranslation.length === 0) {
  report.push('✅ All pages have translations');
} else {
  report.push(`ℹ️ ${issues.missingTranslation.length} page(s) without expected translation`);
  report.push('');
  report.push('| Source | Expected Target | Direction |');
  report.push('|--------|-----------------|-----------|');
  issues.missingTranslation.slice(0, 30).forEach(issue => {
    report.push(`| ${issue.source} | ${issue.expectedTarget} | ${issue.direction} |`);
  });
  if (issues.missingTranslation.length > 30) {
    report.push('');
    report.push(`... and ${issues.missingTranslation.length - 30} more`);
  }
}
report.push('');

// Pages without hreflang
report.push('## Pages Without Hreflang Tags');
report.push('');
if (issues.noHreflangTags.length === 0) {
  report.push('✅ All pages have hreflang tags');
} else {
  report.push(`ℹ️ ${issues.noHreflangTags.length} page(s) have no hreflang tags`);
  report.push('');
  report.push('These pages may be single-language or intentionally excluded:');
  report.push('');
  issues.noHreflangTags.slice(0, 30).forEach(page => {
    report.push(`- ${page}`);
  });
  if (issues.noHreflangTags.length > 30) {
    report.push(`- ... and ${issues.noHreflangTags.length - 30} more`);
  }
}
report.push('');

// Recommendations
report.push('## Recommendations');
report.push('');
report.push('1. **Fix broken hreflang targets** immediately (SEO critical)');
report.push('2. **Add bidirectional links** for all hreflang pairs');
report.push('3. **Add self-referencing hreflang** to all multilingual pages');
report.push('4. **Consider adding translations** for pages with expected counterparts');
report.push('');

// Write report
const reportPath = path.join(baseDir, 'docs', 'HREFLANG-REPORT.md');
fs.writeFileSync(reportPath, report.join('\n'), 'utf8');

// Console summary
console.log('\nResults:');
console.log(`  Broken hreflang targets: ${issues.brokenHreflangTarget.length}`);
console.log(`  Missing bidirectional: ${issues.missingBidirectional.length}`);
console.log(`  Missing self-ref: ${issues.missingSelfRef.length}`);
console.log(`  Pages without hreflang: ${issues.noHreflangTags.length}`);
console.log(`  Missing translations: ${issues.missingTranslation.length}`);
console.log('');
console.log(`Report saved to: docs/HREFLANG-REPORT.md`);
