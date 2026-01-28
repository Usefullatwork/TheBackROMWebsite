#!/usr/bin/env node
/**
 * fix-css-preload.js - Add CSS preload tags to pages missing them
 *
 * Adds <link rel="preload" as="style"> for the first local CSS file found
 * to improve page load performance.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXCLUDE_DIRS = ['node_modules', '.git', 'docs', 'images-originals', 'scripts'];

let stats = {
  preloadsAdded: 0,
  filesModified: 0
};

// ── File Discovery ────────────────────────────────────────────────────────────

function findHtmlFiles(dir) {
  let files = [];
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory() && !EXCLUDE_DIRS.includes(item)) {
        files = files.concat(findHtmlFiles(fullPath));
      } else if (item.endsWith('.html')) {
        files.push(fullPath);
      }
    }
  } catch (err) { /* skip inaccessible */ }
  return files;
}

// ── CSS Preload Check & Fix ───────────────────────────────────────────────────

function hasCssPreload(content) {
  return /<link\s[^>]*rel=["']preload["'][^>]*as=["']style["']/i.test(content);
}

function findFirstLocalCss(content) {
  // Find the first local CSS link (not http/https)
  const linkRegex = /<link\s[^>]*href=["']([^"']+\.css[^"']*)["'][^>]*rel=["']stylesheet["'][^>]*>/gi;
  const linkRegex2 = /<link\s[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+\.css[^"']*)["'][^>]*>/gi;

  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const href = match[1];
    if (!href.startsWith('http://') && !href.startsWith('https://')) {
      return href;
    }
  }

  while ((match = linkRegex2.exec(content)) !== null) {
    const href = match[1];
    if (!href.startsWith('http://') && !href.startsWith('https://')) {
      return href;
    }
  }

  return null;
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(ROOT, filePath);

  // Skip if already has CSS preload
  if (hasCssPreload(content)) {
    return false;
  }

  // Find first local CSS to preload
  const cssHref = findFirstLocalCss(content);
  if (!cssHref) {
    return false;
  }

  // Create preload tag
  const preloadTag = `<link rel="preload" as="style" href="${cssHref}" />`;

  // Insert preload tag after <meta charset> or at start of <head>
  if (/<meta\s[^>]*charset[^>]*>/i.test(content)) {
    content = content.replace(
      /(<meta\s[^>]*charset[^>]*>)/i,
      `$1\n  ${preloadTag}`
    );
  } else if (/<head[^>]*>/i.test(content)) {
    content = content.replace(
      /(<head[^>]*>)/i,
      `$1\n  ${preloadTag}`
    );
  } else {
    console.log(`[SKIP] ${relPath}: No <head> tag found`);
    return false;
  }

  fs.writeFileSync(filePath, content, 'utf8');
  stats.preloadsAdded++;
  stats.filesModified++;
  console.log(`[ADDED] ${relPath}: preload for ${path.basename(cssHref)}`);

  return true;
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  console.log('Fix CSS Preload');
  console.log('===============\n');

  const htmlFiles = findHtmlFiles(ROOT);
  console.log(`Found ${htmlFiles.length} HTML files\n`);

  for (const filePath of htmlFiles) {
    fixFile(filePath);
  }

  console.log('\n--- Summary ---');
  console.log(`CSS preloads added: ${stats.preloadsAdded}`);
  console.log(`Files modified: ${stats.filesModified}`);
}

main();
