/**
 * Blog Article Design Overhaul Script
 *
 * Updates 84 blog articles (42 Norwegian + 42 English) to match hub article design:
 * - Adds hub-subnav related article cards
 * - Updates outro section with background image styling
 * - Ensures MedicalWebPage schema exists
 *
 * IMPORTANT: Uses UTF8 with BOM for Norwegian character support
 */

const fs = require('fs');
const path = require('path');

// Load category mapping
const categoryMapping = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'blog-category-mapping.json'), 'utf8')
);

// Load infographic mapping
const infographicMapping = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../images/infographics/blog-infographic-mapping.json'), 'utf8')
);

// Configuration
const WEBSITE_ROOT = path.join(__dirname, '..');
const BLOG_NO_DIR = path.join(WEBSITE_ROOT, 'blogg');
const BLOG_EN_DIR = path.join(WEBSITE_ROOT, 'en', 'blog');

// Track changes
const results = {
  processed: 0,
  hubSubnavAdded: 0,
  outroUpdated: 0,
  schemaAdded: 0,
  errors: []
};

/**
 * Read file with BOM handling
 */
function readFileUTF8(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Remove BOM if present
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

/**
 * Write file with UTF8 BOM (critical for Norwegian characters)
 */
function writeFileUTF8(filePath, content) {
  const BOM = '\ufeff';
  // Remove existing BOM if present
  const cleanContent = content.replace(/^\ufeff/, '');
  fs.writeFileSync(filePath, BOM + cleanContent, 'utf8');
}

/**
 * Get category for an article
 */
function getCategory(filename, lang) {
  const langKey = lang === 'no' ? 'no' : 'en';
  return categoryMapping.articleToCategory[langKey][filename] || 'andre';
}

/**
 * Generate hub-subnav HTML
 */
function generateHubSubnav(filename, lang) {
  const category = getCategory(filename, lang);
  const catData = categoryMapping.categories[category];
  const langData = catData[lang === 'no' ? 'no' : 'en'];
  const relatedArticles = catData.relatedArticles[lang === 'no' ? 'no' : 'en'];

  // Get up to 3 related articles (excluding current article)
  const articlesToShow = relatedArticles.slice(0, 3);

  let html = `
            <!-- Related sub-articles -->
            <nav class="hub-subnav">
              <h3>${lang === 'no' ? 'Relaterte artikler' : 'Related articles'}</h3>
              <p class="hub-subnav__intro">${langData.introText}</p>
              <div class="hub-subnav__grid hub-subnav__grid--detailed">
                <a href="${langData.parent}" class="hub-subnav__card">
                  <strong>${langData.parentTitle}</strong>
                  <span>${lang === 'no' ? 'Hovedartikkel' : 'Main article'}</span>
                </a>`;

  articlesToShow.forEach(article => {
    html += `
                <a href="${article.file}" class="hub-subnav__card">
                  <strong>${article.title}</strong>
                  <span>${article.desc}</span>
                </a>`;
  });

  html += `
              </div>
            </nav>`;

  return html;
}

/**
 * Insert hub-subnav after premium-summary-card or other suitable location
 */
function insertHubSubnav(content, filename, lang) {
  // Skip if already has hub-subnav
  if (content.includes('class="hub-subnav"')) {
    return { content, changed: false };
  }

  const hubSubnav = generateHubSubnav(filename, lang);

  // Strategy 1: Find premium-summary-card
  const premiumCardPattern = /<div class="premium-summary-card"[\s\S]*?<\/div>/;
  const premiumMatch = content.match(premiumCardPattern);
  if (premiumMatch) {
    const newContent = content.replace(premiumMatch[0], premiumMatch[0] + hubSubnav);
    return { content: newContent, changed: true };
  }

  // Strategy 2: Find highlight-box
  const highlightPattern = /<div class="highlight-box"[\s\S]*?<\/div>/;
  const highlightMatch = content.match(highlightPattern);
  if (highlightMatch) {
    const newContent = content.replace(highlightMatch[0], highlightMatch[0] + hubSubnav);
    return { content: newContent, changed: true };
  }

  // Strategy 3: Find red-flag-alert box
  const redFlagPattern = /<div class="red-flag-alert"[\s\S]*?<\/div>/;
  const redFlagMatch = content.match(redFlagPattern);
  if (redFlagMatch) {
    const newContent = content.replace(redFlagMatch[0], redFlagMatch[0] + hubSubnav);
    return { content: newContent, changed: true };
  }

  // Strategy 4: Insert after intro section (before first hub-section or first h2 in blog-post__content)
  // Look for the end of hub-intro section
  const hubIntroEnd = /<\/section>\s*(?=.*<section class="hub-section")/s;
  const hubIntroMatch = content.match(hubIntroEnd);
  if (hubIntroMatch) {
    const newContent = content.replace(hubIntroMatch[0], hubIntroMatch[0] + '\n' + hubSubnav);
    return { content: newContent, changed: true };
  }

  // Strategy 5: Insert before first <h2> in blog-post__content
  const blogContentStart = /<div class="blog-post__content">/;
  if (content.match(blogContentStart)) {
    // Find the first h2 after blog-post__content
    const contentMatch = content.match(/<div class="blog-post__content">[\s\S]*?(<h2[^>]*>)/);
    if (contentMatch) {
      const firstH2Index = content.indexOf(contentMatch[1], content.indexOf('<div class="blog-post__content">'));
      if (firstH2Index > 0) {
        const newContent = content.slice(0, firstH2Index) + hubSubnav + '\n\n          ' + content.slice(firstH2Index);
        return { content: newContent, changed: true };
      }
    }
  }

  // Strategy 6: Insert after stat-grid
  const statGridPattern = /<div class="stat-grid">[\s\S]*?<\/div>\s*<\/div>/;
  const statGridMatch = content.match(statGridPattern);
  if (statGridMatch) {
    const newContent = content.replace(statGridMatch[0], statGridMatch[0] + hubSubnav);
    return { content: newContent, changed: true };
  }

  return { content, changed: false, error: 'No insertion point found' };
}

/**
 * Update outro section with background image classes
 */
function updateOutroSection(content) {
  // Pattern: page__outro outro outro_home (without overlay/home-bg)
  const outroPattern = /<section class="page__outro outro outro_home">/g;

  if (!content.match(outroPattern)) {
    // Check if already has the full classes
    if (content.includes('outro--overlay outro--home-bg')) {
      return { content, changed: false };
    }
    return { content, changed: false };
  }

  const newContent = content.replace(
    outroPattern,
    '<section class="page__outro outro outro_home outro--overlay outro--home-bg">'
  );

  return { content: newContent, changed: true };
}

/**
 * Ensure MedicalWebPage schema exists
 */
function ensureMedicalSchema(content, filename, lang) {
  // Check if MedicalWebPage already exists
  if (content.includes('"@type": "MedicalWebPage"') || content.includes('"@type":"MedicalWebPage"')) {
    return { content, changed: false };
  }

  let newContent = content;
  let changed = false;

  // Upgrade WebPage -> MedicalWebPage
  if (newContent.includes('"@type": "WebPage"') || newContent.includes('"@type":"WebPage"')) {
    newContent = newContent.replace(/"@type":\s*"WebPage"/g, '"@type": "MedicalWebPage"');
    changed = true;
  }

  // Upgrade Article -> MedicalWebPage (first instance only in ld+json)
  if (newContent.includes('"@type": "Article"') || newContent.includes('"@type":"Article"')) {
    // Only replace the first Article in the schema, not FAQPage etc
    newContent = newContent.replace(/"@type":\s*"Article"/, '"@type": "MedicalWebPage"');
    changed = true;
  }

  // Upgrade BlogPosting -> MedicalWebPage
  if (newContent.includes('"@type": "BlogPosting"') || newContent.includes('"@type":"BlogPosting"')) {
    newContent = newContent.replace(/"@type":\s*"BlogPosting"/g, '"@type": "MedicalWebPage"');
    changed = true;
  }

  return { content: newContent, changed };
}

/**
 * Process a single blog article
 */
function processArticle(filePath, filename, lang) {
  try {
    let content = readFileUTF8(filePath);
    let changed = false;

    // 1. Insert hub-subnav
    const subnavResult = insertHubSubnav(content, filename, lang);
    if (subnavResult.changed) {
      content = subnavResult.content;
      changed = true;
      results.hubSubnavAdded++;
    }
    if (subnavResult.error) {
      results.errors.push(`${filename}: ${subnavResult.error}`);
    }

    // 2. Update outro section
    const outroResult = updateOutroSection(content);
    if (outroResult.changed) {
      content = outroResult.content;
      changed = true;
      results.outroUpdated++;
    }

    // 3. Ensure MedicalWebPage schema
    const schemaResult = ensureMedicalSchema(content, filename, lang);
    if (schemaResult.changed) {
      content = schemaResult.content;
      changed = true;
      results.schemaAdded++;
    }

    // Write back if changed
    if (changed) {
      writeFileUTF8(filePath, content);
      console.log(`  [UPDATED] ${filename}`);
    } else {
      console.log(`  [SKIPPED] ${filename} (no changes needed)`);
    }

    results.processed++;
    return true;

  } catch (err) {
    results.errors.push(`${filename}: ${err.message}`);
    console.error(`  [ERROR] ${filename}: ${err.message}`);
    return false;
  }
}

/**
 * Process all articles in a directory
 */
function processDirectory(dir, lang) {
  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.html') && f !== 'index.html');

  console.log(`\nProcessing ${files.length} ${lang === 'no' ? 'Norwegian' : 'English'} articles...`);

  files.forEach(filename => {
    const filePath = path.join(dir, filename);
    processArticle(filePath, filename, lang);
  });
}

/**
 * Process a specific batch of articles
 */
function processBatch(category, lang) {
  const catData = categoryMapping.categories[category];
  if (!catData) {
    console.error(`Category '${category}' not found`);
    return;
  }

  const langKey = lang === 'no' ? 'no' : 'en';
  const articles = catData.articles[langKey];
  const dir = lang === 'no' ? BLOG_NO_DIR : BLOG_EN_DIR;

  console.log(`\nProcessing ${category} (${lang}): ${articles.length} articles...`);

  articles.forEach(filename => {
    const filePath = path.join(dir, filename);
    if (fs.existsSync(filePath)) {
      processArticle(filePath, filename, lang);
    } else {
      console.log(`  [MISSING] ${filename}`);
      results.errors.push(`${filename}: File not found`);
    }
  });
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);

  console.log('='.repeat(60));
  console.log('Blog Article Design Overhaul');
  console.log('='.repeat(60));

  if (args.length === 0) {
    // Process all articles
    console.log('\nMode: Process ALL articles\n');
    processDirectory(BLOG_NO_DIR, 'no');
    processDirectory(BLOG_EN_DIR, 'en');
  } else if (args[0] === '--batch') {
    // Process specific batch
    const category = args[1];
    const lang = args[2] || 'no';
    console.log(`\nMode: Process batch '${category}' (${lang})\n`);
    processBatch(category, lang);
  } else if (args[0] === '--file') {
    // Process single file
    const filePath = args[1];
    const lang = args[2] || 'no';
    const filename = path.basename(filePath);
    console.log(`\nMode: Process single file '${filename}'\n`);
    processArticle(filePath, filename, lang);
  } else if (args[0] === '--no') {
    // Process all Norwegian
    console.log('\nMode: Process all Norwegian articles\n');
    processDirectory(BLOG_NO_DIR, 'no');
  } else if (args[0] === '--en') {
    // Process all English
    console.log('\nMode: Process all English articles\n');
    processDirectory(BLOG_EN_DIR, 'en');
  } else {
    console.log(`
Usage:
  node upgrade-blog-articles.js           # Process all articles
  node upgrade-blog-articles.js --no      # Process Norwegian only
  node upgrade-blog-articles.js --en      # Process English only
  node upgrade-blog-articles.js --batch svimmelhet no   # Process category batch
  node upgrade-blog-articles.js --file path/to/file.html no  # Single file
    `);
    return;
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`Processed: ${results.processed} files`);
  console.log(`Hub-subnav added: ${results.hubSubnavAdded}`);
  console.log(`Outro updated: ${results.outroUpdated}`);
  console.log(`Schema upgraded: ${results.schemaAdded}`);

  if (results.errors.length > 0) {
    console.log(`\nErrors (${results.errors.length}):`);
    results.errors.forEach(err => console.log(`  - ${err}`));
  }

  console.log('\nDone!');
}

// Run
main();
