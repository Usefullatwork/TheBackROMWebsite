/**
 * Add hreflang to foot articles
 */

const fs = require('fs');

const pairs = [
  ['plager/fot/fottrening.html', 'en/conditions/foot/foot-exercises.html'],
  ['plager/fot/innleggssaler.html', 'en/conditions/foot/orthotics.html'],
  ['plager/fot/minimalistsko.html', 'en/conditions/foot/minimalist-shoes.html'],
  ['plager/fot/nar-innleggssaler-hjelper.html', 'en/conditions/foot/when-orthotics-help.html'],
  ['plager/fot/ortose-nedtrapping.html', 'en/conditions/foot/orthotic-weaning.html'],
  ['plager/fot/overpronasjon.html', 'en/conditions/foot/overpronation.html'],
  ['plager/fot/svake-fotter.html', 'en/conditions/foot/weak-feet.html'],
];

const baseUrl = 'https://thebackrom.com/';

function addHreflang(noFile, enFile) {
  const noUrl = baseUrl + noFile;
  const enUrl = baseUrl + enFile;

  const hreflangNO = `  <link rel="alternate" hreflang="nb" href="${noUrl}" />
  <link rel="alternate" hreflang="en" href="${enUrl}" />`;

  const hreflangEN = `  <link rel="alternate" hreflang="nb" href="${noUrl}" />
  <link rel="alternate" hreflang="en" href="${enUrl}" />`;

  // Update Norwegian file
  if (fs.existsSync(noFile)) {
    let content = fs.readFileSync(noFile, 'utf8');
    if (!content.includes('hreflang')) {
      // Insert before </head>
      content = content.replace('</head>', hreflangNO + '\n</head>');
      fs.writeFileSync(noFile, content, 'utf8');
      console.log('Added hreflang to:', noFile);
    }
  }

  // Update English file
  if (fs.existsSync(enFile)) {
    let content = fs.readFileSync(enFile, 'utf8');
    if (!content.includes('hreflang')) {
      content = content.replace('</head>', hreflangEN + '\n</head>');
      fs.writeFileSync(enFile, content, 'utf8');
      console.log('Added hreflang to:', enFile);
    }
  }
}

for (const [no, en] of pairs) {
  addHreflang(no, en);
}

console.log('\nDone!');
