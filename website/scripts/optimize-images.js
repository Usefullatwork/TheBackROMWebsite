const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const baseDir = path.join(__dirname, '..');

async function optimizeImage(inputPath, outputPath, width, quality = 80) {
  const fullInput = path.join(baseDir, inputPath);
  const fullOutput = path.join(baseDir, outputPath);

  try {
    const info = await sharp(fullInput)
      .resize(width, null, { withoutEnlargement: true })
      .webp({ quality: quality })
      .toFile(fullOutput);

    const origSize = fs.statSync(fullInput).size;
    const newSize = info.size;
    const savings = origSize - newSize;

    console.log(`✓ ${outputPath}`);
    console.log(`  Original: ${(origSize/1024).toFixed(1)}KB → New: ${(newSize/1024).toFixed(1)}KB (saved ${(savings/1024).toFixed(1)}KB)`);
    return info;
  } catch (err) {
    console.error(`✗ Error processing ${inputPath}: ${err.message}`);
  }
}

async function main() {
  console.log('Optimizing images for better performance...\n');

  // Logo - create a smaller version for header (displayed at ~150px typically)
  await optimizeImage('images/logo-header.webp', 'images/logo-header-150w.webp', 150, 85);

  // TRV image - create smaller srcset variants
  await optimizeImage('images/Home/trv-optimized.webp', 'images/Home/trv-optimized-320w.webp', 320, 80);

  // Nakkesmerte - create srcset variants
  await optimizeImage('images/plager nakkesmerter/nakkesmerte-optimized.webp', 'images/plager nakkesmerter/nakkesmerte-optimized-480w.webp', 480, 80);
  await optimizeImage('images/plager nakkesmerter/nakkesmerte-optimized.webp', 'images/plager nakkesmerter/nakkesmerte-optimized-320w.webp', 320, 80);

  // Svimmelhet - create srcset variants
  await optimizeImage('images/Tjenester Svimmelhet/svimmelhet-optimized.webp', 'images/Tjenester Svimmelhet/svimmelhet-optimized-480w.webp', 480, 80);
  await optimizeImage('images/Tjenester Svimmelhet/svimmelhet-optimized.webp', 'images/Tjenester Svimmelhet/svimmelhet-optimized-320w.webp', 320, 80);

  // Behandling - create srcset variants
  await optimizeImage('images/Behandling/behandling-1-optimized.webp', 'images/Behandling/behandling-1-optimized-480w.webp', 480, 80);
  await optimizeImage('images/Behandling/behandling-1-optimized.webp', 'images/Behandling/behandling-1-optimized-320w.webp', 320, 80);

  console.log('\nDone! Remember to update HTML to use srcset for responsive images.');
}

main();
