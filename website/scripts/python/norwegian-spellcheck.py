#!/usr/bin/env python3
"""
Norwegian Character Encoding Spellchecker
Scans HTML files for common Norwegian character encoding issues where
special characters (ø, å, æ) are missing.

Usage:
    python norwegian-spellcheck.py [--fix]

Options:
    --fix    Automatically fix the issues (creates backup first)
"""

import os
import re
import sys
import shutil
from pathlib import Path
from datetime import datetime

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# Common Norwegian word patterns that often have encoding issues
# Format: (pattern_to_find, correct_replacement, context_description)
PATTERNS = [
    # ROUND 4 - Comprehensive quality check patterns (January 2026)
    # Common sentence patterns where 'a' should be 'å'
    (r'mulig a:', 'mulig å:', 'possible to:'),
    (r'mulig a ', 'mulig å ', 'possible to'),
    (r'viktig a ', 'viktig å ', 'important to'),
    (r'vanskelig a ', 'vanskelig å ', 'difficult to'),
    (r'lett a ', 'lett å ', 'easy to'),
    (r'bedre a ', 'bedre å ', 'better to'),
    (r'begynne a ', 'begynne å ', 'begin to'),
    (r'fortsette a ', 'fortsette å ', 'continue to'),
    (r'prove a ', 'prøve å ', 'try to'),
    (r'unnga a ', 'unngå å ', 'avoid to'),
    (r'slutte a ', 'slutte å ', 'stop to'),
    (r'anbefale a ', 'anbefale å ', 'recommend to'),

    # Environment/miljo patterns
    (r'\bmiljoer\b', 'miljøer', 'environments'),
    (r'\bmiljo\b', 'miljø', 'environment'),
    (r'\bMiljo\b', 'Miljø', 'Environment'),

    # Learning patterns
    (r'\blare\b', 'lære', 'learn'),
    (r'\bLare\b', 'Lære', 'Learn'),
    (r'\blarer\b', 'lærer', 'learns/teacher'),
    (r'\blarere\b', 'lærere', 'teachers'),
    (r'\blart\b', 'lært', 'learned'),

    # Understand patterns
    (r'\bforsta\b', 'forstå', 'understand'),
    (r'\bForsta\b', 'Forstå', 'Understand'),
    (r'\bforstar\b', 'forstår', 'understands'),
    (r'\bforstatt\b', 'forstått', 'understood'),

    # Seek/search patterns
    (r'\boppsoke\b', 'oppsøke', 'seek out'),
    (r'\bOppsoke\b', 'Oppsøke', 'Seek out'),
    (r'\boppsok\b', 'oppsøk', 'seek'),
    (r'\bOpsok\b', 'Oppsøk', 'Seek'),

    # Common typos (non-Norwegian character issues)
    (r'\bsekundare\b', 'sekundære', 'secondary'),
    (r'\bvestibulare\b', 'vestibulære', 'vestibular'),
    (r'\bVestibulare\b', 'Vestibulære', 'Vestibular'),
    (r'\bves\btibulaer\b', 'vestibulær', 'vestibular'),

    # ROUND 3 - Final deep dive fixes
    (r'nær det Utføres', 'når det utføres', 'when performed'),
    (r'nær det utføres', 'når det utføres', 'when performed'),
    (r'\boppnær\b', 'oppnår', 'achieve'),
    (r'\bOppnær\b', 'Oppnår', 'Achieve'),

    # ROUND 2 - Additional errors found
    (r'\bjegse\b', 'vise', 'show'),
    (r'\bjegses\b', 'vises', 'is shown'),
    (r'\bFa hjelp\b', 'Få hjelp', 'get help'),
    (r'\boresus\b', 'øresus', 'tinnitus'),
    (r'\bOresus\b', 'Øresus', 'Tinnitus'),
    (r'\boresymptomer\b', 'øresymptomer', 'ear symptoms'),
    (r'\bOresymptomer\b', 'Øresymptomer', 'Ear symptoms'),
    (r'\boresmerter\b', 'øresmerter', 'ear pain'),
    (r'\bOresmerter\b', 'Øresmerter', 'Ear pain'),
    (r'\bhorselstap\b', 'hørselstap', 'hearing loss'),
    (r'\bHorselstap\b', 'Hørselstap', 'Hearing loss'),
    (r'\bore-nese-hals\b', 'øre-nese-hals', 'ENT'),
    (r'\bOre-nese-hals\b', 'Øre-nese-hals', 'ENT'),
    (r'\bPa en\b', 'På en', 'on a'),
    (r'\bovre\b', 'øvre', 'upper'),
    (r'\bOvre\b', 'Øvre', 'Upper'),
    (r'\bapner\b', 'åpner', 'opens'),
    (r'\bApner\b', 'Åpner', 'Opens'),
    (r' ore\b', ' øre', 'ear'),
    (r'\btett ore\b', 'tett øre', 'blocked ear'),

    # HIGH PRIORITY - Common errors found in deep scan
    (r'\bIfolge\b', 'Ifølge', 'according to'),
    (r'\bifolge\b', 'ifølge', 'according to'),
    (r'\bSvaert\b', 'Svært', 'very'),
    (r'\bsvaert\b', 'svært', 'very'),
    (r'\bsvert\b', 'svært', 'very'),
    (r'\bSvert\b', 'Svært', 'very'),
    (r'\boyet\b', 'øyet', 'the eye'),
    (r'\boyene\b', 'øynene', 'the eyes'),
    (r'\bnoytral\b', 'nøytral', 'neutral'),
    (r'\bNoytral\b', 'Nøytral', 'Neutral'),
    (r'\bSekundaer\b', 'Sekundær', 'secondary'),
    (r'\bsekundaer\b', 'sekundær', 'secondary'),
    (r'\bSekundaere\b', 'Sekundære', 'secondary (plural)'),
    (r'\bsekundaere\b', 'sekundære', 'secondary (plural)'),
    (r'\bPrimaer\b', 'Primær', 'primary'),
    (r'\blaret\b', 'låret', 'the thigh'),
    (r'\bhoeyt\b', 'høyt', 'high'),
    (r'\btoeying\b', 'tøying', 'stretching'),
    (r'\btoeye\b', 'tøye', 'stretch'),
    (r'\boeker\b', 'øker', 'increases'),
    (r'\bboeye\b', 'bøye', 'bend'),
    (r'\bmoeter\b', 'møter', 'meets'),
    (r'\btoey\b', 'tøy', 'stretch'),
    (r'\bfoelelse\b', 'følelse', 'feeling'),
    (r'\bfores\b', 'føres', 'is led'),
    (r'\blosne\b', 'løsne', 'loosen'),
    (r'\bmalet\b', 'målet', 'the goal'),
    (r'\bMalet\b', 'Målet', 'The goal'),
    (r'\bfolger\b', 'følger', 'follows'),
    (r'\bFoller\b', 'Følger', 'Follows'),
    (r'\bpalitelig\b', 'pålitelig', 'reliable'),
    (r'\bPalitelig\b', 'Pålitelig', 'Reliable'),
    (r'\butfores\b', 'utføres', 'is performed'),
    (r'\bUtfores\b', 'Utføres', 'Is performed'),
    (r'\bvaer\b', 'vær', 'be (imperative)'),
    (r'\bVaer\b', 'Vær', 'Be (imperative)'),
    (r'\bhoyeste\b', 'høyeste', 'highest'),
    (r'\bHoyeste\b', 'Høyeste', 'Highest'),
    (r'>Ga til\b', '>Gå til', 'Go to (link)'),
    (r'\bblottvevet\b', 'bløtvevet', 'soft tissue'),
    (r'\bblottvev\b', 'bløtvev', 'soft tissue'),

    # ø patterns (o → ø)
    (r'\bboye\b', 'bøye', 'bend'),
    (r'\bboyer\b', 'bøyer', 'bends'),
    (r'\bboyes\b', 'bøyes', 'is bent'),
    (r'\bboyd\b', 'bøyd', 'bent'),
    (r'\bboyde\b', 'bøyde', 'bent (plural)'),
    (r'\bhofteboyer', 'hoftebøyer', 'hip flexor'),
    (r'\bboyesenen\b', 'bøyesenen', 'flexor tendon'),
    (r'\bhoye\b', 'høye', 'high (plural)'),
    (r'\bhoyt\b', 'høyt', 'high'),
    (r'\bhoyere\b', 'høyere', 'higher'),
    (r'\bhoyden\b', 'høyden', 'the height'),
    (r'\bHoye\b', 'Høye', 'High (plural)'),
    (r'\bHoyest\b', 'Høyest', 'Highest'),
    (r'\bforhoyet\b', 'forhøyet', 'elevated'),
    (r'\bForhoyet\b', 'Forhøyet', 'Elevated'),
    (r'\bForhoyede\b', 'Forhøyede', 'Elevated (plural)'),
    (r'\blose\b', 'løse', 'loose'),
    (r'\bLose\b', 'Løse', 'Loose'),
    (r'\blosner\b', 'løsner', 'loosens'),
    (r'\blosning\b', 'løsning', 'solution'),
    (r'\boke\b', 'øke', 'increase'),
    (r'\boker\b', 'øker', 'increases'),
    (r'\bOker\b', 'Øker', 'Increases'),
    (r'\bokt\b', 'økt', 'increased'),
    (r'\bOkt\b', 'Økt', 'Increased'),
    (r'\bokter\b', 'økter', 'sessions'),
    (r'\bnoye\b', 'nøye', 'careful'),
    (r'\bnoyer\b', 'nøyer', 'is careful'),
    (r'\bblodarer\b', 'blodårer', 'blood vessels'),
    (r'\bmisnoye\b', 'misnøye', 'dissatisfaction'),
    (r'\bSok\b', 'Søk', 'Search'),
    (r'\bsovn\b', 'søvn', 'sleep'),
    (r'\bSovn\b', 'Søvn', 'Sleep'),
    (r'\bstotte\b', 'støtte', 'support'),
    (r'\bstorrelse\b', 'størrelse', 'size'),
    (r'\brodhet\b', 'rødhet', 'redness'),
    (r'\bmotes\b', 'møtes', 'meet'),
    (r'\bryggsoylen\b', 'ryggsøylen', 'the spine'),
    (r'\bskivehoyden\b', 'skivehøyden', 'disc height'),
    (r'\bhjorne\b', 'hjørne', 'corner'),
    (r'\boret\b', 'øret', 'the ear'),

    # mønster (pattern) compound words
    (r'\bmonster\b', 'mønster', 'pattern'),
    (r'\bmonsteret\b', 'mønsteret', 'the pattern'),
    (r'\bgangmonster\b', 'gangmønster', 'gait pattern'),
    (r'\bsmertemonster\b', 'smertemønster', 'pain pattern'),
    (r'\bsymptommonster\b', 'symptommønster', 'symptom pattern'),
    (r'\bnervemonster\b', 'nervemønster', 'nerve pattern'),
    (r'\bpustemonster\b', 'pustemønster', 'breathing pattern'),
    (r'\bdermatom-monster\b', 'dermatom-mønster', 'dermatome pattern'),
    (r'\bbelastningsmonster\b', 'belastningsmønster', 'load pattern'),
    (r'\btidsmonster\b', 'tidsmønster', 'time pattern'),
    (r'\bhanske-monster\b', 'hanske-mønster', 'glove pattern'),
    (r'\bstrompe-hanske-monster\b', 'strømpe-hanske-mønster', 'stocking-glove pattern'),
    (r'\barsaksmonster\b', 'årsaksmønster', 'cause pattern'),
    (r'\bStralemonsteret\b', 'Strålemønsteret', 'radiation pattern'),
    (r'\bbukkehorn-monster\b', 'bukkehorn-mønster', 'rams horn pattern'),

    # å patterns (a → å)
    (r'\barlig\b', 'årlig', 'yearly'),
    (r'\bArlig\b', 'Årlig', 'Yearly'),
    (r'\barene\b', 'årene', 'the years'),
    (r'\barsaken\b', 'årsaken', 'the cause'),
    (r'\bArsaken\b', 'Årsaken', 'The cause'),
    (r'\barsak\b', 'årsak', 'cause'),
    (r'(\d+)\s+ar\b', r'\1 år', 'X years'),
    (r'(\d+)-ar\b', r'\1-år', 'X-year'),
    (r'(\d+)-ars\b', r'\1-års', 'X-year (genitive)'),
    (r'\bgar\b', 'går', 'goes'),
    (r'\bsta\b', 'stå', 'stand'),
    (r'\bSta\b', 'Stå', 'Stand'),
    (r'\bgatt\b', 'gått', 'gone'),
    (r'\bgjennomgatt\b', 'gjennomgått', 'gone through'),
    (r'\bstatt\b', 'stått', 'stood'),
    (r'\bnar\b', 'når', 'when'),
    (r'\bNar\b', 'Når', 'When'),
    (r'\bfar\b', 'får', 'gets'),
    (r'\bforer\b', 'fører', 'leads'),
    (r'\bforst\b', 'først', 'first'),
    (r'\bforste\b', 'første', 'first'),
    (r'\bForste\b', 'Første', 'First'),
    (r'\bstorst\b', 'størst', 'biggest'),
    (r'\bhjornesteinen\b', 'hjørnesteinen', 'cornerstone'),
    (r'\bStralemonsteret\b', 'Strålemønsteret', 'radiation pattern'),
    (r'\bpafolgende\b', 'påfølgende', 'following'),
    (r'\bsamarbeidspartnere\b', 'samarbeidspartnere', 'partners'),
    (r'\bmalrettet\b', 'målrettet', 'targeted'),
    (r'\bpatale\b', 'påtale', 'prosecution'),
    (r'\bsarbar\b', 'sårbar', 'vulnerable'),
    (r'\bsarbart\b', 'sårbart', 'vulnerable'),

    # æ patterns (ae/e → æ)
    (r'\bvaert\b', 'vært', 'been'),
    (r'\bvaere\b', 'være', 'be'),
    (r'\bnaer\b', 'nær', 'near'),
    (r'\bNaer\b', 'Nær', 'Near'),
    (r'\bbaer\b', 'bær', 'berries'),
    (r'\btaer\b', 'tær', 'toes'),
    (r'\bhaeler\b', 'hæler', 'heels'),
    (r'\bhael\b', 'hæl', 'heel'),
    (r'\bhaelhoyde\b', 'hælhøyde', 'heel height'),
    (r'\blaere\b', 'lære', 'learn'),
    (r'\blaerer\b', 'lærer', 'teacher/teaches'),
    (r'\blaerere\b', 'lærere', 'teachers'),
    (r'\boyebevegelser\b', 'øyebevegelser', 'eye movements'),
    (r'\boye\b', 'øye', 'eye'),
    (r'\bprimaer\b', 'primær', 'primary'),
    (r'\bprimaerhelsepersonell\b', 'primærhelsepersonell', 'primary healthcare'),
    (r'\binnebar\b', 'innebær', 'entails'),
    (r'\binnebarer\b', 'innebærer', 'entails'),
    (r'\bnaerliggende\b', 'nærliggende', 'nearby'),
    (r'\bsaerlig\b', 'særlig', 'especially'),
    (r'\bSaerlig\b', 'Særlig', 'Especially'),
]

