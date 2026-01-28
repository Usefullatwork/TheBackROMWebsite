#!/usr/bin/env node
/**
 * fix-heading-hierarchy-v4.js - Fourth pass: h3→h5 and remaining skips
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXCLUDE_DIRS = ['node_modules', '.git', 'docs', 'images-originals', 'scripts'];

let stats = {
  filesModified: 0,
  changes: 0
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
  const original = content;
  let changes = [];

  // Fix h3→h5 skips: convert h5 to h4 when there's no h4 between
  const mainMatch = content.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!mainMatch) return false;

  let mainContent = mainMatch[1];
  const originalMain = mainContent;

  // Track heading context
  const lines = mainContent.split('\n');
  let lastH3Index = -1;
  let hasH4SinceH3 = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip sidebar/aside content
    if (/<aside/i.test(line)) {
      // Skip until </aside>
      while (i < lines.length && !/<\/aside>/i.test(lines[i])) {
        i++;
      }
      continue;
    }

    if (/<h3[\s>]/i.test(line)) {
      lastH3Index = i;
      hasH4SinceH3 = false;
    }

    if (/<h4[\s>]/i.test(line)) {
      hasH4SinceH3 = true;
    }

    if (/<h5[\s>]/i.test(line) && lastH3Index >= 0 && !hasH4SinceH3) {
      // Convert h5 to h4
      lines[i] = line.replace(/<h5/gi, '<h4').replace(/<\/h5>/gi, '</h4>');
      stats.changes++;
      hasH4SinceH3 = true;
      changes.push('h5→h4');
    }
  }

  mainContent = lines.join('\n');

  // Fix about.html h2→h4 (certification h4s)
  if (relPath === 'about.html' || relPath === 'en\\about.html' || relPath === 'en/about.html') {
    // Certification cards with h4 that should be h3
    const certRegex = /<h4(\s+style="[^"]*")?>\s*<i class="[^"]*fa-certificate/gi;
    if (certRegex.test(mainContent)) {
      mainContent = mainContent.replace(/<h4(\s+style="[^"]*")?>\s*<i class="([^"]*fa-certificate[^"]*)"/gi,
        '<h3$1><i class="$2"');
      mainContent = mainContent.replace(/<\/i>([^<]*)<\/h4>/gi, '</i>$1</h3>');
      stats.changes++;
      changes.push('cert h4→h3');
    }
  }

  // Fix en\blog\acute-back-pain-self-help.html h1→h3
  if (relPath.includes('acute-back-pain-self-help')) {
    const premiumSummaryRe = /<div class="premium-summary-card"[^>]*>\s*<h3/gi;
    if (premiumSummaryRe.test(mainContent)) {
      mainContent = mainContent.replace(/<div class="premium-summary-card"([^>]*)>\s*<h3/gi,
        '<div class="premium-summary-card"$1>\n                <h2');
      mainContent = mainContent.replace(/(<div class="premium-summary-card"[^>]*>[\s\S]*?<h2[^>]*>[^<]*)<\/h3>/gi,
        '$1</h2>');
      stats.changes++;
      changes.push('h1→h3 fix');
    }
  }

  if (mainContent !== originalMain) {
    content = content.replace(originalMain, mainContent);
    fs.writeFileSync(filePath, content, 'utf8');
    stats.filesModified++;
    console.log(`[FIXED] ${relPath}: ${changes.join(', ')}`);
    return true;
  }

  return false;
}

function main() {
  console.log('Stage 2d: Fix h3→h5 and remaining skips');
  console.log('=======================================\n');

  const htmlFiles = findHtmlFiles(ROOT);
  console.log(`Found ${htmlFiles.length} HTML files\n`);

  for (const filePath of htmlFiles) {
    fixFile(filePath);
  }

  console.log('\n--- Summary ---');
  console.log(`Files modified: ${stats.filesModified}`);
  console.log(`Changes made: ${stats.changes}`);
}

main();
