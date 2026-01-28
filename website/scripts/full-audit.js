#!/usr/bin/env node
/**
 * full-audit.js - Comprehensive site audit script
 * Scans all HTML files and checks meta tags, schema, hreflang, CSS classes,
 * performance, accessibility, content quality, sitemap sync, and structure.
 * Outputs a markdown report to docs/FULL-AUDIT-REPORT.md
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const EXCLUDE_DIRS = ['node_modules', '.git', 'docs', 'images-originals', 'scripts'];
const SITEMAP_PATH = path.join(ROOT, 'sitemap.xml');
const REPORT_PATH = path.join(ROOT, 'docs', 'FULL-AUDIT-REPORT.md');
const SITE_ORIGIN = 'https://thebackrom.com';

const issues = [];

function addIssue(file, category, message, severity) {
  issues.push({ file: path.relative(ROOT, file), category, message, severity });
}

// ── File Discovery ──────────────────────────────────────────────────────────

function findHtmlFiles(dir) {
  let files = [];
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory() && !EXCLUDE_DIRS.includes(item)) {
        files = files.concat(findHtmlFiles(fullPath));
      } else if (item.endsWith('.html')) {
        files.push(fullPath);
      }
    }
  } catch (err) { /* skip inaccessible */ }
  return files;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function getMeta(content, name) {
  // Handle both double and single quoted attributes separately to allow apostrophes in double-quoted values
  const reDouble = new RegExp(`<meta\\s+name="${name}"\\s+content="([^"]*)"`, 'i');
  const reSingle = new RegExp(`<meta\\s+name='${name}'\\s+content='([^']*)'`, 'i');
  const reDouble2 = new RegExp(`<meta\\s+content="([^"]*)"\\s+name="${name}"`, 'i');
  const reSingle2 = new RegExp(`<meta\\s+content='([^']*)'\\s+name='${name}'`, 'i');
  return (content.match(reDouble) || content.match(reSingle) || content.match(reDouble2) || content.match(reSingle2) || [])[1] || '';
}

function getOg(content, prop) {
  // Handle both double and single quoted attributes separately
  const reDouble = new RegExp(`<meta\\s+property="${prop}"\\s+content="([^"]*)"`, 'i');
  const reSingle = new RegExp(`<meta\\s+property='${prop}'\\s+content='([^']*)'`, 'i');
  const reDouble2 = new RegExp(`<meta\\s+content="([^"]*)"\\s+property="${prop}"`, 'i');
  const reSingle2 = new RegExp(`<meta\\s+content='([^']*)'\\s+property='${prop}'`, 'i');
  return (content.match(reDouble) || content.match(reSingle) || content.match(reDouble2) || content.match(reSingle2) || [])[1] || '';
}

function isEnglish(filePath) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
  return rel.startsWith('en/');
}

function isConditionPage(filePath) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
  return rel.includes('/conditions/') || rel.includes('/plager/');
}

