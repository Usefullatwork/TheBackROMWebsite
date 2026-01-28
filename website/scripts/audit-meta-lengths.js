#!/usr/bin/env node
/**
 * audit-meta-lengths.js - Stage 5: Generate meta tag fix report
 *
 * Generates a detailed report of meta tag issues with suggestions.
 * Output: docs/META-TAG-FIXES-NEEDED.md
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXCLUDE_DIRS = ['node_modules', '.git', 'docs', 'images-originals', 'scripts'];
const OUTPUT_PATH = path.join(ROOT, 'docs', 'META-TAG-FIXES-NEEDED.md');

const issues = [];
const stats = {
  titleTooLong: 0,
  titleTooShort: 0,
  descTooLong: 0,
  descTooShort: 0,
  missingCanonical: 0
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

function getMeta(content, name) {
  const re = new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["']([^"']*)["']`, 'i');
  const re2 = new RegExp(`<meta\\s+content=["']([^"']*)["']\\s+name=["']${name}["']`, 'i');
  return (content.match(re) || content.match(re2) || [])[1] || '';
}

function getTitle(content) {
  const match = content.match(/<title>([^<]*)<\/title>/i);
  return match ? match[1] : '';
}

function suggestShorterTitle(title) {
  // Strategy: Remove common suffixes
  const suffixes = [
    ' | Kiropraktor Mads Finstad',
    ' | Kiropraktor Majorstua',
    ' | Klinikk for alle',
    ' | Mads Finstad Kiropraktor',
    ' | Chiropractor Oslo',
    ' | Chiropractor Mads Finstad',
    ' - Kiropraktor Mads Finstad',
    ' - Kiropraktor Majorstua',
    ' - Klinikk for alle'
  ];

  let shortened = title;
  for (const suffix of suffixes) {
    if (shortened.toLowerCase().endsWith(suffix.toLowerCase())) {
      shortened = shortened.slice(0, -suffix.length);
      break;
    }
  }

  // If still too long, truncate at sentence boundary
  if (shortened.length > 70) {
    const pipeIdx = shortened.indexOf(' | ');
    const dashIdx = shortened.indexOf(' - ');
    if (pipeIdx > 30 && pipeIdx < 65) {
      shortened = shortened.substring(0, pipeIdx);
    } else if (dashIdx > 30 && dashIdx < 65) {
      shortened = shortened.substring(0, dashIdx);
    }
  }

  return shortened.length <= 70 ? shortened : title.substring(0, 67) + '...';
}

function suggestShorterDescription(desc) {
  // Strategy: Truncate at sentence boundary before 160 chars
  if (desc.length <= 160) return desc;

  // Find last sentence ending before 160
  let cutoff = 160;
  const lastPeriod = desc.lastIndexOf('. ', 155);
  const lastComma = desc.lastIndexOf(', ', 155);

  if (lastPeriod > 100) {
    cutoff = lastPeriod + 1;
  } else if (lastComma > 120) {
    cutoff = lastComma;
  }

  return desc.substring(0, cutoff).trim();
}

// ── Main Processing ───────────────────────────────────────────────────────────

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(ROOT, filePath);

  const title = getTitle(content);
  const description = getMeta(content, 'description');
  const hasCanonical = /<link\s[^>]*rel=["']canonical["'][^>]*>/i.test(content);

  const fileIssues = [];

  // Title checks
  if (title) {
    if (title.length > 70) {
      stats.titleTooLong++;
      const suggested = suggestShorterTitle(title);
      fileIssues.push({
        type: 'title-long',
        current: title,
        currentLength: title.length,
        suggested: suggested,
        suggestedLength: suggested.length,
        canAutoFix: suggested.length <= 70 && suggested !== title
      });
    } else if (title.length < 20) {
      stats.titleTooShort++;
      fileIssues.push({
        type: 'title-short',
        current: title,
        currentLength: title.length,
        action: 'Expand title to 30-60 characters'
      });
    }
  }

  // Description checks
  if (description) {
    if (description.length > 160) {
      stats.descTooLong++;
      const suggested = suggestShorterDescription(description);
      fileIssues.push({
        type: 'desc-long',
        current: description,
        currentLength: description.length,
        suggested: suggested,
        suggestedLength: suggested.length,
        canAutoFix: suggested.length <= 160 && suggested.length >= 70
      });
    } else if (description.length < 70) {
      stats.descTooShort++;
      fileIssues.push({
        type: 'desc-short',
        current: description,
        currentLength: description.length,
        action: 'Expand description to 120-155 characters'
      });
    }
  }

  // Canonical check
  if (!hasCanonical && !relPath.includes('404')) {
    stats.missingCanonical++;
    fileIssues.push({
      type: 'missing-canonical',
      action: 'Add <link rel="canonical" href="...">'
    });
  }

  if (fileIssues.length > 0) {
    issues.push({
      file: relPath,
      issues: fileIssues
    });
  }
}

// ── Report Generation ─────────────────────────────────────────────────────────

function generateReport() {
  let md = `# Meta Tag Fixes Needed

**Generated:** ${new Date().toISOString().split('T')[0]}

## Summary

| Issue | Count | Auto-fixable |
|-------|-------|--------------|
| Title too long (>70 chars) | ${stats.titleTooLong} | Partial |
| Title too short (<20 chars) | ${stats.titleTooShort} | No |
| Description too long (>160 chars) | ${stats.descTooLong} | Partial |
| Description too short (<70 chars) | ${stats.descTooShort} | No |
| Missing canonical | ${stats.missingCanonical} | Yes |

## Auto-fix Command

To automatically fix the auto-fixable issues, run:
\`\`\`bash
node scripts/fix-meta-lengths.js
\`\`\`

---

## Title Too Long

`;

  const titleLongIssues = issues.filter(i => i.issues.some(x => x.type === 'title-long'));
  for (const item of titleLongIssues) {
    const issue = item.issues.find(x => x.type === 'title-long');
    md += `### ${item.file}\n\n`;
    md += `**Current (${issue.currentLength} chars):**\n\`\`\`\n${issue.current}\n\`\`\`\n\n`;
    if (issue.canAutoFix) {
      md += `**Suggested (${issue.suggestedLength} chars):** ✅ Auto-fixable\n\`\`\`\n${issue.suggested}\n\`\`\`\n\n`;
    } else {
      md += `**Status:** ❌ Needs manual review\n\n`;
    }
    md += `---\n\n`;
  }

  md += `## Description Too Long

`;

  const descLongIssues = issues.filter(i => i.issues.some(x => x.type === 'desc-long'));
  for (const item of descLongIssues) {
    const issue = item.issues.find(x => x.type === 'desc-long');
    md += `### ${item.file}\n\n`;
    md += `**Current (${issue.currentLength} chars):**\n\`\`\`\n${issue.current}\n\`\`\`\n\n`;
    if (issue.canAutoFix) {
      md += `**Suggested (${issue.suggestedLength} chars):** ✅ Auto-fixable\n\`\`\`\n${issue.suggested}\n\`\`\`\n\n`;
    } else {
      md += `**Status:** ❌ Needs manual review (truncation loses meaning)\n\n`;
    }
    md += `---\n\n`;
  }

  if (stats.descTooShort > 0) {
    md += `## Description Too Short

These pages need expanded descriptions (add context, keywords, call-to-action):

`;
    const descShortIssues = issues.filter(i => i.issues.some(x => x.type === 'desc-short'));
    for (const item of descShortIssues) {
      const issue = item.issues.find(x => x.type === 'desc-short');
      md += `- **${item.file}** (${issue.currentLength} chars): "${issue.current}"\n`;
    }
    md += '\n';
  }

  if (stats.missingCanonical > 0) {
    md += `## Missing Canonical

These pages need a canonical link tag:

`;
    const canonicalIssues = issues.filter(i => i.issues.some(x => x.type === 'missing-canonical'));
    for (const item of canonicalIssues) {
      md += `- ${item.file}\n`;
    }
  }

  return md;
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  console.log('Stage 5: Audit Meta Tag Lengths');
  console.log('================================\n');

  const htmlFiles = findHtmlFiles(ROOT);
  console.log(`Found ${htmlFiles.length} HTML files\n`);

  for (const filePath of htmlFiles) {
    analyzeFile(filePath);
  }

  console.log('Summary:');
  console.log(`  Title too long: ${stats.titleTooLong}`);
  console.log(`  Title too short: ${stats.titleTooShort}`);
  console.log(`  Description too long: ${stats.descTooLong}`);
  console.log(`  Description too short: ${stats.descTooShort}`);
  console.log(`  Missing canonical: ${stats.missingCanonical}`);
  console.log(`  Total files with issues: ${issues.length}`);

  // Generate report
  const report = generateReport();
  fs.writeFileSync(OUTPUT_PATH, report, 'utf8');
  console.log(`\nReport saved to: docs/META-TAG-FIXES-NEEDED.md`);
}

main();
