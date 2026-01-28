#!/usr/bin/env node
/**
 * fix-final-11.js - Fix the final 11 warnings
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

let stats = { faqAdded: 0, descFixed: 0 };

// Files needing FAQ schema with their specific h3+p FAQ sections
const faqFiles = [
  'en/conditions/neck/finger-numbness.html',
  'en/conditions/neck/stress-neck.html',
  'en/conditions/neck/text-neck.html',
  'en/conditions/neck/whiplash-headache.html',
  'en/conditions/neck/whiplash.html'
];

// Files with too-long descriptions
const longDescriptions = {
  'en/conditions/elbow-arm/mouse-arm.html': "Mouse arm (RSI) causes pain from repetitive computer use. Learn symptoms, prevention strategies, and treatment options.",
  'en/conditions/elbow-arm/trigger-finger.html': "Trigger finger causes catching or locking when bending your finger. Learn about causes, symptoms, and treatments.",
  'en/conditions/shoulder/cortisone-shoulder.html': "Cortisone injections for shoulder pain - benefits, risks, and alternatives. Evidence-based guide for patients."
};

function extractFaqsFromH3P(content) {
  const faqs = [];

  // Find FAQ section by heading, regardless of section id
  const faqMatch = content.match(/<h2[^>]*>Frequently Asked Questions<\/h2>([\s\S]*?)(?:<\/section>|<section\s|<footer)/i);
  if (!faqMatch) return faqs;

  const faqSection = faqMatch[1];

  // Extract h3 + p pairs
  const regex = /<h3[^>]*>([^<]+)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match;

  while ((match = regex.exec(faqSection)) !== null) {
    const question = match[1].trim();
    let answer = match[2].replace(/<[^>]+>/g, '').trim();

    if (question && answer && answer.length > 20) {
      // Truncate answer if too long
      if (answer.length > 500) {
        answer = answer.substring(0, 497) + '...';
      }
      faqs.push({ question, answer });
    }
  }

  return faqs;
}

function addFaqSchema(filePath) {
  const fullPath = path.join(ROOT, filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`[SKIP] ${filePath}: File not found`);
    return false;
  }

  let content = fs.readFileSync(fullPath, 'utf8');

  // Check if FAQPage schema already exists
  if (content.includes('"@type":"FAQPage"') || content.includes('"@type": "FAQPage"')) {
    console.log(`[SKIP] ${filePath}: FAQPage schema already exists`);
    return false;
  }

  const faqs = extractFaqsFromH3P(content);
  if (faqs.length === 0) {
    console.log(`[SKIP] ${filePath}: No FAQ content found (${faqs.length} questions)`);
    return false;
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  // Insert before </head>
  const schemaScript = `    <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>\n`;
  content = content.replace('</head>', schemaScript + '</head>');

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`[FAQ] ${filePath}: Added FAQPage schema (${faqs.length} questions)`);
  stats.faqAdded++;
  return true;
}

function fixDescription(filePath, newDesc) {
  const fullPath = path.join(ROOT, filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`[SKIP] ${filePath}: File not found`);
    return false;
  }

  let content = fs.readFileSync(fullPath, 'utf8');

  // Fix meta description
  content = content.replace(
    /<meta\s+name="description"\s+content="[^"]*"/i,
    `<meta name="description" content="${newDesc}"`
  );

  // Fix og:description
  content = content.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"/i,
    `<meta property="og:description" content="${newDesc}"`
  );

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`[DESC] ${filePath}: Shortened description to ${newDesc.length} chars`);
  stats.descFixed++;
  return true;
}

function main() {
  console.log('Fixing Final Warnings');
  console.log('=====================\n');

  // Add FAQ schemas
  console.log('--- FAQ Schemas ---');
  for (const file of faqFiles) {
    addFaqSchema(file);
  }

  // Fix long descriptions
  console.log('\n--- Long Descriptions ---');
  for (const [file, desc] of Object.entries(longDescriptions)) {
    fixDescription(file, desc);
  }

  console.log('\n=== Summary ===');
  console.log(`FAQ schemas added: ${stats.faqAdded}`);
  console.log(`Descriptions fixed: ${stats.descFixed}`);
}

main();
