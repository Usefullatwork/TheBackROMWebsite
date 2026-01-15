/**
 * Sitemap Checker
 * Verifies sitemap.xml matches actual files
 *
 * Usage: node scripts/check-sitemap.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n' + '='.repeat(50));
console.log('SITEMAP CHECK');
console.log('='.repeat(50));

// Read sitemap
const sitemapPath = path.join(__dirname, '../sitemap.xml');
const sitemap = fs.readFileSync(sitemapPath, 'utf8');

// Extract URLs from sitemap
const urlRegex = /<loc>https:\/\/thebackrom\.com\/([^<]+)<\/loc>/g;
const sitemapUrls = new Set();
let match;
while ((match = urlRegex.exec(sitemap)) !== null) {
  sitemapUrls.add(match[1]);
}

console.log(`\nSitemap entries: ${sitemapUrls.size}`);

// Find all HTML files (excluding docs and node_modules)
function findHtmlFiles(dir, base = '') {
  let files = [];
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      if (['node_modules', '.git', 'docs'].includes(item)) continue;
      const fullPath = path.join(dir, item);
      const relativePath = base ? `${base}/${item}` : item;
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        files = files.concat(findHtmlFiles(fullPath, relativePath));
      } else if (item.endsWith('.html')) {
        files.push(relativePath.replace(/\\/g, '/'));
      }
    }
  } catch (err) {
    // Skip
  }
  return files;
}

const actualFiles = new Set(findHtmlFiles(path.join(__dirname, '..')));
console.log(`Actual HTML files: ${actualFiles.size}`);

// Find missing from sitemap
const missingFromSitemap = [];
actualFiles.forEach(file => {
  if (!sitemapUrls.has(file)) {
    missingFromSitemap.push(file);
  }
});

// Find orphan sitemap entries (files that don't exist)
const orphanEntries = [];
sitemapUrls.forEach(url => {
  if (!actualFiles.has(url)) {
    orphanEntries.push(url);
  }
});

// Report
console.log('\n-- FILES NOT IN SITEMAP --\n');
if (missingFromSitemap.length === 0) {
  console.log('[PASS] All files are in sitemap');
} else {
  console.log(`[WARN] ${missingFromSitemap.length} files not in sitemap:\n`);
  missingFromSitemap.slice(0, 20).forEach(f => console.log(`  ${f}`));
  if (missingFromSitemap.length > 20) {
    console.log(`  ... and ${missingFromSitemap.length - 20} more`);
  }
}

console.log('\n-- SITEMAP ENTRIES FOR NON-EXISTENT FILES --\n');
if (orphanEntries.length === 0) {
  console.log('[PASS] All sitemap entries point to existing files');
} else {
  console.log(`[FAIL] ${orphanEntries.length} orphan entries in sitemap:\n`);
  orphanEntries.forEach(f => console.log(`  ${f}`));
}

// Summary
console.log('\n' + '='.repeat(50));
if (orphanEntries.length === 0 && missingFromSitemap.length === 0) {
  console.log('\n[PASS] Sitemap is in sync!\n');
  process.exit(0);
} else if (orphanEntries.length > 0) {
  console.log(`\n[FAIL] ${orphanEntries.length} orphan entries need removal\n`);
  process.exit(1);
} else {
  console.log(`\n[WARN] ${missingFromSitemap.length} files could be added to sitemap\n`);
  process.exit(0);
}
