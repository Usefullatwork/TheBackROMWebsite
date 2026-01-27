/**
 * Comprehensive encoding fix for Norwegian characters
 * Fixes corrupted å/ø patterns in HTML files
 */

const fs = require('fs');
const path = require('path');

// Patterns to fix - corrupted → correct
const fixes = [
  // Common word corruptions (Norwegian)
  ['fårste', 'første'],
  ['Fårste', 'Første'],
  ['hår ', 'har '],
  ['hår.', 'har.'],
  ['hår,', 'har,'],
  ['vår ', 'var '],
  ['vår.', 'var.'],
  ['vår,', 'var,'],
  ['klært', 'klart'],
  ['nådvendig', 'nødvendig'],
  ['grøder', 'grader'],
  ['gråd ', 'grad '],
  ['gråd.', 'grad.'],
  ['gråd,', 'grad,'],
  ['Gråd', 'Grad'],
  ['låpet', 'løpet'],
  ['stårter', 'starter'],
  ['vårierer', 'varierer'],
  ['åk ', 'øk '],
  ['åkning', 'økning'],
  ['Fåkus', 'Fokus'],
  ['fåkus', 'fokus'],
  ['tilnårming', 'tilnærming'],
  ['faktårer', 'faktorer'],
  ['forlåp', 'forløp'],
  ['forklærer', 'forklarer'],
  ['forklært', 'forklart'],
  ['misforstøtt', 'misforstått'],
  ['dislåkasjon', 'dislokasjon'],
  ['blåkader', 'blokader'],
  ['grådvis', 'gradvis'],
  ['fårlig', 'farlig'],
  ['tår ', 'tar '],
  ['værer', 'varer'],
  ['advårsel', 'advarsel'],
  ['Vedværende', 'Vedvarende'],
  ['vedværende', 'vedvarende'],
  ['åre ', 'øre '],
  ['åyne', 'øyne'],
  ['Blåtvevsbehandling', 'Bløtvevsbehandling'],
  ['blåtvevsbehandling', 'bløtvevsbehandling'],
  ['nakkefleksårene', 'nakkefleksorene'],
  ['kiropraktåren', 'kiropraktoren'],
  ['Børnsley', 'Barnsley'],
  ['erfåring', 'erfaring'],
  ['måter', 'møter'],
  ['fårsterket', 'forsterket'],
  ['smerseoppfattelse', 'smerteoppfattelse'],
  ['hovedørtikkel', 'hovedartikkel'],
  ['Hovedørtikkel', 'Hovedartikkel'],

  // CSS/HTML patterns (already mostly fixed, but ensure)
  ['vår(--', 'var(--'],
  ['border-rådius', 'border-radius'],
  ['mårgin', 'margin'],

  // Keep these Norwegian words correct (don't change)
  // Årsaker, før, får (when meaning "gets"), etc.
];

function walkSync(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      if (!file.startsWith('_backup') && file !== 'node_modules' && file !== '.git') {
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

  for (const [bad, good] of fixes) {
    content = content.split(bad).join(good);
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

// Process directories
const dirs = ['plager', 'en/conditions', 'blogg', 'en/blog', 'tjeneste', 'en/services', 'faq'];
let fixedCount = 0;
let totalFiles = 0;

for (const dir of dirs) {
  if (fs.existsSync(dir)) {
    const files = walkSync(dir);
    for (const file of files) {
      totalFiles++;
      if (fixFile(file)) {
        console.log('Fixed:', path.relative('.', file));
        fixedCount++;
      }
    }
  }
}

console.log(`\nProcessed ${totalFiles} files, fixed ${fixedCount}`);
