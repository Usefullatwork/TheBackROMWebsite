/**
 * Convert tldr-sidebar class to premium-summary-card for consistency
 */

const fs = require('fs');
const path = require('path');

const files = [
  'plager/hofte/hofteartrose.html',
  'plager/skulder/kalkskulder.html',
  'plager/hodepine/hodepine-toppen.html',
  'plager/korsrygg/nociplastisk-smerte.html',
  'plager/korsrygg/spondylolistese.html',
  'plager/korsrygg/bekhterevs-sykdom.html',
  'plager/korsrygg/spinal-stenose.html',
  'plager/korsrygg/hekseskudd.html',
  'en/conditions/headache/headache-top-of-head.html',
  'en/conditions/shoulder/calcific-tendinitis.html',
  'en/conditions/lower-back/spinal-stenosis.html',
  'en/conditions/lower-back/acute-back-pain.html',
  'en/conditions/lower-back/ankylosing-spondylitis.html',
  'en/conditions/lower-back/spondylolisthesis.html'
];

let fixedCount = 0;

for (const file of files) {
  const filePath = path.join(process.cwd(), file);

  if (!fs.existsSync(filePath)) {
    console.log('Not found:', file);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Replace class names in CSS and HTML
  content = content.replace(/\.tldr-sidebar/g, '.premium-summary-card');
  content = content.replace(/class="tldr-sidebar"/g, 'class="premium-summary-card"');
  content = content.replace(/<aside class="premium-summary-card">/g, '<div class="premium-summary-card">');
  content = content.replace(/<\/aside>(\s*)<\/div>\s*<!-- Hub Subnav/g, '</div>$1</div>\n\n            <!-- Hub Subnav');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed:', file);
    fixedCount++;
  }
}

console.log(`\nTotal files fixed: ${fixedCount}`);
