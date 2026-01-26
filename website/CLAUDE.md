# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Site:** TheBackROM (thebackrom.com) - Bilingual chiropractic/healthcare website
**Languages:** Norwegian (root `/`) + English (`/en/`)
**Pages:** ~527 total (263 Norwegian + 264 English)
**Deploy:** Auto-deploys to Hostinger on git push

## Commands

```bash
# Quality checks (run before committing)
npm run spellcheck:hub     # Spell check English hub pages
npm run spellcheck         # Spell check all English content
npm run validate           # Validate page structure (auto-detects profile)
npm run audit              # Full quality check (spell + validate + sitemap + images + links)

# Individual validators
node scripts/validate-page.js [file]    # Validate single file
node scripts/check-links.js [directory] # Check for broken links
node scripts/check-images.js [directory] # Verify image paths
node scripts/grammar-check.js [file]    # Grammar check

# Full site CSS scan
powershell -File scripts/scan-full-site.ps1
```

## Architecture

```
website/
├── index.html                    # Norwegian homepage
├── plager/                       # Norwegian condition hubs (13)
│   ├── korsryggsmerte.html       # ★ GOLD STANDARD hub page
│   └── [condition]/              # Sub-articles (~150)
│       └── skiveprolaps.html     # ★ GOLD STANDARD sub-article
├── tjeneste/                     # Norwegian services (10)
├── blogg/                        # Norwegian blog (53)
├── faq/                          # FAQ pages (24)
│
├── en/                           # ENGLISH MIRROR
│   ├── conditions/               # Hub pages (13) + sub-articles (~175)
│   ├── services/                 # Service pages (10)
│   └── blog/                     # Blog posts (53)
│
├── css/
│   ├── main.min.css?v=20260101_v5  # Core styles (ALWAYS use this version)
│   ├── hub-article.css             # Hub page components
│   └── index-design.css            # Homepage specific
│
├── js/                           # All scripts have .min.js versions
├── scripts/                      # Build/validation tools
└── docs/                         # Documentation guides
```

## Key Documentation

| File | Purpose |
|------|---------|
| `css/STYLE-GUIDE.md` | CSS class mapping, component reference, gold standards |
| `docs/HUB-PAGE-TEMPLATE.html` | Hub page template |
| `docs/BLOG-POST-CREATION-GUIDE.md` | Blog post creation |
| `docs/IMAGE-OPTIMIZATION-GUIDE.md` | Image optimization |

## Norwegian ↔ English Mapping

| Norwegian | English |
|-----------|---------|
| `/plager/korsryggsmerte.html` | `/en/conditions/lower-back-pain.html` |
| `/plager/nakkesmerter.html` | `/en/conditions/neck-pain.html` |
| `/plager/hodepine.html` | `/en/conditions/headache.html` |
| `/plager/skuldersmerter.html` | `/en/conditions/shoulder-pain.html` |
| `/plager/knesmerter.html` | `/en/conditions/knee-pain.html` |
| `/plager/hofte-og-bekkensmerter.html` | `/en/conditions/hip-pain.html` |
| `/plager/kjevesmerte.html` | `/en/conditions/jaw-pain.html` |

## Validation Profiles

Auto-detected by file path:

| Profile | Path Pattern | Use |
|---------|--------------|-----|
| `nb-blog-article` | `/blogg/` | Norwegian blog posts |
| `hub-article` | `/en/conditions/*.html` | English hub pages |
| `sub-article` | `/en/conditions/*/` | English sub-articles |
| `basic-page` | Other | Contact, about, etc. |

## Quality Gates

Before committing:
- Validation: 35+ passed, 0 failed (warnings OK)
- Spell check: 0 issues
- File size: 20-50KB (blogs), 25-50KB (hubs)

## CSS Architecture

### Required Stylesheets

