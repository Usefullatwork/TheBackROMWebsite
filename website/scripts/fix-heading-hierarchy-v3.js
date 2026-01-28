#!/usr/bin/env node
/**
 * fix-heading-hierarchy-v3.js - Third pass heading fixes
 *
 * Final cleanup: Convert h4 within content sections to h3.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXCLUDE_DIRS = ['node_modules', '.git', 'docs', 'images-originals', 'scripts'];

let stats = {
  filesModified: 0,
  h4ToH3: 0
};

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

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(ROOT, filePath);
  let modified = false;

  // Skip footer and aside sections
  const mainMatch = content.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!mainMatch) return false;

  let mainContent = mainMatch[1];
  const originalMain = mainContent;

  // Remove sidebar from analysis
  mainContent = mainContent.replace(/<aside[\s\S]*?<\/aside>/gi, '<!-- ASIDE_REMOVED -->');

  // Find h2→h4 skips and fix by converting orphan h4 to h3
  // An orphan h4 is one that appears after an h2 without an h3 between them

  const lines = mainContent.split('\n');
  let lastH2Index = -1;
  let hasH3SinceH2 = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/<h2[\s>]/i.test(line)) {
      lastH2Index = i;
      hasH3SinceH2 = false;
    }

    if (/<h3[\s>]/i.test(line)) {
      hasH3SinceH2 = true;
    }

    if (/<h4[\s>]/i.test(line) && lastH2Index >= 0 && !hasH3SinceH2) {
      // This is an orphan h4 - convert to h3
      lines[i] = line.replace(/<h4/gi, '<h3').replace(/<\/h4>/gi, '</h3>');
      stats.h4ToH3++;
      hasH3SinceH2 = true; // Now we have h3
    }
  }

  const newMain = lines.join('\n');

  if (newMain !== mainContent) {
    // Restore aside markers and apply changes to original content
    content = content.replace(originalMain, newMain.replace(/<!-- ASIDE_REMOVED -->/g, ''));
    fs.writeFileSync(filePath, content, 'utf8');
    stats.filesModified++;
    console.log(`[FIXED] ${relPath}`);
    return true;
  }

  return false;
}

function main() {
  console.log('Stage 2c: Final Heading Cleanup');
  console.log('================================\n');

  const htmlFiles = findHtmlFiles(ROOT);
  console.log(`Found ${htmlFiles.length} HTML files\n`);

  for (const filePath of htmlFiles) {
    fixFile(filePath);
  }

  console.log('\n--- Summary ---');
  console.log(`Files modified: ${stats.filesModified}`);
  console.log(`h4→h3 conversions: ${stats.h4ToH3}`);
}

main();
