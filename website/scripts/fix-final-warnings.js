#!/usr/bin/env node
/**
 * fix-final-warnings.js - Fix remaining 35 warnings
 *
 * Categories:
 * - FAQ Schema missing (10 files)
 * - Description too short (10 files)
 * - Inline CSS (14 files) - extract to external
 * - Missing hreflang (1 file) - remove if no EN exists
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');

let stats = {
  faqSchemaAdded: 0,
  descriptionsFixed: 0,
  inlineCssExtracted: 0,
  hreflangFixed: 0
};

// Files needing FAQ schema
const faqSchemaFiles = [
  'blogg/ovelser-isjias.html',
  'blogg/subtil-krystallsyke.html',
  'blogg/muskelsmerte-vs-nervesmerte.html',
  'blogg/stressnakke-triggerpunkter.html',
  'en/conditions/neck/cervical-foraminal-stenosis.html',
  'en/conditions/neck/finger-numbness.html',
  'en/conditions/neck/stress-neck.html',
  'en/conditions/neck/text-neck.html',
  'en/conditions/neck/whiplash-headache.html',
  'en/conditions/neck/whiplash.html'
];

// Files needing description fixes (with proper descriptions)
const descriptionFixes = {
  'en/conditions/elbow-arm/de-quervains.html': "De Quervain's tenosynovitis causes thumb-side wrist pain during gripping and pinching. Learn about symptoms, causes, and treatment options.",
  'en/conditions/elbow-arm/golfers-elbow.html': "Golfer's elbow (medial epicondylitis) causes inner elbow pain from repetitive gripping. Understand symptoms, causes, and effective treatment approaches.",
  'en/conditions/knee/jumpers-knee.html': "Jumper's knee (patellar tendinopathy) causes pain below the kneecap, especially during jumping and running. Learn about symptoms and treatment.",
  'en/conditions/knee/runners-knee.html': "Runner's knee (patellofemoral pain syndrome) causes pain around and behind the kneecap. Understand causes, symptoms, and rehabilitation strategies.",
  'en/conditions/foot/mortons-neuroma.html': "Morton's neuroma causes burning pain and numbness between the toes. Learn about symptoms, causes, and treatment options for this nerve condition.",
  'en/conditions/foot/severs-disease.html': "Sever's disease causes heel pain in active children and adolescents during growth spurts. Understand symptoms, causes, and management strategies.",
  'en/conditions/thoracic/scheuermanns-disease.html': "Scheuermann's disease causes abnormal curvature of the upper back in adolescents. Learn about symptoms, diagnosis, and treatment approaches.",
  'en/conditions/dizziness/menieres-disease.html': "Meniere's disease causes episodes of vertigo, hearing loss, and tinnitus. Understand the symptoms, triggers, and management strategies.",
  'en/conditions/shoulder/throwers-shoulder.html': "Thrower's shoulder causes pain and instability from repetitive overhead throwing. Learn about causes, symptoms, and rehabilitation approaches."
};

// Files with inline CSS to extract (grouped by similar content)
const inlineCssFiles = [
  'blogg/index.html',
  'plager/idrettsskader.html',
  'plager/skulder/kortison-skulder.html',
  'plager/skulder/slap-lesjon.html',
  'plager/skulder/biceps-tendinopati.html',
  'plager/nakke/tekstnakke.html',
  'plager/kne/loperkne.html',
  'plager/kne/knesmerte-fra-hoften.html',
  'en/conditions/knee/runners-knee.html',
  'en/conditions/foot/orthotic-weaning.html',
  'en/conditions/shoulder/biceps-tendinopathy.html',
  'en/conditions/shoulder/cortisone-shoulder.html',
  'en/blog/index.html'
];

function extractFaqContent(content) {
  const faqs = [];

  // Pattern 1: faq-item class
  const faqItemRegex = /<div[^>]*class="[^"]*faq-item[^"]*"[^>]*>[\s\S]*?<(?:h[234]|strong)[^>]*>([^<]+)<\/(?:h[234]|strong)>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>[\s\S]*?<\/div>/gi;
  let match;
  while ((match = faqItemRegex.exec(content)) !== null) {
    const question = match[1].trim();
    const answer = match[2].replace(/<[^>]+>/g, '').trim();
    if (question && answer && answer.length > 20) {
      faqs.push({ question, answer });
    }
  }

  // Pattern 2: details/summary
  const detailsRegex = /<details[^>]*>[\s\S]*?<summary[^>]*>([^<]+)<\/summary>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>[\s\S]*?<\/details>/gi;
  while ((match = detailsRegex.exec(content)) !== null) {
    const question = match[1].trim();
    const answer = match[2].replace(/<[^>]+>/g, '').trim();
    if (question && answer && answer.length > 20) {
      faqs.push({ question, answer });
    }
  }

  // Pattern 3: FAQ section with h3/h4 + p pairs
  const faqSectionMatch = content.match(/<section[^>]*class="[^"]*faq[^"]*"[^>]*>([\s\S]*?)<\/section>/i) ||
                          content.match(/<div[^>]*class="[^"]*faq-section[^"]*"[^>]*>([\s\S]*?)<\/div>/i) ||
                          content.match(/<div[^>]*id="[^"]*faq[^"]*"[^>]*>([\s\S]*?)<\/div>/i);

  if (faqSectionMatch && faqs.length === 0) {
    const sectionContent = faqSectionMatch[1];
    const h3pRegex = /<h[34][^>]*>([^<]+)<\/h[34]>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/gi;
    while ((match = h3pRegex.exec(sectionContent)) !== null) {
      const question = match[1].trim();
      const answer = match[2].replace(/<[^>]+>/g, '').trim();
      if (question && answer && answer.length > 20 && question.includes('?')) {
        faqs.push({ question, answer });
      }
    }
  }

  return faqs;
}

function generateFaqSchema(faqs, url) {
  if (faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer.substring(0, 500)
      }
    }))
  };
}

function addFaqSchema(filePath) {
  const fullPath = path.join(ROOT, filePath);
  if (!fs.existsSync(fullPath)) return false;

  let content = fs.readFileSync(fullPath, 'utf8');

  // Check if FAQPage schema already exists
  if (content.includes('"@type":"FAQPage"') || content.includes('"@type": "FAQPage"')) {
    return false;
  }

  const faqs = extractFaqContent(content);
  if (faqs.length === 0) {
    console.log(`[SKIP] ${filePath}: No FAQ content found`);
    return false;
  }

  const faqSchema = generateFaqSchema(faqs, filePath);
  if (!faqSchema) return false;

  // Check if there's existing schema
  const existingSchemaMatch = content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);

  if (existingSchemaMatch) {
    try {
      const existingSchema = JSON.parse(existingSchemaMatch[1]);
      // Create @graph array or append
      let schemas;
      if (existingSchema['@graph']) {
        schemas = { "@context": "https://schema.org", "@graph": [...existingSchema['@graph'], faqSchema] };
      } else {
        schemas = { "@context": "https://schema.org", "@graph": [existingSchema, faqSchema] };
      }
      delete schemas['@graph'][0]['@context'];

      const newSchemaStr = JSON.stringify(schemas);
      content = content.replace(existingSchemaMatch[0], `<script type="application/ld+json">${newSchemaStr}</script>`);
    } catch (e) {
      // If parsing fails, add as separate script
      const newSchemaScript = `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`;
      content = content.replace('</head>', `    ${newSchemaScript}\n</head>`);
    }
  } else {
    const newSchemaScript = `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`;
    content = content.replace('</head>', `    ${newSchemaScript}\n</head>`);
  }

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`[FAQ] ${filePath}: Added FAQPage schema (${faqs.length} questions)`);
  stats.faqSchemaAdded++;
  return true;
}

function fixDescription(filePath) {
  const fullPath = path.join(ROOT, filePath);
  if (!fs.existsSync(fullPath)) return false;

  const description = descriptionFixes[filePath];
  if (!description) return false;

  let content = fs.readFileSync(fullPath, 'utf8');

  // Fix meta description
  const descMatch = content.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  if (descMatch && descMatch[1].length < 70) {
    content = content.replace(descMatch[0], `<meta name="description" content="${description}"`);

    // Also fix og:description if exists
    content = content.replace(/<meta\s+property="og:description"\s+content="[^"]*"/gi,
      `<meta property="og:description" content="${description}"`);

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`[DESC] ${filePath}: Fixed description`);
    stats.descriptionsFixed++;
    return true;
  }

  return false;
}

function extractInlineCss(filePath) {
  const fullPath = path.join(ROOT, filePath);
  if (!fs.existsSync(fullPath)) return false;

  let content = fs.readFileSync(fullPath, 'utf8');

  // Find inline style blocks
  const styleMatches = content.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
  if (!styleMatches) return false;

  let modified = false;

  for (const styleBlock of styleMatches) {
    const cssContent = styleBlock.replace(/<\/?style[^>]*>/gi, '').trim();

    // Skip if less than 2000 chars (not a warning)
    if (cssContent.length < 2000) continue;

    // Generate hash for filename
    const hash = crypto.createHash('md5').update(cssContent).digest('hex').substring(0, 8);
    const cssFileName = `inline-${path.basename(filePath, '.html')}-${hash}.css`;
    const cssDir = path.join(ROOT, 'css');
    const cssPath = path.join(cssDir, cssFileName);

    // Check if similar CSS file already exists
    let existingFile = null;
    if (fs.existsSync(cssDir)) {
      const existingFiles = fs.readdirSync(cssDir).filter(f => f.startsWith('inline-'));
      for (const ef of existingFiles) {
        const efContent = fs.readFileSync(path.join(cssDir, ef), 'utf8');
        if (efContent === cssContent) {
          existingFile = ef;
          break;
        }
      }
    }

    // Write CSS file if not exists
    const targetCssFile = existingFile || cssFileName;
    if (!existingFile) {
      fs.writeFileSync(cssPath, cssContent, 'utf8');
      console.log(`[CSS] Created css/${cssFileName}`);
    }

    // Calculate relative path from HTML file to CSS
    const htmlDir = path.dirname(filePath);
    const depth = htmlDir.split(/[/\\]/).filter(p => p).length;
    const relPath = '../'.repeat(depth) + 'css/' + targetCssFile;

    // Replace inline style with link
    const linkTag = `<link rel="stylesheet" href="${relPath}">`;
    content = content.replace(styleBlock, linkTag);
    modified = true;

    console.log(`[CSS] ${filePath}: Extracted ${cssContent.length} chars to ${targetCssFile}`);
    stats.inlineCssExtracted++;
  }

  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    return true;
  }

  return false;
}

function fixHreflang() {
  const filePath = 'plager/korsrygg/nociplastisk-smerte.html';
  const fullPath = path.join(ROOT, filePath);

  if (!fs.existsSync(fullPath)) return false;

  let content = fs.readFileSync(fullPath, 'utf8');

  // Remove hreflang if the EN version doesn't exist
  const enPath = path.join(ROOT, 'en/conditions/lower-back/nociplastic-pain.html');
  if (!fs.existsSync(enPath)) {
    // Remove hreflang links
    const beforeLen = content.length;
    content = content.replace(/<link[^>]*hreflang="en"[^>]*>\s*/gi, '');
    content = content.replace(/<link[^>]*hreflang="x-default"[^>]*>\s*/gi, '');

    if (content.length !== beforeLen) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`[HREFLANG] ${filePath}: Removed hreflang (no EN version exists)`);
      stats.hreflangFixed++;
      return true;
    }
  }

  return false;
}

function main() {
  console.log('Fixing Final 35 Warnings');
  console.log('========================\n');

  // 1. Add FAQ schemas
  console.log('--- FAQ Schemas ---');
  for (const file of faqSchemaFiles) {
    addFaqSchema(file);
  }

  // 2. Fix descriptions
  console.log('\n--- Descriptions ---');
  for (const file of Object.keys(descriptionFixes)) {
    fixDescription(file);
  }

  // 3. Extract inline CSS
  console.log('\n--- Inline CSS ---');
  for (const file of inlineCssFiles) {
    extractInlineCss(file);
  }

  // 4. Fix hreflang
  console.log('\n--- Hreflang ---');
  fixHreflang();

  console.log('\n=== Summary ===');
  console.log(`FAQ schemas added: ${stats.faqSchemaAdded}`);
  console.log(`Descriptions fixed: ${stats.descriptionsFixed}`);
  console.log(`Inline CSS extracted: ${stats.inlineCssExtracted}`);
  console.log(`Hreflang fixed: ${stats.hreflangFixed}`);
}

main();
