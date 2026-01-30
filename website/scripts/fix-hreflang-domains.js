/**
 * Fix Hreflang Domain Issues
 * Corrects wrong domain references in hreflang and canonical tags
 *
 * Issues fixed:
 * - thebackrom.no → thebackrom.com
 * - www.thebackrom.com → thebackrom.com
 */

const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..');

// Files with known issues (from audit)
const targetFiles = [
  'en/conditions/hip/bursitis-myth.html',
  'en/conditions/elbow-arm/carpal-tunnel-syndrome.html',
  'en/conditions/elbow-arm/cubital-tunnel-syndrome.html',
  'en/conditions/elbow-arm/golfers-elbow.html',
  'en/conditions/elbow-arm/mouse-arm.html',
  'en/conditions/elbow-arm/tennis-elbow.html',
  'en/conditions/elbow-arm/thumb-arthritis.html',
  'en/conditions/elbow-arm/trigger-finger.html',
  'en/conditions/elbow-arm/trigger-points-arm.html',
  'en/conditions/elbow-arm/de-quervains.html'
];

// Replacements to make
const replacements = [
  { from: 'https://thebackrom.no/', to: 'https://thebackrom.com/' },
  { from: 'https://www.thebackrom.com/', to: 'https://thebackrom.com/' },
  { from: 'http://thebackrom.no/', to: 'https://thebackrom.com/' },
  { from: 'http://www.thebackrom.com/', to: 'https://thebackrom.com/' }
];

console.log('\nFix Hreflang Domain Issues');
console.log('='.repeat(50));

let totalFixed = 0;
let filesModified = 0;

targetFiles.forEach(relPath => {
  const fullPath = path.join(baseDir, relPath);

  if (!fs.existsSync(fullPath)) {
    console.log(`[SKIP] File not found: ${relPath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;
  let fixCount = 0;

  replacements.forEach(({ from, to }) => {
    const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, to);
      fixCount += matches.length;
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`[FIXED] ${relPath} (${fixCount} replacement${fixCount > 1 ? 's' : ''})`);
    totalFixed += fixCount;
    filesModified++;
  } else {
    console.log(`[OK] ${relPath} (no issues found)`);
  }
});

// Also scan for any other files with these issues
console.log('\nScanning all HTML files for additional issues...');

function findHtmlFiles(dir, excludeDirs = ['node_modules', '.git', 'images']) {
  let files = [];
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory() && !excludeDirs.includes(item)) {
        files = files.concat(findHtmlFiles(fullPath, excludeDirs));
      } else if (item.endsWith('.html')) {
        files.push(fullPath);
      }
    }
  } catch (err) {}
  return files;
}

const allFiles = findHtmlFiles(baseDir);
let additionalFixes = 0;

allFiles.forEach(fullPath => {
  const relPath = fullPath.replace(baseDir + path.sep, '').replace(/\\/g, '/');

  // Skip already processed files
  if (targetFiles.includes(relPath)) return;

  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;
  let fixCount = 0;

  replacements.forEach(({ from, to }) => {
    const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, to);
      fixCount += matches.length;
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`[FIXED] ${relPath} (${fixCount} replacement${fixCount > 1 ? 's' : ''})`);
    totalFixed += fixCount;
    filesModified++;
    additionalFixes++;
  }
});

console.log('\n' + '='.repeat(50));
console.log(`Total files modified: ${filesModified}`);
console.log(`Total replacements: ${totalFixed}`);
if (additionalFixes > 0) {
  console.log(`Additional files found and fixed: ${additionalFixes}`);
}
console.log('\nDone!');
