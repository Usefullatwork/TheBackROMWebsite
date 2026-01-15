/**
 * Internal Link Checker
 * Verifies all internal links point to existing files
 *
 * Usage: node scripts/check-links.js [path]
 *        node scripts/check-links.js en/
 */

const fs = require('fs');
const path = require('path');

const targetPath = process.argv[2] || '.';

console.log(`\nLink Check: ${targetPath}`);
console.log('='.repeat(50));

const issues = {
  broken: [],
  noHreflang: [],
  missingNoopener: []
};

// Find all HTML files
function findHtmlFiles(dir) {
  let files = [];
  try {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && !['node_modules', '.git'].includes(item)) {
        files = files.concat(findHtmlFiles(fullPath));
      } else if (item.endsWith('.html')) {
        files.push(fullPath);
      }
    }
  } catch (err) {
    // Skip inaccessible directories
  }
  return files;
}

// Extract links from HTML
function extractLinks(content) {
  const linkRegex = /<a[^>]+href="([^"]+)"[^>]*>/gi;
  const links = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    links.push({
      href: match[1],
      full: match[0]
    });
  }
  return links;
}

// Check single file
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const links = extractLinks(content);
  const fileDir = path.dirname(filePath);

  // Check hreflang
  const hasEnHreflang = content.includes('hreflang="en"');
  const hasNbHreflang = content.includes('hreflang="nb"');

  if (filePath.includes('/en/') && (!hasEnHreflang || !hasNbHreflang)) {
    issues.noHreflang.push(filePath);
  }

  links.forEach(link => {
    const href = link.href;

    // Skip anchors, external, mailto, tel, sms, javascript
    if (href.startsWith('#') ||
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('sms:') ||
        href.startsWith('javascript:')) {

      // Check external links for noopener
      if (href.startsWith('http') && !link.full.includes('rel=')) {
        issues.missingNoopener.push({ file: filePath, link: href });
      }
      return;
    }

    // Resolve the path
    let targetFile;
    if (href.startsWith('/')) {
      // Absolute path from root
      targetFile = path.join('.', href);
    } else {
      // Relative path
      targetFile = path.join(fileDir, href);
    }

    // Remove query strings and anchors
    targetFile = targetFile.split('?')[0].split('#')[0];

    // Check if file exists
    if (!fs.existsSync(targetFile)) {
      // Try with .html extension
      if (!targetFile.endsWith('.html') && !fs.existsSync(targetFile + '.html')) {
        // Try as directory with index.html
        if (!fs.existsSync(path.join(targetFile, 'index.html'))) {
          issues.broken.push({
            file: filePath,
            link: href,
            target: targetFile
          });
        }
      }
    }
  });
}

// Run checks
try {
  const files = findHtmlFiles(targetPath);
  console.log(`Checking ${files.length} files...\n`);

  files.forEach(file => checkFile(file));

  // Report
  console.log('-- BROKEN INTERNAL LINKS --\n');
  if (issues.broken.length === 0) {
    console.log('[PASS] No broken links found\n');
  } else {
    console.log(`[FAIL] ${issues.broken.length} broken links:\n`);
    issues.broken.slice(0, 15).forEach(i => {
      console.log(`  ${path.basename(i.file)}:`);
      console.log(`    → ${i.link}`);
    });
    if (issues.broken.length > 15) {
      console.log(`\n  ... and ${issues.broken.length - 15} more`);
    }
    console.log('');
  }

  console.log('-- MISSING HREFLANG (English pages) --\n');
  if (issues.noHreflang.length === 0) {
    console.log('[PASS] All English pages have hreflang\n');
  } else {
    console.log(`[WARN] ${issues.noHreflang.length} pages missing hreflang:\n`);
    issues.noHreflang.slice(0, 10).forEach(f => {
      console.log(`  ${f}`);
    });
    if (issues.noHreflang.length > 10) {
      console.log(`  ... and ${issues.noHreflang.length - 10} more`);
    }
    console.log('');
  }

  console.log('-- EXTERNAL LINKS MISSING rel="noopener" --\n');
  if (issues.missingNoopener.length === 0) {
    console.log('[PASS] All external links have proper rel attribute\n');
  } else {
    console.log(`[INFO] ${issues.missingNoopener.length} external links without noopener\n`);
  }

  // Summary
  console.log('='.repeat(50));
  if (issues.broken.length === 0) {
    console.log('\n[PASS] Link check passed!\n');
    process.exit(0);
  } else {
    console.log(`\n[FAIL] ${issues.broken.length} broken links need fixing\n`);
    process.exit(1);
  }

} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
