/**
 * Image Consistency Checker
 * Verifies images exist and are consistent between EN/NO pages
 *
 * Usage: node scripts/check-images.js [path]
 *        node scripts/check-images.js en/conditions/
 */

const fs = require('fs');
const path = require('path');

const targetPath = process.argv[2] || 'en/';

console.log(`\nImage Check: ${targetPath}`);
console.log('='.repeat(50));

const issues = {
  missing: [],
  duplicates: [],
  noAlt: [],
  noLazy: []
};

// Find all HTML files
function findHtmlFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && item !== 'node_modules') {
      files = files.concat(findHtmlFiles(fullPath));
    } else if (item.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

// Extract image sources from HTML
function extractImages(content) {
  const imgRegex = /<img[^>]+>/gi;
  const matches = content.match(imgRegex) || [];
  return matches;
}

// Check single file
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const images = extractImages(content);

  images.forEach(img => {
    // Get src
    const srcMatch = img.match(/src="([^"]+)"/);
    if (srcMatch) {
      const src = srcMatch[1];

      // Skip external images and data URIs
      if (src.startsWith('http') || src.startsWith('data:')) return;

      // Resolve path
      const imgPath = path.resolve(path.dirname(filePath), src);

      // Check if exists
      if (!fs.existsSync(imgPath)) {
        issues.missing.push({ file: filePath, image: src });
      }

      // Check for duplicates in /en/ folder
      if (src.includes('/en/') && src.includes('/images/')) {
        issues.duplicates.push({ file: filePath, image: src });
      }
    }

    // Check for alt text
    if (!img.includes('alt=')) {
      const srcMatch = img.match(/src="([^"]+)"/);
      issues.noAlt.push({ file: filePath, image: srcMatch ? srcMatch[1] : 'unknown' });
    }

    // Check for lazy loading
    if (!img.includes('loading="lazy"')) {
      const srcMatch = img.match(/src="([^"]+)"/);
      // Skip small images that shouldn't be lazy
      if (!img.includes('favicon') && !img.includes('logo')) {
        issues.noLazy.push({ file: filePath, image: srcMatch ? srcMatch[1] : 'unknown' });
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
  console.log('-- MISSING IMAGES --\n');
  if (issues.missing.length === 0) {
    console.log('[PASS] No missing images\n');
  } else {
    console.log(`[FAIL] ${issues.missing.length} missing images:\n`);
    issues.missing.slice(0, 10).forEach(i => {
      console.log(`  ${i.file}`);
      console.log(`    → ${i.image}`);
    });
    if (issues.missing.length > 10) {
      console.log(`  ... and ${issues.missing.length - 10} more\n`);
    }
  }

  console.log('-- DUPLICATE IMAGES IN /en/ --\n');
  if (issues.duplicates.length === 0) {
    console.log('[PASS] No duplicates (images shared correctly)\n');
  } else {
    console.log(`[WARN] ${issues.duplicates.length} images duplicated in /en/:\n`);
    issues.duplicates.slice(0, 5).forEach(i => {
      console.log(`  ${i.image}`);
    });
  }

  console.log('-- MISSING ALT TEXT --\n');
  if (issues.noAlt.length === 0) {
    console.log('[PASS] All images have alt text\n');
  } else {
    console.log(`[WARN] ${issues.noAlt.length} images without alt text\n`);
  }

  console.log('-- MISSING LAZY LOADING --\n');
  if (issues.noLazy.length === 0) {
    console.log('[PASS] All images use lazy loading\n');
  } else {
    console.log(`[INFO] ${issues.noLazy.length} images without lazy loading\n`);
  }

  // Summary
  console.log('='.repeat(50));
  const total = issues.missing.length + issues.duplicates.length;
  if (total === 0) {
    console.log('\n[PASS] All image checks passed!\n');
  } else {
    console.log(`\n[WARN] Found ${total} issues to review\n`);
  }

} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
