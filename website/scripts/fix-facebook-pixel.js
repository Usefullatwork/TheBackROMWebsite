#!/usr/bin/env node
/**
 * fix-facebook-pixel.js - Add Facebook Pixel to pages missing it
 *
 * Uses the existing pixel ID: 540166625752174
 * Implements deferred loading pattern for performance
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXCLUDE_DIRS = ['node_modules', '.git', 'docs', 'images-originals', 'scripts'];
const PIXEL_ID = '540166625752174';

let stats = {
  pixelAdded: 0,
  filesModified: 0
};

// Facebook Pixel code template (deferred loading for performance)
const PIXEL_CODE = `
  <!-- Meta Pixel Code -->
  <script>
  window.addEventListener('load', function() {
    setTimeout(function() {
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${PIXEL_ID}');
      fbq('track', 'PageView');
    }, 2000);
  });
  </script>
  <noscript><img loading="lazy" decoding="async" height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1" alt="Facebook Pixel" /></noscript>
  <!-- End Meta Pixel Code -->`;

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

// ── Pixel Detection ───────────────────────────────────────────────────────────

function hasFacebookPixel(content) {
  // Check for various indicators of Facebook Pixel
  return /fbq\(/i.test(content) ||
         /facebook\.net.*fbevents/i.test(content) ||
         /connect\.facebook\.net/i.test(content) ||
         /Meta Pixel/i.test(content) ||
         /Facebook Pixel/i.test(content) ||
         new RegExp(`facebook\\.com/tr\\?id=${PIXEL_ID}`, 'i').test(content);
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(ROOT, filePath);

  if (hasFacebookPixel(content)) {
    return false; // Already has pixel
  }

  // Insert pixel code before </head>
  if (!content.includes('</head>')) {
    console.log(`[SKIP] ${relPath}: No </head> tag found`);
    return false;
  }

  content = content.replace('</head>', PIXEL_CODE + '\n</head>');

  fs.writeFileSync(filePath, content, 'utf8');
  stats.pixelAdded++;
  stats.filesModified++;
  console.log(`[ADDED] ${relPath}: Facebook Pixel added`);

  return true;
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  console.log('Fix Facebook Pixel');
  console.log('==================\n');
  console.log(`Pixel ID: ${PIXEL_ID}\n`);

  const htmlFiles = findHtmlFiles(ROOT);
  console.log(`Found ${htmlFiles.length} HTML files\n`);

  for (const filePath of htmlFiles) {
    fixFile(filePath);
  }

  console.log('\n--- Summary ---');
  console.log(`Facebook Pixel added: ${stats.pixelAdded}`);
  console.log(`Files modified: ${stats.filesModified}`);
}

main();
