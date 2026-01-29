/**
 * Validation Script for Blog Article Design Overhaul
 * Verifies all 84 articles have required elements
 */

const fs = require('fs');
const path = require('path');

const WEBSITE_ROOT = path.join(__dirname, '..');
const BLOG_NO_DIR = path.join(WEBSITE_ROOT, 'blogg');
const BLOG_EN_DIR = path.join(WEBSITE_ROOT, 'en', 'blog');

const results = {
  total: 0,
  passed: 0,
  failed: 0,
  issues: []
};

function validateArticle(filePath) {
  const filename = path.basename(filePath);
  let content;

  try {
    content = fs.readFileSync(filePath, 'utf8');
    // Remove BOM if present
    if (content.charCodeAt(0) === 0xFEFF) {
      content = content.slice(1);
    }
  } catch (err) {
    return { filename, passed: false, issues: [`Cannot read file: ${err.message}`] };
  }

  const issues = [];

  // Check 1: Hub-subnav
  if (!content.includes('class="hub-subnav"')) {
    issues.push('Missing hub-subnav');
  }

  // Check 2: Outro with background image classes
  if (!content.includes('outro--overlay') || !content.includes('outro--home-bg')) {
    issues.push('Missing outro background classes');
  }

  // Check 3: MedicalWebPage schema
  if (!content.includes('"@type": "MedicalWebPage"') && !content.includes('"@type":"MedicalWebPage"')) {
    issues.push('Missing MedicalWebPage schema');
  }

  // Check 4: Encoding issues (Norwegian characters)
  if (content.includes('Ã¥') || content.includes('Ã¸') || content.includes('Ã¦')) {
    issues.push('Encoding corruption detected (Ã¥/Ã¸/Ã¦)');
  }

  // Check 5: Hub-article.css included
  if (!content.includes('hub-article.css')) {
    issues.push('Missing hub-article.css reference');
  }

  return {
    filename,
    passed: issues.length === 0,
    issues
  };
}

function validateDirectory(dir, lang) {
  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.html') && f !== 'index.html');

  console.log(`\n${lang === 'no' ? 'Norwegian' : 'English'} articles (${files.length}):`);
  console.log('-'.repeat(50));

  let passCount = 0;
  let failCount = 0;

  files.forEach(filename => {
    const filePath = path.join(dir, filename);
    const result = validateArticle(filePath);
    results.total++;

    if (result.passed) {
      console.log(`  [PASS] ${filename}`);
      passCount++;
      results.passed++;
    } else {
      console.log(`  [FAIL] ${filename}`);
      result.issues.forEach(issue => console.log(`         - ${issue}`));
      failCount++;
      results.failed++;
      results.issues.push({ file: `${lang}/${filename}`, issues: result.issues });
    }
  });

  console.log(`\n  Summary: ${passCount} passed, ${failCount} failed`);
}

function main() {
  console.log('='.repeat(60));
  console.log('Blog Article Design Overhaul - Validation');
  console.log('='.repeat(60));

  validateDirectory(BLOG_NO_DIR, 'no');
  validateDirectory(BLOG_EN_DIR, 'en');

  console.log('\n' + '='.repeat(60));
  console.log('OVERALL RESULTS');
  console.log('='.repeat(60));
  console.log(`Total articles: ${results.total}`);
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  console.log(`Success rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);

  if (results.issues.length > 0) {
    console.log('\n' + '='.repeat(60));
    console.log('ISSUES TO FIX');
    console.log('='.repeat(60));
    results.issues.forEach(item => {
      console.log(`\n${item.file}:`);
      item.issues.forEach(issue => console.log(`  - ${issue}`));
    });
  }

  console.log('\nValidation complete!');
}

main();
