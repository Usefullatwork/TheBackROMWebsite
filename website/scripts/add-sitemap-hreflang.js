/**
 * Add Sitemap Hreflang
 * Adds xhtml:link hreflang entries to sitemap.xml
 *
 * Usage: node scripts/add-sitemap-hreflang.js
 *
 * This script:
 * 1. Parses existing sitemap.xml
 * 2. For each URL, finds hreflang links from the HTML file
 * 3. Adds xhtml:link elements to the sitemap
 * 4. Writes updated sitemap.xml
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://thebackrom.com';
const baseDir = path.join(__dirname, '..');

// Extract hreflang tags from HTML file
function extractHreflang(htmlPath) {
  try {
    const content = fs.readFileSync(htmlPath, 'utf8');

    // Find all link tags with hreflang
    const linkTags = content.match(/<link[^>]+hreflang[^>]*>/gi) || [];

    const results = [];
    const seen = new Set();

    linkTags.forEach(tag => {
      // Extract attributes individually
      const hreflangMatch = tag.match(/hreflang=["']([^"']+)["']/i);
      const hrefMatch = tag.match(/href=["']([^"']+)["']/i);

      if (!hreflangMatch || !hrefMatch) return;

      let lang = hreflangMatch[1];
      let href = hrefMatch[1];

      // Normalize the URL
      if (!href.startsWith('http')) {
        if (href.startsWith('/')) {
          href = BASE_URL + href;
        } else {
          // Relative URL - resolve it
          const htmlDir = path.dirname(htmlPath).replace(/\\/g, '/');
          const htmlRelDir = htmlDir.replace(/^.*?website\/?/, '');
          href = BASE_URL + '/' + path.join(htmlRelDir, href).replace(/\\/g, '/');
        }
      }

      const key = `${lang}:${href}`;
      if (!seen.has(key)) {
        seen.add(key);
        results.push({ lang, href });
      }
    });

    return results;
  } catch (err) {
    return [];
  }
}

// URL to file path
function urlToPath(url) {
  let localPath = url
    .replace(BASE_URL, '')
    .replace(/^\//, '');

  if (localPath === '' || localPath.endsWith('/')) {
    localPath += 'index.html';
  }

  return path.join(baseDir, localPath);
}

// Parse sitemap XML (simple regex-based)
function parseSitemap(content) {
  const urls = [];
  const urlRegex = /<url>([\s\S]*?)<\/url>/gi;
  let match;

  while ((match = urlRegex.exec(content)) !== null) {
    const urlBlock = match[1];
    const loc = urlBlock.match(/<loc>([^<]+)<\/loc>/)?.[1];
    const lastmod = urlBlock.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
    const changefreq = urlBlock.match(/<changefreq>([^<]+)<\/changefreq>/)?.[1];
    const priority = urlBlock.match(/<priority>([^<]+)<\/priority>/)?.[1];

    if (loc) {
      urls.push({ loc, lastmod, changefreq, priority });
    }
  }

  return urls;
}

// Main
console.log('\nAdd Sitemap Hreflang');
console.log('='.repeat(50));

const sitemapPath = path.join(baseDir, 'sitemap.xml');

if (!fs.existsSync(sitemapPath)) {
  console.error('Error: sitemap.xml not found');
  process.exit(1);
}

console.log('Reading sitemap.xml...');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
const urls = parseSitemap(sitemapContent);

console.log(`Found ${urls.length} URLs in sitemap\n`);

let updatedCount = 0;
let skippedCount = 0;

// Build new sitemap with hreflang
const lines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  '        xmlns:xhtml="http://www.w3.org/1999/xhtml">'
];

urls.forEach(url => {
  const htmlPath = urlToPath(url.loc);
  const hreflangTags = extractHreflang(htmlPath);

  lines.push('  <url>');
  lines.push(`    <loc>${url.loc}</loc>`);

  if (url.lastmod) {
    lines.push(`    <lastmod>${url.lastmod}</lastmod>`);
  }

  if (hreflangTags.length > 0) {
    hreflangTags.forEach(tag => {
      lines.push(`    <xhtml:link rel="alternate" hreflang="${tag.lang}" href="${tag.href}"/>`);
    });
    updatedCount++;
  } else {
    skippedCount++;
  }

  if (url.changefreq) {
    lines.push(`    <changefreq>${url.changefreq}</changefreq>`);
  }

  if (url.priority) {
    lines.push(`    <priority>${url.priority}</priority>`);
  }

  lines.push('  </url>');
});

lines.push('</urlset>');

// Write new sitemap
const newContent = lines.join('\n');
fs.writeFileSync(sitemapPath, newContent, 'utf8');

console.log('Results:');
console.log(`  URLs with hreflang added: ${updatedCount}`);
console.log(`  URLs without hreflang: ${skippedCount}`);
console.log('');
console.log('sitemap.xml updated successfully!');
