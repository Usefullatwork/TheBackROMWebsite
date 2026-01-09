const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Graphics to optimize for blog articles (various folders)
const GRAPHICS_TO_OPTIMIZE = [
  // Korsrygg - already done but including for completeness
  { folder: 'plager korsryggsmerter', file: 'Guide to L4-L5 Disc Herniation.png' },
  { folder: 'plager korsryggsmerter', file: 'L5-S1 Disc Herniation Symptoms and Recovery.png' },
  { folder: 'plager korsryggsmerter', file: 'Piriformis Syndrome False Sciatica Explained.png' },
  { folder: 'plager korsryggsmerter', file: 'Five Exercises to Relieve Sciatica Pain.png' },
  { folder: 'plager korsryggsmerter', file: 'Discogenic Pain Sitting and Movement.png' },
  { folder: 'plager korsryggsmerter', file: 'Facet Joint Syndrome Causes and Management.png' },
  { folder: 'plager korsryggsmerter', file: 'Decoding Sciatica Pain and Recovery.png' },
  { folder: 'plager korsryggsmerter', file: 'Smart Approach to Back Pain MRIs.png' },
  { folder: 'plager korsryggsmerter', file: 'Guide to Acute Low Back Pain.png' },
  { folder: 'plager korsryggsmerter', file: 'Herniated Discs The Body Heals.png' },

  // Nakke/hodepine
  { folder: 'plager hodepine-og-migrene', file: 'Understanding Cervicogenic Headache and Treatment.png' },
  { folder: 'plager hodepine-og-migrene', file: 'Understanding and Managing Migraine Attacks.png' },
  { folder: 'plager hodepine-og-migrene', file: 'Quick Guide to Tension Headaches.png' },
  { folder: 'plager hodepine-og-migrene', file: 'Headaches Types, Relief, and Care.png' },
  { folder: 'plager hodepine-og-migrene', file: 'Decoding Headaches Causes and Relief.png' },

  // Hofte/bekken
  { folder: 'Plager hofte-og-bekkensmerter', file: 'Visual Guide to Understanding Hip Pain.png' },
  { folder: 'Plager hofte-og-bekkensmerter', file: 'Fighting Pelvic Pain in Pregnancy.png' },
  { folder: 'Plager hofte-og-bekkensmerter', file: 'Hip Impingement (FAI) Treatment Guide.png' },
  { folder: 'Plager hofte-og-bekkensmerter', file: 'SI Joint Pain Causes and Relief.png' },
  { folder: 'Plager hofte-og-bekkensmerter', file: 'Patient Guide to Outer Hip Pain.png' },
  { folder: 'Plager hofte-og-bekkensmerter', file: 'Patient Guide to SI Joint Pain.png' },
  { folder: 'Plager hofte-og-bekkensmerter', file: 'Patient Guide Hip Osteoarthritis.png' },

  // Kjeve
  { folder: 'plager kjevesmerter', file: 'Understanding and Managing Jaw Pain (TMD).png' },
  { folder: 'plager kjevesmerter', file: 'The Jaw-Headache Connection Guide to TMD.png' },
  { folder: 'plager kjevesmerter', file: 'Guide to Clicking and Aching Jaw.png' },
  { folder: 'plager kjevesmerter', file: 'Bruxism Day and Night Grinding.png' },

  // Albue/arm
  { folder: 'plager albue-arm', file: 'Guide to Arm, Elbow, and Hand Pain.png' }
];

const IMAGES_BASE = path.join(__dirname, 'website', 'images');

async function optimizeGraphic(folder, filename) {
  const inputPath = path.join(IMAGES_BASE, folder, filename);
  const baseName = path.basename(filename, '.png');
  const outputPath = path.join(IMAGES_BASE, folder, `${baseName}.webp`);

  if (!fs.existsSync(inputPath)) {
    console.log(`  SKIP: File not found`);
    return null;
  }

  // Check if WebP already exists
  if (fs.existsSync(outputPath)) {
    const stats = fs.statSync(outputPath);
    console.log(`  EXISTS: ${baseName}.webp (${Math.round(stats.size / 1024)}KB)`);
    return { name: `${baseName}.webp`, size: stats.size, existed: true };
  }

  try {
    const inputStats = fs.statSync(inputPath);
    console.log(`  Input: ${Math.round(inputStats.size / 1024 / 1024 * 10) / 10}MB`);

    await sharp(inputPath)
      .resize(1200, null, { withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(outputPath);

    const outputStats = fs.statSync(outputPath);
    const reduction = Math.round((1 - outputStats.size / inputStats.size) * 100);
    console.log(`  Created: ${baseName}.webp (${Math.round(outputStats.size / 1024)}KB, ${reduction}% smaller)`);

    return { name: `${baseName}.webp`, size: outputStats.size, existed: false };
  } catch (err) {
    console.log(`  ERROR: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log('=== Optimizing Blog Article Graphics ===\n');

  let created = 0;
  let existed = 0;
  let failed = 0;

  for (const { folder, file } of GRAPHICS_TO_OPTIMIZE) {
    console.log(`\n[${folder}] ${file}`);
    const result = await optimizeGraphic(folder, file);
    if (result) {
      if (result.existed) existed++;
      else created++;
    } else {
      failed++;
    }
  }

  console.log('\n=== Summary ===');
  console.log(`Created: ${created}`);
  console.log(`Already existed: ${existed}`);
  console.log(`Failed/not found: ${failed}`);
}

main().catch(console.error);
