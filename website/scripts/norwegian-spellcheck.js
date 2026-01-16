/**
 * Norwegian Spellcheck using LanguageTool API
 * Usage: node scripts/norwegian-spellcheck.js [file or directory]
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const targetPath = process.argv[2] || '.';

// Skip these directories
const skipDirs = ['node_modules', 'en', '.git', 'docs', 'scripts'];

// Skip these file patterns in content (CSS classes, URLs, etc.)
const ignorePatterns = [
  /class="[^"]*"/g,
  /id="[^"]*"/g,
  /href="[^"]*"/g,
  /src="[^"]*"/g,
  /url\([^)]*\)/g,
  /<script[\s\S]*?<\/script>/gi,
  /<style[\s\S]*?<\/style>/gi,
  /\{[\s\S]*?\}/g  // JSON-LD
];

function findHtmlFiles(dir) {
  let files = [];
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      if (skipDirs.includes(item)) continue;
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        files = files.concat(findHtmlFiles(fullPath));
      } else if (item.endsWith('.html') && !item.includes('en/')) {
        files.push(fullPath);
      }
    }
  } catch (err) {
    // Skip
  }
  return files;
}

function extractText(html) {
  // Remove ignored patterns
  let text = html;
  for (const pattern of ignorePatterns) {
    text = text.replace(pattern, ' ');
  }

  // Remove HTML tags but keep content
  text = text.replace(/<[^>]+>/g, ' ');

  // Decode HTML entities
  text = text.replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

async function checkWithLanguageTool(text, language = 'nb') {
  return new Promise((resolve, reject) => {
    const postData = `text=${encodeURIComponent(text)}&language=${language}`;

    const options = {
      hostname: 'api.languagetool.org',
      port: 443,
      path: '/v2/check',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const text = extractText(content);

  // Only check first 10000 chars due to API limits
  const textToCheck = text.substring(0, 10000);

  if (textToCheck.length < 50) return [];

  try {
    const result = await checkWithLanguageTool(textToCheck);
    return result.matches || [];
  } catch (err) {
    console.error(`Error checking ${filePath}: ${err.message}`);
    return [];
  }
}

async function main() {
  console.log('\n==================================================');
  console.log('NORWEGIAN SPELLCHECK (LanguageTool)');
  console.log('==================================================\n');

  let files;
  if (fs.statSync(targetPath).isFile()) {
    files = [targetPath];
  } else {
    files = findHtmlFiles(targetPath);
  }

  // Filter to only root-level Norwegian HTML files
  files = files.filter(f => !f.includes('\\en\\') && !f.includes('/en/'));

  console.log(`Checking ${files.length} Norwegian files...\n`);

  const allIssues = [];

  // Check files with rate limiting (1 per second)
  for (let i = 0; i < Math.min(files.length, 5); i++) {
    const file = files[i];
    const relPath = path.relative(targetPath, file);
    process.stdout.write(`Checking ${relPath}... `);

    const issues = await checkFile(file);

    if (issues.length > 0) {
      console.log(`${issues.length} issues`);
      allIssues.push({ file: relPath, issues });
    } else {
      console.log('OK');
    }

    // Rate limit
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n==================================================');
  console.log('RESULTS');
  console.log('==================================================\n');

  if (allIssues.length === 0) {
    console.log('[PASS] No spelling/grammar issues found!\n');
  } else {
    let totalIssues = 0;
    for (const { file, issues } of allIssues) {
      console.log(`\n${file}:`);
      for (const issue of issues.slice(0, 5)) {
        console.log(`  - "${issue.context.text.substring(issue.context.offset, issue.context.offset + issue.context.length)}"`);
        console.log(`    ${issue.message}`);
        if (issue.replacements && issue.replacements.length > 0) {
          console.log(`    Suggestion: ${issue.replacements.slice(0, 3).map(r => r.value).join(', ')}`);
        }
        totalIssues++;
      }
      if (issues.length > 5) {
        console.log(`  ... and ${issues.length - 5} more`);
        totalIssues += issues.length - 5;
      }
    }
    console.log(`\n[WARN] Found ${totalIssues} potential issues in ${allIssues.length} files\n`);
  }
}

main().catch(console.error);
