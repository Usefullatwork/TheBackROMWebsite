const fs = require('fs');
const path = require('path');

const WEBSITE_DIR = path.join(__dirname, 'website');
const IMAGES_DIR = path.join(WEBSITE_DIR, 'images');

// Find all WebP files that were converted
function findWebPFiles(dir, webpFiles = new Set()) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      findWebPFiles(fullPath, webpFiles);
    } else if (file.endsWith('.webp')) {
      // Get the relative path from images dir
      const relativePath = path.relative(IMAGES_DIR, fullPath);
      // Store the base name without extension
      const baseName = relativePath.replace('.webp', '');
      webpFiles.add(baseName);
    }
  }

  return webpFiles;
}

// Find all HTML files
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
  let originalContent = content;
  let changes = 0;

  // Pattern to match image sources with .png, .jpg, .jpeg
  const imgPattern = /src="([^"]*\.(png|jpg|jpeg))"/gi;

  content = content.replace(imgPattern, (match, imagePath, ext) => {
    // Skip external URLs
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return match;
    }

    // Get the path relative to images folder
    // imagePath might be like "../images/folder/file.png" or "images/folder/file.png"
    let normalizedPath = imagePath;

    // Extract just the images/... part
    const imagesMatch = imagePath.match(/images[\/\\](.+)\.(png|jpg|jpeg)$/i);
    if (imagesMatch) {
      const basePath = imagesMatch[1];

      // Check if WebP version exists
      if (webpFiles.has(basePath)) {
        changes++;
        // Replace extension with .webp
        return match.replace(/\.(png|jpg|jpeg)"/i, '.webp"');
      }
    }

    return match;
  });

  if (changes > 0) {
    fs.writeFileSync(htmlPath, content, 'utf8');
    console.log(`Updated ${path.basename(htmlPath)}: ${changes} image(s) → WebP`);
  }

  return changes;
}

async function main() {
  console.log('Finding WebP files...');
  const webpFiles = findWebPFiles(IMAGES_DIR);
  console.log(`Found ${webpFiles.size} WebP files\n`);

  console.log('Finding HTML files...');
  const htmlFiles = findHTMLFiles(WEBSITE_DIR);
  console.log(`Found ${htmlFiles.length} HTML files\n`);

  console.log('Updating HTML references...\n');

  let totalChanges = 0;
  let filesUpdated = 0;

  for (const htmlFile of htmlFiles) {
    const changes = updateHTMLFile(htmlFile, webpFiles);
    if (changes > 0) {
      totalChanges += changes;
      filesUpdated++;
    }
  }

  console.log('\n========== UPDATE COMPLETE ==========');
  console.log(`HTML files updated: ${filesUpdated}`);
  console.log(`Total image references changed: ${totalChanges}`);
  console.log('======================================\n');
}

main().catch(console.error);
