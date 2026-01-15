#!/usr/bin/env python3
"""
Fix broken internal links in English pages.
"""

import os
import re
import sys

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# Link corrections (broken -> correct)
LINK_CORRECTIONS = {
    # Filename corrections
    'c5-c6-prolapse.html': 'c5-c6-disc-herniation.html',
    'c6-c7-prolapse.html': 'c6-c7-disc-herniation.html',
    'numbness-fingers.html': 'finger-numbness.html',
    'lumbago.html': 'acute-back-pain.html',
    'acute-lumbago.html': 'acute-back-pain.html',

    # Folder typo
    '/low-back/': '/lower-back/',

    # Double-word typo
    'cervical-cervical-foraminal-stenosis.html': 'cervical-foraminal-stenosis.html',

    # Relative links in neck folder - cervical-disc-herniation -> neck-disc-herniation
    '"cervical-disc-herniation.html"': '"neck-disc-herniation.html"',
}

# Special case: cervical-disc-herniation.html -> neck-disc-herniation.html
# But we need to be careful not to match c5-c6-disc-herniation.html etc.

def fix_links(content):
    """Fix broken links in content."""
    fixed = 0
    new_content = content

    # Apply simple replacements
    for wrong, correct in LINK_CORRECTIONS.items():
        if wrong in new_content:
            count = new_content.count(wrong)
            new_content = new_content.replace(wrong, correct)
            fixed += count

    # Special case: cervical-disc-herniation.html -> neck-disc-herniation.html
    # Only match when it's the full filename, not part of another name
    pattern = r'href="([^"]*/)cervical-disc-herniation\.html"'
    matches = re.findall(pattern, new_content)
    if matches:
        new_content = re.sub(pattern, r'href="\1neck-disc-herniation.html"', new_content)
        fixed += len(matches)

    # Special case: disc-herniation.html in neck context
    # Match href="...neck/disc-herniation.html" -> neck-disc-herniation.html
    pattern = r'href="([^"]*neck/)disc-herniation\.html"'
    matches = re.findall(pattern, new_content)
    if matches:
        new_content = re.sub(pattern, r'href="\1neck-disc-herniation.html"', new_content)
        fixed += len(matches)

    return new_content, fixed

def scan_and_fix(en_dir, fix=False):
    """Scan and optionally fix broken links."""
    stats = {
        'scanned': 0,
        'files_with_issues': 0,
        'links_fixed': 0
    }

    issues = []

    for root, dirs, files in os.walk(en_dir):
        if 'node_modules' in root:
            continue

        for file in files:
            if not file.endswith('.html'):
                continue

            file_path = os.path.join(root, file)

            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
            except Exception as e:
                print(f"Error reading {file_path}: {e}")
                continue

            stats['scanned'] += 1

            new_content, fixed_count = fix_links(content)

            if fixed_count > 0:
                stats['files_with_issues'] += 1
                stats['links_fixed'] += fixed_count
                rel_path = os.path.relpath(file_path, en_dir)
                issues.append((rel_path, fixed_count))

                if fix:
                    try:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                    except Exception as e:
                        print(f"Error writing {file_path}: {e}")

    return stats, issues

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    en_dir = os.path.join(script_dir, 'en')

    if not os.path.exists(en_dir):
        print(f"Error: English directory not found at {en_dir}")
        return 1

    fix = '--fix' in sys.argv

    print("=" * 60)
    print("Broken Link Fix Tool")
    print("=" * 60)
    print(f"Directory: {en_dir}")
    print(f"Mode: {'FIX' if fix else 'SCAN ONLY'}")
    print("=" * 60)
    print()

    stats, issues = scan_and_fix(en_dir, fix=fix)

    if issues:
        print("Files with broken links:")
        for path, count in issues:
            print(f"  {path}: {count} link(s)")
        print()

    print("=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Files scanned: {stats['scanned']}")
    print(f"Files with issues: {stats['files_with_issues']}")
    print(f"Links {'fixed' if fix else 'to fix'}: {stats['links_fixed']}")

    if not fix and stats['links_fixed'] > 0:
        print()
        print(f"To fix {stats['links_fixed']} links, run: python fix-broken-links.py --fix")

    return 0

if __name__ == '__main__':
    sys.exit(main())
