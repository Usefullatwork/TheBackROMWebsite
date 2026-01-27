/**
 * Add FAQPage schema to files that have FAQ content but no schema
 */

const fs = require('fs');
const path = require('path');

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

function extractFAQs(content) {
  const faqs = [];

  // Pattern 1: faq-item with faq-question and faq-answer
  const pattern1 = /<div class="faq-item">\s*<div class="faq-question">([^<]+)<\/div>\s*<div class="faq-answer">([^<]+(?:<[^>]+>[^<]*<\/[^>]+>)*[^<]*)<\/div>/gi;

  // Pattern 2: faq-item with question/answer divs (more flexible)
  const pattern2 = /<div class="faq-item">[\s\S]*?class="faq-question"[^>]*>([^<]+)<[\s\S]*?class="faq-answer"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi;

  let match;

  // Try pattern 1
  while ((match = pattern1.exec(content)) !== null) {
    const question = match[1].trim();
    let answer = match[2].trim()
      .replace(/<[^>]+>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ')    // Normalize whitespace
      .trim();
    if (question && answer) {
      faqs.push({ question, answer });
    }
  }

  // If no matches, try pattern 2
  if (faqs.length === 0) {
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

function escapeJSON(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, ' ')
    .replace(/\r/g, '')
    .replace(/\t/g, ' ');
}

function createFAQSchema(faqs) {
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
  <!-- FAQPage Schema -->
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

// Process files
const dirs = ['plager', 'en/conditions'];
let addedCount = 0;
let skippedCount = 0;
let noFaqCount = 0;

for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;

  const files = walkSync(dir);

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');

    // Skip if already has FAQPage
    if (content.includes('FAQPage')) {
      skippedCount++;
      continue;
    }

    // Check if has FAQ content
    if (!content.includes('faq-item') && !content.includes('faq-question')) {
      noFaqCount++;
      continue;
    }

    const faqs = extractFAQs(content);

    if (faqs.length === 0) {
      console.log('Could not extract FAQs:', file);
      continue;
    }

    const schema = createFAQSchema(faqs);

    // Insert before </head>
    content = content.replace('</head>', schema + '</head>');

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Added FAQPage (${faqs.length} Q&As):`, path.relative('.', file));
    addedCount++;
  }
}

console.log(`\nSummary:`);
console.log(`  Added FAQPage schema: ${addedCount}`);
console.log(`  Already had schema: ${skippedCount}`);
console.log(`  No FAQ content: ${noFaqCount}`);
