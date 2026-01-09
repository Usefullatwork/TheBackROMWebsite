const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Large PNG graphics that need to be converted to WebP
const GRAPHICS_TO_OPTIMIZE = [
  'Sciatica Guide to Symptoms and Recovery.png',
  'Recognizing and Managing Ankylosing Spondylitis.png',
  'Urgent Back Pain Symptoms Guide.png',
  'Understanding Spinal Stenosis.png',
  'Understanding and Treating Nociplastic Pain.png',
  'Patient Guide to Disc Herniation.png',
  'Spondylolisthesis in Athletes and Adults.png',
  'SI Joint Pain Causes, Symptoms, Relief.png',
  'Relieving Back Pain During Pregnancy.png',
  'Guide to L4-L5 Disc Herniation.png',
  'L5-S1 Disc Herniation Symptoms and Recovery.png',
  'Herniated Discs The Body Heals.png',
  'Guide to Acute Low Back Pain.png',
  'Five Exercises to Relieve Sciatica Pain.png',
  'Facet Joint Syndrome Causes and Management.png',
  'Discogenic Pain Sitting and Movement.png',
  'Decoding Sciatica Pain and Recovery.png',
  'Piriformis Syndrome False Sciatica Explained.png',
  'SCIATICA NERVE PAIN VS MUSCLE.png',
  'Smart Approach to Back Pain MRIs.png'
];

const IMAGES_DIR = path.join(__dirname, 'website', 'images', 'plager korsryggsmerter');

async function optimizeGraphic(filename) {
  const inputPath = path.join(IMAGES_DIR, filename);
  const baseName = path.basename(filename, '.png');
  const outputPath = path.join(IMAGES_DIR, `${baseName}.webp`);

  if (!fs.existsSync(inputPath)) {
    console.log(`  SKIP: File not found: ${filename}`);
    return null;
  }

  // Check if WebP already exists
  if (fs.existsSync(outputPath)) {
    const stats = fs.statSync(outputPath);
    console.log(`  EXISTS: ${baseName}.webp (${Math.round(stats.size / 1024)}KB)`);
    return { name: `${baseName}.webp`, size: stats.size };
  }

  try {
    const inputStats = fs.statSync(inputPath);
    console.log(`  Input: ${Math.round(inputStats.size / 1024 / 1024 * 10) / 10}MB`);

    await sharp(inputPath)
      .resize(1200, null, { withoutEnlargement: true }) // Max width 1200px
      .webp({ quality: 85 })
      .toFile(outputPath);

    const outputStats = fs.statSync(outputPath);
    const reduction = Math.round((1 - outputStats.size / inputStats.size) * 100);
    console.log(`  Created: ${baseName}.webp (${Math.round(outputStats.size / 1024)}KB, ${reduction}% smaller)`);

    return { name: `${baseName}.webp`, size: outputStats.size };
  } catch (err) {
    console.log(`  ERROR: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log('=== Optimizing Article Graphics ===\n');

  const results = [];
  let totalSaved = 0;

  for (const filename of GRAPHICS_TO_OPTIMIZE) {
    console.log(`\nProcessing: ${filename}`);
    const result = await optimizeGraphic(filename);
    if (result) {
      results.push(result);
    }
  }

  console.log('\n=== Summary ===');
  console.log(`Processed ${results.length} graphics`);
}

main().catch(console.error);
