/**
 * Orphan Page Detector
 * Finds pages with zero inbound links
 *
 * Usage: node scripts/audit-orphans.js
 *
 * Checks:
 * 1. Build link graph of all pages
 * 2. Find pages with zero inbound links
 * 3. Categorize by type (hub, sub-article, blog)
 * 4. Suggest parent pages for orphans
 */

const fs = require('fs');
const path = require('path');

// Page type definitions
const PAGE_TYPES = {
  'index': ['index.html', 'en/index.html'],
  'hub': /^(plager\/[^\/]+\.html|en\/conditions\/[^\/]+\.html)$/,
  'sub-article': /^(plager\/[^\/]+\/[^\/]+\.html|en\/conditions\/[^\/]+\/[^\/]+\.html)$/,
  'blog': /^(blogg\/[^\/]+\.html|en\/blog\/[^\/]+\.html)$/,
  'faq': /^(faq\/[^\/]+\.html)$/,
  'service': /^(tjeneste\/[^\/]+\.html|en\/services\/[^\/]+\.html)$/,
  'other': /.*/
};

// Expected parent pages
const PARENT_SUGGESTIONS = {
  'plager/korsrygg/': 'plager/korsryggsmerte.html',
  'plager/nakke/': 'plager/nakkesmerter.html',
  'plager/hodepine/': 'plager/hodepine.html',
  'plager/skulder/': 'plager/skuldersmerter.html',
  'plager/kne/': 'plager/knesmerter.html',
  'plager/hofte/': 'plager/hofte-og-bekkensmerter.html',
  'plager/kjeve/': 'plager/kjevesmerte.html',
  'plager/fot/': 'plager/fotsmerter.html',
  'plager/svimmelhet/': 'plager/svimmelhet.html',
  'plager/idrettsskader/': 'plager/idrettsskader.html',
  'plager/albue-arm/': 'plager.html',
  'en/conditions/lower-back/': 'en/conditions/lower-back-pain.html',
  'en/conditions/neck/': 'en/conditions/neck-pain.html',
  'en/conditions/headache/': 'en/conditions/headache.html',
  'en/conditions/shoulder/': 'en/conditions/shoulder-pain.html',
  'en/conditions/knee/': 'en/conditions/knee-pain.html',
  'en/conditions/hip/': 'en/conditions/hip-pain.html',
  'en/conditions/jaw/': 'en/conditions/jaw-pain.html',
  'en/conditions/foot/': 'en/conditions/foot-pain.html',
  'en/conditions/dizziness/': 'en/conditions/dizziness.html',
  'en/conditions/elbow-arm/': 'en/conditions.html',
  'blogg/': 'blogg/index.html',
  'en/blog/': 'en/blog/index.html',
  'faq/': 'faq.html',
  'tjeneste/': 'services.html',
  'en/services/': 'en/services.html'
};

const stats = {
  totalFiles: 0,
  totalLinks: 0,
  orphanPages: 0
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

// Extract internal links from HTML
function extractLinks(content) {
  const linkRegex = /<a[^>]+href="([^"#?]+)"[^>]*>/gi;
  const links = [];
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const href = match[1];
    if (!href.startsWith('http') && !href.startsWith('mailto:') &&
        !href.startsWith('tel:') && !href.startsWith('javascript:') &&
        !href.startsWith('sms:') && href.length > 0) {
      links.push(href);
    }
  }
  return links;
}

