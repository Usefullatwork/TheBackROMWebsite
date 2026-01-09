const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Target widths for responsive images
const WIDTHS = [480, 768, 1200];

// Priority images to process (relative to website/images/)
const PRIORITY_IMAGES = [
  'Om/meg.webp',
  'Om/fotball.webp',
  'Home/trv-optimized.webp',
  'plager nakkesmerter/nakkesmerte-optimized.webp',
  'Tjenester Svimmelhet/svimmelhet-optimized.webp',
  'Tjenester Kiroprakikk/behandling-optimized.webp',
  'plager korsryggsmerter/korsrygg-optimized.webp',
  'Tjenester Rehabilitering/aktiv-optimized.webp',
  'plager kjevesmerter/kjeve-optimized.webp',
  'plager hodepine-og-migrene/hodepine-optimized.webp',
  // Additional commonly used images
  'Behandling/behandling-1-optimized.webp',
  'Behandling/behandling-2-optimized.webp',
  // Services page images
  'Tjenester Dry-Needling/Dry needle.webp',
  'Tjenester Graston/graston.webp',
  'Tjenester Fasciemanipulasjon/Fascal release.webp'
];

const IMAGES_DIR = path.join(__dirname, 'website', 'images');

async function generateResponsiveImages(imagePath) {
  const fullPath = path.join(IMAGES_DIR, imagePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`  SKIP: File not found: ${imagePath}`);
    return null;
  }

  const dir = path.dirname(fullPath);
  const ext = path.extname(imagePath);
  const baseName = path.basename(imagePath, ext);

  // Get original image metadata
  const metadata = await sharp(fullPath).metadata();
  console.log(`  Original: ${metadata.width}x${metadata.height}`);

  const generated = [];

  for (const width of WIDTHS) {
    // Skip if target width is larger than original
    if (width >= metadata.width) {
      console.log(`  SKIP ${width}w: Original is smaller (${metadata.width}px)`);
      continue;
    }

    const outputName = `${baseName}-${width}w.webp`;
    const outputPath = path.join(dir, outputName);

    try {
      await sharp(fullPath)
        .resize(width, null, { withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(outputPath);

      const stats = fs.statSync(outputPath);
      console.log(`  Created: ${outputName} (${Math.round(stats.size / 1024)}KB)`);
      generated.push({ width, path: outputPath, name: outputName });
    } catch (err) {
      console.log(`  ERROR creating ${outputName}: ${err.message}`);
    }
  }

  return generated;
}

async function main() {
  console.log('=== Generating Responsive Image Variants ===\n');

  const results = {};

  for (const imagePath of PRIORITY_IMAGES) {
    console.log(`\nProcessing: ${imagePath}`);
    const generated = await generateResponsiveImages(imagePath);
    if (generated) {
      results[imagePath] = generated;
    }
  }

  console.log('\n=== Summary ===');
  let totalGenerated = 0;
  for (const [img, variants] of Object.entries(results)) {
    if (variants && variants.length > 0) {
      console.log(`${img}: ${variants.length} variants`);
      totalGenerated += variants.length;
    }
  }
  console.log(`\nTotal variants generated: ${totalGenerated}`);

  // Save results for reference
  fs.writeFileSync(
    path.join(__dirname, 'responsive-images-generated.json'),
    JSON.stringify(results, null, 2)
  );
  console.log('\nResults saved to responsive-images-generated.json');
}

main().catch(console.error);
