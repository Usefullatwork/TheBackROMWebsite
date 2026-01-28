#!/usr/bin/env node
/**
 * fix-remaining-inline-css.js - Stage 3: Fix inline CSS warnings
 *
 * Extracts large inline CSS blocks to external files and replaces with <link> tags.
 * Identifies common patterns and groups them by content hash.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const CSS_DIR = path.join(ROOT, 'css');
const EXCLUDE_DIRS = ['node_modules', '.git', 'docs', 'images-originals', 'scripts', 'css'];

let stats = {
  filesScanned: 0,
  filesModified: 0,
  cssExtracted: 0,
  cssFilesCreated: 0
};

// Track unique CSS patterns
const cssPatterns = new Map();

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

// ── CSS Pattern Analysis ──────────────────────────────────────────────────────

function hashCSS(css) {
  return crypto.createHash('md5').update(css.trim()).digest('hex').substring(0, 8);
}

function normalizeCSS(css) {
  // Normalize for comparison (remove whitespace variations)
  return css.replace(/\s+/g, ' ').trim();
}

function identifyPattern(css) {
  // Identify CSS pattern type based on content
  if (/blog-filters|blog-tag|blog-category|blog-card/i.test(css)) {
    return 'blog-page';
  }
  if (/faq-accordion|faq-toggle|faq-item/i.test(css)) {
    return 'faq-page';
  }
  if (/contact-form|contact-grid|contact-card/i.test(css)) {
    return 'contact-page';
  }
  if (/price-table|price-card|pricing/i.test(css)) {
    return 'pricing-page';
  }
  if (/carousel|slider|swiper/i.test(css)) {
    return 'carousel';
  }
  if (/hero-filter|hero-tag/i.test(css)) {
    return 'hero-filters';
  }
  return 'page-specific';
}

// ── Main Processing ───────────────────────────────────────────────────────────

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(ROOT, filePath);
  stats.filesScanned++;

  // Find all style blocks
  const styleBlocks = [];
  const styleRe = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let match;

  while ((match = styleRe.exec(content)) !== null) {
    const css = match[1];
    if (css.length > 2000) {
      const hash = hashCSS(css);
      const pattern = identifyPattern(css);

      if (!cssPatterns.has(hash)) {
        cssPatterns.set(hash, {
          css: css,
          pattern: pattern,
          files: [],
          length: css.length
        });
      }
      cssPatterns.get(hash).files.push(relPath);
      styleBlocks.push({ full: match[0], css: css, hash: hash });
    }
  }

  return styleBlocks;
}

function extractAndReplace(filePath, styleBlocks) {
  if (styleBlocks.length === 0) return false;

  let content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(ROOT, filePath);
  let modified = false;

  // Calculate path depth for relative CSS path
  const depth = relPath.split(/[\/\\]/).length - 1;
  const cssPathPrefix = '../'.repeat(depth) || './';

  for (const block of styleBlocks) {
    const patternInfo = cssPatterns.get(block.hash);
    const cssFileName = `inline-${patternInfo.pattern}-${block.hash}.css`;
    const cssPath = path.join(CSS_DIR, cssFileName);

    // Create CSS file if it doesn't exist
    if (!fs.existsSync(cssPath)) {
      // Add header comment
      const cssContent = `/* Extracted inline CSS - ${patternInfo.pattern} */
/* Used by: ${patternInfo.files.slice(0, 5).join(', ')}${patternInfo.files.length > 5 ? ` + ${patternInfo.files.length - 5} more` : ''} */

${block.css}
`;
      fs.writeFileSync(cssPath, cssContent, 'utf8');
      stats.cssFilesCreated++;
      console.log(`[CSS] Created: css/${cssFileName} (${Math.round(block.css.length / 1024)}KB)`);
    }

    // Replace inline style with link tag
    const linkTag = `<link rel="stylesheet" href="${cssPathPrefix}css/${cssFileName}">`;

    // Only replace if we haven't already (idempotency)
    if (content.includes(block.full) && !content.includes(cssFileName)) {
      content = content.replace(block.full, linkTag);
      modified = true;
      stats.cssExtracted++;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    stats.filesModified++;
    console.log(`[FIXED] ${relPath}`);
    return true;
  }

  return false;
}

// ── Alternative: Reduce inline CSS instead of extracting ──────────────────────

function reduceInlineCSS(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(ROOT, filePath);
  let modified = false;

  // For files with minor inline CSS that can be optimized rather than extracted
  // Strategy: Remove redundant !important, compress whitespace, remove comments

  const styleRe = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let match;
  const replacements = [];

  while ((match = styleRe.exec(content)) !== null) {
    const css = match[1];
    if (css.length > 2000 && css.length < 4000) {
      // Try to compress CSS
      let compressed = css
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ')              // Normalize whitespace
        .replace(/;\s+/g, ';')             // Remove space after semicolons
        .replace(/:\s+/g, ':')             // Remove space after colons
        .replace(/\{\s+/g, '{')            // Remove space after {
        .replace(/\s+\}/g, '}')            // Remove space before }
        .replace(/,\s+/g, ',')             // Remove space after commas
        .trim();

      if (compressed.length < 2000) {
        replacements.push({
          original: match[0],
          replacement: `<style>${compressed}</style>`
        });
      }
    }
  }

  for (const r of replacements) {
    content = content.replace(r.original, r.replacement);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[COMPRESSED] ${relPath}`);
    return true;
  }

  return false;
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  console.log('Stage 3: Fix Inline CSS');
  console.log('=======================\n');

  const htmlFiles = findHtmlFiles(ROOT);
  console.log(`Found ${htmlFiles.length} HTML files\n`);

  // Phase 1: Analyze all files to find common patterns
  console.log('Phase 1: Analyzing CSS patterns...');
  const fileBlocks = new Map();

  for (const filePath of htmlFiles) {
    const blocks = analyzeFile(filePath);
    if (blocks.length > 0) {
      fileBlocks.set(filePath, blocks);
    }
  }

  console.log(`\nFound ${cssPatterns.size} unique CSS patterns across ${fileBlocks.size} files\n`);

  // Report patterns
  console.log('Pattern summary:');
  for (const [hash, info] of cssPatterns) {
    console.log(`  - ${info.pattern} (${hash}): ${info.files.length} files, ${Math.round(info.length / 1024)}KB`);
  }
  console.log('');

  // Phase 2: Extract common patterns (used in 2+ files) to external CSS
  console.log('Phase 2: Extracting to external CSS files...');
  for (const [filePath, blocks] of fileBlocks) {
    const commonBlocks = blocks.filter(b => {
      const info = cssPatterns.get(b.hash);
      return info.files.length >= 2; // Only extract if used in multiple files
    });

    if (commonBlocks.length > 0) {
      extractAndReplace(filePath, commonBlocks);
    }
  }

  // Phase 3: Compress remaining inline CSS
  console.log('\nPhase 3: Compressing remaining inline CSS...');
  for (const filePath of htmlFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    const totalInline = (content.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [])
      .reduce((sum, s) => sum + s.length, 0);

    if (totalInline > 2000) {
      reduceInlineCSS(filePath);
    }
  }

  console.log('\n--- Summary ---');
  console.log(`Files scanned: ${stats.filesScanned}`);
  console.log(`CSS files created: ${stats.cssFilesCreated}`);
  console.log(`Files modified: ${stats.filesModified}`);
  console.log(`CSS blocks extracted: ${stats.cssExtracted}`);
}

main();
