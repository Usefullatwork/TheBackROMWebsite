# Klinikk for alle Website - Project Context

## Quick Start
```bash
# Check current state
git status

# Quality check
npm run spellcheck:hub
```

---

## Site Overview

**Domain:** thebackrom.com (Norwegian) / thebackrom.com/en/ (English)
**Type:** Bilingual healthcare/chiropractic website
**Languages:** Norwegian (root) + English (/en/)

### Page Counts
| Section | Norwegian | English | Total |
|---------|-----------|---------|-------|
| Main pages | 13 | 13 | 26 |
| Condition hubs | 13 | 13 | 26 |
| Sub-articles | ~150 | ~175 | ~325 |
| Services | 10 | 10 | 20 |
| Blog posts | 53 | 53 | 106 |
| FAQ | 24 | - | 24 |
| **Total** | ~263 | ~264 | **~527** |

---

## Site Architecture

```
website/
├── index.html              # Norwegian homepage
├── plager/                 # Norwegian condition hubs (13)
│   ├── korsryggsmerte.html
│   ├── nakkesmerter.html
│   └── [condition]/        # Sub-articles
├── tjeneste/               # Norwegian services (10)
├── blogg/                  # Norwegian blog (53)
├── faq/                    # FAQ pages (24)
│
├── en/                     # ENGLISH SITE
│   ├── index.html
│   ├── conditions/         # Hub pages (13)
│   │   ├── lower-back-pain.html
│   │   ├── neck-pain.html
│   │   └── [condition]/    # Sub-articles
│   ├── services/           # Service pages (10)
│   └── blog/               # Blog posts (53)
│
├── css/                    # Stylesheets
│   ├── main.min.css        # Core styles (v=20260101_v5)
│   ├── hub-article.css     # Hub page template
│   └── index-design.css    # Homepage specific
├── js/                     # JavaScript
├── images/                 # Shared images (used by both languages)
└── docs/                   # Documentation & guides
```

---

## Key File Locations

| Purpose | Path |
|---------|------|
| English hub pages | `/en/conditions/*.html` |
| English sub-articles | `/en/conditions/[condition]/*.html` |
| Norwegian source (gold standard) | `/plager/*.html` |
| Hub page CSS | `/css/hub-article.css` |
| Sitemap | `/sitemap.xml` |
| Robots | `/robots.txt` |

### Norwegian → English Mapping
| Norwegian | English |
|-----------|---------|
| `/plager/korsryggsmerte.html` | `/en/conditions/lower-back-pain.html` |
| `/plager/nakkesmerter.html` | `/en/conditions/neck-pain.html` |
| `/plager/hodepine.html` | `/en/conditions/headache.html` |
| `/plager/skuldersmerter.html` | `/en/conditions/shoulder-pain.html` |
| `/plager/knesmerter.html` | `/en/conditions/knee-pain.html` |
| `/plager/hofte-og-bekkensmerter.html` | `/en/conditions/hip-pain.html` |
| `/plager/kjevesmerte.html` | `/en/conditions/jaw-pain.html` |
| `/plager/fotsmerte.html` | `/en/conditions/foot-pain.html` |
| `/plager/albue-arm.html` | `/en/conditions/arm-pain.html` |
| `/plager/brystryggsmerter.html` | `/en/conditions/thoracic-pain.html` |
| `/plager/svimmelhet.html` | `/en/conditions/dizziness.html` |
| `/plager/idrettsskader.html` | `/en/conditions/sports-injuries.html` |

---

## Documentation

| File | Purpose |
|------|---------|
| `docs/TODO.md` | Current tasks and progress |
| `docs/HUB-PAGE-TEMPLATE.html` | Gold standard hub page template |
| `docs/BLOG-POST-CREATION-GUIDE.md` | How to create blog posts |
| `docs/IMAGE-OPTIMIZATION-GUIDE.md` | Image optimization guide |
| `docs/VIDEO-TEMPLATE.md` | Video content template |

---

## Quality Tools

```bash
# Spell check hub pages
npm run spellcheck:hub

# Spell check all English
npm run spellcheck

# Validate page structure
node scripts/validate-page.js [file]

# Grammar check
node scripts/grammar-check.js [file]
```

### Quality Gates (Before Commit)
- Validation: 35+ passed, 0 failed
- Spell check: 0 issues
- File size: 25-50KB

---

## Git Workflow

```bash
# Check status
git status

# Stage and commit
git add .
git commit -m "Description of changes"

# Push (auto-deploys to Hostinger)
git push
```

---

## CSS Version
All pages should use: `main.min.css?v=20260101_v5`

## Social Media
- Instagram: @chiro_mads
- Facebook: profile ID 61551540184975
- YouTube: @TheBackROM

---

## Common Tasks

### Adding a new condition sub-article
1. Copy existing sub-article as template
2. Translate content from Norwegian source
3. Update internal links
4. Add to hub page's hub-subnav
5. Add to sitemap.xml
6. Run spell check and validation

### Updating hub page
1. Read Norwegian source for content
2. Use HUB-PAGE-TEMPLATE.html as reference
3. Ensure all sections present (hero, summary, subnav, numbered sections, FAQ, sources)
4. Run validation

### SEO Checklist
- Title: <60 characters
- Meta description: 150-160 characters
- hreflang tags linking EN ↔ NO
- Schema markup (MedicalWebPage, FAQPage)
- Open Graph tags
