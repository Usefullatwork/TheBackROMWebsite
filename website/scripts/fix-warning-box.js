/**
 * Fix warning-box class to red-flag-alert
 * This script replaces all occurrences of:
 * - .warning-box (CSS selector)
 * - class="warning-box" (HTML class)
 */

const fs = require('fs');
const path = require('path');

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

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;

    // Replace all CSS selectors - use global regex to catch all patterns
    content = content.replace(/\.warning-box/g, '.red-flag-alert');

    // Replace HTML class attribute
    content = content.replace(/class="warning-box"/g, 'class="red-flag-alert"');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed:', path.relative(process.cwd(), filePath));
        return true;
    }
    return false;
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
