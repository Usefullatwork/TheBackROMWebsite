#!/usr/bin/env node
/**
 * fix-schema-warnings.js - Stage 1: Fix schema markup warnings
 *
 * 1A: Add MedicalWebPage schema to pages without JSON-LD (~148 files)
 * 1B: Add FAQPage schema to pages with FAQ sections but no schema (~54 files)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXCLUDE_DIRS = ['node_modules', '.git', 'docs', 'images-originals', 'scripts'];

let stats = {
  medicalAdded: 0,
  faqAdded: 0,
  alreadyHasSchema: 0,
  skipped: 0
};

// ── File Discovery ────────────────────────────────────────────────────────────

function findHtmlFiles(dir) {
  let files = [];
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory() && !EXCLUDE_DIRS.includes(item)) {
        files = files.concat(findHtmlFiles(fullPath));
      } else if (item.endsWith('.html')) {
        files.push(fullPath);
      }
    }
  } catch (err) { /* skip inaccessible */ }
  return files;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getMeta(content, name) {
  const re = new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["']([^"']*)["']`, 'i');
  const re2 = new RegExp(`<meta\\s+content=["']([^"']*)["']\\s+name=["']${name}["']`, 'i');
  return (content.match(re) || content.match(re2) || [])[1] || '';
}

function getTitle(content) {
  const match = content.match(/<title>([^<]*)<\/title>/i);
  return match ? match[1].split('|')[0].trim() : '';
}

function getUrl(filePath) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
  return 'https://thebackrom.com/' + rel;
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

function isConditionOrMedicalPage(filePath) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
  return rel.includes('/conditions/') ||
         rel.includes('/plager/') ||
         rel.includes('/blogg/') ||
         rel.includes('/faq/');
}

function isEnglish(filePath) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
  return rel.startsWith('en/');
}

// ── Schema Generators ─────────────────────────────────────────────────────────

function createMedicalWebPageSchema(title, description, url, isEN) {
  const today = new Date().toISOString().split('T')[0];
  return `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "headline": "${escapeJSON(title)}",
    "description": "${escapeJSON(description)}",
    "url": "${url}",
    "author": {
      "@type": "Person",
      "name": "Mads Finstad",
      "jobTitle": "${isEN ? 'Chiropractor' : 'Kiropraktor'}",
      "worksFor": {
        "@type": "MedicalClinic",
        "name": "Klinikk for alle Majorstua",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Gardeveien 17",
          "addressLocality": "Oslo",
          "postalCode": "0363",
          "addressCountry": "NO"
        }
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "Klinikk for alle - Mads Finstad Kiropraktor",
      "url": "https://thebackrom.com"
    },
    "datePublished": "${today}",
    "dateModified": "${today}"
  }
  </script>
`;
}

function createWebPageSchema(title, description, url) {
  const today = new Date().toISOString().split('T')[0];
  return `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "${escapeJSON(title)}",
    "description": "${escapeJSON(description)}",
    "url": "${url}",
    "publisher": {
      "@type": "Organization",
      "name": "Klinikk for alle - Mads Finstad Kiropraktor",
      "url": "https://thebackrom.com"
    },
    "dateModified": "${today}"
  }
  </script>
`;
}

// ── FAQ Extraction ────────────────────────────────────────────────────────────

function extractFAQs(content) {
  const faqs = [];

  // Pattern 1: faq-item with faq-question and faq-answer (most common)
  const pattern1 = /<div\s+class=["']faq-item["'][^>]*>[\s\S]*?<div\s+class=["']faq-question["'][^>]*>([^<]+)<\/div>[\s\S]*?<div\s+class=["']faq-answer["'][^>]*>([\s\S]*?)<\/div>[\s\S]*?<\/div>/gi;

  let match;
  while ((match = pattern1.exec(content)) !== null) {
    const question = match[1].trim();
    let answer = match[2].trim()
      .replace(/<a[^>]*>([^<]*)<\/a>/gi, '$1') // Keep link text
      .replace(/<[^>]+>/g, '') // Remove other HTML tags
      .replace(/\s+/g, ' ')
      .trim();
    if (question && answer && answer.length > 10) {
      faqs.push({ question, answer });
    }
  }

  // Pattern 2: details/summary FAQ (less common)
  if (faqs.length === 0) {
    const pattern2 = /<details[^>]*>[\s\S]*?<summary[^>]*>([^<]+)<\/summary>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>[\s\S]*?<\/details>/gi;
    while ((match = pattern2.exec(content)) !== null) {
      const question = match[1].trim();
      let answer = match[2].trim()
        .replace(/<[^>]+>/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      if (question && answer && answer.length > 10) {
        faqs.push({ question, answer });
      }
    }
  }

  return faqs;
}

function createFAQPageSchema(faqs) {
  if (faqs.length === 0) return null;

  const entities = faqs.map(faq => `      {
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

function hasFAQContent(content) {
  return /class=["'][^"']*faq[^"']*["']/i.test(content) ||
         /id=["']faq["']/i.test(content) ||
         /<h[23][^>]*>.*(?:FAQ|Frequently Asked|Vanlige spørsmål|Ofte stilte)/i.test(content) ||
         /faq-item/i.test(content);
}

// ── Main Processing ───────────────────────────────────────────────────────────

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const relPath = path.relative(ROOT, filePath);

  // Check existing schemas
  const hasJsonLd = /type=["']application\/ld\+json["']/i.test(content);
  const hasMedicalWebPage = /MedicalWebPage/i.test(content);
  const hasFAQPage = /FAQPage/i.test(content);

  // 1A: Add MedicalWebPage schema if missing and page is medical content
  if (!hasJsonLd && isConditionOrMedicalPage(filePath)) {
    const title = getTitle(content);
    const description = getMeta(content, 'description');
    const url = getUrl(filePath);
    const isEN = isEnglish(filePath);

    if (title && description) {
      const schema = createMedicalWebPageSchema(title, description, url, isEN);
      content = content.replace('</head>', schema + '</head>');
      modified = true;
      stats.medicalAdded++;
      console.log(`[+MedicalWebPage] ${relPath}`);
    }
  } else if (!hasJsonLd) {
    // Add basic WebPage schema for non-medical pages
    const title = getTitle(content);
    const description = getMeta(content, 'description');
    const url = getUrl(filePath);

    if (title && description) {
      const schema = createWebPageSchema(title, description, url);
      content = content.replace('</head>', schema + '</head>');
      modified = true;
      stats.medicalAdded++;
      console.log(`[+WebPage] ${relPath}`);
    }
  }

  // 1B: Add FAQPage schema if page has FAQ content but no FAQPage schema
  if (!hasFAQPage && hasFAQContent(content)) {
    const faqs = extractFAQs(content);
    if (faqs.length > 0) {
      const schema = createFAQPageSchema(faqs);
      if (schema) {
        content = content.replace('</head>', schema + '</head>');
        modified = true;
        stats.faqAdded++;
        console.log(`[+FAQPage ${faqs.length}Q] ${relPath}`);
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }

  return false;
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  console.log('Stage 1: Fix Schema Warnings');
  console.log('============================\n');

  const htmlFiles = findHtmlFiles(ROOT);
  console.log(`Found ${htmlFiles.length} HTML files\n`);

  for (const filePath of htmlFiles) {
    processFile(filePath);
  }

  console.log('\n--- Summary ---');
  console.log(`MedicalWebPage/WebPage added: ${stats.medicalAdded}`);
  console.log(`FAQPage added: ${stats.faqAdded}`);
  console.log(`Total files modified: ${stats.medicalAdded + stats.faqAdded}`);
}

main();
