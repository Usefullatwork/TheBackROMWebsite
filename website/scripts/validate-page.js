/**
 * Page Validation Script (Reusable)
 *
 * Usage:
 *   node scripts/validate-page.js <path-to-html> [--profile=hub-article|sub-article|basic-page]
 *   node scripts/validate-page.js en/conditions/hip-pain.html
 *   node scripts/validate-page.js en/conditions/hip-pain.html --profile=hub-article
 *
 * Profiles:
 *   hub-article  - Full hub pages with sidebar, FAQ, stats (default for /conditions/*.html)
 *   sub-article  - Simpler sub-pages
 *   basic-page   - Contact, about, etc.
 */

const fs = require('fs');
const path = require('path');

// Parse arguments
const args = process.argv.slice(2);
const filePath = args.find(a => !a.startsWith('--'));
const profileArg = args.find(a => a.startsWith('--profile='));
let profileName = profileArg ? profileArg.split('=')[1] : null;

if (!filePath) {
  console.log('Usage: node scripts/validate-page.js <path-to-html-file> [--profile=name]');
  console.log('');
  console.log('Profiles: hub-article, sub-article, basic-page');
  process.exit(1);
}

const fullPath = path.resolve(filePath);

if (!fs.existsSync(fullPath)) {
  console.log(`File not found: ${fullPath}`);
  process.exit(1);
}

// Load config
const configPath = path.join(__dirname, 'validate-config.json');
let config;
try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (e) {
  console.log('Config file not found, using defaults');
  config = { profiles: {}, norwegianWords: [] };
}

// Auto-detect profile if not specified
if (!profileName) {
  // Check for Norwegian blog files
  if (filePath.includes('blogg/') || filePath.includes('blogg\\')) {
    profileName = 'nb-blog-article';
  } else if (filePath.includes('/conditions/') && !filePath.includes('/conditions/lower-back/')
      && !filePath.includes('/conditions/shoulder/') && !filePath.includes('/conditions/hip/')
      && !filePath.includes('/conditions/knee/') && !filePath.includes('/conditions/neck/')
      && !filePath.includes('/conditions/headache/') && !filePath.includes('/conditions/foot/')
      && !filePath.includes('/conditions/elbow-arm/') && !filePath.includes('/conditions/jaw/')
      && !filePath.includes('/conditions/dizziness/')) {
    profileName = 'hub-article';
  } else if (filePath.includes('/conditions/')) {
    profileName = 'sub-article';
  } else {
    profileName = 'basic-page';
  }
}

const profile = config.profiles[profileName] || config.profiles['hub-article'];

const content = fs.readFileSync(fullPath, 'utf8');
const fileName = path.basename(filePath);

console.log(`\nValidating: ${fileName}`);
console.log(`Profile: ${profileName}`);
console.log('='.repeat(50));

let passed = 0;
let failed = 0;
let warnings = 0;

function check(name, condition, isWarning = false) {
  if (condition) {
    console.log(`[PASS] ${name}`);
    passed++;
  } else if (isWarning) {
    console.log(`[WARN] ${name}`);
    warnings++;
  } else {
    console.log(`[FAIL] ${name}`);
    failed++;
  }
}

// === STRUCTURE CHECKS ===
if (profile.structure && profile.structure.length > 0) {
  console.log('\n-- STRUCTURE --\n');
  profile.structure.forEach(item => {
    check(`Has ${item.name}`, content.includes(item.pattern), !item.required);
  });
}

// === SEO CHECKS ===
if (profile.seo && profile.seo.length > 0) {
  console.log('\n-- SEO --\n');
  profile.seo.forEach(item => {
    check(`Has ${item.name}`, content.includes(item.pattern), !item.required);
  });
}

