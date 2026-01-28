#!/usr/bin/env node
/**
 * fix-heading-hierarchy.js - Stage 2: Fix heading hierarchy warnings
 *
 * Fixes h1→h3 and h2→h4 skips by adjusting headings appropriately.
 * Uses context-aware logic to avoid breaking sidebars and footers.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXCLUDE_DIRS = ['node_modules', '.git', 'docs', 'images-originals', 'scripts'];

let stats = {
  filesModified: 0,
  h3ToH2: 0,
  h4ToH3: 0,
  h5ToH4: 0,
  skipped: 0
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
  // Remove footer, aside, nav, sidebar to analyze main content only
  let main = content;
  main = main.replace(/<footer[\s\S]*?<\/footer>/gi, '');
  main = main.replace(/<aside[\s\S]*?<\/aside>/gi, '');
  main = main.replace(/<nav[\s\S]*?<\/nav>/gi, '');
  // Remove sidebar classes
  main = main.replace(/<div[^>]*class="[^"]*sidebar[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>/gi, '');
  return main;
}

function getHeadingSequence(content) {
  const headings = [];
  const hRe = /<h([1-6])[\s>]/gi;
  let m;
  while ((m = hRe.exec(content)) !== null) {
    headings.push(parseInt(m[1]));
  }
  return headings;
}

function findHeadingSkips(headings) {
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
  return skips;
}

// ── Pattern-based fixes ───────────────────────────────────────────────────────

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(ROOT, filePath);
  let modified = false;
  let changes = [];

  // ═══════════════════════════════════════════════════════════════════════════
  // Pattern 1: FAQ pages with h3 questions after h1 (should be h2)
  // ═══════════════════════════════════════════════════════════════════════════
  if (relPath.includes('faq/') || relPath.includes('faq\\')) {
    // FAQ question headings should be h2, not h3
    const faqH3Pattern = /<h3(\s+class="[^"]*faq[^"]*"[^>]*)>/gi;
    const before = content;
    content = content.replace(faqH3Pattern, '<h2$1>');
    content = content.replace(/<\/h3>(\s*<div class="faq__answer)/gi, '</h2>$1');
    // Close tags
    content = content.replace(/<h2(\s+class="[^"]*faq__question[^"]*"[^>]*)>([^<]*)<\/h3>/gi, '<h2$1>$2</h2>');

    if (content !== before) {
      changes.push('FAQ h3→h2');
      stats.h3ToH2 += (before.match(/<h3(\s+class="[^"]*faq)/gi) || []).length;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Pattern 2: Services/contact page with h3 cards after h1 (should be h2)
  // ═══════════════════════════════════════════════════════════════════════════
  if (relPath === 'services.html' || relPath === 'en\\services.html' ||
      relPath === 'en/services.html') {
    // services-grid__title should be h2
    const before = content;
    content = content.replace(/<h3(\s+class="services-grid__title")/gi, '<h2$1');
    content = content.replace(/(<h2\s+class="services-grid__title"[^>]*>[^<]*)<\/h3>/gi, '$1</h2>');

    if (content !== before) {
      changes.push('Services grid h3→h2');
      stats.h3ToH2 += (before.match(/<h3\s+class="services-grid__title"/gi) || []).length;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Pattern 3: Contact page social/form h3 after h1 (need h2 section first or change to h2)
  // ═══════════════════════════════════════════════════════════════════════════
  if (relPath === 'contact.html' || relPath === 'en\\contact.html' ||
      relPath === 'en/contact.html') {
    const before = content;
    // Change contact__subtitle h3s to h2
    content = content.replace(/<h3(\s+class="contact__subtitle")/gi, '<h2$1');
    content = content.replace(/(<h2\s+class="contact__subtitle"[^>]*>[^<]*)<\/h3>/gi, '$1</h2>');

    if (content !== before) {
      changes.push('Contact h3→h2');
      stats.h3ToH2 += (before.match(/<h3\s+class="contact__subtitle"/gi) || []).length;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Pattern 4: plager.html page overview cards (h3 after h1)
  // ═══════════════════════════════════════════════════════════════════════════
  if (relPath === 'plager.html' || relPath === 'en\\conditions.html' ||
      relPath === 'en/conditions.html') {
    const before = content;
    // Category cards should be h2
    content = content.replace(/<h3(\s+class="[^"]*category[^"]*")/gi, '<h2$1');
    content = content.replace(/(<h2\s+class="[^"]*category[^"]*"[^>]*>[^<]*)<\/h3>/gi, '$1</h2>');
    // Also body-part cards
    content = content.replace(/<h3(\s+class="[^"]*body-part[^"]*")/gi, '<h2$1');
    content = content.replace(/(<h2\s+class="[^"]*body-part[^"]*"[^>]*>[^<]*)<\/h3>/gi, '$1</h2>');

    if (content !== before) {
      changes.push('Plager cards h3→h2');
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Pattern 5: Hub pages with h4 that should be h3 (after h2 sections)
  // Targets: .condition-card h4, .treatment-box h4, .nerve-box h4, .info-box h4
  // ═══════════════════════════════════════════════════════════════════════════
  const h4BoxPatterns = [
    { pattern: /<h4(\s+class="[^"]*(?:condition|treatment|nerve|info|stat|red-flag)[^"]*")/gi, close: true },
    { pattern: /<div class="(?:condition-card|treatment-box|nerve-box|info-box|red-flag-box)"[^>]*>\s*<h4/gi, close: false }
  ];

  // More targeted: h4 inside specific box classes
  const boxClasses = ['condition-card', 'treatment-box', 'nerve-box', 'info-box', 'red-flag-box', 'stat-grid'];
  for (const cls of boxClasses) {
    const re = new RegExp(`(<div[^>]*class="[^"]*${cls}[^"]*"[^>]*>[\\s\\S]*?)<h4([^>]*)>([^<]*)<\\/h4>`, 'gi');
    const before = content;
    content = content.replace(re, (match, prefix, attrs, text) => {
      stats.h4ToH3++;
      return `${prefix}<h3${attrs}>${text}</h3>`;
    });
    if (content !== before) {
      changes.push(`${cls} h4→h3`);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Pattern 6: Generic h1→h3 skip fix - first h3 in main after h1 should be h2
  // Only if no h2 exists between them
  // ═══════════════════════════════════════════════════════════════════════════
  const mainContent = extractMainContent(content);
  const headings = getHeadingSequence(mainContent);
  const skips = findHeadingSkips(headings);

  // Check for h1→h3 skip (skip of 2)
  if (skips.length > 0 && skips[0].from === 1 && skips[0].to === 3) {
    // Find the first h3 in main content (not in footer/aside)
    // We need to change it and subsequent h3s under h1 to h2
    const before = content;

    // Find where main content starts (after header, before footer/aside)
    const mainStart = content.indexOf('<main');
    const mainEnd = content.indexOf('<footer');

    if (mainStart > 0 && mainEnd > mainStart) {
      let mainSection = content.substring(mainStart, mainEnd);
      const originalMain = mainSection;

      // Find first h3 that appears before any h2
      const h2Match = mainSection.match(/<h2[\s>]/i);
      const h3Match = mainSection.match(/<h3[\s>]/i);

      if (h3Match && (!h2Match || h3Match.index < h2Match.index)) {
        // There's an h3 before any h2, which is a skip
        // Change the first few h3s to h2 until we hit an h2

        // Strategy: In sections immediately under h1 (before first h2), promote h3→h2
        // This is complex so we'll do a simpler targeted approach

        // For hub pages, look for specific patterns
        // Premium summary card h2 is ok, but then section h3s after that need to be h2

        // Check if this looks like a hub article with section headers
        if (/class="hub-section"/i.test(mainSection)) {
          // Hub article: The section-header h3s might be the issue
          // Actually hub pages usually have h2 in section-header, let's check
          // No changes needed here
        } else {
          // Generic page - look for standalone h3 after h1 that should be h2
          // Only fix first instance to avoid over-correction
          let foundFirst = false;
          mainSection = mainSection.replace(/<h3(\s[^>]*)?>([^<]+)<\/h3>/i, (match, attrs, text) => {
            if (!foundFirst) {
              foundFirst = true;
              stats.h3ToH2++;
              return `<h2${attrs || ''}>${text}</h2>`;
            }
            return match;
          });
        }
      }

      if (mainSection !== originalMain) {
        content = content.substring(0, mainStart) + mainSection + content.substring(mainEnd);
        changes.push('Generic h3→h2 (first)');
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Pattern 7: h2→h4 skip - h4 immediately after h2 should be h3
  // ═══════════════════════════════════════════════════════════════════════════
  // Find h2→h4 skips and fix by changing h4s in that section to h3
  let currentLevel = 1;
  const lines = content.split('\n');
  let inH2Section = false;
  let h2Depth = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track h2 sections
    if (/<h2[\s>]/i.test(line)) {
      inH2Section = true;
    }

    // If we're in an h2 section and find h4 (skip), change to h3
    if (inH2Section && /<h4[\s>]/i.test(line) && !/<h3[\s>]/i.test(lines.slice(i - 10, i).join('\n'))) {
      // Check if there's no h3 in the previous 10 lines (simple heuristic)
      const before = content;
      // Only fix if this h4 is inside a content box, not in sidebar
      if (/class="[^"]*(?:treatment|condition|nerve|info|method)[^"]*"/i.test(line) ||
          !/sidebar|aside|toc/i.test(lines.slice(Math.max(0, i - 5), i).join('\n'))) {
        lines[i] = line.replace(/<h4(\s)/gi, '<h3$1').replace(/<\/h4>/gi, '</h3>');
        if (lines[i] !== line) {
          stats.h4ToH3++;
        }
      }
    }

    // Reset when we hit another h2
    if (/<h2[\s>]/i.test(line) && i > 0) {
      inH2Section = true;
    }
  }

  const afterLines = lines.join('\n');
  if (afterLines !== content) {
    content = afterLines;
    changes.push('h4→h3 in h2 sections');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Pattern 8: h3→h5 skip (rare) - fix by changing h5 to h4
  // ═══════════════════════════════════════════════════════════════════════════
  // For fotsmerte.html and similar pages with h3→h5 skip
  if (relPath.includes('fotsmerte') || relPath.includes('foot')) {
    const before = content;
    // Find h5 in main content and check if preceded by h3 without h4
    content = content.replace(/(<h3[^>]*>[^<]*<\/h3>[\s\S]{0,500}?)<h5([^>]*)>([^<]*)<\/h5>/gi,
      (match, prefix, attrs, text) => {
        stats.h5ToH4++;
        return `${prefix}<h4${attrs}>${text}</h4>`;
      });
    if (content !== before) {
      changes.push('h5→h4');
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Write changes
  // ═══════════════════════════════════════════════════════════════════════════
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
  console.log('Stage 2: Fix Heading Hierarchy');
  console.log('==============================\n');

  const htmlFiles = findHtmlFiles(ROOT);
  console.log(`Found ${htmlFiles.length} HTML files\n`);

  for (const filePath of htmlFiles) {
    fixFile(filePath);
  }

  console.log('\n--- Summary ---');
  console.log(`Files modified: ${stats.filesModified}`);
  console.log(`h3→h2 changes: ${stats.h3ToH2}`);
  console.log(`h4→h3 changes: ${stats.h4ToH3}`);
  console.log(`h5→h4 changes: ${stats.h5ToH4}`);
}

main();
