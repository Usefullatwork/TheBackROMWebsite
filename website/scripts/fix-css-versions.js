#!/usr/bin/env node
/**
 * fix-css-versions.js - Add version hash to CSS links
 *
 * Fixes:
 * - CSS links missing ?v= version query string
 *
 * Skips:
 * - External CSS (http/https URLs)
 * - CSS that already has version query string
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXCLUDE_DIRS = ['node_modules', '.git', 'docs', 'images-originals', 'scripts'];

let stats = {
  versionsAdded: 0,
  filesModified: 0,
  cssLinksProcessed: 0
};

// Get today's date in YYYYMMDD format for version string
const VERSION = new Date().toISOString().split('T')[0].replace(/-/g, '');

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

// ── CSS Link Processing ───────────────────────────────────────────────────────

function getCssVersion(cssPath, htmlFilePath) {
  // Try to get the actual file modification date
  try {
    // Resolve relative path from HTML file location
    const htmlDir = path.dirname(htmlFilePath);
    let fullCssPath;

    if (cssPath.startsWith('../')) {
      fullCssPath = path.resolve(htmlDir, cssPath);
    } else if (cssPath.startsWith('./')) {
      fullCssPath = path.resolve(htmlDir, cssPath);
    } else {
      fullCssPath = path.resolve(htmlDir, cssPath);
    }

    if (fs.existsSync(fullCssPath)) {
      const stat = fs.statSync(fullCssPath);
      return stat.mtime.toISOString().split('T')[0].replace(/-/g, '');
    }
  } catch (err) {
    // Fall through to default
  }

  // Default to today's date
  return VERSION;
}

function processLinkTag(linkTag, htmlFilePath) {
  // Skip if not a stylesheet
  if (!/rel=["']stylesheet["']/i.test(linkTag) && !/rel=["']preload["'][^>]*as=["']style["']/i.test(linkTag)) {
    return { modified: linkTag, versionAdded: false };
  }

  // Get href
  const hrefMatch = linkTag.match(/href=["']([^"']+)["']/i);
  if (!hrefMatch) {
    return { modified: linkTag, versionAdded: false };
  }

  const href = hrefMatch[1];

  // Skip external CSS (http/https)
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return { modified: linkTag, versionAdded: false };
  }

  // Skip if not a .css file
  if (!href.includes('.css')) {
    return { modified: linkTag, versionAdded: false };
  }

  // Skip if already has version query string
  if (href.includes('?v=') || href.includes('&v=')) {
    return { modified: linkTag, versionAdded: false };
  }

  // Get version based on file modification date
  const version = getCssVersion(href, htmlFilePath);

  // Add version query string
  const newHref = href + '?v=' + version;
  const modified = linkTag.replace(href, newHref);

  return { modified, versionAdded: true, cssFile: path.basename(href) };
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(ROOT, filePath);
  let fileModified = false;
  let fileVersionsAdded = 0;
  const cssFilesFixed = [];

  // Find all link tags with href containing .css
  const linkRegex = /<link\s[^>]*href=["'][^"']*\.css[^"']*["'][^>]*>/gi;
  let match;
  const replacements = [];

  while ((match = linkRegex.exec(content)) !== null) {
    const original = match[0];
    const result = processLinkTag(original, filePath);
    stats.cssLinksProcessed++;

    if (result.versionAdded) {
      replacements.push({ original, replacement: result.modified });
      fileVersionsAdded++;
      cssFilesFixed.push(result.cssFile);
      fileModified = true;
    }
  }

  // Apply replacements (reverse order to maintain positions)
  for (const { original, replacement } of replacements) {
    content = content.replace(original, replacement);
  }

  if (fileModified) {
    fs.writeFileSync(filePath, content, 'utf8');
    stats.filesModified++;
    stats.versionsAdded += fileVersionsAdded;
    console.log(`[FIXED] ${relPath}: +${fileVersionsAdded} versions (${cssFilesFixed.join(', ')})`);
  }

  return fileModified;
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  console.log('Fix CSS Version Hashes');
  console.log('======================\n');
  console.log(`Version string: ${VERSION}\n`);

  const htmlFiles = findHtmlFiles(ROOT);
  console.log(`Found ${htmlFiles.length} HTML files\n`);

  for (const filePath of htmlFiles) {
    fixFile(filePath);
  }

  console.log('\n--- Summary ---');
  console.log(`CSS links processed: ${stats.cssLinksProcessed}`);
  console.log(`Version hashes added: ${stats.versionsAdded}`);
  console.log(`Files modified: ${stats.filesModified}`);
}

main();