// Resolve relative path to absolute
function resolvePath(href, currentDir, baseDir) {
  let resolved;

  if (href.startsWith('/')) {
    resolved = href.slice(1);
  } else if (href.startsWith('../')) {
    const parts = currentDir.split('/').filter(p => p);
    let linkParts = href.split('/');
    while (linkParts[0] === '..') {
      parts.pop();
      linkParts.shift();
    }
    resolved = parts.concat(linkParts).join('/');
  } else if (!href.includes('/')) {
    resolved = currentDir + '/' + href;
  } else {
    resolved = currentDir + '/' + href;
  }

  // Normalize
  resolved = resolved.replace(/\/+/g, '/').replace(/^\//, '');

  // Check if file exists, if not try with index.html
  const fullPath = path.join(baseDir, resolved);
  if (!fs.existsSync(fullPath) && !resolved.endsWith('.html')) {
    if (fs.existsSync(path.join(baseDir, resolved, 'index.html'))) {
      resolved = resolved + '/index.html';
    } else if (fs.existsSync(fullPath + '.html')) {
      resolved = resolved + '.html';
    }
  }

  return resolved;
}

// Get page type
function getPageType(relativePath) {
  if (PAGE_TYPES.index.includes(relativePath)) return 'index';
  if (relativePath.match(PAGE_TYPES.hub)) return 'hub';
  if (relativePath.match(PAGE_TYPES['sub-article'])) return 'sub-article';
  if (relativePath.match(PAGE_TYPES.blog)) return 'blog';
  if (relativePath.match(PAGE_TYPES.faq)) return 'faq';
  if (relativePath.match(PAGE_TYPES.service)) return 'service';
  return 'other';
}

// Get suggested parent
function getSuggestedParent(relativePath) {
  for (const [prefix, parent] of Object.entries(PARENT_SUGGESTIONS)) {
    if (relativePath.startsWith(prefix)) {
      return parent;
    }
  }
  return 'index.html';
}

// Main
console.log('\nOrphan Page Detector');
console.log('='.repeat(50));
console.log('Building link graph...\n');

const baseDir = path.join(__dirname, '..');
const allFiles = findHtmlFiles(baseDir);
stats.totalFiles = allFiles.length;

console.log(`Found ${allFiles.length} HTML files\n`);

// Build inbound link map
const inboundLinks = new Map();
allFiles.forEach(file => {
  const relativePath = file.replace(/^.*?website\//, '');
  inboundLinks.set(relativePath, []);
});

// Process each file
console.log('Analyzing links...');
allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const links = extractLinks(content);
  const relativePath = file.replace(/^.*?website\//, '');
  const currentDir = path.dirname(relativePath);

  links.forEach(href => {
    const targetPath = resolvePath(href, currentDir, baseDir);

    // Check if target is a known file
    if (inboundLinks.has(targetPath)) {
      inboundLinks.get(targetPath).push(relativePath);
      stats.totalLinks++;
    }
  });
});

// Find orphan pages
const orphanPages = [];
const entryPoints = [
  'index.html',
  'en/index.html',
  'sitemap.xml',
  'blogg/index.html',
  'en/blog/index.html',
  'plager.html',
  'en/conditions.html',
  'faq.html',
  'services.html',
  'en/services.html'
];

for (const [page, sources] of inboundLinks) {
  // Skip entry points and special files
  if (entryPoints.includes(page)) continue;
  if (page.includes('404')) continue;
  if (page.includes('privacy') || page.includes('personvern')) continue;
  if (page.startsWith('docs/')) continue;

  if (sources.length === 0) {
    orphanPages.push({
      page,
      type: getPageType(page),
      suggestedParent: getSuggestedParent(page)
    });
    stats.orphanPages++;
  }
}

// Sort by type
orphanPages.sort((a, b) => {
  const typeOrder = ['hub', 'sub-article', 'blog', 'faq', 'service', 'other'];
  return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
});

// Generate report
const report = [];
report.push('# Orphan Pages Report');
report.push('');
report.push(`**Generated:** ${new Date().toISOString().split('T')[0]}`);
report.push(`**Files scanned:** ${stats.totalFiles}`);
report.push(`**Links analyzed:** ${stats.totalLinks}`);
report.push(`**Orphan pages found:** ${stats.orphanPages}`);
report.push('');
report.push('## Summary');
report.push('');
report.push('An "orphan page" has no internal links pointing to it, making it hard for users and search engines to discover.');
report.push('');

// Count by type
const byType = {};
orphanPages.forEach(p => {
  byType[p.type] = (byType[p.type] || 0) + 1;
});

report.push('| Page Type | Orphan Count |');
report.push('|-----------|--------------|');
for (const [type, count] of Object.entries(byType)) {
  report.push(`| ${type} | ${count} |`);
}
report.push('');

if (orphanPages.length === 0) {
  report.push('## Results');
  report.push('');
  report.push('✅ No orphan pages found! All pages have at least one inbound link.');
} else {
  report.push('## Orphan Pages by Type');
  report.push('');

  // Group by type
  const grouped = {};
  orphanPages.forEach(p => {
    if (!grouped[p.type]) grouped[p.type] = [];
    grouped[p.type].push(p);
  });

  for (const [type, pages] of Object.entries(grouped)) {
    report.push(`### ${type.charAt(0).toUpperCase() + type.slice(1)} Pages (${pages.length})`);
    report.push('');
    report.push('| Page | Suggested Parent |');
    report.push('|------|------------------|');
    pages.forEach(p => {
      report.push(`| ${p.page} | ${p.suggestedParent} |`);
    });
    report.push('');
  }
}

// Pages with few inbound links
report.push('## Pages with Low Link Count');
report.push('');
report.push('Pages with only 1 inbound link may also benefit from more internal linking:');
report.push('');

const lowLinkPages = [];
for (const [page, sources] of inboundLinks) {
  if (sources.length === 1 && !entryPoints.includes(page) && !page.includes('404') && !page.startsWith('docs/')) {
    lowLinkPages.push({
      page,
      source: sources[0],
      type: getPageType(page)
    });
  }
}

if (lowLinkPages.length === 0) {
  report.push('✅ All pages have multiple inbound links');
} else {
  report.push(`ℹ️ ${lowLinkPages.length} pages have only 1 inbound link`);
  report.push('');
  report.push('| Page | Only Linked From | Type |');
  report.push('|------|------------------|------|');
  lowLinkPages.slice(0, 30).forEach(p => {
    report.push(`| ${p.page} | ${p.source} | ${p.type} |`);
  });
  if (lowLinkPages.length > 30) {
    report.push('');
    report.push(`... and ${lowLinkPages.length - 30} more`);
  }
}

report.push('');
report.push('## Recommendations');
report.push('');
report.push('1. **Add orphan pages** to appropriate parent page navigation (subnav, related links)');
report.push('2. **Link from blog posts** to relevant condition pages');
report.push('3. **Consider consolidating** or removing pages that don\'t fit the site structure');
report.push('4. **Add to sitemap** if not already present');
report.push('');

// Write report
const reportPath = path.join(baseDir, 'docs', 'ORPHAN-PAGES-REPORT.md');
fs.writeFileSync(reportPath, report.join('\n'), 'utf8');

// Console summary
console.log('\nResults:');
console.log(`  Total orphan pages: ${stats.orphanPages}`);
console.log(`  Low-link pages (1 link): ${lowLinkPages.length}`);
console.log('');
console.log(`Report saved to: docs/ORPHAN-PAGES-REPORT.md`);
