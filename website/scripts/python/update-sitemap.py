#!/usr/bin/env python3
"""
Script to add missing HTML pages to sitemap.xml
"""

import os
import re
from pathlib import Path
from datetime import datetime

BASE_DIR = Path(r"D:\0 - 0 - Totall Clarity\0 - 0 - Nettside code – Kopi\website")
DOMAIN = "https://thebackrom.com"

# Directories to scan for pages to add
SCAN_DIRS = [
    'en/blog',
    'en/conditions',
    'en/services',
    'plager',
    'blogg',
    'tjeneste',
]

# Files to exclude
EXCLUDE_PATTERNS = [
    r'\.backup\.html$',
    r'\.old\.html$',
    r'_test\.html$',
    r'template',
]

def get_existing_urls(sitemap_path):
    """Extract existing URLs from sitemap."""
    with open(sitemap_path, 'r', encoding='utf-8') as f:
        content = f.read()

    urls = set()
    for match in re.finditer(r'<loc>([^<]+)</loc>', content):
        url = match.group(1)
        # Normalize URL
        url = url.rstrip('/')
        urls.add(url)
    return urls

def get_html_files(base_dir, scan_dirs):
    """Find all HTML files in specified directories."""
    html_files = []

    for scan_dir in scan_dirs:
        dir_path = base_dir / scan_dir
        if dir_path.exists():
            for html_file in dir_path.rglob('*.html'):
                rel_path = html_file.relative_to(base_dir)
                # Skip excluded patterns
                skip = False
                for pattern in EXCLUDE_PATTERNS:
                    if re.search(pattern, str(rel_path), re.IGNORECASE):
                        skip = True
                        break
                if not skip:
                    html_files.append(rel_path)

    return html_files

def path_to_url(rel_path):
    """Convert file path to URL."""
    # Normalize path separators
    url_path = str(rel_path).replace('\\', '/')
    return f"{DOMAIN}/{url_path}"

def create_url_entry(url, lastmod=None, changefreq='monthly', priority='0.5'):
    """Create a sitemap URL entry."""
    if lastmod is None:
        lastmod = datetime.now().strftime('%Y-%m-%d')

    return f"""  <url>
    <loc>{url}</loc>
    <lastmod>{lastmod}</lastmod>
    <changefreq>{changefreq}</changefreq>
    <priority>{priority}</priority>
  </url>"""

def main():
    sitemap_path = BASE_DIR / 'sitemap.xml'

    # Get existing URLs
    existing_urls = get_existing_urls(sitemap_path)
    print(f"Found {len(existing_urls)} existing URLs in sitemap")

    # Get HTML files
    html_files = get_html_files(BASE_DIR, SCAN_DIRS)
    print(f"Found {len(html_files)} HTML files in scan directories")

    # Find missing URLs
    missing = []
    for rel_path in html_files:
        url = path_to_url(rel_path)
        if url not in existing_urls:
            missing.append((rel_path, url))

    print(f"\nMissing from sitemap: {len(missing)} URLs")

    if not missing:
        print("Nothing to add!")
        return

    # Read sitemap
    with open(sitemap_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Create new entries
    new_entries = []
    for rel_path, url in sorted(missing):
        # Determine priority based on path
        if '/blog/' in str(rel_path) or '/blogg/' in str(rel_path):
            priority = '0.6'
        elif 'index.html' in str(rel_path):
            priority = '0.7'
        else:
            priority = '0.5'

        entry = create_url_entry(url, priority=priority)
        new_entries.append(entry)
        print(f"  Added: {url}")

    # Insert before closing tag
    new_content = content.replace('</urlset>', '\n'.join(new_entries) + '\n</urlset>')

    # Write updated sitemap
    with open(sitemap_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print(f"\n✓ Added {len(missing)} URLs to sitemap")

if __name__ == '__main__':
    main()
