#!/usr/bin/env node
/**
 * fix-meta-lengths.js - Auto-fix meta tag length issues
 *
 * Fixes:
 * - Title too long: Removes common suffixes to shorten
 * - Description too long: Truncates at sentence boundary
 * - Syncs og:title and og:description with main tags
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXCLUDE_DIRS = ['node_modules', '.git', 'docs', 'images-originals', 'scripts'];

let stats = {
  titlesFixed: 0,
  descriptionsFixed: 0,
  ogTagsSynced: 0,
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

// ── Title Shortening ──────────────────────────────────────────────────────────

function shortenTitle(title) {
  // Suffixes to remove (ordered by preference)
  const suffixes = [
    ' | Kiropraktor Mads Finstad Majorstua Oslo',
    ' | Chiropractor Mads Finstad Oslo',
    ' | Klinikk for alle Majorstua',
    ' | Kiropraktor Mads Finstad',
    ' | Kiropraktor Majorstua',
    ' | Klinikk for alle',
    ' | Mads Finstad Kiropraktor',
    ' | Mads Finstad Chiropractor',
    ' | Chiropractor Oslo',
    ' - Kiropraktor Mads Finstad',
    ' - Kiropraktor Majorstua',
    ' - Klinikk for alle',
    ' - Chiropractor Oslo',
    ' | TheBackROM',
    ' | Majorstua Oslo',
    ' Oslo'
  ];

  let shortened = title;
  for (const suffix of suffixes) {
    if (shortened.toLowerCase().endsWith(suffix.toLowerCase())) {
      shortened = shortened.slice(0, shortened.length - suffix.length);
      break;
    }
  }

  // If still too long, try trimming more aggressively
  if (shortened.length > 70) {
    // Remove secondary descriptors
    const morePatterns = [
      / - Symptomer, .*/i,
      / - Årsaker, .*/i,
      / - Symptoms, .*/i,
      / - Causes, .*/i,
      / \| Symptomer .*/i,
      / \| Symptoms .*/i
    ];

    for (const pattern of morePatterns) {
      if (pattern.test(shortened)) {
        shortened = shortened.replace(pattern, '');
        break;
      }
    }
  }

  return shortened.length <= 70 ? shortened : null; // Return null if can't safely shorten
}

// ── Description Shortening ────────────────────────────────────────────────────

function shortenDescription(desc) {
  if (desc.length <= 160) return desc;

  // Find good cut points
  let cutoff = 160;

  // Try to end at a sentence
  const sentences = desc.match(/[^.!?]+[.!?]+/g) || [];
  let accumulated = '';

  for (const sentence of sentences) {
    if ((accumulated + sentence).length <= 157) {
      accumulated += sentence;
    } else {
      break;
    }
  }

  if (accumulated.length >= 100) {
    return accumulated.trim();
  }

  // Otherwise, cut at last space before 157 chars
  const lastSpace = desc.lastIndexOf(' ', 155);
  if (lastSpace > 100) {
    return desc.substring(0, lastSpace).trim() + '...';
  }

  // Last resort: hard cut
  return desc.substring(0, 157).trim() + '...';
}

// ── Main Processing ───────────────────────────────────────────────────────────

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(ROOT, filePath);
  let modified = false;

  // Get current values
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : '';

  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ||
                    content.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i);
  const description = descMatch ? descMatch[1] : '';

  // Fix title if too long
  if (title && title.length > 70) {
    const newTitle = shortenTitle(title);
    if (newTitle && newTitle !== title) {
      content = content.replace(
        new RegExp(`<title>${escapeRegex(title)}</title>`, 'i'),
        `<title>${newTitle}</title>`
      );

      // Also update og:title if it matches the old title
      content = content.replace(
        new RegExp(`<meta\\s+property=["']og:title["']\\s+content=["']${escapeRegex(title)}["']`, 'gi'),
        `<meta property="og:title" content="${newTitle}"`
      );
      content = content.replace(
        new RegExp(`<meta\\s+content=["']${escapeRegex(title)}["']\\s+property=["']og:title["']`, 'gi'),
        `<meta content="${newTitle}" property="og:title"`
      );

      stats.titlesFixed++;
      modified = true;
      console.log(`[TITLE] ${relPath}: ${title.length} → ${newTitle.length} chars`);
    }
  }

  // Fix description if too long
  if (description && description.length > 160) {
    const newDesc = shortenDescription(description);
    if (newDesc && newDesc !== description && newDesc.length <= 160) {
      content = content.replace(
        new RegExp(`(<meta\\s+name=["']description["']\\s+content=["'])${escapeRegex(description)}(["'])`, 'i'),
        `$1${newDesc}$2`
      );
      content = content.replace(
        new RegExp(`(<meta\\s+content=["'])${escapeRegex(description)}(["']\\s+name=["']description["'])`, 'i'),
        `$1${newDesc}$2`
      );

      // Also update og:description if it matches the old description
      content = content.replace(
        new RegExp(`(<meta\\s+property=["']og:description["']\\s+content=["'])${escapeRegex(description)}(["'])`, 'gi'),
        `$1${newDesc}$2`
      );
      content = content.replace(
        new RegExp(`(<meta\\s+content=["'])${escapeRegex(description)}(["']\\s+property=["']og:description["'])`, 'gi'),
        `$1${newDesc}$2`
      );

      stats.descriptionsFixed++;
      modified = true;
      console.log(`[DESC] ${relPath}: ${description.length} → ${newDesc.length} chars`);
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    stats.filesModified++;
    return true;
  }

  return false;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  console.log('Auto-fix Meta Tag Lengths');
  console.log('=========================\n');

  const htmlFiles = findHtmlFiles(ROOT);
  console.log(`Found ${htmlFiles.length} HTML files\n`);

  for (const filePath of htmlFiles) {
    fixFile(filePath);
  }

  console.log('\n--- Summary ---');
  console.log(`Titles shortened: ${stats.titlesFixed}`);
  console.log(`Descriptions shortened: ${stats.descriptionsFixed}`);
  console.log(`Files modified: ${stats.filesModified}`);
}

main();