function stripHtml(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ── Check Functions ─────────────────────────────────────────────────────────

function checkMetaTags(filePath, content) {
  const cat = 'Meta Tags';

  // Title
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  if (!titleMatch) {
    addIssue(filePath, cat, 'Missing <title> tag', 'critical');
  } else {
    const len = titleMatch[1].length;
    if (len < 20) addIssue(filePath, cat, `Title too short (${len} chars)`, 'warning');
    if (len > 70) addIssue(filePath, cat, `Title too long (${len} chars)`, 'warning');
  }

  // Description
  const desc = getMeta(content, 'description');
  if (!desc) {
    addIssue(filePath, cat, 'Missing meta description', 'critical');
  } else {
    if (desc.length < 70) addIssue(filePath, cat, `Description too short (${desc.length} chars)`, 'warning');
    if (desc.length > 160) addIssue(filePath, cat, `Description too long (${desc.length} chars)`, 'warning');
  }

  // Viewport
  if (!getMeta(content, 'viewport')) {
    addIssue(filePath, cat, 'Missing viewport meta tag', 'critical');
  }

  // Canonical
  if (!/<link\s[^>]*rel=["']canonical["'][^>]*>/i.test(content)) {
    addIssue(filePath, cat, 'Missing canonical link', 'warning');
  }

  // OG tags
  if (!getOg(content, 'og:title')) addIssue(filePath, cat, 'Missing og:title', 'warning');
  if (!getOg(content, 'og:description')) addIssue(filePath, cat, 'Missing og:description', 'warning');
  if (!getOg(content, 'og:image')) addIssue(filePath, cat, 'Missing og:image', 'info');

  // Twitter cards
  if (!getMeta(content, 'twitter:card') && !getOg(content, 'og:title')) {
    addIssue(filePath, cat, 'Missing twitter card and OG tags', 'info');
  }
}

function checkSchema(filePath, content) {
  const cat = 'Schema Markup';
  const jsonLdBlocks = [];
  const re = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(content)) !== null) {
    try {
      jsonLdBlocks.push(JSON.parse(m[1]));
    } catch (e) {
      addIssue(filePath, cat, `Invalid JSON-LD: ${e.message}`, 'critical');
    }
  }

  if (jsonLdBlocks.length === 0) {
    addIssue(filePath, cat, 'No JSON-LD schema found', 'warning');
    return;
  }

  const allTypes = JSON.stringify(jsonLdBlocks);

  // Condition pages should have MedicalWebPage
  if (isConditionPage(filePath) && !allTypes.includes('MedicalWebPage')) {
    addIssue(filePath, cat, 'Condition page missing MedicalWebPage schema', 'warning');
  }

  // FAQ sections should have FAQPage schema
  if (/<(section|div)[^>]*class=["'][^"']*faq[^"']*["']/i.test(content) ||
      /id=["']faq["']/i.test(content) ||
      /<h[23][^>]*>.*(?:FAQ|Frequently Asked|Vanlige spørsmål)/i.test(content)) {
    if (!allTypes.includes('FAQPage')) {
      addIssue(filePath, cat, 'FAQ section found but no FAQPage schema', 'warning');
    }
  }

  // Check lastReviewed not future
  const reviewMatch = allTypes.match(/"lastReviewed"\s*:\s*"(\d{4}-\d{2}-\d{2})"/);
  if (reviewMatch) {
    const reviewed = new Date(reviewMatch[1]);
    if (reviewed > new Date()) {
      addIssue(filePath, cat, `lastReviewed date is in the future: ${reviewMatch[1]}`, 'warning');
    }
  }

  // Check author present on medical pages
  if (isConditionPage(filePath) && !allTypes.includes('"author"')) {
    addIssue(filePath, cat, 'Medical page missing author in schema', 'warning');
  }
}

function checkHreflang(filePath, content) {
  const cat = 'Hreflang & Language';
  const hreflangTags = [];
  const re = /<link\s[^>]*hreflang=["']([^"']*)["'][^>]*href=["']([^"']*)["'][^>]*>/gi;
  let m;
  while ((m = re.exec(content)) !== null) {
    hreflangTags.push({ lang: m[1], href: m[2] });
  }
  // Also match reversed attribute order
  const re2 = /<link\s[^>]*href=["']([^"']*)["'][^>]*hreflang=["']([^"']*)["'][^>]*>/gi;
  while ((m = re2.exec(content)) !== null) {
    if (!hreflangTags.some(t => t.lang === m[2] && t.href === m[1])) {
      hreflangTags.push({ lang: m[2], href: m[1] });
    }
  }

  if (hreflangTags.length === 0) {
    // No hreflang is OK for single-language pages - only info level
    addIssue(filePath, cat, 'No hreflang tags (single-language page)', 'info');
    return;
  }

  // Check bidirectional: should have both en and nb
  const langs = hreflangTags.map(t => t.lang);
  if (!langs.includes('en')) addIssue(filePath, cat, 'Missing hreflang="en"', 'warning');
  if (!langs.includes('nb') && !langs.includes('no')) addIssue(filePath, cat, 'Missing hreflang="nb"', 'warning');

  // Check that referenced alternate files exist
  for (const tag of hreflangTags) {
    const urlPath = tag.href.replace(SITE_ORIGIN, '');
    if (urlPath.startsWith('/')) {
      const localPath = path.join(ROOT, urlPath.replace(/\//g, path.sep));
      if (!fs.existsSync(localPath)) {
        addIssue(filePath, cat, `Hreflang target missing: ${urlPath}`, 'critical');
      }
    }
  }
}

function checkCssClasses(filePath, content) {
  const cat = 'CSS Class Consistency';
  const deprecated = ['hub-sidenav', 'section-heading', 'tldr-box', 'cta-box', 'warning-box'];
  for (const cls of deprecated) {
    if (content.includes(cls)) {
      addIssue(filePath, cat, `Uses deprecated class: ${cls}`, 'warning');
    }
  }

  // Hero should use <section> not <header>
  if (/<header[^>]*class=["'][^"']*hero[^"']*["']/i.test(content)) {
    addIssue(filePath, cat, 'Hero uses <header> instead of <section>', 'warning');
  }
}

function checkPerformance(filePath, content) {
  const cat = 'Performance';

  // File size
  const size = Buffer.byteLength(content, 'utf8');
  if (size > 80 * 1024) {
    addIssue(filePath, cat, `File size ${Math.round(size / 1024)}KB exceeds 80KB`, 'warning');
  }

  // Inline CSS
  const styleBlocks = content.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
  const totalInline = styleBlocks.reduce((sum, s) => sum + s.length, 0);
  if (totalInline > 2000) {
    addIssue(filePath, cat, `Inline CSS ${totalInline} chars (>2000)`, 'warning');
  }

  // Script count
  const scripts = (content.match(/<script[\s\S]*?<\/script>/gi) || []);
  const externalScripts = scripts.filter(s => /src=["']/i.test(s));
  if (externalScripts.length > 8) {
    addIssue(filePath, cat, `${externalScripts.length} external scripts (>8)`, 'warning');
  }

  // CSS preload
  if (!/<link\s[^>]*rel=["']preload["'][^>]*as=["']style["']/i.test(content)) {
    addIssue(filePath, cat, 'No CSS preload found', 'info');
  }

  // Images missing loading="lazy" or decoding="async"
  const imgTags = content.match(/<img\s[^>]*>/gi) || [];
  for (const img of imgTags) {
    if (!/loading=["']lazy["']/i.test(img) && !/loading=["']eager["']/i.test(img)) {
      const src = (img.match(/src=["']([^"']*)["']/i) || [])[1] || 'unknown';
      addIssue(filePath, cat, `Image missing loading attribute: ${path.basename(src)}`, 'info');
    }
    if (!/decoding=["']async["']/i.test(img)) {
      const src = (img.match(/src=["']([^"']*)["']/i) || [])[1] || 'unknown';
      addIssue(filePath, cat, `Image missing decoding="async": ${path.basename(src)}`, 'info');
    }
  }

  // Google Fonts display=swap
  if (/fonts\.googleapis\.com/i.test(content) && !/display=swap/i.test(content)) {
    addIssue(filePath, cat, 'Google Fonts missing display=swap', 'warning');
  }

  // Version hash on CSS/JS
  const linkTags = content.match(/<link\s[^>]*href=["'][^"']*\.css[^"']*["'][^>]*>/gi) || [];
  for (const link of linkTags) {
    const href = (link.match(/href=["']([^"']*)["']/i) || [])[1] || '';
    if (href && !href.startsWith('http') && !href.includes('?v=')) {
      addIssue(filePath, cat, `CSS missing version hash: ${path.basename(href)}`, 'info');
    }
  }
}

function checkAccessibility(filePath, content) {
  const cat = 'Accessibility';

  // html lang
  if (!/<html[^>]*\slang=["'][^"']+["']/i.test(content)) {
    addIssue(filePath, cat, 'Missing lang attribute on <html>', 'critical');
  }

  // Single h1
  const h1s = content.match(/<h1[\s>]/gi) || [];
  if (h1s.length === 0) addIssue(filePath, cat, 'No <h1> found', 'warning');
  if (h1s.length > 1) addIssue(filePath, cat, `Multiple <h1> tags (${h1s.length})`, 'warning');

  // Heading hierarchy - check for skipped levels (main content only)
  // Strip sidebar, footer, and aside to avoid false positives from structural headings
  let mainContent = content;
  mainContent = mainContent.replace(/<footer[\s\S]*?<\/footer>/gi, '');
  mainContent = mainContent.replace(/<aside[\s\S]*?<\/aside>/gi, '');
  mainContent = mainContent.replace(/<nav[\s\S]*?<\/nav>/gi, '');
  const headings = [];
  const hRe = /<h([1-6])[\s>]/gi;
  let hm;
  while ((hm = hRe.exec(mainContent)) !== null) {
    headings.push(parseInt(hm[1]));
  }
  for (let i = 1; i < headings.length; i++) {
    if (headings[i] > headings[i - 1] + 1) {
      addIssue(filePath, cat, `Heading skip: h${headings[i - 1]} → h${headings[i]}`, 'warning');
      break;
    }
  }

  // img alt
  const imgs = content.match(/<img\s[^>]*>/gi) || [];
  for (const img of imgs) {
    if (!/alt=["']/i.test(img)) {
      const src = (img.match(/src=["']([^"']*)["']/i) || [])[1] || 'unknown';
      addIssue(filePath, cat, `Image missing alt: ${path.basename(src)}`, 'warning');
    }
  }

  // Links without text or aria-label
  const linkRe = /<a\s([^>]*)>([\s\S]*?)<\/a>/gi;
  let lm;
  while ((lm = linkRe.exec(content)) !== null) {
    const attrs = lm[1];
    const inner = lm[2].replace(/<[^>]+>/g, '').trim();
    if (!inner && !/aria-label=["']/i.test(attrs) && !/title=["']/i.test(attrs)) {
      addIssue(filePath, cat, 'Link without text or aria-label', 'warning');
    }
  }
}

function checkContentQuality(filePath, content) {
  const cat = 'Content Quality';
  const text = stripHtml(content);
  const words = text.split(/\s+/).filter(w => w.length > 1);

  if (words.length < 300) {
    addIssue(filePath, cat, `Low word count: ${words.length} (<300)`, 'info');
  }

  // Norwegian words in English pages
  if (isEnglish(filePath)) {
    const norwegianWords = ['behandling', 'kiropraktor', 'smerter', 'nakke', 'rygg',
      'hodepine', 'svimmelhet', 'kjeve', 'skulder', 'kne', 'hofte', 'ankel',
      'bestill', 'kontakt', 'åpningstider', 'priser'];
    // Check in visible text only (not in URLs/attributes)
    const visibleText = text.toLowerCase();
    for (const word of norwegianWords) {
      const re = new RegExp(`\\b${word}\\b`, 'i');
      if (re.test(visibleText)) {
        addIssue(filePath, cat, `Norwegian word in EN page: "${word}"`, 'warning');
        break; // One warning per page is enough
      }
    }
  }

  // Medical pages should have disclaimer/source
  if (isConditionPage(filePath)) {
    if (!/disclaimer|ansvarsfraskrivelse|medical.disclaimer/i.test(content) &&
        !/class=["'][^"']*disclaimer/i.test(content)) {
      addIssue(filePath, cat, 'Medical page missing disclaimer', 'info');
    }
    if (!/kilde|source|referanse|reference/i.test(content)) {
      addIssue(filePath, cat, 'Medical page missing source/reference section', 'info');
    }
  }
}

function checkStructure(filePath, content) {
  const cat = 'Structural Consistency';

  // Mobile sticky CTA
  if (!/sticky.?cta|mobile.?cta|fixed.?cta|cta.?sticky|cta.?mobile/i.test(content) &&
      !/class=["'][^"']*sticky[^"']*["'][^>]*>[\s\S]*?(bestill|book|ring|call)/i.test(content)) {
    addIssue(filePath, cat, 'Missing mobile sticky CTA', 'info');
  }

  // Breadcrumb nav
  if (!/breadcrumb/i.test(content) && !/aria-label=["']breadcrumb/i.test(content)) {
    addIssue(filePath, cat, 'Missing breadcrumb navigation', 'info');
  }

  // Footer
  if (!/<footer[\s>]/i.test(content)) {
    addIssue(filePath, cat, 'Missing <footer> element', 'warning');
  }

  // Facebook Pixel
  if (!/fbq\(|facebook\.net\/|Meta Pixel/i.test(content)) {
    addIssue(filePath, cat, 'Missing Facebook Pixel', 'info');
  }
}

// ── Sitemap Sync ────────────────────────────────────────────────────────────

function checkSitemapSync(htmlFiles) {
  const cat = 'Sitemap Sync';
  if (!fs.existsSync(SITEMAP_PATH)) {
    addIssue(SITEMAP_PATH, cat, 'sitemap.xml not found', 'critical');
    return;
  }
  const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf8');
  const locRe = /<loc>([^<]+)<\/loc>/g;
  const sitemapUrls = new Set();
  let m;
  while ((m = locRe.exec(sitemapContent)) !== null) {
    sitemapUrls.add(m[1].replace(SITE_ORIGIN, '').replace(/^\//, ''));
  }

  const htmlRelPaths = new Set(
    htmlFiles.map(f => path.relative(ROOT, f).replace(/\\/g, '/'))
  );

  // Files in sitemap but not on disk
  for (const url of sitemapUrls) {
    if (!htmlRelPaths.has(url) && url.endsWith('.html')) {
      addIssue(SITEMAP_PATH, cat, `In sitemap but missing on disk: ${url}`, 'critical');
    }
  }

  // HTML files not in sitemap
  for (const rel of htmlRelPaths) {
    if (!sitemapUrls.has(rel)) {
      addIssue(rel, cat, `HTML file not in sitemap: ${rel}`, 'warning');
    }
  }
}

// ── Report Generation ───────────────────────────────────────────────────────

function generateReport(fileCount) {
  const critical = issues.filter(i => i.severity === 'critical');
  const warnings = issues.filter(i => i.severity === 'warning');
  const info = issues.filter(i => i.severity === 'info');

  const categories = {};
  for (const issue of issues) {
    if (!categories[issue.category]) categories[issue.category] = [];
    categories[issue.category].push(issue);
  }

  let md = `# Full Site Audit Report\n\n`;
  md += `**Generated:** ${new Date().toISOString().split('T')[0]}\n`;
  md += `**Pages scanned:** ${fileCount}\n`;
  md += `**Total issues:** ${issues.length}\n\n`;
  md += `## Summary\n\n`;
  md += `| Severity | Count |\n|----------|-------|\n`;
  md += `| 🔴 Critical | ${critical.length} |\n`;
  md += `| 🟡 Warning | ${warnings.length} |\n`;
  md += `| 🔵 Info | ${info.length} |\n\n`;

  if (critical.length > 0) {
    md += `## Critical Issues\n\n`;
    for (const i of critical) {
      md += `- **${i.file}** [${i.category}] ${i.message}\n`;
    }
    md += '\n';
  }

  if (warnings.length > 0) {
    md += `## Warnings\n\n`;
    for (const i of warnings) {
      md += `- **${i.file}** [${i.category}] ${i.message}\n`;
    }
    md += '\n';
  }

  if (info.length > 0) {
    md += `## Info\n\n`;
    for (const i of info) {
      md += `- **${i.file}** [${i.category}] ${i.message}\n`;
    }
    md += '\n';
  }

  md += `## By Category\n\n`;
  for (const [cat, catIssues] of Object.entries(categories).sort()) {
    const c = catIssues.filter(i => i.severity === 'critical').length;
    const w = catIssues.filter(i => i.severity === 'warning').length;
    const inf = catIssues.filter(i => i.severity === 'info').length;
    md += `### ${cat}\n\n`;
    md += `Critical: ${c} | Warnings: ${w} | Info: ${inf}\n\n`;
    for (const i of catIssues) {
      const icon = i.severity === 'critical' ? '🔴' : i.severity === 'warning' ? '🟡' : '🔵';
      md += `- ${icon} **${i.file}** ${i.message}\n`;
    }
    md += '\n';
  }

  return md;
}

// ── Main ────────────────────────────────────────────────────────────────────

function main() {
  console.log('Full Site Audit');
  console.log('===============\n');

  console.log('Scanning for HTML files...');
  const htmlFiles = findHtmlFiles(ROOT);
  console.log(`Found ${htmlFiles.length} HTML files\n`);

  console.log('Running checks...');
  for (const filePath of htmlFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    checkMetaTags(filePath, content);
    checkSchema(filePath, content);
    checkHreflang(filePath, content);
    checkCssClasses(filePath, content);
    checkPerformance(filePath, content);
    checkAccessibility(filePath, content);
    checkContentQuality(filePath, content);
    checkStructure(filePath, content);
  }

  console.log('Checking sitemap sync...');
  checkSitemapSync(htmlFiles);

  // Summary
  const critical = issues.filter(i => i.severity === 'critical').length;
  const warnings = issues.filter(i => i.severity === 'warning').length;
  const info = issues.filter(i => i.severity === 'info').length;

  console.log(`\nResults:`);
  console.log(`  Critical: ${critical}`);
  console.log(`  Warnings: ${warnings}`);
  console.log(`  Info:     ${info}`);
  console.log(`  Total:    ${issues.length}`);

  // Write report
  const docsDir = path.join(ROOT, 'docs');
  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });

  const report = generateReport(htmlFiles.length);
  fs.writeFileSync(REPORT_PATH, report, 'utf8');
  console.log(`\nReport saved to: docs/FULL-AUDIT-REPORT.md`);
}

main();
