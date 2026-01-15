/**
 * Simple Grammar Check Script
 * Catches common English grammar errors
 *
 * Usage: node scripts/grammar-check.js <path-to-html-file>
 */

const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];

if (!filePath) {
  console.log('Usage: node scripts/grammar-check.js <path-to-html-file>');
  process.exit(1);
}

const fullPath = path.resolve(filePath);

if (!fs.existsSync(fullPath)) {
  console.log(`File not found: ${fullPath}`);
  process.exit(1);
}

const content = fs.readFileSync(fullPath, 'utf8');
const fileName = path.basename(filePath);

// Extract visible text (remove HTML tags, scripts, styles)
const visibleText = content
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z]+;/gi, ' ')
  .replace(/\s+/g, ' ');

console.log(`\nGrammar Check: ${fileName}`);
console.log('='.repeat(50));

let issues = [];

// Common grammar patterns to check
const grammarPatterns = [
  // Double words
  { pattern: /\b(\w+)\s+\1\b/gi, message: 'Repeated word' },

  // a/an errors
  { pattern: /\ba\s+[aeiou]/gi, message: 'Should be "an" before vowel' },
  { pattern: /\ban\s+[^aeiou\s]/gi, message: 'Should be "a" before consonant' },

  // Common typos
  { pattern: /\bteh\b/gi, message: 'Typo: "teh" should be "the"' },
  { pattern: /\bthier\b/gi, message: 'Typo: should be "their" or "there"' },
  { pattern: /\brecieve\b/gi, message: 'Typo: should be "receive"' },
  { pattern: /\boccured\b/gi, message: 'Typo: should be "occurred"' },
  { pattern: /\baccross\b/gi, message: 'Typo: should be "across"' },
  { pattern: /\balot\b/gi, message: 'Should be "a lot" (two words)' },
  { pattern: /\buntill\b/gi, message: 'Typo: should be "until"' },
  { pattern: /\bwich\b/gi, message: 'Typo: should be "which"' },
  { pattern: /\bbeacuse\b/gi, message: 'Typo: should be "because"' },
  { pattern: /\bbeleive\b/gi, message: 'Typo: should be "believe"' },
  { pattern: /\bdefinate\b/gi, message: 'Typo: should be "definite"' },
  { pattern: /\bseperately\b/gi, message: 'Typo: should be "separately"' },
  { pattern: /\boccasionally\b/gi, message: 'Check: should be "occasionally"' },
  { pattern: /\bneccessary\b/gi, message: 'Typo: should be "necessary"' },
  { pattern: /\bexistance\b/gi, message: 'Typo: should be "existence"' },

  // Subject-verb agreement
  { pattern: /\bhe don't\b/gi, message: 'Should be "he doesn\'t"' },
  { pattern: /\bshe don't\b/gi, message: 'Should be "she doesn\'t"' },
  { pattern: /\bit don't\b/gi, message: 'Should be "it doesn\'t"' },

  // Common mistakes
  { pattern: /\bshould of\b/gi, message: 'Should be "should have"' },
  { pattern: /\bcould of\b/gi, message: 'Should be "could have"' },
  { pattern: /\bwould of\b/gi, message: 'Should be "would have"' },
  { pattern: /\byour welcome\b/gi, message: 'Should be "you\'re welcome"' },
  { pattern: /\bits a\b/gi, message: 'Check: should this be "it\'s a"?' },

  // British vs American (prefer British for this project)
  { pattern: /\borganize\b/gi, message: 'British: prefer "organise"' },
  { pattern: /\brealize\b/gi, message: 'British: prefer "realise"' },
  { pattern: /\bcolor\b/gi, message: 'British: prefer "colour"' },
  { pattern: /\bfavor\b/gi, message: 'British: prefer "favour"' },
  { pattern: /\bhonor\b/gi, message: 'British: prefer "honour"' },
  { pattern: /\blabor\b/gi, message: 'British: prefer "labour"' },
  { pattern: /\bcenter\b/gi, message: 'British: prefer "centre"' },
  { pattern: /\bfiber\b/gi, message: 'British: prefer "fibre"' },

  // Missing capitals after periods (basic check)
  { pattern: /\.\s+[a-z]/g, message: 'Possible missing capital after period' },
];

// Check each pattern
grammarPatterns.forEach(({ pattern, message }) => {
  const matches = visibleText.match(pattern);
  if (matches) {
    matches.forEach(match => {
      // Skip some false positives
      if (message.includes('capital after period') && match.includes('e.g.')) return;
      if (message.includes('capital after period') && match.includes('i.e.')) return;
      if (message.includes('capital after period') && match.includes('vs.')) return;

      issues.push({
        text: match.trim().substring(0, 30),
        message: message
      });
    });
  }
});

// Check for very long sentences (readability)
const sentences = visibleText.split(/[.!?]+/);
sentences.forEach((sentence, idx) => {
  const wordCount = sentence.trim().split(/\s+/).length;
  if (wordCount > 40) {
    issues.push({
      text: sentence.trim().substring(0, 40) + '...',
      message: `Very long sentence (${wordCount} words) - consider splitting`
    });
  }
});

// Output results
if (issues.length === 0) {
  console.log('\n[PASS] No grammar issues found!\n');
  process.exit(0);
} else {
  console.log(`\n[WARN] Found ${issues.length} potential issues:\n`);

  // Group by message type
  const grouped = {};
  issues.forEach(issue => {
    if (!grouped[issue.message]) {
      grouped[issue.message] = [];
    }
    grouped[issue.message].push(issue.text);
  });

  Object.entries(grouped).forEach(([message, texts]) => {
    console.log(`- ${message}:`);
    texts.slice(0, 5).forEach(text => {
      console.log(`    "${text}"`);
    });
    if (texts.length > 5) {
      console.log(`    ... and ${texts.length - 5} more`);
    }
    console.log('');
  });

  console.log('='.repeat(50));
  console.log(`Total: ${issues.length} potential issues\n`);
  process.exit(1);
}
