/**
 * Fix encoding issues in HTML files
 * Fixes corrupted characters like "sidebør" -> "sidebar"
 */

const fs = require('fs');
const path = require('path');

// Common corrupted patterns and their fixes
const fixes = [
  // CSS/HTML class names
  ['hub-sidebør', 'hub-sidebar'],
  ['sidebør-', 'sidebar-'],
  ['hub-primåry', 'hub-primary'],
  ['hub-dørk', 'hub-dark'],
  ['btn-primåry', 'btn-primary'],
  ['hub-årticle', 'hub-article'],
  ['årticle', 'article'],
  ['conversion-cård', 'conversion-card'],
  ['toc-cård', 'toc-card'],
  ['condition-cård', 'condition-card'],
  ['-cård', '-card'],
  ['Cård', 'Card'],
  ['cård', 'card'],

  // URLs
  ['onlineboåking', 'onlinebooking'],
  ['boåk-available', 'book-available'],

  // HTML attributes
  ['chårset', 'charset'],
  ['åria-', 'aria-'],
  ['Transpårent', 'Transparent'],
  ['border-rådius', 'border-radius'],
  ['mårgin', 'margin'],
  ['vår(--', 'var(--'],
  ['scroll-mårgin', 'scroll-margin'],

  // Common words that might be corrupted
  ['Januår', 'Januar'],
  ['årsaker', 'Årsaker'],  // This one is intentional Norwegian
];

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    for (const [bad, good] of fixes) {
        content = content.split(bad).join(good);
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed:', path.relative(process.cwd(), filePath));
        return true;
    }
    return false;
}

function walkSync(dir, filelist = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filepath = path.join(dir, file);
        const stat = fs.statSync(filepath);
        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                walkSync(filepath, filelist);
            }
        } else if (file.endsWith('.html')) {
            filelist.push(filepath);
        }
    }
    return filelist;
}

// Get all HTML files
const files = walkSync('.');

let fixedCount = 0;
for (const file of files) {
    if (fixFile(file)) {
        fixedCount++;
    }
}

console.log(`\nTotal files fixed: ${fixedCount}`);
