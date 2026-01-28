#!/usr/bin/env node
/**
 * fix-remaining-warnings.js - Fix all remaining audit warnings
 *
 * Handles:
 * 1. FAQPage schema for blog posts with FAQ sections
 * 2. Title too long - more aggressive shortening
 * 3. Description too short - add proper descriptions
 * 4. Missing hreflang, canonical, heading skips
 * 5. Norwegian words in EN pages
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

let stats = {
  faqSchemaAdded: 0,
  titlesFixed: 0,
  descriptionsFixed: 0,
  hreflangFixed: 0,
  canonicalFixed: 0,
  headingFixed: 0,
  norwegianFixed: 0,
  totalFiles: 0
};

// ══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════════════════════

function readFile(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), 'utf8');
}

function writeFile(filePath, content) {
  fs.writeFileSync(path.join(ROOT, filePath), content, 'utf8');
}

function escapeJSON(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, ' ')
    .replace(/\r/g, '')
    .replace(/\t/g, ' ')
    .trim();
}

// ══════════════════════════════════════════════════════════════════════════════
// 1. FAQ SCHEMA - Extract FAQs and add FAQPage schema
// ══════════════════════════════════════════════════════════════════════════════

function extractFAQsFromContent(content) {
  const faqs = [];

  // Pattern 1: "Ofte stilte spørsmål" section with h3 questions
  const faqSectionMatch = content.match(/(?:Ofte stilte spørsmål|Frequently Asked|FAQ)[\s\S]*?(<h[23][^>]*>[\s\S]*?)(?=<section|<footer|<\/article|$)/i);

  if (faqSectionMatch) {
    const section = faqSectionMatch[1];
    // Match h3 followed by paragraph
    const qaPairs = section.matchAll(/<h[23][^>]*>([^<]+)<\/h[23]>\s*(?:<[^>]+>)*\s*<p[^>]*>([\s\S]*?)<\/p>/gi);
    for (const match of qaPairs) {
      const question = match[1].trim();
      let answer = match[2].trim()
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      if (question && answer && answer.length > 20 && !question.includes('?') === false) {
        faqs.push({ question, answer: answer.substring(0, 500) });
      }
    }
  }

  // Pattern 2: FAQ with faq-item class
  const faqItems = content.matchAll(/<div[^>]*class="[^"]*faq-item[^"]*"[^>]*>[\s\S]*?<(?:h[234]|div)[^>]*class="[^"]*(?:faq-)?question[^"]*"[^>]*>([^<]+)<[\s\S]*?<(?:div|p)[^>]*class="[^"]*(?:faq-)?answer[^"]*"[^>]*>([\s\S]*?)<\/(?:div|p)>/gi);

  for (const match of faqItems) {
    const question = match[1].trim();
    let answer = match[2].trim()
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (question && answer && answer.length > 20) {
      faqs.push({ question, answer: answer.substring(0, 500) });
    }
  }

  // Pattern 3: Details/summary (accordion)
  const details = content.matchAll(/<details[^>]*>[\s\S]*?<summary[^>]*>([^<]+)<\/summary>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/gi);
  for (const match of details) {
    const question = match[1].trim();
    let answer = match[2].trim()
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (question && answer && answer.length > 20) {
      faqs.push({ question, answer: answer.substring(0, 500) });
    }
  }

  return faqs;
}

function createFAQSchema(faqs) {
  if (faqs.length === 0) return null;

  const entities = faqs.slice(0, 10).map(faq => `      {
        "@type": "Question",
        "name": "${escapeJSON(faq.question)}",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "${escapeJSON(faq.answer)}"
        }
      }`).join(',\n');

  return `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
${entities}
    ]
  }
  </script>
`;
}

function addFAQSchema(filePath) {
  let content = readFile(filePath);

  if (content.includes('"FAQPage"')) return false;

  const faqs = extractFAQsFromContent(content);
  if (faqs.length === 0) return false;

  const schema = createFAQSchema(faqs);
  if (!schema) return false;

  content = content.replace('</head>', schema + '</head>');
  writeFile(filePath, content);
  stats.faqSchemaAdded++;
  console.log(`[+FAQ ${faqs.length}Q] ${filePath}`);
  return true;
}

// ══════════════════════════════════════════════════════════════════════════════
// 2. TITLE SHORTENING - More aggressive
// ══════════════════════════════════════════════════════════════════════════════

const titleFixes = {
  'plager.html': 'Plager og tilstander | Kiropraktor Oslo',
  'plager/hofte/athletic-pubalgia-lyskebrokk.html': 'Athletic Pubalgia (Sportsbrokk) | Symptomer og behandling',
  'plager/fot/stressfraktur-fot.html': 'Stressfraktur i foten | Årsaker og behandling',
  'plager/fot/hallux-valgus.html': 'Hallux Valgus (Knyst) | Symptomer og behandling',
  'plager/fot/ankelinstabilitet.html': 'Ankelinstabilitet | Årsaker og behandling',
  'plager/fot/hallux-rigidus.html': 'Hallux Rigidus | Stiv stortå behandling',
  'plager/fot/tibialis-posterior-tendinopati.html': 'Tibialis Posterior Tendinopati | Behandling',
  'plager/fot/fottrening.html': 'Fottrening og øvelser | Sterke føtter',
  'plager/fot/minimalistsko.html': 'Minimalistsko | Fordeler og overgang',
  'plager/nakke/degenerative-forandringer.html': 'Degenerative forandringer i nakken | Behandling',
  'plager/kne/knesmerte-fra-hoften.html': 'Knesmerte fra hoften | Referred pain',
  'plager/brystrygg/pust-stress-rygg.html': 'Pust, stress og ryggplager | Sammenheng',
  'plager/brystrygg/kostokondritt.html': 'Kostokondritt | Brystbenssmerte behandling',
  'plager/svimmelhet/scds.html': 'SCDS - Superior Canal Dehiscence Syndrom',
  'plager/svimmelhet/mdds.html': 'MdDS - Mal de Débarquement Syndrom',
  'plager/svimmelhet/whiplash-svimmelhet.html': 'Svimmelhet etter whiplash | Behandling',
  'plager/svimmelhet/vestibularisnevritt.html': 'Vestibularisnevritt | Årsaker og behandling',
  'plager/svimmelhet/post-hjernerystelse.html': 'Svimmelhet etter hjernerystelse | Behandling',
  'plager/albue-arm/triggerpunkter-arm.html': 'Triggerpunkter i arm og hånd | Behandling',
  'plager/albue-arm/tennisalbue.html': 'Tennisalbue | Symptomer og behandling',
  'tjeneste/graston.html': 'Graston Technique | Instrumentassistert behandling',
  'tjeneste/svimmelhet.html': 'Svimmelhet behandling | Vestibulær rehabilitering',
  'tjeneste/fasciemanipulasjon.html': 'Fasciemanipulasjon | Stecco-metoden',
  'tjeneste/dry-needling.html': 'Dry Needling | Nålebehandling triggerpunkter',
  'tjeneste/trykkbolge.html': 'Trykkbølgebehandling | Shockwave therapy',
  'en/conditions/foot/weak-feet.html': 'Weak Feet | Causes and exercises'
};

function fixTitle(filePath) {
  if (!titleFixes[filePath]) return false;

  let content = readFile(filePath);
  const newTitle = titleFixes[filePath];

  // Replace title tag
  content = content.replace(/<title>[^<]+<\/title>/i, `<title>${newTitle}</title>`);

  // Also update og:title
  content = content.replace(/<meta\s+property="og:title"\s+content="[^"]+"/gi,
    `<meta property="og:title" content="${newTitle}"`);
  content = content.replace(/<meta\s+content="[^"]+"\s+property="og:title"/gi,
    `<meta content="${newTitle}" property="og:title"`);

  writeFile(filePath, content);
  stats.titlesFixed++;
  console.log(`[TITLE] ${filePath}`);
  return true;
}

// ══════════════════════════════════════════════════════════════════════════════
// 3. DESCRIPTION FIXES - Add/expand short descriptions
// ══════════════════════════════════════════════════════════════════════════════

const descriptionFixes = {
  'plager/fot/mortons-nevrom.html': 'Mortons nevrom gir brennende smerter og nummenhet mellom tærne. Lær om årsaker, symptomer og effektiv behandling hos kiropraktor på Majorstua Oslo.',
  'en/conditions/knee-pain.html': 'Comprehensive guide to knee pain causes, diagnosis, and treatment. Learn about common conditions like runner\'s knee, meniscus injuries, and osteoarthritis.',
  'en/conditions/neck-pain.html': 'Expert guide to neck pain causes, symptoms and treatment options. Get relief from stiff neck, cervical disc problems, and chronic neck pain.',
  'en/conditions/jaw/clicking-locking-joint-problems.html': 'TMJ clicking, popping and locking explained. Learn about causes of jaw joint problems and effective treatment options from a chiropractor.',
  'en/conditions/elbow-arm/de-quervains.html': 'De Quervain\'s tenosynovitis causes thumb and wrist pain. Learn about symptoms, causes and effective treatment options for this common condition.',
  'en/conditions/elbow-arm/golfers-elbow.html': 'Golfer\'s elbow (medial epicondylitis) causes inner elbow pain. Learn about symptoms, causes, and treatment options for this overuse injury.',
  'en/conditions/knee/jumpers-knee.html': 'Jumper\'s knee (patellar tendinopathy) causes pain below the kneecap. Learn about symptoms, causes and treatment for this common sports injury.',
  'en/conditions/knee/knee-pain-from-hip.html': 'Knee pain can originate from hip problems through referred pain patterns. Learn how hip issues cause knee symptoms and proper diagnosis.',
  'en/conditions/knee/meniscus-injury.html': 'Meniscus tears cause knee pain, swelling and locking. Learn about symptoms, diagnosis and treatment options for this common knee injury.',
  'en/conditions/knee/runners-knee.html': 'Runner\'s knee (patellofemoral pain syndrome) causes pain around the kneecap. Learn about causes, symptoms and effective treatment options.',
  'en/conditions/foot/mortons-neuroma.html': 'Morton\'s neuroma causes burning pain and numbness between the toes. Learn about causes, symptoms and treatment options for this foot condition.',
  'en/conditions/foot/severs-disease.html': 'Sever\'s disease causes heel pain in active children and adolescents. Learn about symptoms, causes and treatment for this growth-related condition.',
  'en/conditions/thoracic/costochondritis.html': 'Costochondritis causes chest wall pain where ribs meet the breastbone. Learn about symptoms, causes and treatment for this benign condition.',
  'en/conditions/thoracic/scheuermanns-disease.html': 'Scheuermann\'s disease causes rounded upper back (kyphosis) in adolescents. Learn about symptoms, diagnosis and treatment options.',
  'en/conditions/dizziness/menieres-disease.html': 'Meniere\'s disease causes vertigo, hearing loss and tinnitus. Learn about symptoms, triggers and treatment options for this inner ear condition.',
  'en/conditions/shoulder/throwers-shoulder.html': 'Thrower\'s shoulder affects athletes who perform overhead motions. Learn about causes, symptoms and treatment for this sports-related condition.',
  'en/conditions/lower-back/spinal-stenosis.html': 'Spinal stenosis causes narrowing of the spinal canal leading to back and leg pain. Learn about symptoms, causes and treatment options.',
  'en/blog/dizziness-treatment.html': 'Comprehensive guide to dizziness treatment options. Learn about vestibular rehabilitation, medication and other effective treatments for vertigo.',
  'en/blog/acute-back-pain-self-help.html': 'What to do when acute back pain strikes. Practical self-help guide for the first hours and days, including safe movements and pain relief tips.',
  'en/404.html': 'Page not found. The page you are looking for may have been moved or no longer exists. Return to our homepage to find what you need.'
};

function fixDescription(filePath) {
  if (!descriptionFixes[filePath]) return false;

  let content = readFile(filePath);
  const newDesc = descriptionFixes[filePath];

  // Replace or add meta description
  if (/<meta\s+name="description"/i.test(content)) {
    content = content.replace(/<meta\s+name="description"\s+content="[^"]*"/gi,
      `<meta name="description" content="${newDesc}"`);
  } else {
    content = content.replace('</title>', `</title>\n  <meta name="description" content="${newDesc}">`);
  }

  // Also update og:description
  if (/<meta\s+property="og:description"/i.test(content)) {
    content = content.replace(/<meta\s+property="og:description"\s+content="[^"]*"/gi,
      `<meta property="og:description" content="${newDesc}"`);
  }

  writeFile(filePath, content);
  stats.descriptionsFixed++;
  console.log(`[DESC] ${filePath}`);
  return true;
}

// ══════════════════════════════════════════════════════════════════════════════
// 4. OTHER FIXES
// ══════════════════════════════════════════════════════════════════════════════

function fixNociplastiskHreflang() {
  const filePath = 'plager/korsrygg/nociplastisk-smerte.html';
  let content = readFile(filePath);

  // Check if EN version exists
  const enPath = 'en/conditions/lower-back/nociplastic-pain.html';
  if (!fs.existsSync(path.join(ROOT, enPath))) {
    // No EN version - remove any hreflang pointing to it or just leave as is
    console.log(`[SKIP] ${filePath} - no EN translation exists`);
    return false;
  }

  // Add hreflang if missing
  if (!content.includes('hreflang="en"')) {
    const hreflang = `<link rel="alternate" hreflang="en" href="https://thebackrom.com/${enPath}" />`;
    content = content.replace('</head>', `  ${hreflang}\n</head>`);
    writeFile(filePath, content);
    stats.hreflangFixed++;
    console.log(`[HREFLANG] ${filePath}`);
    return true;
  }
  return false;
}

function fixScheuermannsNorwegian() {
  const filePath = 'en/conditions/thoracic/scheuermanns-disease.html';
  let content = readFile(filePath);

  // The word "nakke" appears in a Norwegian source citation - this is acceptable
  // But let's check if it's in actual content
  const nakkeMatch = content.match(/[^"'>]nakke[^"'<]/gi);
  if (nakkeMatch) {
    // Replace Norwegian text with English
    content = content.replace(/Strukturelle nakke- og ryggplager/g, 'Structural neck and back problems');
    writeFile(filePath, content);
    stats.norwegianFixed++;
    console.log(`[NORWEGIAN] ${filePath}`);
    return true;
  }
  return false;
}

function fix404Canonical() {
  const filePath = '404.html';
  let content = readFile(filePath);

  if (!content.includes('rel="canonical"')) {
    const canonical = `<link rel="canonical" href="https://thebackrom.com/404.html">`;
    content = content.replace('</head>', `  ${canonical}\n</head>`);
    writeFile(filePath, content);
    stats.canonicalFixed++;
    console.log(`[CANONICAL] ${filePath}`);
    return true;
  }
  return false;
}

function fixAcuteBackPainHeading() {
  const filePath = 'en/blog/acute-back-pain-self-help.html';
  let content = readFile(filePath);

  // Find the red flag h3 after h1 and change to h2
  // The premium-summary h2 is already fixed, check for other h3s
  const headings = content.match(/<h[1-3][^>]*>/gi) || [];

  // Check if there's h1 → h3 skip
  let lastLevel = 0;
  for (const h of headings) {
    const level = parseInt(h.match(/<h([1-3])/i)[1]);
    if (lastLevel === 1 && level === 3) {
      // Found skip - fix it
      // The "Seek Emergency Care" h3 needs to be h2
      content = content.replace(/<h3([^>]*)>Seek Emergency Care/gi, '<h2$1>Seek Emergency Care');
      content = content.replace(/Seek Emergency Care Immediately For:<\/h3>/gi, 'Seek Emergency Care Immediately For:</h2>');
      writeFile(filePath, content);
      stats.headingFixed++;
      console.log(`[HEADING] ${filePath}`);
      return true;
    }
    lastLevel = level;
  }
  return false;
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════════════

const faqFiles = [
  'priser.html',
  'blogg/nakkesmerter-gravid.html',
  'blogg/piriformissyndrom-falsk-isjias.html',
  'blogg/l4-l5-prolaps.html',
  'blogg/diskogen-smerte.html',
  'blogg/ovelser-isjias.html',
  'blogg/subtil-krystallsyke.html',
  'blogg/l5-s1-prolaps.html',
  'blogg/svimmelhet-myter.html',
  'blogg/svimmel-i-senga.html',
  'blogg/mr-bildediagnostikk-ryggsmerte.html',
  'blogg/muskelsmerte-vs-nervesmerte.html',
  'blogg/stressnakke-triggerpunkter.html',
  'blogg/akutt-ryggsmerte-selvhjelp.html',
  'blogg/isjias-prolaps-hekseskudd-forskjell.html',
  'en/conditions/neck/cervical-foraminal-stenosis.html',
  'en/conditions/neck/finger-numbness.html',
  'en/conditions/neck/stress-neck.html',
  'en/conditions/neck/text-neck.html',
  'en/conditions/neck/whiplash-headache.html',
  'en/conditions/neck/whiplash.html',
  'en/blog/neck-pain-pregnancy.html',
  'en/blog/stress-neck-trigger-points.html',
  'en/blog/sciatica-prolapse-lumbago-difference.html',
  'en/blog/subtle-bppv.html',
  'en/blog/discogenic-pain.html',
  'en/blog/dizziness-myths.html',
  'en/blog/dizzy-and-nauseous.html',
  'en/blog/dizzy-in-bed.html',
  'en/blog/exercises-sciatica.html',
  'en/blog/l4-l5-disc-herniation.html',
  'en/blog/l5-s1-disc-herniation.html',
  'en/blog/mri-imaging-back-pain.html',
  'en/blog/muscle-pain-vs-nerve-pain.html',
  'en/emergency.html',
  'en/new-patients.html'
];

function main() {
  console.log('Fix All Remaining Warnings');
  console.log('==========================\n');

  // 1. Add FAQ schemas
  console.log('--- Adding FAQ Schemas ---');
  for (const file of faqFiles) {
    try {
      addFAQSchema(file);
    } catch (e) {
      console.log(`[ERROR] ${file}: ${e.message}`);
    }
  }

  // 2. Fix titles
  console.log('\n--- Fixing Titles ---');
  for (const file of Object.keys(titleFixes)) {
    try {
      fixTitle(file);
    } catch (e) {
      console.log(`[ERROR] ${file}: ${e.message}`);
    }
  }

  // 3. Fix descriptions
  console.log('\n--- Fixing Descriptions ---');
  for (const file of Object.keys(descriptionFixes)) {
    try {
      fixDescription(file);
    } catch (e) {
      console.log(`[ERROR] ${file}: ${e.message}`);
    }
  }

  // 4. Other fixes
  console.log('\n--- Other Fixes ---');
  try { fixNociplastiskHreflang(); } catch (e) { console.log(`[ERROR] hreflang: ${e.message}`); }
  try { fixScheuermannsNorwegian(); } catch (e) { console.log(`[ERROR] norwegian: ${e.message}`); }
  try { fix404Canonical(); } catch (e) { console.log(`[ERROR] canonical: ${e.message}`); }
  try { fixAcuteBackPainHeading(); } catch (e) { console.log(`[ERROR] heading: ${e.message}`); }

  console.log('\n--- Summary ---');
  console.log(`FAQ schemas added: ${stats.faqSchemaAdded}`);
  console.log(`Titles fixed: ${stats.titlesFixed}`);
  console.log(`Descriptions fixed: ${stats.descriptionsFixed}`);
  console.log(`Hreflang fixed: ${stats.hreflangFixed}`);
  console.log(`Canonical fixed: ${stats.canonicalFixed}`);
  console.log(`Headings fixed: ${stats.headingFixed}`);
  console.log(`Norwegian words fixed: ${stats.norwegianFixed}`);
}

main();
