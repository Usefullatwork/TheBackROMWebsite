const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'website', 'images');
const MIN_SIZE_KB = 500; // Only process files larger than 500KB
const QUALITY = 80; // WebP quality

// Track statistics
let stats = {
  processed: 0,
  skipped: 0,
  errors: 0,
  savedBytes: 0
};

// Find all large images recursively
function findLargeImages(dir, images = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      findLargeImages(fullPath, images);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        const sizeKB = stat.size / 1024;
        if (sizeKB > MIN_SIZE_KB) {
          // Check if WebP version already exists
          const webpPath = fullPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
          if (!fs.existsSync(webpPath)) {
            images.push({
              path: fullPath,
              size: stat.size,
              sizeKB: Math.round(sizeKB)
            });
          }
        }
      }
    }
  }

  return images;
}

async function convertToWebP(imagePath) {
  const webpPath = imagePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  const originalSize = fs.statSync(imagePath).size;

  try {
    await sharp(imagePath)
      .webp({ quality: QUALITY })
      .toFile(webpPath);

    const newSize = fs.statSync(webpPath).size;
    const saved = originalSize - newSize;
    const percent = Math.round((saved / originalSize) * 100);

    console.log(`✓ ${path.basename(imagePath)}: ${Math.round(originalSize/1024)}KB → ${Math.round(newSize/1024)}KB (${percent}% smaller)`);

    stats.processed++;
    stats.savedBytes += saved;

    return { success: true, saved };
  } catch (err) {
    console.error(`✗ ${path.basename(imagePath)}: ${err.message}`);
    stats.errors++;
    return { success: false };
  }
}

async function main() {
  console.log('Scanning for large images (>500KB)...\n');

  const images = findLargeImages(IMAGES_DIR);

  // Sort by size descending (process largest first)
  images.sort((a, b) => b.size - a.size);

  console.log(`Found ${images.length} large images to convert\n`);

  if (images.length === 0) {
    console.log('No images need conversion (WebP versions already exist)');
    return;
  }

  // Show top 10 largest
  console.log('Top 10 largest images:');
  images.slice(0, 10).forEach((img, i) => {
    console.log(`  ${i+1}. ${path.basename(img.path)} (${Math.round(img.sizeKB/1024*10)/10}MB)`);
  });
  console.log('\nStarting conversion...\n');

  // Process in batches of 5 to avoid memory issues
  const BATCH_SIZE = 5;
  for (let i = 0; i < images.length; i += BATCH_SIZE) {
    const batch = images.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(img => convertToWebP(img.path)));

    // Progress update every 20 images
    if ((i + BATCH_SIZE) % 20 === 0 || i + BATCH_SIZE >= images.length) {
      const progress = Math.min(i + BATCH_SIZE, images.length);
      console.log(`\n--- Progress: ${progress}/${images.length} (${Math.round(progress/images.length*100)}%) ---\n`);
    }
  }

  // Final stats
  console.log('\n========== OPTIMIZATION COMPLETE ==========');
  console.log(`Processed: ${stats.processed} images`);
  console.log(`Errors: ${stats.errors}`);
  console.log(`Total saved: ${Math.round(stats.savedBytes / 1024 / 1024)}MB`);
  console.log('============================================\n');
}

main().catch(console.error);
