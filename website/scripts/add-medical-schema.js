/**
 * Add MedicalWebPage schema to files missing it
 */

const fs = require('fs');
const path = require('path');

const files = [
  'plager/idrettsskader.html',
  'plager/brystrygg/t4-syndrom.html',
  'plager/brystrygg/pust-stress-rygg.html',
  'plager/brystrygg/brystryggsmerter.html',
  'plager/brystrygg/stiv-rygg-idrett.html',
  'en/conditions/knee/acl-injury.html',
  'en/conditions/knee/iliotibial-band-syndrome.html',
  'en/conditions/knee/meniscus-injury.html',
  'en/conditions/knee/pcl-injury.html',
  'en/conditions/knee/pes-anserine-bursitis.html',
  'en/conditions/knee/prepatellar-bursitis.html',
  'en/conditions/knee/shin-splints.html',
  'en/conditions/thoracic/breathing-stress-back.html',
  'en/conditions/thoracic/stiff-back-sports.html',
  'en/conditions/thoracic/t4-syndrome.html',
  'en/conditions/thoracic/thoracic-back-pain.html'
];

function extractMeta(content, name) {
  const match = content.match(new RegExp(`<meta\\s+(?:name|property)="${name}"\\s+content="([^"]+)"`, 'i')) ||
                content.match(new RegExp(`<meta\\s+content="([^"]+)"\\s+(?:name|property)="${name}"`, 'i'));
  return match ? match[1] : '';
}

function extractTitle(content) {
  const match = content.match(/<title>([^<]+)<\/title>/i);
  return match ? match[1].split('|')[0].trim() : '';
}

function getUrl(filePath) {
  return 'https://thebackrom.com/' + filePath.replace(/\\/g, '/');
}

function createSchema(title, description, url) {
  return `
  <!-- MedicalWebPage Schema -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": "${title}",
    "description": "${description}",
    "url": "${url}",
    "author": {
      "@type": "Person",
      "name": "Mads Finstad",
      "jobTitle": "Kiropraktor"
    },
    "lastReviewed": "2026-01-01"
  }
  </script>
`;
}

let fixedCount = 0;

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.log('Not found:', file);
    continue;
  }

  let content = fs.readFileSync(file, 'utf8');

  // Skip if already has MedicalWebPage
  if (content.includes('MedicalWebPage')) {
    console.log('Already has schema:', file);
    continue;
  }

  const title = extractTitle(content);
  const description = extractMeta(content, 'description');
  const url = getUrl(file);

  const schema = createSchema(title, description, url);

  // Insert before </head>
  content = content.replace('</head>', schema + '</head>');

  fs.writeFileSync(file, content, 'utf8');
  console.log('Added schema:', file);
  fixedCount++;
}

console.log(`\nAdded MedicalWebPage schema to ${fixedCount} files`);
