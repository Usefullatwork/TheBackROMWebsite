/**
 * Batch Hub Page Validator
 *
 * Validates ALL hub pages in en/conditions/*.html
 * Fails if ANY hub page doesn't pass validation
 *
 * Usage: node scripts/validate-hubs.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const hubDir = path.join(__dirname, '../en/conditions');

// Get all HTML files directly in conditions folder (not subdirectories)
const hubFiles = fs.readdirSync(hubDir)
  .filter(f => {
    const fullPath = path.join(hubDir, f);
    return f.endsWith('.html') && fs.statSync(fullPath).isFile();
  });

console.log(`\n${'='.repeat(50)}`);
console.log(`HUB PAGE VALIDATION`);
console.log(`${'='.repeat(50)}`);
console.log(`\nChecking ${hubFiles.length} hub pages...\n`);

let passed = 0;
let failed = 0;
const failures = [];

hubFiles.forEach(file => {
  try {
    execSync(`node scripts/validate-page.js en/conditions/${file}`, {
      stdio: 'pipe',
      cwd: path.join(__dirname, '..')
    });
    console.log(`[PASS] ${file}`);
    passed++;
  } catch (e) {
    console.log(`[FAIL] ${file}`);
    failed++;
    failures.push(file);
  }
});

console.log(`\n${'='.repeat(50)}`);
console.log(`RESULTS: ${passed}/${hubFiles.length} passed, ${failed} failed`);
console.log(`${'='.repeat(50)}`);

if (failures.length > 0) {
  console.log(`\n[ERROR] Failed hub pages:`);
  failures.forEach(f => console.log(`  - en/conditions/${f}`));
  console.log(`\nRun for details: node scripts/validate-page.js en/conditions/<file>\n`);
  process.exit(1);
}

console.log(`\n[SUCCESS] All hub pages valid!\n`);
process.exit(0);
