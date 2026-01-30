/**
 * Mirror Structure Checker
 * Compares Norwegian and English site structure
 *
 * Usage: node scripts/audit-mirror.js
 *
 * Checks:
 * 1. Every NO hub has EN equivalent
 * 2. Every NO sub-article has EN equivalent
 * 3. Every NO blog has EN equivalent
 * 4. Report structure mismatches
 */

const fs = require('fs');
const path = require('path');

// Path mappings for Norwegian to English
const PATH_MAPPINGS = {
  // Hub pages
  'plager/korsryggsmerte.html': 'en/conditions/lower-back-pain.html',
  'plager/nakkesmerter.html': 'en/conditions/neck-pain.html',
  'plager/hodepine.html': 'en/conditions/headache.html',
  'plager/skuldersmerter.html': 'en/conditions/shoulder-pain.html',
  'plager/knesmerter.html': 'en/conditions/knee-pain.html',
  'plager/hofte-og-bekkensmerter.html': 'en/conditions/hip-pain.html',
  'plager/kjevesmerte.html': 'en/conditions/jaw-pain.html',
  'plager/fotsmerter.html': 'en/conditions/foot-pain.html',
  'plager/svimmelhet.html': 'en/conditions/dizziness.html',
  'plager/idrettsskader.html': 'en/conditions/sports-injuries.html',
  'plager/brystryggsmerter.html': 'en/conditions/thoracic-pain.html',
  'plager/ryggsmerter.html': 'en/conditions/back-pain.html',

  // Directory mappings
  'plager/korsrygg/': 'en/conditions/lower-back/',
  'plager/nakke/': 'en/conditions/neck/',
  'plager/hodepine/': 'en/conditions/headache/',
  'plager/skulder/': 'en/conditions/shoulder/',
  'plager/kne/': 'en/conditions/knee/',
  'plager/hofte/': 'en/conditions/hip/',
  'plager/kjeve/': 'en/conditions/jaw/',
  'plager/fot/': 'en/conditions/foot/',
  'plager/svimmelhet/': 'en/conditions/dizziness/',
  'plager/idrettsskader/': 'en/conditions/sports/',
  'plager/albue-arm/': 'en/conditions/elbow-arm/',

  // Other pages
  'blogg/': 'en/blog/',
  'tjeneste/': 'en/services/',
  'faq/': 'en/faq/',
  'behandlinger/': 'en/treatments/'
};

// Known filename translations (NO → EN)
const FILENAME_TRANSLATIONS = {
  // Common condition names
  'skiveprolaps': 'disc-herniation',
  'isjias': 'sciatica',
  'triggerpunkter': 'trigger-points',
  'artrose': 'osteoarthritis',
  'migrene': 'migraine',
  'spenningshodepine': 'tension-headache',
  'krystallsyke': 'bppv',
  'svimmelhet': 'dizziness',
  'prolaps': 'disc-herniation',
  'leddgikt': 'arthritis',
  'betennelse': 'inflammation',
  'smerter': 'pain',
  'syndrom': 'syndrome',
  'ovelser': 'exercises',
  'behandling': 'treatment',
  'arsaker': 'causes',
  'symptomer': 'symptoms'
};

const stats = {
  noHubs: 0,
  enHubs: 0,
  noSubArticles: 0,
  enSubArticles: 0,
  noBlogs: 0,
  enBlogs: 0
};

const issues = {
  missingEnHub: [],
  missingNoHub: [],
  missingEnSubArticle: [],
  missingNoSubArticle: [],
  missingEnBlog: [],
  missingNoBlog: [],
  structureMismatch: []
};

// Find HTML files in directory
function findHtmlFiles(dir, excludeDirs = ['node_modules', '.git', 'images', 'images-originals', 'scripts', 'docs']) {
  let files = [];
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory() && !excludeDirs.includes(item)) {
        files = files.concat(findHtmlFiles(fullPath, excludeDirs));
      } else if (item.endsWith('.html') && !item.includes('template')) {
        files.push(fullPath.replace(/\\/g, '/'));
      }
    }
  } catch (err) {
    // Skip inaccessible directories
  }
  return files;
}