// === CONTENT CHECKS ===
if (profile.content) {
  console.log('\n-- CONTENT --\n');

  if (profile.content.minSections > 0) {
    const sectionMatches = content.match(/class="hub-section"/g);
    const sectionCount = sectionMatches ? sectionMatches.length : 0;
    check(`Has ${profile.content.minSections}+ sections (found: ${sectionCount})`,
          sectionCount >= profile.content.minSections);
  }

  if (profile.content.minFaqItems > 0) {
    const faqMatches = content.match(/class="faq-item"/g);
    const faqCount = faqMatches ? faqMatches.length : 0;
    check(`Has ${profile.content.minFaqItems}+ FAQ items (found: ${faqCount})`,
          faqCount >= profile.content.minFaqItems);
  }

  if (profile.content.exactStatItems) {
    const statMatches = content.match(/class="stat-item"/g);
    const statCount = statMatches ? statMatches.length : 0;
    check(`Has ${profile.content.exactStatItems} stat items (found: ${statCount})`,
          statCount === profile.content.exactStatItems);
  }

  if (profile.content.requireSources) {
    check('Has sources section',
          content.includes('sources-section') || content.includes('References'));
  }

  if (profile.content.requireDisclaimer) {
    check('Has medical disclaimer',
          content.includes('medical-disclaimer') || content.includes('Medical Information'));
  }

  if (profile.content.requireRelatedBox) {
    check('Has related-box', content.includes('related-box'));
  }
}

// === NORWEGIAN WORD CHECK ===
// Skip for Norwegian pages (they should have Norwegian content)
if (!profile.skipNorwegianCheck) {
  console.log('\n-- NORWEGIAN WORDS (should be 0) --\n');

  const norwegianWords = config.norwegianWords || [];

  // Only check in visible content (not in URLs, meta tags, or schema)
  const visibleContent = content
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/href="[^"]*"/gi, '')
    .replace(/src="[^"]*"/gi, '')
    .replace(/content="[^"]*plager[^"]*"/gi, '')
    .replace(/hreflang="[^"]*"/gi, '');

  let foundNorwegian = [];
  norwegianWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = visibleContent.match(regex);
    if (matches && matches.length > 0) {
      foundNorwegian.push(`${word} (${matches.length}x)`);
    }
  });

  if (foundNorwegian.length === 0) {
    console.log('[PASS] No Norwegian words found');
    passed++;
  } else {
    console.log(`[WARN] Norwegian words: ${foundNorwegian.join(', ')}`);
    warnings++;
  }
}

// === IMAGE CHECKS ===
if (profile.images) {
  console.log('\n-- IMAGES --\n');

  if (profile.images.requireFeaturedImage) {
    check('Has featured image', content.includes('hub-featured-image'));
  }

  if (profile.images.requireProfileImage) {
    check('Has profile image (meg.webp)', content.includes('meg.webp'));
  }

  if (profile.images.requireLazyLoading) {
    const lazyCount = (content.match(/loading="lazy"/g) || []).length;
    check(`Images use loading="lazy" (${lazyCount} found)`, lazyCount >= 2);
  }

  if (profile.images.requireAsyncDecoding) {
    const asyncCount = (content.match(/decoding="async"/g) || []).length;
    check(`Images use decoding="async" (${asyncCount} found)`, asyncCount >= 2);
  }
}

// === FILE SIZE CHECK ===
if (profile.fileSize) {
  console.log('\n-- FILE SIZE --\n');
  const stats = fs.statSync(fullPath);
  const sizeKB = Math.round(stats.size / 1024);
  const inRange = sizeKB >= profile.fileSize.minKB && sizeKB <= profile.fileSize.maxKB;
  check(`File size ${profile.fileSize.minKB}-${profile.fileSize.maxKB}KB (actual: ${sizeKB}KB)`,
        inRange, sizeKB < profile.fileSize.minKB);
}

// === SUMMARY ===
console.log('\n' + '='.repeat(50));
console.log(`\nRESULTS: ${passed} passed, ${failed} failed, ${warnings} warnings\n`);

if (failed === 0 && warnings === 0) {
  console.log('PERFECT - All checks passed!\n');
  process.exit(0);
} else if (failed === 0) {
  console.log('GOOD - Passed with warnings.\n');
  process.exit(0);
} else {
  console.log('NEEDS WORK - Fix failed items before continuing.\n');
  process.exit(1);
}
