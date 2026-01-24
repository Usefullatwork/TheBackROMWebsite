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

---

## Visual Design Audit Findings (Jan 2026)

Reference patterns for maintaining consistent styling across site pages.

### CSS Patterns (hub-article.css)

#### 1. Sticky Sidebar Pattern
```css
.hub-sidebar {
  position: sticky;
  top: 90px;
  align-self: start;
  max-height: calc(100vh - 110px);
}
```
- Keeps sidebar visible as user scrolls
- Requires `overflow: visible` on parent wrapper

#### 2. Alternating Section Backgrounds
```css
.hub-section:nth-child(even) {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 12px;
  margin: 0.5rem 0;
}
```
- Creates visual rhythm between sections
- Uses subtle gray (#f8fafc) for alternating sections

#### 3. Info Box Icons (CSS-based)
```css
.info-box::before { content: 'ℹ️'; }
.decision-helper::before { content: '🤔'; }
.insight-card.summary::before { content: '💡'; }
.insight-card.warning::before { content: '⚠️'; }
.insight-card.tip::before { content: 'ℹ️'; }
.important-finding::before { content: '📌'; }
.tldr-box::before { content: '💡'; }
```
- Icons positioned absolutely inside padded boxes
- Makes info boxes look designed, not just highlighted text

#### 4. Image Placeholder Structures
Ready-to-use placeholder classes for when images are not yet available:

| Class | Purpose | Icon |
|-------|---------|------|
| `.anatomy-placeholder` | Anatomical illustrations | 🦴 |
| `.exercise-grid-placeholder` | Exercise demonstration grid | 🏃 |
| `.exercise-item-placeholder` | Individual exercise items | 🏃 |
| `.pain-map-placeholder` | Pain location diagrams | 📍 |
| `.condition-icon-placeholder` | Condition card icons | (emoji) |

#### 5. Mid-Content CTA Banner
```html
<div class="mid-content-cta">
  <div class="mid-content-cta__text">
    <h4 class="mid-content-cta__title">Ready to start?</h4>
    <p class="mid-content-cta__subtitle">Get personalized help</p>
  </div>
  <a href="#" class="mid-content-cta__button">Book appointment</a>
</div>
```
- Full-width teal gradient banner
- Breaks up long content sections
- Prevents CTA getting lost when scrolling

### Common Fixes Reference

#### Broken Characters
- Fix `�` → `-` (encoding issue from copy-paste)

#### URL Showing in Hero/Header Sections
- **Affected pages:** FAQ pages (e.g., `/faq/knee-pain-faq.html`), blog posts
- **Symptom:** Page URL displays visibly above the h1 title in hero section
- **Root cause:** CSS rule `a[href]::after { content: " (" attr(href) ")"; }`
- **Location:** Found in `main.css:8631-8634` (inside @media print - should be OK)
- **TODO:** Check if same rule exists OUTSIDE @media print in:
  - `pages-combined.css` / `pages-combined.min.css`
  - `conditions-combined.css` / `conditions-combined.min.css`
- **Fix:** Ensure `attr(href)` rules are only inside `@media print {}` block
- **Alternative fix:** Add CSS to hide URLs in hero: `.main_pages a::after { content: none !important; }`

#### Class Naming Consistency
- Use `stat-card` (preferred) or `stat-item` (both work)
- CSS supports both for backwards compatibility

### Color Variables (hub-article.css)
```css
--hub-primary: #1a5f7a;      /* Main teal */
--hub-primary-dark: #0f4f68; /* Darker teal */
--hub-dark: #0d3d4d;         /* Darkest teal */
--hub-accent: #F26522;       /* Orange CTA */
--hub-accent-hover: #e05a1a; /* Orange hover */
--hub-red: #ef4444;          /* Red flags */
--hub-green: #22c55e;        /* Success */
--hub-blue: #3b82f6;         /* Info */
--hub-light-bg: #f8fafc;     /* Section backgrounds */
```

---

## Location-Section Design Pattern (Jan 2026) ⭐

**Status:** PREFERRED pattern for all sub-sections with numbered items

Dark header with green numbered badge - use for:
- Diagnose-tabeller per smertelokasjon
- Test-seksjoner (Sokke-testen, Ett-bens-testen, etc.)
- Selvhjelp-bokser (Slik bør du sove, Sitte og stå)
- Årsaks-bokser (GTPS, Artrose, FAI)

### HTML Structure
```html
<div class="location-section" id="unique-id">
  <div class="location-header">
    <span class="section-number" style="background: #059669;">1</span>
    <h4>Section Title Here</h4>
  </div>
  <div class="location-content">
    <p>Content goes here...</p>
  </div>
</div>
```

### Required CSS (add to page inline styles or hub-article.css)
```css
.location-header {
  background: var(--hub-dark);
  color: #fff;
  padding: 16px 24px;
  border-radius: 12px 12px 0 0;
  display: flex;
  align-items: center;
  gap: 12px;
}
.location-header h3, .location-header h4 {
  margin: 0;
  color: #fff !important;
  font-size: 18px;
}
.location-section {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 32px;
}
.location-content {
  padding: 24px;
}
.section-number {
  background: #059669;  /* GREEN badge */
  color: white;
  min-width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}
```

### With Diagnosis Table
```html
<div class="location-section" id="lateral">
  <div class="location-header">
    <span class="section-number" style="background: #059669;">1</span>
    <h4>Smerter på UTSIDEN av hoften</h4>
  </div>
  <div class="comparison-card">
    <table class="diagnosis-table">
      <thead>
        <tr>
          <th>Tilstand</th>
          <th>Nøkkelsymptomer</th>
          <th>Tester</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <span class="diagnosis-name">GTPS</span>
            <span class="diagnosis-likelihood common">SVÆRT VANLIG</span>
          </td>
          <td>Symptom text...</td>
          <td>Test info...</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

### Likelihood Badge Colors
```css
.diagnosis-likelihood.common { background: #dcfce7; color: #166534; }
.diagnosis-likelihood.uncommon { background: #f3f4f6; color: #4b5563; }
.diagnosis-likelihood.rare { background: #fee2e2; color: #991b1b; }
```

### Pages Using This Pattern
- `/plager/hofte-og-bekkensmerter.html` - S1 (4 smertetyper), S2 (3 tester), S5 (2 selvhjelp)
- `/en/conditions/hip-pain.html` - S1 (3 smertetyper), S2 (3 årsaker), S4 (2 selvhjelp)

---

## Content De-Duplication Rules (Jan 2026)

### Problem
Same statistics/facts repeated multiple times on hub pages leads to:
- Reader fatigue
- SEO keyword stuffing concerns
- Maintenance burden (updating same fact in 5 places)

### Solution: Single Source + References

| Content Type | Primary Location | Other Locations |
|-------------|------------------|-----------------|
| LEAP study / 78% success | S6 Behandling | Summary card (brief), Intro (brief) |
| MR stats (69%, 37%) | S4 MR-fellen | Summary card (brief), diagnosis tables (in context) |
| Kortison effectiveness | S6 Behandling | FAQ → link to S6 |
| Red flags | S7 Røde flagg | Intro alert → link to S7 |

### FAQ Simplification Pattern
Instead of repeating full explanations in FAQ:
```html
<!-- OLD (duplicates content) -->
<p>Full explanation with all statistics and study references...</p>

<!-- NEW (links to primary source) -->
<p>Brief answer here. <a href="#s6">Read more about treatment</a>.</p>
```

### Implemented On
- [x] Norwegian hip hub - FAQ kortison, FAQ MR, S1 GTPS prognosis
- [x] English hip hub - FAQ cortisone, S1 GTPS prognosis

### Page Structure Checklist
Hub pages should include (in order):
1. `.hub-hero` - Teal gradient, centered text
2. `.hub-intro` with `.intro-text` and `.premium-summary-card`
3. `.hub-subnav` - Condition navigation cards
4. `.red-flag-alert` - Safety warning
5. `.hub-section` (numbered) - Main content
6. `.hub-cta` - Bottom call-to-action
7. `.related-box` - Related articles
8. `.hub-sidebar` with `.hub-conversion-card` + `.hub-toc-card`

---

## FAQ Strategy (Jan 2026)

### Key Finding: Health Sites Qualify for FAQ Rich Results
Since August 2023, Google restricted FAQ rich snippets to **authoritative government and health websites**. As a chiropractic/medical website, this site qualifies where most commercial sites don't.

### Strategy: Hybrid Approach
Inline FAQs for quick answers + Dedicated pages for comprehensive coverage.

### Implementation Rules

#### Sub-Articles (e.g., knee-osteoarthritis.html)
1. **Keep 3-5 inline FAQs** - Most relevant to that specific condition
2. **ADD FAQPage schema** in `<head>` - Currently missing on most
3. **ADD link to dedicated FAQ** at end of FAQ section

#### Hub Pages (e.g., knee-pain.html)
1. **Keep 5 inline FAQs** with schema
2. **ADD visible link to FAQ page** in HTML (not just schema)

#### Dedicated FAQ Pages (/faq/*.html)
1. Keep as primary resource (10-15 comprehensive Q&As)
2. ADD "Related Articles" section linking back
3. Ensure no duplicate questions with hub/sub-articles

### FAQ Schema Template
Add this JSON-LD in `<head>` section of any page with inline FAQs:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text here?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Answer text here..."
      }
    }
  ]
}
</script>
```

### FAQ Cross-Link Template
Add at end of inline FAQ sections:

```html
<p class="faq-more-link">
  <a href="../../faq/[topic]-faq.html">See all [topic] FAQs →</a>
</p>
```

### De-Duplication Rules
- **Sub-articles:** Very specific questions (e.g., "Can I run with knee osteoarthritis?")
- **Hub pages:** General overview questions (e.g., "Do I need an MRI for knee pain?")
- **FAQ pages:** Comprehensive collection, avoid repeating exact questions from hubs

### SEO Benefits
1. Rich snippets potential (health sites still qualify)
2. AI/Voice search optimization
3. Better internal linking architecture
4. Featured snippet opportunities

### Implementation Checklist (Per Body Area)
When adding FAQ schema to a new body area (e.g., back, shoulder):

1. **Find all sub-articles** in `en/conditions/[area]/` and `plager/[area]/`
2. **Check each for existing FAQPage schema** - skip if already present
3. **Extract FAQ questions** from `.faq-question` elements
4. **Add FAQPage JSON-LD** after other schema scripts in `<head>`
5. **Add cross-link** at end of FAQ section before `</section>`:
   ```html
   <p class="faq-more-link"><a href="../../../faq/[area]-pain-faq.html">See all [area] FAQs →</a></p>
   ```
6. **CSS already exists** in `hub-article.css` (lines 2446-2470)

### File Naming Convention
- EN sub-articles: `/en/conditions/[area]/[condition].html`
- NO sub-articles: `/plager/[area]/[condition].html`
- EN FAQ pages: `/faq/[area]-pain-faq.html` (e.g., `knee-pain-faq.html`)
- NO FAQ pages: `/faq/[area]smerter-faq.html` (e.g., `knesmerter-faq.html`)

### Completed Areas
- [x] Knee (EN) - 12 articles with FAQPage schema + "See all FAQs" cross-links (Jan 2026)
- [ ] Knee (NO) - 12 articles pending (`/plager/kne/`)
- [ ] Back (EN/NO) - Pending
- [ ] Neck (EN/NO) - Pending
- [ ] Shoulder (EN/NO) - Pending
- [ ] Hip (EN/NO) - Pending
- [ ] Foot (EN/NO) - Pending

### Knee Articles Completed (EN)
| File | Schema | Cross-Link |
|------|--------|------------|
| knee-osteoarthritis.html | ✅ | ✅ |
| runners-knee.html | ✅ | ✅ |
| jumpers-knee.html | ✅ | ✅ |
| knee-pain-from-hip.html | ✅ | ✅ |
| meniscus-injury.html | ✅ | ✅ |
| acl-injury.html | ✅ | ✅ |
| iliotibial-band-syndrome.html | ✅ | ✅ |
| pes-anserine-bursitis.html | ✅ | ✅ |
| pcl-injury.html | ✅ | ✅ |
| popliteus-syndrome.html | ✅ | ✅ |
| prepatellar-bursitis.html | ✅ | ✅ |
| shin-splints.html | ✅ | ✅ |

---

## Website Audit Completion (January 24, 2026) ✅

### Files Audited
- **492 HTML files** scanned for CSS issues
- **493/494 files** have proper header/footer structure
- **0 CSS issues** remaining after standardization

### Critical Fixes Applied

#### Truncated File Restored
- `en/conditions/hip/osteitis-pubis.html` - was cut off mid-content, now complete

#### Broken Links Fixed (15 total)
**en/index.html (8 links):**
- `services/dizziness.html` → `services/dizziness-treatment.html`
- `conditions/lower-back/chronic-pain.html` → `conditions/lower-back/nociplastic-pain.html`
- `conditions/dizziness/bppv.html` → `conditions/dizziness/bppv-crystal-disease.html`
- `conditions/dizziness/pppd.html` → `conditions/dizziness/pppd-chronic-dizziness.html`
- `conditions/jaw/clicking-locking.html` → `conditions/jaw/clicking-locking-joint-problems.html`
- `conditions/jaw/chewing-pain.html` → `conditions/jaw-pain.html`
- `conditions/jaw/teeth-grinding.html` → `conditions/jaw/bruxism.html`
- `conditions/hip/pelvic-girdle-pain.html` → `conditions/hip/pelvic-pain-pregnancy.html`

**en/blog/* (7 files):**
- `../conditions/dizziness/bppv.html` → `../conditions/dizziness/bppv-crystal-disease.html`

### CSS Standardization
- Mobile CTA: orange (#F26522)
- Hub-hero CSS: added to 268+ files
- Location-section CSS: added where missing
- Stat font sizes: standardized

### FAQ Pages (24 total)
All properly linked from hub pages:
- `/faq/` contains 12 Norwegian + 12 English FAQ pages
- Linked from `faq.html` and `en/faq.html`
