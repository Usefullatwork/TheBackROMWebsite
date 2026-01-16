/**
 * Image Tools - Consolidated image optimization utilities
 * Usage: node image-tools.js <command>
 *
 * Commands:
 *   optimize     - Find and convert large images (>500KB) to WebP
 *   responsive   - Generate responsive variants (480w, 768w) for key images
 *   update-html  - Update HTML files to use WebP versions
 *   all          - Run all commands in sequence
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const WEBSITE_DIR = path.join(__dirname, 'website');
const IMAGES_DIR = path.join(WEBSITE_DIR, 'images');

// ============================================================
// OPTIMIZE: Convert large images to WebP
// ============================================================
function findLargeImages(dir, minSizeKB = 500, images = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      findLargeImages(fullPath, minSizeKB, images);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        const sizeKB = stat.size / 1024;
        if (sizeKB > minSizeKB) {
          const webpPath = fullPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
          if (!fs.existsSync(webpPath)) {
            images.push({ path: fullPath, size: stat.size, sizeKB: Math.round(sizeKB) });
          }
        }
      }
    }
  }
  return images;
}

async function convertToWebP(imagePath, quality = 80) {
  const webpPath = imagePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  const originalSize = fs.statSync(imagePath).size;
  try {
    await sharp(imagePath).webp({ quality }).toFile(webpPath);
    const newSize = fs.statSync(webpPath).size;
    const saved = originalSize - newSize;
    const percent = Math.round((saved / originalSize) * 100);
    console.log(`  OK: ${path.basename(imagePath)}: ${Math.round(originalSize/1024)}KB -> ${Math.round(newSize/1024)}KB (${percent}% smaller)`);
    return { success: true, saved };
  } catch (err) {
    console.error(`  ERROR: ${path.basename(imagePath)}: ${err.message}`);
    return { success: false, saved: 0 };
  }
}

async function runOptimize() {
  console.log('\n=== OPTIMIZE: Converting large images to WebP ===\n');
  const images = findLargeImages(IMAGES_DIR);
  images.sort((a, b) => b.size - a.size);

  if (images.length === 0) {
    console.log('No large images need conversion.\n');
    return;
  }

  console.log(`Found ${images.length} images to convert:\n`);
  let totalSaved = 0;
  let processed = 0;

  for (const img of images) {
    const result = await convertToWebP(img.path);
    if (result.success) {
      totalSaved += result.saved;
      processed++;
    }
  }

  console.log(`\nConverted: ${processed} images`);
  console.log(`Space saved: ${Math.round(totalSaved / 1024 / 1024)}MB\n`);
}

// ============================================================
// RESPONSIVE: Generate responsive image variants
// ============================================================
const RESPONSIVE_WIDTHS = [480, 768];
const PRIORITY_IMAGES = [
  'Om/meg.webp', 'Om/fotball.webp', 'Home/trv-optimized.webp',
  'plager nakkesmerter/nakkesmerte-optimized.webp',
  'Tjenester Svimmelhet/svimmelhet-optimized.webp',
  'Tjenester Kiroprakikk/behandling-optimized.webp',
  'plager korsryggsmerter/korsrygg-optimized.webp',
  'Tjenester Rehabilitering/aktiv-optimized.webp',
  'plager kjevesmerter/kjeve-optimized.webp',
  'plager hodepine-og-migrene/hodepine-optimized.webp',
  'Behandling/behandling-1-optimized.webp', 'Behandling/behandling-2-optimized.webp',
  'Tjenester Dry-Needling/Dry needle.webp', 'Tjenester Graston/graston.webp',
  'Tjenester Fasciemanipulasjon/Fascal release.webp'
];

async function generateResponsive(imagePath) {
  const fullPath = path.join(IMAGES_DIR, imagePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`  SKIP: Not found: ${imagePath}`);
    return 0;
  }

  const dir = path.dirname(fullPath);
  const ext = path.extname(imagePath);
  const baseName = path.basename(imagePath, ext);
  const metadata = await sharp(fullPath).metadata();
  let generated = 0;

  for (const width of RESPONSIVE_WIDTHS) {
    if (width >= metadata.width) continue;
    const outputName = `${baseName}-${width}w.webp`;
    const outputPath = path.join(dir, outputName);
    if (fs.existsSync(outputPath)) continue;

    try {
      await sharp(fullPath)
        .resize(width, null, { withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(outputPath);
      const stats = fs.statSync(outputPath);
      console.log(`  Created: ${outputName} (${Math.round(stats.size / 1024)}KB)`);
      generated++;
    } catch (err) {
      console.log(`  ERROR: ${outputName}: ${err.message}`);
    }
  }
  return generated;
}

async function runResponsive() {
  console.log('\n=== RESPONSIVE: Generating image variants ===\n');
  let total = 0;
  for (const img of PRIORITY_IMAGES) {
    console.log(`Processing: ${img}`);
    total += await generateResponsive(img);
  }
  console.log(`\nGenerated ${total} responsive variants.\n`);
}

// ============================================================
// UPDATE-HTML: Update HTML to use WebP versions
// ============================================================
function findWebPFiles(dir, webpFiles = new Set()) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      findWebPFiles(fullPath, webpFiles);
    } else if (file.endsWith('.webp')) {
      const relativePath = path.relative(IMAGES_DIR, fullPath);
      webpFiles.add(relativePath.replace('.webp', ''));
    }
  }
  return webpFiles;
}

function findHTMLFiles(dir, htmlFiles = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      findHTMLFiles(fullPath, htmlFiles);
    } else if (file.endsWith('.html')) {
      htmlFiles.push(fullPath);
    }
  }
  return htmlFiles;
}

function updateHTMLFile(htmlPath, webpFiles) {
  let content = fs.readFileSync(htmlPath, 'utf8');
  let changes = 0;
  const imgPattern = /src="([^"]*\.(png|jpg|jpeg))"/gi;

  content = content.replace(imgPattern, (match, imagePath) => {
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return match;
    const imagesMatch = imagePath.match(/images[\/\\](.+)\.(png|jpg|jpeg)$/i);
    if (imagesMatch && webpFiles.has(imagesMatch[1])) {
      changes++;
      return match.replace(/\.(png|jpg|jpeg)"/i, '.webp"');
    }
    return match;
  });

  if (changes > 0) {
    fs.writeFileSync(htmlPath, content, 'utf8');
    console.log(`  Updated: ${path.basename(htmlPath)} (${changes} images)`);
  }
  return changes;
}

async function runUpdateHTML() {
  console.log('\n=== UPDATE-HTML: Updating image references ===\n');
  const webpFiles = findWebPFiles(IMAGES_DIR);
  const htmlFiles = findHTMLFiles(WEBSITE_DIR);

  let totalChanges = 0;
  let filesUpdated = 0;

  for (const htmlFile of htmlFiles) {
    const changes = updateHTMLFile(htmlFile, webpFiles);
    if (changes > 0) {
      totalChanges += changes;
      filesUpdated++;
    }
  }

  console.log(`\nUpdated ${filesUpdated} HTML files (${totalChanges} image refs).\n`);
}

// ============================================================
// MAIN
// ============================================================
async function main() {
  const command = process.argv[2] || 'help';

  switch (command) {
    case 'optimize':
      await runOptimize();
      break;
    case 'responsive':
      await runResponsive();
      break;
    case 'update-html':
      await runUpdateHTML();
      break;
    case 'all':
      await runOptimize();
      await runResponsive();
      await runUpdateHTML();
      break;
    default:
      console.log(`
Image Tools - Website image optimization

Usage: node image-tools.js <command>

Commands:
  optimize     Convert large images (>500KB) to WebP
  responsive   Generate 480w/768w variants for key images
  update-html  Update HTML files to reference WebP versions
  all          Run all commands in sequence
`);
  }
}

main().catch(console.error);
