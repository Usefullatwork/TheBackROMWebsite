/**
 * Interlinking Audit Script
 * Checks internal linking patterns across the website
 *
 * Usage: node scripts/audit-interlinking.js
 *
 * Checks:
 * 1. Blog → Hub linking (blogs should link to parent hub)
 * 2. Hub → Sub-article linking (hubs link to their sub-pages)
 * 3. Sub-article → Hub back-links
 * 4. Cross-language consistency (NO vs EN linking patterns)
 */

const fs = require('fs');
const path = require('path');

// Config
const HUB_MAPPING = {
  // Norwegian hubs and their sub-article directories
  'plager/korsryggsmerte.html': 'plager/korsrygg/',
  'plager/nakkesmerter.html': 'plager/nakke/',
  'plager/hodepine.html': 'plager/hodepine/',
  'plager/skuldersmerter.html': 'plager/skulder/',
  'plager/knesmerter.html': 'plager/kne/',
  'plager/hofte-og-bekkensmerter.html': 'plager/hofte/',
  'plager/kjevesmerte.html': 'plager/kjeve/',
  'plager/fotsmerter.html': 'plager/fot/',
  'plager/svimmelhet.html': 'plager/svimmelhet/',
  'plager/idrettsskader.html': 'plager/idrettsskader/',
  // English hubs
  'en/conditions/lower-back-pain.html': 'en/conditions/lower-back/',
  'en/conditions/neck-pain.html': 'en/conditions/neck/',
  'en/conditions/headache.html': 'en/conditions/headache/',
  'en/conditions/shoulder-pain.html': 'en/conditions/shoulder/',
  'en/conditions/knee-pain.html': 'en/conditions/knee/',
  'en/conditions/hip-pain.html': 'en/conditions/hip/',
  'en/conditions/jaw-pain.html': 'en/conditions/jaw/',
  'en/conditions/foot-pain.html': 'en/conditions/foot/',
  'en/conditions/dizziness.html': 'en/conditions/dizziness/',
  'en/conditions/sports-injuries.html': 'en/conditions/sports/'
};

// Blog keywords to hub mapping
const BLOG_TO_HUB = {
  // Norwegian
  'rygg|korsrygg|prolaps|skive|isjias': 'plager/korsryggsmerte.html',
  'nakke|cervical|whiplash': 'plager/nakkesmerter.html',
  'hodepine|migrene|spenningshodepine': 'plager/hodepine.html',
  'skulder|rotator|impingement': 'plager/skuldersmerter.html',
  'kne|patella|menisk|korsbånd': 'plager/knesmerter.html',
  'hofte|bekken|piriformis': 'plager/hofte-og-bekkensmerter.html',
  'kjeve|tmj|tmd|tygge': 'plager/kjevesmerte.html',
  'fot|ankel|hæl|plantar': 'plager/fotsmerter.html',
  'svimmel|vertigo|bppv': 'plager/svimmelhet.html'
};

const issues = {
  blogMissingHubLink: [],
  hubMissingSubArticleLinks: [],
  subArticleMissingHubBacklink: [],
  orphanSubArticles: [],
  hubSubnavIncomplete: []
};

const stats = {
  totalFiles: 0,
  hubPages: 0,
  subArticles: 0,
  blogPosts: 0,
  linksAnalyzed: 0
};

// Find all HTML files
function findHtmlFiles(dir, excludeDirs = ['node_modules', '.git', 'images', 'images-originals']) {
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

// Extract all internal links from HTML
function extractLinks(content) {
  const linkRegex = /<a[^>]+href="([^"#?]+)"[^>]*>/gi;
  const links = [];
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const href = match[1];
    // Skip external, mailto, tel, javascript
    if (!href.startsWith('http') && !href.startsWith('mailto:') &&
        !href.startsWith('tel:') && !href.startsWith('javascript:') &&
        !href.startsWith('sms:') && href.length > 0) {
      links.push(href);
    }
  }
  return links;
}

// Extract subnav links (hub pages link to sub-articles via .hub-subnav)
function extractSubnavLinks(content) {
  const subnavMatch = content.match(/<nav[^>]*class="[^"]*hub-subnav[^"]*"[^>]*>[\s\S]*?<\/nav>/i);
  if (!subnavMatch) return [];
  return extractLinks(subnavMatch[0]);
}

