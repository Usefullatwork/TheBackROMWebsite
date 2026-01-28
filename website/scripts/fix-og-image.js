#!/usr/bin/env node
/**
 * fix-og-image.js - Add og:image meta tag to pages missing it
 *
 * Strategy:
 * 1. Look for existing hero image in the page
 * 2. Look for first content image
 * 3. Fall back to default site image
 *
 * Also adds matching twitter:image if missing
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXCLUDE_DIRS = ['node_modules', '.git', 'docs', 'images-originals', 'scripts'];
const SITE_ORIGIN = 'https://thebackrom.com';
const DEFAULT_IMAGE = 'images/Home/kiropraktor-ryggbehandling-hero.jpeg';

let stats = {
  ogImageAdded: 0,
  twitterImageAdded: 0,
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function getOg(content, prop) {
  const reDouble = new RegExp(`<meta\\s+property="${prop}"\\s+content="([^"]*)"`, 'i');
  const reSingle = new RegExp(`<meta\\s+property='${prop}'\\s+content='([^']*)'`, 'i');
  const reDouble2 = new RegExp(`<meta\\s+content="([^"]*)"\\s+property="${prop}"`, 'i');
  const reSingle2 = new RegExp(`<meta\\s+content='([^']*)'\\s+property='${prop}'`, 'i');
  return (content.match(reDouble) || content.match(reSingle) || content.match(reDouble2) || content.match(reSingle2) || [])[1] || '';
}

function getMeta(content, name) {
  const reDouble = new RegExp(`<meta\\s+name="${name}"\\s+content="([^"]*)"`, 'i');
  const reSingle = new RegExp(`<meta\\s+name='${name}'\\s+content='([^']*)'`, 'i');
  const reDouble2 = new RegExp(`<meta\\s+content="([^"]*)"\\s+name="${name}"`, 'i');
  const reSingle2 = new RegExp(`<meta\\s+content='([^']*)'\\s+name='${name}'`, 'i');
  return (content.match(reDouble) || content.match(reSingle) || content.match(reDouble2) || content.match(reSingle2) || [])[1] || '';
}

function resolveImageUrl(imageSrc, filePath) {
  // If already a full URL, return as-is
  if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
    return imageSrc;
  }

  // Get relative path from ROOT
  const relPath = path.relative(ROOT, filePath).replace(/\\/g, '/');
  const depth = relPath.split('/').length - 1;

  // Resolve relative path
  let resolvedPath = imageSrc;

  // Handle ../ paths
  if (imageSrc.startsWith('../')) {
    // Count how many levels up
    const upLevels = (imageSrc.match(/\.\.\//g) || []).length;
    resolvedPath = imageSrc.replace(/^(\.\.\/)+/, '');
  } else if (imageSrc.startsWith('./')) {
    // Same directory
    const dir = path.dirname(relPath);
    resolvedPath = dir ? dir + '/' + imageSrc.replace('./', '') : imageSrc.replace('./', '');
  } else if (!imageSrc.startsWith('/')) {
    // Relative from current file location
    const dir = path.dirname(relPath);
    if (dir && dir !== '.') {
      resolvedPath = dir + '/' + imageSrc;
    }
  }

  // Clean up path (remove leading ./ or extra /)
  resolvedPath = resolvedPath.replace(/^\.\//, '').replace(/\/+/g, '/');

  // Build full URL
  return SITE_ORIGIN + '/' + resolvedPath;
}

function findBestImage(content, filePath) {
  // 1. Look for hero section image
  const heroMatch = content.match(/<(?:section|div)[^>]*class=["'][^"']*hero[^"']*["'][^>]*>[\s\S]*?<img[^>]*src=["']([^"']+)["']/i);
  if (heroMatch) {
    return resolveImageUrl(heroMatch[1], filePath);
  }

  // 2. Look for og:image in schema (might be in JSON-LD)
  const schemaImageMatch = content.match(/"image"\s*:\s*"([^"]+)"/);
  if (schemaImageMatch && !schemaImageMatch[1].includes('facebook.com')) {
    const img = schemaImageMatch[1];
    if (img.startsWith('http')) {
      return img;
    }
    return resolveImageUrl(img, filePath);
  }

  // 3. Look for first content image (not logo, not icon, not tracking pixel)
  const imgMatches = content.match(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi) || [];
  for (const imgTag of imgMatches) {
    const srcMatch = imgTag.match(/src=["']([^"']+)["']/i);
    if (!srcMatch) continue;

    const src = srcMatch[1];

    // Skip logos, icons, tracking pixels
    if (/logo/i.test(src)) continue;
    if (/icon/i.test(src)) continue;
    if (/facebook\.com/i.test(src)) continue;
    if (/width=["']1["']/i.test(imgTag)) continue;

    // Skip very small images or data URIs
    if (src.startsWith('data:')) continue;

    return resolveImageUrl(src, filePath);
  }

  // 4. Fall back to default
  return SITE_ORIGIN + '/' + DEFAULT_IMAGE;
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(ROOT, filePath);
  let modified = false;

  const hasOgImage = !!getOg(content, 'og:image');
  const hasTwitterImage = !!getMeta(content, 'twitter:image');

  if (hasOgImage && hasTwitterImage) {
    return false; // Nothing to fix
  }

  const imageUrl = findBestImage(content, filePath);

  // Add og:image if missing
  if (!hasOgImage) {
    // Find where to insert (after og:description or og:url, or after og:type)
    const insertPatterns = [
      /(<meta\s+property=["']og:description["'][^>]*>)/i,
      /(<meta\s+content=["'][^"']*["']\s+property=["']og:description["'][^>]*>)/i,
      /(<meta\s+property=["']og:url["'][^>]*>)/i,
      /(<meta\s+property=["']og:type["'][^>]*>)/i,
      /(<meta\s+property=["']og:title["'][^>]*>)/i
    ];

    let inserted = false;
    for (const pattern of insertPatterns) {
      if (pattern.test(content)) {
        content = content.replace(pattern, `$1\n  <meta property="og:image" content="${imageUrl}">`);
        inserted = true;
        break;
      }
    }

    if (!inserted) {
      // Insert before </head>
      content = content.replace('</head>', `  <meta property="og:image" content="${imageUrl}">\n</head>`);
    }

    stats.ogImageAdded++;
    modified = true;
    console.log(`[OG:IMAGE] ${relPath}: ${path.basename(imageUrl)}`);
  }

  // Add twitter:image if missing
  if (!hasTwitterImage) {
    // Use same image as og:image
    const twitterImage = hasOgImage ? getOg(content, 'og:image') : imageUrl;

    // Find where to insert (after twitter:description or twitter:title)
    const insertPatterns = [
      /(<meta\s+name=["']twitter:description["'][^>]*>)/i,
      /(<meta\s+content=["'][^"']*["']\s+name=["']twitter:description["'][^>]*>)/i,
      /(<meta\s+name=["']twitter:title["'][^>]*>)/i,
      /(<meta\s+name=["']twitter:card["'][^>]*>)/i
    ];

    let inserted = false;
    for (const pattern of insertPatterns) {
      if (pattern.test(content)) {
        content = content.replace(pattern, `$1\n  <meta name="twitter:image" content="${twitterImage}">`);
        inserted = true;
        break;
      }
    }

    if (!inserted) {
      // Insert before </head>
      content = content.replace('</head>', `  <meta name="twitter:image" content="${twitterImage}">\n</head>`);
    }

    stats.twitterImageAdded++;
    modified = true;
    console.log(`[TWITTER:IMAGE] ${relPath}: ${path.basename(twitterImage)}`);
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    stats.filesModified++;
  }

  return modified;
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  console.log('Fix og:image Meta Tags');
  console.log('======================\n');
  console.log(`Default fallback: ${DEFAULT_IMAGE}\n`);

  const htmlFiles = findHtmlFiles(ROOT);
  console.log(`Found ${htmlFiles.length} HTML files\n`);

  for (const filePath of htmlFiles) {
    fixFile(filePath);
  }

  console.log('\n--- Summary ---');
  console.log(`og:image added: ${stats.ogImageAdded}`);
  console.log(`twitter:image added: ${stats.twitterImageAdded}`);
  console.log(`Files modified: ${stats.filesModified}`);
}

main();
