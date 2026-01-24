/**
 * Convert Google LM Infographics to WebP
 * Copies PNG files from Google LM folders to website/images/infographics/
 * and converts them to optimized WebP format
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, 'website/images-originals/Google LM');
const TARGET_DIR = path.join(__dirname, 'website/images/infographics');

// Folder mapping to body areas
const FOLDER_MAPPING = {
  '1 - Korsrygg': 'korsrygg',
  '2 - Nakke': 'nakke',
  '3 - Kjeve TMD': 'kjeve',
  '4 - svimmlhet': 'svimmelhet',
  '5 - Hodepine og migrene': 'hodepine',
  '6 - Skulder': 'skulder',
  '7 - Hofte og Bekken': 'hofte',
  '8 - Ankel og fot': 'fot',
  '9 - Arm, Albue og Håndledd': 'arm',
  '10 - Brystrygg': 'brystrygg',
  '11 - Kne': 'kne'
};

async function convertPngToWebp(sourcePath, targetPath) {
  try {
    await sharp(sourcePath)
      .resize(1200, null, { withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(targetPath);

    const originalSize = fs.statSync(sourcePath).size;
    const newSize = fs.statSync(targetPath).size;
    const savedPercent = Math.round((1 - newSize / originalSize) * 100);

    return { success: true, originalSize, newSize, savedPercent };
  } catch (err) {
    console.error(`Error converting ${sourcePath}: ${err.message}`);
    return { success: false };
  }
}

function sanitizeFilename(filename) {
  return filename
    .replace(/\s+/g, '-')
    .replace(/['']/g, '')
    .replace(/[&]/g, 'and')
    .replace(/[,.:;!?]/g, '')
    .replace(/--+/g, '-')
    .toLowerCase();
}

async function processFolder(sourceFolder, targetSubfolder) {
  const sourcePath = path.join(SOURCE_DIR, sourceFolder);
  const targetPath = path.join(TARGET_DIR, targetSubfolder);

  if (!fs.existsSync(sourcePath)) {
    console.log(`Source folder not found: ${sourceFolder}`);
    return [];
  }

  // Create target subfolder
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  const files = fs.readdirSync(sourcePath).filter(f => f.toLowerCase().endsWith('.png'));
  const results = [];

  console.log(`\nProcessing ${sourceFolder} (${files.length} files)...`);

  for (const file of files) {
    const sourceFile = path.join(sourcePath, file);
    const sanitizedName = sanitizeFilename(path.basename(file, '.png')) + '.webp';
    const targetFile = path.join(targetPath, sanitizedName);

    if (fs.existsSync(targetFile)) {
      console.log(`  SKIP: ${sanitizedName} (exists)`);
      results.push({
        original: file,
        converted: sanitizedName,
        area: targetSubfolder,
        skipped: true
      });
      continue;
    }

    const result = await convertPngToWebp(sourceFile, targetFile);
    if (result.success) {
      console.log(`  OK: ${sanitizedName} (${Math.round(result.originalSize/1024)}KB -> ${Math.round(result.newSize/1024)}KB, ${result.savedPercent}% saved)`);
      results.push({
        original: file,
        converted: sanitizedName,
        area: targetSubfolder,
        sizeBefore: result.originalSize,
        sizeAfter: result.newSize
      });
    }
  }

  return results;
}

async function main() {
  console.log('=== Converting Google LM Infographics to WebP ===\n');

  // Ensure target directory exists
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  const allResults = [];
  let totalOriginal = 0;
  let totalConverted = 0;

  for (const [sourceFolder, targetSubfolder] of Object.entries(FOLDER_MAPPING)) {
    const results = await processFolder(sourceFolder, targetSubfolder);
    allResults.push(...results);

    for (const r of results) {
      if (!r.skipped && r.sizeBefore) {
        totalOriginal += r.sizeBefore;
        totalConverted += r.sizeAfter;
      }
    }
  }

  // Create mapping JSON
  const mapping = {};
  for (const r of allResults) {
    const key = r.original.replace('.png', '').toLowerCase();
    mapping[key] = {
      file: `infographics/${r.area}/${r.converted}`,
      area: r.area,
      originalName: r.original
    };
  }

  const mappingPath = path.join(TARGET_DIR, 'mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));

  console.log('\n=== Summary ===');
  console.log(`Total files processed: ${allResults.length}`);
  console.log(`Space saved: ${Math.round((totalOriginal - totalConverted) / 1024 / 1024)}MB`);
  console.log(`Mapping saved to: ${mappingPath}`);
}

main().catch(console.error);