def find_issues(file_path, content):
    """Find all encoding issues in the content."""
    issues = []
    for pattern, replacement, description in PATTERNS:
        for match in re.finditer(pattern, content, re.IGNORECASE if pattern[0] != '\\' or pattern[1].islower() else 0):
            # Get line number
            line_num = content[:match.start()].count('\n') + 1
            # Get context (surrounding text)
            start = max(0, match.start() - 30)
            end = min(len(content), match.end() + 30)
            context = content[start:end].replace('\n', ' ')

            issues.append({
                'file': file_path,
                'line': line_num,
                'found': match.group(),
                'replacement': replacement,
                'description': description,
                'context': context,
                'start': match.start(),
                'end': match.end()
            })
    return issues

def fix_issues(content, issues):
    """Apply fixes to the content."""
    # Sort issues by position in reverse order to avoid position shifts
    sorted_issues = sorted(issues, key=lambda x: x['start'], reverse=True)

    for issue in sorted_issues:
        # Preserve case when replacing
        found = issue['found']
        replacement = issue['replacement']

        # Handle case matching
        if found.isupper():
            replacement = replacement.upper()
        elif found[0].isupper():
            replacement = replacement[0].upper() + replacement[1:]

        content = content[:issue['start']] + replacement + content[issue['end']:]

    return content

