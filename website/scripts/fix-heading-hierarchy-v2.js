#!/usr/bin/env node
/**
 * fix-heading-hierarchy-v2.js - Second pass heading fixes
 *
 * More aggressive approach to fix remaining heading skips.
 * Analyzes the actual heading sequence and adjusts levels.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXCLUDE_DIRS = ['node_modules', '.git', 'docs', 'images-originals', 'scripts'];

let stats = {
  filesModified: 0,
  headingsAdjusted: 0
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

function extractMainContent(content) {
  // Remove footer, aside, nav to analyze main content only
  let main = content;
  main = main.replace(/<footer[\s\S]*?<\/footer>/gi, '');
  main = main.replace(/<aside[\s\S]*?<\/aside>/gi, '');
  main = main.replace(/<nav[\s\S]*?<\/nav>/gi, '');
  return main;
}

function findHeadingSkips(content) {
  const mainContent = extractMainContent(content);
  const headings = [];
  const hRe = /<h([1-6])[\s>]/gi;
  let m;
  while ((m = hRe.exec(mainContent)) !== null) {
    headings.push(parseInt(m[1]));
  }

  const skips = [];
  for (let i = 1; i < headings.length; i++) {
    if (headings[i] > headings[i - 1] + 1) {
      skips.push({
        index: i,
        from: headings[i - 1],
        to: headings[i],
        skip: headings[i] - headings[i - 1]
      });
    }
  }
  return { headings, skips };
}

// ── Fix Strategies ────────────────────────────────────────────────────────────

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(ROOT, filePath);
  let modified = false;

  // Check for skips
  const { headings, skips } = findHeadingSkips(content);
  if (skips.length === 0) return false;

  const changes = [];

  // ═══════════════════════════════════════════════════════════════════════════
  // Strategy 1: h1→h3 skips - change all h3 to h2 until h2 section starts
  // ═══════════════════════════════════════════════════════════════════════════
  if (skips.some(s => s.from === 1 && s.to === 3)) {
    // Premium summary card h3 should be h2
    const before = content;
    content = content.replace(/<div class="premium-summary-card">\s*<h3/gi,
      '<div class="premium-summary-card">\n                <h2');
    content = content.replace(/<div class="premium-summary-card"[^>]*>\s*<h3([^>]*)>([^<]*)<\/h3>/gi,
      (match, attrs, text) => {
        return match.replace(/<h3/g, '<h2').replace(/<\/h3>/g, '</h2>');
      });

    // Also fix in condition cards right after h1
    content = content.replace(/(<\/h1>[\s\S]{0,500}?)<h3(\s+class="[^"]*condition[^"]*")/gi,
      (match, prefix, attrs) => {
        return prefix + '<h2' + attrs;
      });

    if (content !== before) {
      changes.push('h1→h3: premium-summary h3→h2');
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Strategy 2: h2→h4 skips - change h4 to h3
  // ═══════════════════════════════════════════════════════════════════════════
  if (skips.some(s => s.from === 2 && s.to === 4)) {
    const before = content;

    // About page certification h4s
    content = content.replace(/<h4(\s+class="[^"]*cert[^"]*"|\s+style="[^"]*")?>\s*<i/gi,
      '<h3$1><i');

    // Treatment method h4s
    content = content.replace(/<h4(\s+class="[^"]*treatment-method[^"]*")/gi, '<h3$1');
    content = content.replace(/(<h3\s+class="[^"]*treatment-method[^"]*"[^>]*>[^<]*)<\/h4>/gi, '$1</h3>');

    // Generic h4 in hub-sections that come right after h2
    const sectionRe = /<div class="section-header">\s*<span[^>]*>[^<]*<\/span>\s*<h2[^>]*>[^<]*<\/h2>\s*<\/div>([\s\S]*?)(?=<div class="section-header">|<section|<\/article|<\/section)/gi;
    content = content.replace(sectionRe, (match, sectionContent) => {
      // Check if section has h4 without h3
      if (/<h4[\s>]/i.test(sectionContent) && !/<h3[\s>]/i.test(sectionContent)) {
        return match.replace(/<h4/g, '<h3').replace(/<\/h4>/g, '</h3>');
      }
      return match;
    });

    if (content !== before) {
      changes.push('h2→h4: various h4→h3');
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Strategy 3: h2→h5 or h3→h5 skips (foot pages) - change h5 to h4 or h3
  // ═══════════════════════════════════════════════════════════════════════════
  if (skips.some(s => s.to === 5)) {
    const before = content;

    // In exercise/treatment boxes, h5 should be h4
    content = content.replace(/<h5(\s+class="[^"]*exercise[^"]*")/gi, '<h4$1');
    content = content.replace(/(<h4\s+class="[^"]*exercise[^"]*"[^>]*>[^<]*)<\/h5>/gi, '$1</h4>');

    // Generic h5 after h2 or h3 should be h3 or h4
    // Find the pattern and adjust
    content = content.replace(/<h2([^>]*)>([^<]*)<\/h2>([\s\S]*?)<h5/gi,
      (match, attrs, text, between) => {
        if (!/<h3[\s>]/i.test(between) && !/<h4[\s>]/i.test(between)) {
          return `<h2${attrs}>${text}</h2>${between}<h3`;
        }
        return match;
      });

    // h5 tags should become h4 if there's h3 before them
    content = content.replace(/<h3([^>]*)>([^<]*)<\/h3>([\s\S]*?)<h5/gi,
      (match, attrs, text, between) => {
        if (!/<h4[\s>]/i.test(between)) {
          return `<h3${attrs}>${text}</h3>${between}<h4`;
        }
        return match;
      });

    // Close h5→h4 tags
    content = content.replace(/<h4([^>]*)>([^<]*)<\/h5>/gi, '<h4$1>$2</h4>');
    content = content.replace(/<h3([^>]*)>([^<]*)<\/h5>/gi, '<h3$1>$2</h3>');

    if (content !== before) {
      changes.push('h5 adjustments');
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Strategy 4: Info-box and condition-card h3 adjustments
  // ═══════════════════════════════════════════════════════════════════════════
  {
    const before = content;

    // Within hub-intro section, h3 after h1 (but not after h2) should be h2
    const introMatch = content.match(/<section class="hub-intro">([\s\S]*?)<\/section>/i);
    if (introMatch) {
      let intro = introMatch[1];
      const introOrig = intro;

      // h3 in premium-summary-card
      intro = intro.replace(/(<div class="premium-summary-card"[^>]*>[\s\S]*?)<h3([^>]*)>([^<]*)<\/h3>/gi,
        '$1<h2$2>$3</h2>');

      // First h3 in hub-subnav
      intro = intro.replace(/(<nav class="hub-subnav"[^>]*>[\s\S]*?)<h3([^>]*)>([^<]*)<\/h3>/gi,
        '$1<h2$2>$3</h2>');

      // Red flag alert h3
      intro = intro.replace(/(<div class="red-flag-alert"[^>]*>[\s\S]*?)<h3([^>]*)>([^<]*)<\/h3>/gi,
        '$1<h2$2>$3</h2>');

      if (intro !== introOrig) {
        content = content.replace(introMatch[1], intro);
        changes.push('hub-intro h3→h2');
      }
    }

    if (content !== before) {
      // changes already added above
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Strategy 5: Iliopsoas and similar hub pages with h1→h3
  // ═══════════════════════════════════════════════════════════════════════════
  if (relPath.includes('plager/') || relPath.includes('conditions/')) {
    const before = content;

    // If there's h1 followed by h3 without h2 between, change that h3 to h2
    // Look at hub-sections structure
    let h2Found = false;
    const lines = content.split('\n');
    const newLines = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      // Track if we've seen h2
      if (/<h2[\s>]/i.test(line)) {
        h2Found = true;
      }

      // Reset on new main section
      if (/<h1[\s>]/i.test(line)) {
        h2Found = false;
      }

      // If we see h3 before any h2 (after h1), change to h2
      // But be careful about sidebar/footer h3s
      if (!h2Found && /<h3[\s>]/i.test(line)) {
        // Check context - not in aside, footer, nav
        const contextBefore = lines.slice(Math.max(0, i - 20), i).join('\n');
        if (!/<aside/i.test(contextBefore) &&
            !/<footer/i.test(contextBefore) &&
            !/<nav class="hub-toc/i.test(contextBefore) &&
            !/hub-sidebar/i.test(contextBefore)) {
          line = line.replace(/<h3/gi, '<h2').replace(/<\/h3>/gi, '</h2>');
          stats.headingsAdjusted++;
        }
      }

      newLines.push(line);
    }

    const newContent = newLines.join('\n');
    if (newContent !== content) {
      content = newContent;
      changes.push('conditional h1→h3 fix');
    }
  }

  // Write if modified
  if (changes.length > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    stats.filesModified++;
    console.log(`[FIXED] ${relPath}: ${changes.join(', ')}`);
    return true;
  }

  return false;
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  console.log('Stage 2b: Fix Remaining Heading Hierarchy');
  console.log('=========================================\n');

  const htmlFiles = findHtmlFiles(ROOT);
  console.log(`Found ${htmlFiles.length} HTML files\n`);

  for (const filePath of htmlFiles) {
    fixFile(filePath);
  }

  console.log('\n--- Summary ---');
  console.log(`Files modified: ${stats.filesModified}`);
  console.log(`Headings adjusted: ${stats.headingsAdjusted}`);
}

main();
