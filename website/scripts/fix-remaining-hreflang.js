/**
 * Fix Remaining Bidirectional Hreflang Links
 * Adds missing hreflang tags to all paired pages
 */

const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..');
const BASE_URL = 'https://thebackrom.com';

// All pairs that need bidirectional hreflang
const hreflangPairs = [
  // Index pages
  { no: 'index.html', en: 'en/index.html', noUrl: '/', enUrl: '/en/' },

  // svimmelhet vestibulaer-migrene (Norwegian) links to dizziness (English)
  { no: 'plager/svimmelhet/vestibulaer-migrene.html', en: 'en/conditions/dizziness/vestibular-migraine.html' },
  // Also check headache location
  { no: 'plager/hodepine/vestibulaer-migrene.html', en: 'en/conditions/dizziness/vestibular-migraine.html' },

  // ryggsmerter - may link to back-pain or lower-back-pain
  { no: 'plager/ryggsmerter.html', en: 'en/conditions/lower-back-pain.html' },

  // Hip pages
  { no: 'plager/hofte/meralgia-paresthetica.html', en: 'en/conditions/hip/meralgia-paresthetica.html' },
  { no: 'plager/hofte/osteitis-pubis.html', en: 'en/conditions/hip/osteitis-pubis.html' },
  { no: 'plager/hofte/snapping-hip.html', en: 'en/conditions/hip/snapping-hip.html' },
  { no: 'plager/hofte/hip-pointer.html', en: 'en/conditions/hip/hip-pointer.html' },

  // Neck pages
  { no: 'plager/nakke/whiplash.html', en: 'en/conditions/neck/whiplash.html' },
  { no: 'plager/nakke/torticollis.html', en: 'en/conditions/neck/torticollis.html' },

  // Elbow-arm
  { no: 'plager/albue-arm/de-quervains.html', en: 'en/conditions/elbow-arm/de-quervains.html' },

  // Foot pages
  { no: 'plager/fot/hallux-rigidus.html', en: 'en/conditions/foot/hallux-rigidus.html' },
  { no: 'plager/fot/hallux-valgus.html', en: 'en/conditions/foot/hallux-valgus.html' },

  // Dizziness
  { no: 'plager/svimmelhet/mdds.html', en: 'en/conditions/dizziness/mdds.html' },
  { no: 'plager/svimmelhet/scds.html', en: 'en/conditions/dizziness/scds.html' },

  // Services
  { no: 'tjeneste/dry-needling.html', en: 'en/services/dry-needling.html' },
  { no: 'tjeneste/graston.html', en: 'en/services/graston.html' },

  // Blog indexes
  { no: 'blogg/index.html', en: 'en/blog/index.html' },

  // FAQ main page
  { no: 'faq.html', en: 'en/faq.html' },

  // Other pages
  { no: 'nye-pasienter.html', en: 'en/new-patients.html' },
  { no: 'akutt-behandling.html', en: 'en/emergency-treatment.html' }
];

console.log('\nFix Remaining Hreflang Links');
console.log('='.repeat(50));

let fixedCount = 0;

// Function to add/fix hreflang tags
function fixHreflang(content, noUrl, enUrl) {
  // Remove existing hreflang tags
  let cleaned = content.replace(/<link[^>]+hreflang[^>]*>\s*/gi, '');
  let changed = cleaned !== content;

  const hreflangTags = `
  <link rel="alternate" hreflang="nb" href="${noUrl}">
  <link rel="alternate" hreflang="en" href="${enUrl}">`;

  // Find canonical link or </head>
  const canonicalMatch = cleaned.match(/<link[^>]+rel=["']canonical["'][^>]*>/i);
  if (canonicalMatch) {
    const insertPoint = cleaned.indexOf(canonicalMatch[0]) + canonicalMatch[0].length;
    cleaned = cleaned.slice(0, insertPoint) + hreflangTags + cleaned.slice(insertPoint);
    return { content: cleaned, changed: true };
  }

  // Insert before </head>
  cleaned = cleaned.replace('</head>', hreflangTags + '\n</head>');
  return { content: cleaned, changed: true };
}

// Process each pair
hreflangPairs.forEach(pair => {
  const noPath = path.join(baseDir, pair.no);
  const enPath = path.join(baseDir, pair.en);

  // Determine URLs
  let noUrl = pair.noUrl || `${BASE_URL}/${pair.no}`;
  let enUrl = pair.enUrl || `${BASE_URL}/${pair.en}`;

  // Fix trailing slashes for index pages
  if (pair.noUrl) noUrl = BASE_URL + pair.noUrl;
  if (pair.enUrl) enUrl = BASE_URL + pair.enUrl;

  // Check if files exist
  const noExists = fs.existsSync(noPath);
  const enExists = fs.existsSync(enPath);

  if (!noExists && !enExists) {
    console.log(`[SKIP] Both files not found: ${pair.no} / ${pair.en}`);
    return;
  }

  // Fix Norwegian file
  if (noExists) {
    let noContent = fs.readFileSync(noPath, 'utf8');
    const noResult = fixHreflang(noContent, noUrl, enUrl);
    if (noResult.changed) {
      fs.writeFileSync(noPath, noResult.content, 'utf8');
      console.log(`[FIXED] ${pair.no}`);
      fixedCount++;
    } else {
      console.log(`[OK] ${pair.no}`);
    }
  } else {
    console.log(`[SKIP] NO file not found: ${pair.no}`);
  }

  // Fix English file
  if (enExists) {
    let enContent = fs.readFileSync(enPath, 'utf8');
    const enResult = fixHreflang(enContent, noUrl, enUrl);
    if (enResult.changed) {
      fs.writeFileSync(enPath, enResult.content, 'utf8');
      console.log(`[FIXED] ${pair.en}`);
      fixedCount++;
    } else {
      console.log(`[OK] ${pair.en}`);
    }
  } else {
    console.log(`[SKIP] EN file not found: ${pair.en}`);
  }
});

console.log('\n' + '='.repeat(50));
console.log(`Total files fixed: ${fixedCount}`);
console.log('\nDone!');