def scan_directory(directory, fix=False):
    """Scan all HTML files in the directory."""
    total_issues = 0
    files_with_issues = 0

    print(f"\n{'='*60}")
    print(f"Norwegian Character Encoding Spellchecker")
    print(f"{'='*60}")
    print(f"Scanning: {directory}")
    print(f"Mode: {'FIX' if fix else 'SCAN ONLY'}")
    print(f"{'='*60}\n")

    # Directories to exclude (English content)
    exclude_dirs = {'en', 'node_modules', '.norwegian-spellcheck-backup'}

    for root, dirs, files in os.walk(directory):
        # Skip excluded directories
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)

                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                except UnicodeDecodeError:
                    print(f"Warning: Could not read {file_path} (encoding issue)")
                    continue

                issues = find_issues(file_path, content)

                if issues:
                    files_with_issues += 1
                    total_issues += len(issues)

                    rel_path = os.path.relpath(file_path, directory)
                    print(f"\n{rel_path} ({len(issues)} issues):")
                    print("-" * 40)

                    for issue in issues[:10]:  # Show first 10 issues per file
                        print(f"  Line {issue['line']}: '{issue['found']}' -> '{issue['replacement']}' ({issue['description']})")
                        print(f"    Context: ...{issue['context']}...")

                    if len(issues) > 10:
                        print(f"  ... and {len(issues) - 10} more issues")

                    if fix:
                        # Create backup
                        backup_dir = os.path.join(directory, '.norwegian-spellcheck-backup')
                        os.makedirs(backup_dir, exist_ok=True)
                        backup_path = os.path.join(backup_dir, f"{file}.{datetime.now().strftime('%Y%m%d_%H%M%S')}.bak")
                        shutil.copy2(file_path, backup_path)

                        # Apply fixes
                        fixed_content = fix_issues(content, issues)
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(fixed_content)
                        print(f"  -> Fixed! Backup saved to: {backup_path}")

    print(f"\n{'='*60}")
    print(f"SUMMARY")
    print(f"{'='*60}")
    print(f"Total issues found: {total_issues}")
    print(f"Files with issues: {files_with_issues}")

    if not fix and total_issues > 0:
        print(f"\nTo fix these issues, run: python norwegian-spellcheck.py --fix")
    elif fix and total_issues > 0:
        print(f"\nAll issues have been fixed. Backups saved in .norwegian-spellcheck-backup/")

    return total_issues

def main():
    # Get the directory of this script
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # Check for --fix flag
    fix = '--fix' in sys.argv

    # Scan the directory
    total_issues = scan_directory(script_dir, fix=fix)

    return 0 if total_issues == 0 else 1

if __name__ == '__main__':
    sys.exit(main())
