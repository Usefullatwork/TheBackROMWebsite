/**
 * Fix Bidirectional Hreflang Links
 * Adds missing hreflang tags to Norwegian pages that have English counterparts
 */

const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..');
const BASE_URL = 'https://thebackrom.com';

// Mapping of files that need hreflang added (target → source pairs)
const hreflangPairs = [
  // FAQ pages - Norwegian needs links to English
  { no: 'faq/armsmerter-faq.html', en: 'faq/arm-pain-faq.html' },
  { no: 'faq/knesmerter-faq.html', en: 'faq/knee-pain-faq.html' },
  { no: 'faq/kjevesmerter-faq.html', en: 'faq/jaw-pain-faq.html' },
  { no: 'faq/hoftesmerter-faq.html', en: 'faq/hip-pain-faq.html' },
  { no: 'faq/svimmelhet-faq.html', en: 'faq/dizziness-faq.html' },
  { no: 'faq/nakkesmerter-faq.html', en: 'faq/neck-pain-faq.html' },
  { no: 'faq/fotsmerter-faq.html', en: 'faq/foot-pain-faq.html' },
  { no: 'faq/hodepine-faq.html', en: 'faq/headache-faq.html' },
  { no: 'faq/brystryggsmerter-faq.html', en: 'faq/chest-pain-faq.html' },
  { no: 'faq/skuldersmerter-faq.html', en: 'faq/shoulder-pain-faq.html' },
  { no: 'faq/ryggsmerter-faq.html', en: 'faq/back-pain-faq.html' },
  { no: 'faq/korsryggsmerter-faq.html', en: 'faq/lower-back-pain-faq.html' },

  // Blog indexes
  { no: 'blogg/index.html', en: 'en/blog/index.html' },

  // Other pages
  { no: 'nye-pasienter.html', en: 'en/new-patients.html' },
  { no: 'akutt-behandling.html', en: 'en/emergency.html' },

  // Condition pages with mismatched links
  { no: 'plager/hodepine/vestibulaer-migrene.html', en: 'en/conditions/dizziness/vestibular-migraine.html' },
  { no: 'plager/ryggsmerter.html', en: 'en/conditions/back-pain.html' }
];

// Also fix English FAQ pages that need self-reference and proper NO link
const englishFaqPages = [
  'faq/arm-pain-faq.html',
  'faq/knee-pain-faq.html',
  'faq/jaw-pain-faq.html',
  'faq/hip-pain-faq.html',
  'faq/dizziness-faq.html',
  'faq/neck-pain-faq.html',
  'faq/foot-pain-faq.html',
  'faq/headache-faq.html',
  'faq/chest-pain-faq.html',
  'faq/shoulder-pain-faq.html',
  'faq/back-pain-faq.html',
  'faq/lower-back-pain-faq.html'
];

console.log('\nFix Bidirectional Hreflang Links');
console.log('='.repeat(50));

let fixedCount = 0;

// Function to add hreflang tags after canonical or before </head>
function addHreflangTags(content, noUrl, enUrl) {
  const hreflangTags = `
  <link rel="alternate" hreflang="nb" href="${noUrl}">
  <link rel="alternate" hreflang="en" href="${enUrl}">`;

  // Check if hreflang tags already exist
  if (content.includes('hreflang="nb"') && content.includes('hreflang="en"')) {
    return { content, changed: false };
  }

  // Try to insert after canonical link
  const canonicalMatch = content.match(/<link[^>]+rel="canonical"[^>]*>/i);
  if (canonicalMatch) {
    const insertPoint = content.indexOf(canonicalMatch[0]) + canonicalMatch[0].length;
    content = content.slice(0, insertPoint) + hreflangTags + content.slice(insertPoint);
    return { content, changed: true };
  }

  // Otherwise insert before </head>
  content = content.replace('</head>', hreflangTags + '\n</head>');
  return { content, changed: true };
}

// Function to fix existing hreflang tags
function fixExistingHreflang(content, noUrl, enUrl) {
  let changed = false;

  // Remove any existing hreflang tags
  const oldContent = content;
  content = content.replace(/<link[^>]+hreflang[^>]*>\s*/gi, '');

  if (content !== oldContent) {
    changed = true;
  }

  // Add correct hreflang tags
  const result = addHreflangTags(content, noUrl, enUrl);
  return { content: result.content, changed: changed || result.changed };
}

// Process Norwegian pages - add hreflang to NO pages
console.log('\nAdding hreflang to Norwegian pages...');

hreflangPairs.forEach(pair => {
  const noPath = path.join(baseDir, pair.no);
  const enPath = path.join(baseDir, pair.en);

  if (!fs.existsSync(noPath)) {
    console.log(`[SKIP] NO file not found: ${pair.no}`);
    return;
  }

  if (!fs.existsSync(enPath)) {
    console.log(`[SKIP] EN file not found: ${pair.en}`);
    return;
  }

  const noUrl = `${BASE_URL}/${pair.no}`;
  const enUrl = `${BASE_URL}/${pair.en}`;

  // Fix Norwegian file
  let noContent = fs.readFileSync(noPath, 'utf8');
  const noResult = fixExistingHreflang(noContent, noUrl, enUrl);
  if (noResult.changed) {
    fs.writeFileSync(noPath, noResult.content, 'utf8');
    console.log(`[FIXED] ${pair.no}`);
    fixedCount++;
  } else {
    console.log(`[OK] ${pair.no}`);
  }

  // Fix English file
  let enContent = fs.readFileSync(enPath, 'utf8');
  const enResult = fixExistingHreflang(enContent, noUrl, enUrl);
  if (enResult.changed) {
    fs.writeFileSync(enPath, enResult.content, 'utf8');
    console.log(`[FIXED] ${pair.en}`);
    fixedCount++;
  } else {
    console.log(`[OK] ${pair.en}`);
  }
});