```html
<!-- Hub pages in /plager/ -->
<link rel="stylesheet" href="../css/main.min.css?v=20260101_v5">
<link rel="stylesheet" href="../css/hub-article.css">

<!-- Sub-articles in /plager/[area]/ -->
<link rel="stylesheet" href="../../css/main.min.css?v=20260101_v5">
<link rel="stylesheet" href="../../css/hub-article.css">
```

### Color Variables

```css
:root {
  --hub-primary: #1a5f7a;   /* Main teal */
  --hub-dark: #0d3d4d;      /* Dark teal */
  --hub-red: #dc2626;       /* Red flags */
  --hub-green: #059669;     /* Success */
  --hub-blue: #2563eb;      /* Info */
  --hub-orange: #ea580c;    /* CTA */
}
```

### Critical Class Names

Use these (defined in `hub-article.css`):

| Component | Class |
|-----------|-------|
| Summary card | `.premium-summary-card` |
| Related navigation | `.hub-subnav` + `.hub-subnav__grid` + `.hub-subnav__card` |
| Warning alert | `.red-flag-alert` |
| Section header | `.section-header` + `.section-number` |
| Sidebar | `.hub-sidebar` (NOT `.hub-sidenav`) |
| CTA button | `.button` (NOT `.cta-button`) |

## Page Structure Pattern

```html
<main class="page">
  <!-- Hero OUTSIDE hub-wrapper -->
  <section class="hub-hero">
    <div class="hub-hero__container">
      <h1>Title</h1>
      <p class="hub-hero__subtitle">Subtitle | Kiropraktor Mads Finstad</p>
    </div>
  </section>

  <div class="hub-wrapper">
    <article class="hub-main">
      <section class="hub-intro">...</section>
      <section class="hub-section" id="s1">
        <div class="section-header">
          <span class="section-number">1</span>
          <h2>Section Title</h2>
        </div>
        <p>Content...</p>
      </section>
    </article>
    <aside class="hub-sidebar">
      <div class="hub-conversion-card">...</div>
      <nav class="hub-toc-card">...</nav>
    </aside>
  </div>
</main>
```

## FAQ Schema

Health sites qualify for FAQ rich snippets. Add FAQPage schema to pages with inline FAQs:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Answer text..."
      }
    }
  ]
}
</script>
```

### FAQ Schema Status

- [x] Knee (EN) - 12 articles completed
- [ ] Knee (NO), Back, Neck, Shoulder, Hip, Foot - pending

## SEO Checklist

- Title: <60 characters
- Meta description: 150-160 characters
- hreflang tags linking EN ↔ NO
- Schema markup (MedicalWebPage, FAQPage)
- Open Graph tags

## Common Tasks

### Adding a new condition sub-article
1. Copy existing sub-article as template (use gold standard)
2. Translate content from Norwegian source
3. Update internal links
4. Add to hub page's `.hub-subnav`
5. Add to `sitemap.xml`
6. Run `npm run validate` and `npm run spellcheck`

### Updating hub page
1. Read Norwegian source for content
2. Reference gold standard (`plager/korsryggsmerte.html`)
3. Ensure all sections present: hero, summary, subnav, numbered sections, FAQ, sources
4. Run validation

## Content De-Duplication

Single source for statistics/facts, brief references elsewhere:

| Content | Primary Location | Others Link To |
|---------|------------------|----------------|
| Treatment success stats | S6 Behandling | Summary card (brief) |
| MR/imaging stats | S4 Diagnostikk | Summary card (brief) |
| Red flags | S7 Røde flagg | Intro alert (link) |

## Known Issues / Pending Work

### Files Needing Restructure
- `/plager/kjeve/` - 21 sub-articles need hub-article.css + correct structure

### FAQ Schema Pending
- Norwegian knee articles
- All back, neck, shoulder, hip, foot articles (both languages)

## Social Media

- Instagram: @chiro_mads
- Facebook: 61551540184975
- YouTube: @TheBackROM