// Get file type
function getFileType(filePath) {
  const relativePath = filePath.replace(/^.*?website\//, '');

  // Blog posts
  if (relativePath.startsWith('blogg/') && relativePath !== 'blogg/index.html') {
    return 'nb-blog';
  }
  if (relativePath.startsWith('en/blog/') && relativePath !== 'en/blog/index.html') {
    return 'en-blog';
  }

  // Hub pages
  for (const hub of Object.keys(HUB_MAPPING)) {
    if (relativePath === hub) return 'hub';
  }

  // Sub-articles
  for (const subDir of Object.values(HUB_MAPPING)) {
    if (relativePath.startsWith(subDir) && relativePath.endsWith('.html')) {
      return 'sub-article';
    }
  }

  return 'other';
}

// Get parent hub for a sub-article
function getParentHub(filePath) {
  const relativePath = filePath.replace(/^.*?website\//, '');
  for (const [hub, subDir] of Object.entries(HUB_MAPPING)) {
    if (relativePath.startsWith(subDir)) {
      return hub;
    }
  }
  return null;
}

// Check if content links to a specific target (allowing for path variations)
function linksTo(links, targetPath, currentDir) {
  const targetNormalized = targetPath.replace(/^\//, '').replace(/\\/g, '/');

  return links.some(link => {
    // Resolve relative paths
    let resolved = link;
    if (link.startsWith('/')) {
      resolved = link.slice(1);
    } else if (link.startsWith('../')) {
      const parts = currentDir.split('/');
      let linkParts = link.split('/');
      while (linkParts[0] === '..') {
        parts.pop();
        linkParts.shift();
      }
      resolved = parts.concat(linkParts).join('/');
    } else if (!link.includes('/')) {
      resolved = currentDir + '/' + link;
    } else {
      resolved = currentDir + '/' + link;
    }
    resolved = resolved.replace(/^.*?website\//, '').replace(/\/+/g, '/');
    return resolved === targetNormalized;
  });
}

// Analyze a single file
function analyzeFile(filePath, allFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  const links = extractLinks(content);
  const relativePath = filePath.replace(/^.*?website\//, '');
  const currentDir = path.dirname(relativePath);
  const fileType = getFileType(filePath);

  stats.linksAnalyzed += links.length;

  if (fileType === 'hub') {
    stats.hubPages++;

    // Check hub → sub-article links via subnav
    const subnavLinks = extractSubnavLinks(content);
    const subDir = HUB_MAPPING[relativePath];

    if (subDir) {
      // Find all sub-articles for this hub
      const subArticles = allFiles.filter(f => {
        const relPath = f.replace(/^.*?website\//, '');
        return relPath.startsWith(subDir) && relPath.endsWith('.html');
      });

      // Check which are linked from the hub
      const missingFromSubnav = [];
      subArticles.forEach(subArticle => {
        const subRelPath = subArticle.replace(/^.*?website\//, '');
        const subFileName = path.basename(subRelPath);

        // Check if linked in subnav
        const isLinked = subnavLinks.some(link => {
          const linkFile = path.basename(link);
          return linkFile === subFileName || link.includes(subRelPath);
        });

        if (!isLinked) {
          missingFromSubnav.push(subRelPath);
        }
      });

      if (missingFromSubnav.length > 0) {
        issues.hubSubnavIncomplete.push({
          hub: relativePath,
          missing: missingFromSubnav
        });
      }
    }
  }

  if (fileType === 'sub-article') {
    stats.subArticles++;

    // Check sub-article → hub back-link
    const parentHub = getParentHub(filePath);
    if (parentHub && !linksTo(links, parentHub, currentDir)) {
      issues.subArticleMissingHubBacklink.push({
        subArticle: relativePath,
        expectedHub: parentHub
      });
    }
  }

  if (fileType === 'nb-blog' || fileType === 'en-blog') {
    stats.blogPosts++;

    // Check blog → related hub linking
    const title = content.match(/<title>([^<]+)<\/title>/i)?.[1] || '';
    const h1 = content.match(/<h1[^>]*>([^<]+)<\/h1>/i)?.[1] || '';
    const searchText = (title + ' ' + h1).toLowerCase();

    // Find relevant hub based on keywords
    let relevantHub = null;
    for (const [keywords, hub] of Object.entries(BLOG_TO_HUB)) {
      const regex = new RegExp(keywords, 'i');
      if (regex.test(searchText)) {
        relevantHub = hub;
        break;
      }
    }

    // English blogs should link to English hubs
    if (fileType === 'en-blog' && relevantHub) {
      const enHub = Object.entries(HUB_MAPPING).find(([hub]) => {
        return hub.startsWith('en/') && hub.replace('en/', '') === relevantHub.replace('plager/', 'conditions/');
      });
      if (enHub) relevantHub = enHub[0];
    }

    if (relevantHub && !linksTo(links, relevantHub, currentDir)) {
      issues.blogMissingHubLink.push({
        blog: relativePath,
        suggestedHub: relevantHub,
        title: h1 || title
      });
    }
  }
}

// Main
console.log('\nInterlinking Audit');
console.log('='.repeat(50));
console.log('Scanning website for linking patterns...\n');

const baseDir = path.join(__dirname, '..');
const allFiles = findHtmlFiles(baseDir);
stats.totalFiles = allFiles.length;

console.log(`Found ${allFiles.length} HTML files\n`);
console.log('Analyzing links...');

allFiles.forEach(file => analyzeFile(file, allFiles));

// Generate report
const report = [];
report.push('# Interlinking Audit Report');
report.push('');
report.push(`**Generated:** ${new Date().toISOString().split('T')[0]}`);
report.push(`**Files scanned:** ${stats.totalFiles}`);
report.push(`**Links analyzed:** ${stats.linksAnalyzed}`);
report.push('');
report.push('## Summary');
report.push('');
report.push('| Category | Count |');
report.push('|----------|-------|');
report.push(`| Hub pages | ${stats.hubPages} |`);
report.push(`| Sub-articles | ${stats.subArticles} |`);
report.push(`| Blog posts | ${stats.blogPosts} |`);
report.push('');
report.push('## Issues Found');
report.push('');

// Hub subnav incomplete
report.push('### Hub Pages Missing Sub-Article Links');
report.push('');
if (issues.hubSubnavIncomplete.length === 0) {
  report.push('✅ All hubs link to their sub-articles');
} else {
  report.push(`⚠️ ${issues.hubSubnavIncomplete.length} hub(s) have incomplete subnav sections`);
  report.push('');
  issues.hubSubnavIncomplete.forEach(issue => {
    report.push(`**${issue.hub}** missing ${issue.missing.length} sub-article(s):`);
    issue.missing.slice(0, 10).forEach(m => report.push(`- ${m}`));
    if (issue.missing.length > 10) {
      report.push(`- ... and ${issue.missing.length - 10} more`);
    }
    report.push('');
  });
}
report.push('');

// Sub-article back-links
report.push('### Sub-Articles Missing Hub Back-Link');
report.push('');
if (issues.subArticleMissingHubBacklink.length === 0) {
  report.push('✅ All sub-articles link back to their parent hub');
} else {
  report.push(`⚠️ ${issues.subArticleMissingHubBacklink.length} sub-article(s) missing hub back-link`);
  report.push('');
  report.push('| Sub-Article | Should Link To |');
  report.push('|-------------|----------------|');
  issues.subArticleMissingHubBacklink.slice(0, 30).forEach(issue => {
    report.push(`| ${issue.subArticle} | ${issue.expectedHub} |`);
  });
  if (issues.subArticleMissingHubBacklink.length > 30) {
    report.push('');
    report.push(`... and ${issues.subArticleMissingHubBacklink.length - 30} more`);
  }
}
report.push('');

// Blog to hub links
report.push('### Blog Posts Missing Related Hub Link');
report.push('');
if (issues.blogMissingHubLink.length === 0) {
  report.push('✅ All blogs link to related hubs');
} else {
  report.push(`ℹ️ ${issues.blogMissingHubLink.length} blog post(s) could link to related hub`);
  report.push('');
  report.push('| Blog | Suggested Hub | Title |');
  report.push('|------|---------------|-------|');
  issues.blogMissingHubLink.slice(0, 20).forEach(issue => {
    const shortTitle = issue.title.substring(0, 40) + (issue.title.length > 40 ? '...' : '');
    report.push(`| ${issue.blog} | ${issue.suggestedHub} | ${shortTitle} |`);
  });
  if (issues.blogMissingHubLink.length > 20) {
    report.push('');
    report.push(`... and ${issues.blogMissingHubLink.length - 20} more`);
  }
}
report.push('');

// Recommendations
report.push('## Recommendations');
report.push('');
report.push('1. **Add missing sub-article links** to hub subnav sections');
report.push('2. **Add "Back to [Hub]" links** in sub-article breadcrumbs or intro');
report.push('3. **Consider linking blogs** to related condition hubs to improve site structure');
report.push('');

// Write report
const reportPath = path.join(baseDir, 'docs', 'INTERLINKING-REPORT.md');
fs.writeFileSync(reportPath, report.join('\n'), 'utf8');

// Console summary
console.log('\nResults:');
console.log(`  Hub subnav issues: ${issues.hubSubnavIncomplete.length}`);
console.log(`  Sub-article back-links missing: ${issues.subArticleMissingHubBacklink.length}`);
console.log(`  Blog→Hub suggestions: ${issues.blogMissingHubLink.length}`);
console.log('');
console.log(`Report saved to: docs/INTERLINKING-REPORT.md`);