// Fix index.html and en/index.html
console.log('\nFixing homepage hreflang...');

const indexNoPath = path.join(baseDir, 'index.html');
const indexEnPath = path.join(baseDir, 'en/index.html');

if (fs.existsSync(indexNoPath) && fs.existsSync(indexEnPath)) {
  const indexNoUrl = `${BASE_URL}/`;
  const indexEnUrl = `${BASE_URL}/en/`;

  let indexNoContent = fs.readFileSync(indexNoPath, 'utf8');
  const indexNoResult = fixExistingHreflang(indexNoContent, indexNoUrl, indexEnUrl);
  if (indexNoResult.changed) {
    fs.writeFileSync(indexNoPath, indexNoResult.content, 'utf8');
    console.log(`[FIXED] index.html`);
    fixedCount++;
  }

  let indexEnContent = fs.readFileSync(indexEnPath, 'utf8');
  const indexEnResult = fixExistingHreflang(indexEnContent, indexNoUrl, indexEnUrl);
  if (indexEnResult.changed) {
    fs.writeFileSync(indexEnPath, indexEnResult.content, 'utf8');
    console.log(`[FIXED] en/index.html`);
    fixedCount++;
  }
}

// Fix vestibular-migraine back-link
console.log('\nFixing vestibular migraine back-link...');

const vestMigEnPath = path.join(baseDir, 'en/conditions/dizziness/vestibular-migraine.html');
const vestMigNoPath = path.join(baseDir, 'plager/hodepine/vestibulaer-migrene.html');

if (fs.existsSync(vestMigEnPath) && fs.existsSync(vestMigNoPath)) {
  const vestMigNoUrl = `${BASE_URL}/plager/hodepine/vestibulaer-migrene.html`;
  const vestMigEnUrl = `${BASE_URL}/en/conditions/dizziness/vestibular-migraine.html`;

  let vestMigEnContent = fs.readFileSync(vestMigEnPath, 'utf8');
  const vestMigEnResult = fixExistingHreflang(vestMigEnContent, vestMigNoUrl, vestMigEnUrl);
  if (vestMigEnResult.changed) {
    fs.writeFileSync(vestMigEnPath, vestMigEnResult.content, 'utf8');
    console.log(`[FIXED] en/conditions/dizziness/vestibular-migraine.html`);
    fixedCount++;
  }
}

// Fix lower-back-pain back-link to ryggsmerter
console.log('\nFixing ryggsmerter/back-pain link...');

const backPainEnPath = path.join(baseDir, 'en/conditions/lower-back-pain.html');
const ryggsmerterNoPath = path.join(baseDir, 'plager/ryggsmerter.html');

if (fs.existsSync(backPainEnPath) && fs.existsSync(ryggsmerterNoPath)) {
  // Check current hreflang in EN file
  let backPainEnContent = fs.readFileSync(backPainEnPath, 'utf8');

  // This page links to korsryggsmerte, but ryggsmerter also links to it
  // We need to check if ryggsmerter should have its own EN page or link to lower-back-pain
  // For now, let's add proper hreflang to ryggsmerter
  const ryggsmerterNoUrl = `${BASE_URL}/plager/ryggsmerter.html`;
  const backPainEnUrl = `${BASE_URL}/en/conditions/back-pain.html`;

  // Check if en/conditions/back-pain.html exists
  const backPainAltPath = path.join(baseDir, 'en/conditions/back-pain.html');
  if (fs.existsSync(backPainAltPath)) {
    let ryggsmerterContent = fs.readFileSync(ryggsmerterNoPath, 'utf8');
    const ryggsmerterResult = fixExistingHreflang(ryggsmerterContent, ryggsmerterNoUrl, backPainEnUrl);
    if (ryggsmerterResult.changed) {
      fs.writeFileSync(ryggsmerterNoPath, ryggsmerterResult.content, 'utf8');
      console.log(`[FIXED] plager/ryggsmerter.html`);
      fixedCount++;
    }

    let backPainAltContent = fs.readFileSync(backPainAltPath, 'utf8');
    const backPainAltResult = fixExistingHreflang(backPainAltContent, ryggsmerterNoUrl, backPainEnUrl);
    if (backPainAltResult.changed) {
      fs.writeFileSync(backPainAltPath, backPainAltResult.content, 'utf8');
      console.log(`[FIXED] en/conditions/back-pain.html`);
      fixedCount++;
    }
  }
}

console.log('\n' + '='.repeat(50));
console.log(`Total files fixed: ${fixedCount}`);
console.log('\nDone!');
