#!/usr/bin/env python3
"""
Fix encoding errors in Norwegian HTML files.
Replaces corrupted æ, ø, å characters (showing as replacement character).
"""
import os
import re
import sys

# Dictionary of known replacements (corrupted -> correct)
REPLACEMENTS = {
    # Words with å
    'p\ufffd': 'på',
    'n\ufffdr': 'når',
    'N\ufffdr': 'Når',
    '\ufffdrsaker': 'årsaker',
    '\ufffdrsak': 'årsak',
    '\ufffdrsaken': 'årsaken',
    '\ufffdpne': 'Åpne',
    '\ufffdpningstider': 'Åpningstider',
    'm\ufffdneder': 'måneder',
    'ogs\ufffd': 'også',
    'm\ufffd': 'må',
    's\ufffd': 'så',
    'g\ufffd': 'gå',
    'G\ufffd': 'Gå',
    'g\ufffdr': 'går',
    'st\ufffdr': 'står',
    'oppst\ufffdr': 'oppstår',
    'Unng\ufffd': 'Unngå',
    'unng\ufffd': 'unngå',
    'r\ufffdde': 'råde',
    'fr\ufffd': 'frå',  # Less common, but possible

    # Words with ø
    'b\ufffdr': 'bør',
    'B\ufffdr': 'Bør',
    'f\ufffdr': 'før',
    'F\ufffdr': 'Før',
    'f\ufffdrst': 'først',
    'f\ufffdrste': 'første',
    '\ufffdvelser': 'øvelser',
    '\ufffdvre': 'øvre',
    '\ufffdkt': 'økt',
    '\ufffdker': 'øker',
    's\ufffdke': 'søke',
    's\ufffdrlig': 'særlig',  # Actually æ
    'gj\ufffdr': 'gjør',
    'gj\ufffdre': 'gjøre',
    'n\ufffdvendig': 'nødvendig',
    'n\ufffdvendige': 'nødvendige',
    'Opps\ufffdk': 'Oppsøk',
    'opps\ufffdk': 'oppsøk',
    'r\ufffdntgen': 'røntgen',
    'R\ufffdntgen': 'Røntgen',
    'vestibul\ufffdr': 'vestibulær',  # Actually æ
    'F\ufffdlg': 'Følg',
    'f\ufffdlg': 'følg',
    'R\ufffdde': 'Røde',
    'r\ufffdde': 'røde',
    'Bes\ufffdk': 'Besøk',
    'bes\ufffdk': 'besøk',
    'h\ufffdy': 'høy',
    'H\ufffdy': 'Høy',
    'h\ufffdyre': 'høyre',
    'H\ufffdyre': 'Høyre',
    'h\uffddt': 'høyt',
    'bl\ufffdff': 'bløff',
    'bl\ufffdt': 'bløt',
    'kj\ufffdp': 'kjøp',
    'd\ufffdr': 'dør',
    'D\ufffdr': 'Dør',
    'sm\ufffdrte': 'smørte',
    'st\ufffdrre': 'større',
    'St\ufffdrre': 'Større',
    'L\ufffdrdag': 'Lørdag',
    'l\ufffdrdag': 'lørdag',
    'S\ufffdndag': 'Søndag',
    's\ufffdndag': 'søndag',
    'sp\ufffdrsm': 'spørsm',
    '\ufffdt': 'øt',  # Part of words
    '\ufffdl': 'øl',  # Part of words
    '\ufffds': 'ås',  # Part of words like 'ås'

    # Words with æ
    'v\ufffdre': 'være',
    'V\ufffdre': 'Være',
    'L\ufffdr': 'Lær',
    'l\ufffdr': 'lær',
    'l\ufffdre': 'lære',
    's\ufffdrbarheten': 'sårbarheten',  # Actually å
    'Personvernerkl\ufffdring': 'Personvernerklæring',
    'erkl\ufffdring': 'erklæring',
    'n\ufffdr': 'nær',  # Can also be når
    'N\ufffdr': 'Nær',  # Can also be Når
    'n\ufffdrliggende': 'nærliggende',
    'sj\ufffdlden': 'sjælden',
    'n\ufffermest': 'nærmest',
    'n\ufffdrmere': 'nærmere',
    'b\ufffdrende': 'bærende',
    '\ufffdrekjeve': 'Ørekjeve',  # Actually ø
    'Spr\ufffdkvalg': 'Språkvalg',
    'spr\ufffdkvalg': 'språkvalg',

    # Words with å (at word boundary)
    'p\ufffdvirker': 'påvirker',
    'p\ufffdvirke': 'påvirke',
    'p\ufffdvirkning': 'påvirkning',
    'p\ufffdta': 'påta',
    'p\ufffdse': 'påse',
    'p\ufffdpeke': 'påpeke',
    'p\ufffdlegg': 'pålegg',
    'p\ufffdf\ufffdlgende': 'påfølgende',
    '\ufffdr': 'år',
    '\ufffdret': 'året',
    '\ufffdrs': 'års',
    '\ufffdpen': 'åpen',
    '\ufffdpent': 'åpent',
    '\ufffdtte': 'åtte',

    # Additional common patterns
    'unders\ufffdkelse': 'undersøkelse',
    'Unders\ufffdkelse': 'Undersøkelse',
    'unders\ufffdk': 'undersøk',
    's\ufffdrbar': 'sårbar',
    'h\ufffdr': 'hår',
    'H\ufffdr': 'Hår',
    'kn\ufffd': 'knå',
    'l\ufffdne': 'låne',
    'bl\ufffd': 'blå',
    'Bl\ufffd': 'Blå',
    'r\ufffd': 'rå',
    'tr\ufffd': 'trå',

    # Single character at end/start of words (generic)
    '\ufffd': 'å',  # Default to å if no context
}

def fix_file(filepath):
    """Fix encoding issues in a single file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return False, 0

    if '\ufffd' not in content:
        return True, 0  # No issues found

    original = content
    changes = 0

    # Apply replacements in order of length (longest first to avoid partial matches)
    sorted_replacements = sorted(REPLACEMENTS.items(), key=lambda x: -len(x[0]))

    for corrupted, correct in sorted_replacements:
        if corrupted in content:
            count = content.count(corrupted)
            content = content.replace(corrupted, correct)
            changes += count

    # Check if any replacement characters remain
    remaining = content.count('\ufffd')
    if remaining > 0:
        # Find unique remaining patterns for debugging
        patterns = set(re.findall(r'\w*\ufffd\w*', content))
        print(f"  Warning: {remaining} replacement chars remain in {filepath}")
        print(f"  Patterns: {list(patterns)[:10]}")

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True, changes

    return True, 0

def main():
    if len(sys.argv) < 2:
        print("Usage: python fix-encoding.py <directory>")
        sys.exit(1)

    target_dir = sys.argv[1]
    total_files = 0
    total_changes = 0
    files_fixed = 0

    for root, dirs, files in os.walk(target_dir):
        # Skip /en/ directory
        if '/en/' in root or '\\en\\' in root:
            continue
        dirs[:] = [d for d in dirs if d != 'en']

        for f in files:
            if f.endswith('.html'):
                filepath = os.path.join(root, f)
                success, changes = fix_file(filepath)
                total_files += 1
                if changes > 0:
                    files_fixed += 1
                    total_changes += changes
                    print(f"Fixed {filepath}: {changes} replacements")

    print(f"\nSummary: Fixed {files_fixed}/{total_files} files, {total_changes} total replacements")

if __name__ == '__main__':
    main()