// Get relative path
function getRelativePath(fullPath) {
  return fullPath.replace(/^.*?website\//, '');
}

// Get expected EN path for NO path
function getExpectedEnPath(noPath) {
  // Direct mapping
  if (PATH_MAPPINGS[noPath]) {
    return PATH_MAPPINGS[noPath];
  }

  // Directory-based mapping
  for (const [noDir, enDir] of Object.entries(PATH_MAPPINGS)) {
    if (noPath.startsWith(noDir) && noDir.endsWith('/')) {
      const filename = noPath.replace(noDir, '');
      // Just return with same filename - actual translation check is complex
      return enDir + filename;
    }
  }

  return null;
}

// Get expected NO path for EN path
function getExpectedNoPath(enPath) {
  // Find reverse mapping
  for (const [noPath, mappedEnPath] of Object.entries(PATH_MAPPINGS)) {
    if (enPath === mappedEnPath) {
      return noPath;
    }

    // Directory-based reverse mapping
    if (mappedEnPath.endsWith('/') && enPath.startsWith(mappedEnPath)) {
      const filename = enPath.replace(mappedEnPath, '');
      return noPath + filename;
    }
  }

  return null;
}

// Categorize files
function categorizeFile(relativePath) {
  const isEnglish = relativePath.startsWith('en/');

  // Hub pages
  const hubPatterns = {
    noHub: /^plager\/[^\/]+\.html$/,
    enHub: /^en\/conditions\/[^\/]+\.html$/
  };

  // Sub-articles
  const subPatterns = {
    noSub: /^plager\/[^\/]+\/[^\/]+\.html$/,
    enSub: /^en\/conditions\/[^\/]+\/[^\/]+\.html$/
  };

  // Blogs
  const blogPatterns = {
    noBlog: /^blogg\/[^\/]+\.html$/,
    enBlog: /^en\/blog\/[^\/]+\.html$/
  };

  if (hubPatterns.noHub.test(relativePath)) return 'noHub';
  if (hubPatterns.enHub.test(relativePath)) return 'enHub';
  if (subPatterns.noSub.test(relativePath)) return 'noSub';
  if (subPatterns.enSub.test(relativePath)) return 'enSub';
  if (blogPatterns.noBlog.test(relativePath)) return 'noBlog';
  if (blogPatterns.enBlog.test(relativePath)) return 'enBlog';

  return 'other';
}

// Main
console.log('\nMirror Structure Checker');
console.log('='.repeat(50));
console.log('Comparing Norwegian and English site structure...\n');

const baseDir = path.join(__dirname, '..');
const allFiles = findHtmlFiles(baseDir);
const relativePaths = allFiles.map(getRelativePath);

console.log(`Found ${allFiles.length} HTML files\n`);

// Categorize all files
const categorized = {
  noHubs: [],
  enHubs: [],
  noSubArticles: [],
  enSubArticles: [],
  noBlogs: [],
  enBlogs: []
};

relativePaths.forEach(p => {
  const cat = categorizeFile(p);
  switch (cat) {
    case 'noHub': categorized.noHubs.push(p); break;
    case 'enHub': categorized.enHubs.push(p); break;
    case 'noSub': categorized.noSubArticles.push(p); break;
    case 'enSub': categorized.enSubArticles.push(p); break;
    case 'noBlog': categorized.noBlogs.push(p); break;
    case 'enBlog': categorized.enBlogs.push(p); break;
  }
});

// Update stats
stats.noHubs = categorized.noHubs.length;
stats.enHubs = categorized.enHubs.length;
stats.noSubArticles = categorized.noSubArticles.length;
stats.enSubArticles = categorized.enSubArticles.length;
stats.noBlogs = categorized.noBlogs.length;
stats.enBlogs = categorized.enBlogs.length;

console.log('Checking hub pages...');
// Check NO hubs have EN equivalents
categorized.noHubs.forEach(noHub => {
  const expectedEn = getExpectedEnPath(noHub);
  if (expectedEn && !relativePaths.includes(expectedEn)) {
    issues.missingEnHub.push({ no: noHub, expectedEn });
  }
});

// Check EN hubs have NO equivalents
categorized.enHubs.forEach(enHub => {
  const expectedNo = getExpectedNoPath(enHub);
  if (expectedNo && !relativePaths.includes(expectedNo)) {
    issues.missingNoHub.push({ en: enHub, expectedNo });
  }
});

console.log('Checking sub-articles...');
// Check NO sub-articles have EN equivalents
categorized.noSubArticles.forEach(noSub => {
  const expectedEn = getExpectedEnPath(noSub);
  if (expectedEn && !relativePaths.includes(expectedEn)) {
    issues.missingEnSubArticle.push({ no: noSub, expectedEn });
  }
});

// Check EN sub-articles have NO equivalents
categorized.enSubArticles.forEach(enSub => {
  const expectedNo = getExpectedNoPath(enSub);
  if (expectedNo && !relativePaths.includes(expectedNo)) {
    issues.missingNoSubArticle.push({ en: enSub, expectedNo });
  }
});

console.log('Checking blog posts...');
// For blogs, just report the count difference since filenames often differ
if (Math.abs(categorized.noBlogs.length - categorized.enBlogs.length) > 0) {
  issues.structureMismatch.push({
    type: 'blog',
    noCount: categorized.noBlogs.length,
    enCount: categorized.enBlogs.length,
    diff: categorized.noBlogs.length - categorized.enBlogs.length
  });
}

// Generate report
const report = [];
report.push('# Mirror Structure Report');
report.push('');
report.push(`**Generated:** ${new Date().toISOString().split('T')[0]}`);
report.push('');
report.push('## Structure Overview');
report.push('');
report.push('| Content Type | Norwegian | English | Difference |');
report.push('|--------------|-----------|---------|------------|');
report.push(`| Hub pages | ${stats.noHubs} | ${stats.enHubs} | ${stats.noHubs - stats.enHubs} |`);
report.push(`| Sub-articles | ${stats.noSubArticles} | ${stats.enSubArticles} | ${stats.noSubArticles - stats.enSubArticles} |`);
report.push(`| Blog posts | ${stats.noBlogs} | ${stats.enBlogs} | ${stats.noBlogs - stats.enBlogs} |`);
report.push('');

report.push('## Missing English Translations');
report.push('');

// Missing EN hubs
report.push('### Hub Pages');
report.push('');
if (issues.missingEnHub.length === 0) {
  report.push('✅ All Norwegian hub pages have English equivalents');
} else {
  report.push(`⚠️ ${issues.missingEnHub.length} Norwegian hub page(s) missing English translation`);
  report.push('');
  report.push('| Norwegian | Expected English |');
  report.push('|-----------|------------------|');
  issues.missingEnHub.forEach(i => {
    report.push(`| ${i.no} | ${i.expectedEn} |`);
  });
}
report.push('');

// Missing EN sub-articles
report.push('### Sub-Articles');
report.push('');
if (issues.missingEnSubArticle.length === 0) {
  report.push('✅ All Norwegian sub-articles have English equivalents');
} else {
  report.push(`⚠️ ${issues.missingEnSubArticle.length} Norwegian sub-article(s) missing English translation`);
  report.push('');
  report.push('Note: Filename matching is exact. Some files may exist with different names.');
  report.push('');
  report.push('| Norwegian | Expected English |');
  report.push('|-----------|------------------|');
  issues.missingEnSubArticle.slice(0, 50).forEach(i => {
    report.push(`| ${i.no} | ${i.expectedEn} |`);
  });
  if (issues.missingEnSubArticle.length > 50) {
    report.push('');
    report.push(`... and ${issues.missingEnSubArticle.length - 50} more`);
  }
}
report.push('');

report.push('## Missing Norwegian Pages');
report.push('');

// Missing NO hubs
report.push('### Hub Pages');
report.push('');
if (issues.missingNoHub.length === 0) {
  report.push('✅ All English hub pages have Norwegian equivalents');
} else {
  report.push(`⚠️ ${issues.missingNoHub.length} English hub page(s) missing Norwegian version`);
  report.push('');
  report.push('| English | Expected Norwegian |');
  report.push('|---------|-------------------|');
  issues.missingNoHub.forEach(i => {
    report.push(`| ${i.en} | ${i.expectedNo} |`);
  });
}
report.push('');

// Missing NO sub-articles
report.push('### Sub-Articles');
report.push('');
if (issues.missingNoSubArticle.length === 0) {
  report.push('✅ All English sub-articles have Norwegian equivalents');
} else {
  report.push(`⚠️ ${issues.missingNoSubArticle.length} English sub-article(s) missing Norwegian version`);
  report.push('');
  report.push('| English | Expected Norwegian |');
  report.push('|---------|-------------------|');
  issues.missingNoSubArticle.slice(0, 50).forEach(i => {
    report.push(`| ${i.en} | ${i.expectedNo} |`);
  });
  if (issues.missingNoSubArticle.length > 50) {
    report.push('');
    report.push(`... and ${issues.missingNoSubArticle.length - 50} more`);
  }
}
report.push('');

// Blog comparison
report.push('## Blog Post Comparison');
report.push('');
report.push(`Norwegian blogs: ${stats.noBlogs}`);
report.push(`English blogs: ${stats.enBlogs}`);
report.push('');
if (stats.noBlogs === stats.enBlogs) {
  report.push('✅ Blog post counts match');
} else {
  report.push(`ℹ️ Difference of ${Math.abs(stats.noBlogs - stats.enBlogs)} posts between languages`);
  report.push('');
  report.push('Note: Blog filenames are often translated, so this only compares counts.');
}
report.push('');

// Directory structure comparison
report.push('## Directory Structure');
report.push('');
report.push('### Norwegian Condition Directories');
report.push('');

const noDirs = [...new Set(categorized.noSubArticles.map(p => p.split('/').slice(0, 2).join('/')))];
const enDirs = [...new Set(categorized.enSubArticles.map(p => p.split('/').slice(0, 3).join('/')))];

noDirs.forEach(noDir => {
  const count = categorized.noSubArticles.filter(p => p.startsWith(noDir + '/')).length;
  const mappedEnDir = PATH_MAPPINGS[noDir + '/'] || 'No mapping';
  const enCount = mappedEnDir !== 'No mapping'
    ? categorized.enSubArticles.filter(p => p.startsWith(mappedEnDir)).length
    : 0;
  report.push(`- **${noDir}/** (${count} articles) → **${mappedEnDir}** (${enCount} articles)`);
});
report.push('');

// Recommendations
report.push('## Recommendations');
report.push('');
report.push('1. **Prioritize hub page translations** - these are most important for SEO');
report.push('2. **Translate high-traffic sub-articles** first');
report.push('3. **Blog posts can have different content** - focus on comparable topics');
report.push('4. **Consider creating missing Norwegian pages** if English versions get traffic');
report.push('');

// Write report
const reportPath = path.join(baseDir, 'docs', 'MIRROR-STRUCTURE-REPORT.md');
fs.writeFileSync(reportPath, report.join('\n'), 'utf8');

// Console summary
console.log('\nResults:');
console.log(`  NO → EN hub gaps: ${issues.missingEnHub.length}`);
console.log(`  NO → EN sub-article gaps: ${issues.missingEnSubArticle.length}`);
console.log(`  EN → NO hub gaps: ${issues.missingNoHub.length}`);
console.log(`  EN → NO sub-article gaps: ${issues.missingNoSubArticle.length}`);
console.log(`  Blog difference: ${Math.abs(stats.noBlogs - stats.enBlogs)}`);
console.log('');
console.log(`Report saved to: docs/MIRROR-STRUCTURE-REPORT.md`);
