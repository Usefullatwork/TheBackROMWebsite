#!/usr/bin/env node
/**
 * fix-image-attributes.js - Add loading="lazy" and decoding="async" to images
 *
 * Fixes:
 * - Missing loading attribute (adds loading="lazy")
 * - Missing decoding="async" attribute
 *
 * Skips:
 * - Images already with loading="eager" or loading="lazy"
 * - Images already with decoding="async"
 * - Facebook pixel tracking images (1x1)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXCLUDE_DIRS = ['node_modules', '.git', 'docs', 'images-originals', 'scripts'];

let stats = {
  loadingAdded: 0,
  decodingAdded: 0,
  filesModified: 0,
  imagesProcessed: 0
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

// ── Image Processing ──────────────────────────────────────────────────────────

function isTrackingPixel(imgTag) {
  // Skip Facebook pixel and other tracking pixels (1x1 images)
  if (/width=["']1["']/i.test(imgTag) && /height=["']1["']/i.test(imgTag)) {
    return true;
  }
  // Skip if it's the noscript Facebook pixel (any pixel ID)
  if (/facebook\.com\/tr/i.test(imgTag)) {
    return true;
  }
  return false;
}

function addAttributesToTrackingPixel(imgTag) {
  // Only process Facebook tracking pixel images
  if (!/facebook\.com\/tr/i.test(imgTag)) {
    return { modified: imgTag, loadingAdded: false, decodingAdded: false };
  }

  let modified = imgTag;
  let loadingAdded = false;
  let decodingAdded = false;

  // Add loading="lazy" if missing
  if (!/loading=["'](lazy|eager)["']/i.test(modified)) {
    if (/\/>/.test(modified)) {
      modified = modified.replace(/\s*\/>/, ' loading="lazy" />');
    } else {
      modified = modified.replace(/\s*>/, ' loading="lazy">');
    }
    loadingAdded = true;
  }

  // Add decoding="async" if missing
  if (!/decoding=["']async["']/i.test(modified)) {
    if (/\/>/.test(modified)) {
      modified = modified.replace(/\s*\/>/, ' decoding="async" />');
    } else {
      modified = modified.replace(/\s*>/, ' decoding="async">');
    }
    decodingAdded = true;
  }

  return { modified, loadingAdded, decodingAdded };
}

function processImageTag(imgTag) {
  let modified = imgTag;
  let loadingAdded = false;
  let decodingAdded = false;

  // Handle Facebook tracking pixels specially - they need loading/decoding but shouldn't error
  if (/facebook\.com\/tr/i.test(imgTag)) {
    return addAttributesToTrackingPixel(imgTag);
  }

  // Skip other tracking pixels (1x1 images)
  if (/width=["']1["']/i.test(imgTag) && /height=["']1["']/i.test(imgTag)) {
    return { modified: imgTag, loadingAdded: false, decodingAdded: false };
  }

  // Add loading="lazy" if missing and not already set to eager
  if (!/loading=["'](lazy|eager)["']/i.test(modified)) {
    // Insert before the closing /> or >
    if (/\/>/.test(modified)) {
      modified = modified.replace(/\s*\/>/, ' loading="lazy" />');
    } else {
      modified = modified.replace(/\s*>/, ' loading="lazy">');
    }
    loadingAdded = true;
  }

  // Add decoding="async" if missing
  if (!/decoding=["']async["']/i.test(modified)) {
    // Insert before the closing /> or >
    if (/\/>/.test(modified)) {
      modified = modified.replace(/\s*\/>/, ' decoding="async" />');
    } else {
      modified = modified.replace(/\s*>/, ' decoding="async">');
    }
    decodingAdded = true;
  }

  return { modified, loadingAdded, decodingAdded };
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(ROOT, filePath);
  let fileModified = false;
  let fileLoadingAdded = 0;
  let fileDecodingAdded = 0;

  // Find all img tags
  const imgRegex = /<img\s[^>]*>/gi;
  let match;
  const replacements = [];

  while ((match = imgRegex.exec(content)) !== null) {
    const original = match[0];
    const result = processImageTag(original);
    stats.imagesProcessed++;

    if (result.loadingAdded || result.decodingAdded) {
      replacements.push({ original, replacement: result.modified });
      if (result.loadingAdded) fileLoadingAdded++;
      if (result.decodingAdded) fileDecodingAdded++;
      fileModified = true;
    }
  }

  // Apply replacements
  for (const { original, replacement } of replacements) {
    content = content.replace(original, replacement);
  }

  if (fileModified) {
    fs.writeFileSync(filePath, content, 'utf8');
    stats.filesModified++;
    stats.loadingAdded += fileLoadingAdded;
    stats.decodingAdded += fileDecodingAdded;
    console.log(`[FIXED] ${relPath}: +${fileLoadingAdded} loading, +${fileDecodingAdded} decoding`);
  }

  return fileModified;
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  console.log('Fix Image Attributes');
  console.log('====================\n');

  const htmlFiles = findHtmlFiles(ROOT);
  console.log(`Found ${htmlFiles.length} HTML files\n`);

  for (const filePath of htmlFiles) {
    fixFile(filePath);
  }

  console.log('\n--- Summary ---');
  console.log(`Images processed: ${stats.imagesProcessed}`);
  console.log(`loading="lazy" added: ${stats.loadingAdded}`);
  console.log(`decoding="async" added: ${stats.decodingAdded}`);
  console.log(`Files modified: ${stats.filesModified}`);
}

main();
