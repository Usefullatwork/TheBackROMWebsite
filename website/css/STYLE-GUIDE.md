# TheBackROM Hub Style Guide

## QUICK REFERENCE - Copy These Patterns

### Gold Standards (USE AS TEMPLATES):
- **Hub Page:** `plager/korsryggsmerte.html`
- **Sub-Article:** `plager/korsrygg/skiveprolaps.html`

### Required Stylesheets (EVERY page needs these):
```html
<!-- For pages in /plager/ -->
<link rel="stylesheet" href="../css/main.min.css?v=20260101">
<link rel="stylesheet" href="../css/index-2026-fixes.css">
<link rel="stylesheet" href="../css/hub-article.css">

<!-- For pages in /plager/korsrygg/ (sub-articles) -->
<link rel="stylesheet" href="../../css/main.min.css?v=20260101">
<link rel="stylesheet" href="../../css/index-2026-fixes.css">
<link rel="stylesheet" href="../../css/hub-article.css">
```

### Required CSS Variables (minimal inline block):
```css
<style>
  :root {
    --hub-primary: #1a5f7a;
    --hub-dark: #0d3d4d;
    --hub-red: #dc2626;
    --hub-green: #059669;
    --hub-blue: #2563eb;
    --hub-purple: #7c3aed;
    --hub-orange: #ea580c;
  }
</style>
```

### Correct Hero Structure:
```html
<main class="page">
  <!-- HERO OUTSIDE hub-wrapper -->
  <section class="hub-hero">
    <div class="hub-hero__container">
      <h1>Title</h1>
      <p class="hub-hero__subtitle">Subtitle | Kiropraktor Mads Finstad</p>
    </div>
  </section>

  <div class="hub-wrapper">
    <article class="hub-main">
      <!-- Content here -->
    </article>
    <aside class="hub-sidebar">  <!-- For hub pages -->
      <!-- Sidebar content -->
    </aside>
  </div>
</main>
```

### Class Name Mapping (WRONG → CORRECT):
| WRONG | CORRECT |
|-------|---------|
| `.hub-sidenav` | `.hub-sidebar` |
| `.sidenav-inner` | `.hub-toc-card` |
| `.section-heading` | `.section-header` |
| `.tldr-box` | `.premium-summary-card` |
| `.cta-box` | `.hub-cta` |
| `.cta-button` | `.button` |
| `.warning-box` | `.red-flag-box` or `.red-flag-alert` |
| `.hub-content` | `.hub-intro` + `.hub-section` |
| `<header class="hub-hero">` | `<section class="hub-hero">` |
| `.author` | `.hub-hero__subtitle` |

### Component Classes to Use:
- `.premium-summary-card` - Quick summary box
- `.hub-subnav` + `.hub-subnav__grid` + `.hub-subnav__card` - Related links
- `.red-flag-alert` - Prominent warning (with link)
- `.red-flag-box` - Warning section
- `.condition-card` - Condition info card
- `.nerve-box` - Nerve info (yellow)
- `.treatment-box` - Treatment info (green)
- `.info-box` - General info (blue)
- `.stat-grid` + `.stat-item` - Statistics
- `.hub-cta` - Call to action
- `.related-box` - Related articles
- `.sources-section` - References
- `.mobile-sticky-cta` - Mobile CTA

---
---

# HUB PAGE Style Guide

## Gold Standard Template: `plager/korsryggsmerte.html`

---

## Key Differences: Korsrygg (Correct) vs Kjeve (Needs Fixing)

### 1. Stylesheets

**CORRECT (korsrygg):**
```html
<link rel="stylesheet" href="../css/main.min.css?v=20260101">
<link rel="stylesheet" href="../css/index-2026-fixes.css">
<link rel="stylesheet" href="../css/hub-article.css">  <!-- REQUIRED -->
```

**WRONG (kjeve):**
- Missing `hub-article.css`
- Has ~860 lines of inline CSS instead

---

### 2. CSS Variables (Minimal Inline Block)

**CORRECT (korsrygg) - Only ~85 lines of inline CSS:**
```css
<style>
  :root {
    --hub-primary: #1a5f7a;
    --hub-dark: #0d3d4d;
    --hub-red: #dc2626;
    --hub-green: #059669;
    --hub-blue: #2563eb;
    --hub-purple: #7c3aed;
    --hub-orange: #ea580c;
  }
  /* Only supplementary styles not in hub-article.css */
</style>
```

**WRONG (kjeve):**
- Has ALL styles inline (layout, components, everything)
- ~860 lines of CSS in the `<style>` block

---

### 3. Page Layout Structure

**CORRECT (korsrygg):**
```html
<main class="page">
  <!-- Hero Section OUTSIDE hub-wrapper -->
  <section class="hub-hero">
    <div class="hub-hero__container">
      <h1>Title</h1>
      <p class="hub-hero__subtitle">Subtitle</p>
    </div>
  </section>

  <div class="hub-wrapper">
    <article class="hub-main">
      <!-- Content sections -->
    </article>

    <aside class="hub-sidebar">  <!-- SIDEBAR ON RIGHT -->
      <div class="hub-conversion-card">...</div>
      <nav class="hub-toc-card">...</nav>
    </aside>
  </div>
</main>
```

**WRONG (kjeve):**
```html
<main class="page">
  <div class="hub-wrapper">
    <article class="hub-main">
      <!-- Hero INSIDE hub-main -->
      <header class="hub-hero">...</header>
      <div class="hub-content">...</div>
    </article>

    <aside class="hub-sidenav">  <!-- DIFFERENT CLASS NAME -->
      <nav class="sidenav-inner">...</nav>
    </aside>
  </div>
</main>
```

---

### 4. Hero Section

**CORRECT (korsrygg):**
```html
<section class="hub-hero">
  <div class="hub-hero__container">
    <h1>Korsryggsmerter – Komplett guide</h1>
    <p class="hub-hero__subtitle">Alt du trenger å vite | Kiropraktor Mads Finstad</p>
  </div>
</section>
```

**WRONG (kjeve):**
```html
<header class="hub-hero">
  <h1>Title</h1>
  <p class="author">Author text</p>
</header>
```

---

### 5. Sidebar Components

**CORRECT (korsrygg) - Uses `.hub-sidebar`:**
```html
<aside class="hub-sidebar">
  <!-- Conversion Card with Image -->
  <div class="hub-conversion-card">
    <img src="..." alt="..." class="sidebar-image">
    <h3>Vondt i korsryggen?</h3>
    <p>Description</p>
    <a href="..." class="btn-cta">Bestill time</a>
    <div class="sidebar-info">
      <small><strong>Mads Finstad</strong><br>Kiropraktor</small>
    </div>
  </div>

  <!-- Table of Contents -->
  <nav class="hub-toc-card" aria-label="Innholdsnavigasjon">
    <h3>Innhold</h3>
    <ul>
      <li><a href="#section1">Section 1</a></li>
      <li><a href="#section2">Section 2</a></li>
    </ul>
  </nav>
</aside>
```

**WRONG (kjeve) - Uses `.hub-sidenav`:**
```html
<aside class="hub-sidenav">
  <nav class="sidenav-inner">
    <div class="sidenav-title">Innhold</div>
    <a href="#s1" class="sidenav-link active">1. Section</a>
    <a href="..." class="sidenav-cta">Bestill time</a>
  </nav>
</aside>
```

---

### 6. Section Structure

**CORRECT (korsrygg):**
```html
<section id="hekseskudd" class="hub-section">
  <div class="section-header">
    <span class="section-number">1</span>
    <h2>Section Title</h2>
  </div>
  <p>Content...</p>
</section>
```

**WRONG (kjeve):**
```html
<section class="hub-section" id="s1">
  <div class="section-heading">  <!-- Different class name -->
    <span class="section-number">1</span>
    <h2 class="section-title">Section Title</h2>  <!-- Extra class -->
  </div>
</section>
```

---

### 7. Special Components (ONLY in korsrygg)

These components are defined in `hub-article.css` and should be used:

```html
<!-- Premium Summary Card -->
<div class="premium-summary-card">
  <h3>Kort oppsummert</h3>
  <ul>
    <li><strong>Stat</strong> - Description</li>
  </ul>
</div>

<!-- Sub-navigation Grid -->
<nav class="hub-subnav">
  <h3>Velg din tilstand</h3>
  <div class="hub-subnav__grid hub-subnav__grid--detailed">
    <a href="..." class="hub-subnav__card">
      <strong>Title</strong>
      <span>Description</span>
    </a>
  </div>
</nav>

<!-- Red Flag Alert (Prominent) -->
<div class="red-flag-alert">
  <h4>Når må du ringe 113?</h4>
  <p>Warning text</p>
  <a href="...">Les mer →</a>
</div>

<!-- Decision Helper -->
<div class="decision-helper">
  <h4>Usikker på hva du har?</h4>
  <p>Description</p>
  <a href="..." class="decision-helper__link">Link text →</a>
</div>

<!-- Insight Cards (variants: tip, summary, warning) -->
<div class="insight-card tip">
  <h4>Title</h4>
  <p>Content</p>
</div>

<div class="insight-card summary">...</div>
<div class="insight-card warning">...</div>

<!-- Floating Images -->
<img src="..." alt="..." class="img-float-right" />
<img src="..." alt="..." class="img-float-left" />

<!-- Hub Infographic -->
<img src="..." alt="..." class="hub-infographic" />
```

---

### 8. Intro Section

**CORRECT (korsrygg):**
```html
<section class="hub-intro">
  <div class="intro-text">
    <p>Main intro text...</p>
  </div>

  <div class="premium-summary-card">...</div>
  <nav class="hub-subnav">...</nav>
  <div class="red-flag-alert">...</div>
  <img class="hub-infographic" ... />
  <div class="decision-helper">...</div>
  <div class="stat-grid">...</div>
  <div class="insight-card tip">...</div>
</section>
```

**WRONG (kjeve):**
```html
<div class="hub-content">
  <div class="intro-tldr-grid">
    <div class="intro-text">...</div>
    <aside class="tldr-sidebar">...</aside>
  </div>
</div>
```

---

### 9. CTA Section

**CORRECT (korsrygg):**
```html
<div class="hub-cta">
  <h3>Book time direkte</h3>
  <p>Price info</p>
  <a href="..." class="button">Bestill time online</a>
  <p style="margin-top: 16px; font-size: 0.9rem;">
    Eller ring: <a href="tel:..." style="color: white;">Phone</a>
  </p>
</div>
```

**WRONG (kjeve):**
```html
<div class="hub-cta">
  <h3>Title</h3>
  <p>Description</p>
  <h4>Subheading</h4>
  <ul>...</ul>
  <a href="..." class="btn">Bestill time →</a>
</div>
```

---

### 10. Blog Carousel

**CORRECT (korsrygg) - Simple cards:**
```html
<article class="blog-card" style="flex: 0 0 280px; scroll-snap-align: start; background: #f8fafc; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
  <div style="height: 160px; overflow: hidden;">
    <img src="..." style="width: 100%; height: 100%; object-fit: cover;">
  </div>
  <div style="padding: 16px;">
    <h3 style="font-size: 15px; margin: 0 0 8px; color: var(--hub-dark);">Title</h3>
    <p style="font-size: 13px; color: #6b7280; margin: 0 0 12px;">Description</p>
    <a href="..." style="color: var(--hub-primary); font-weight: 600; font-size: 13px;">Les mer →</a>
  </div>
</article>
```

**WRONG (kjeve) - Overly styled:**
```html
<a href="..." class="blog-card" style="min-width: 280px; max-width: 280px; ... box-shadow: 0 4px 15px rgba(0,0,0,0.1); ...">
  <img ... style="width: 100%; height: 160px; object-fit: cover;">
  <div style="padding: 16px;">
    <span style="display: inline-block; background: var(--hub-primary); ...">Category</span>
    <h3 style="...">Title</h3>
    <p style="...">Description</p>
  </div>
</a>
```

---

### 11. Related Box

**CORRECT (korsrygg):**
```html
<div class="related-box">
  <h3>Dypere artikler om korsrygg</h3>
  <a href="...">→ Article title</a>
  <a href="...">→ Article title</a>
</div>
```

**WRONG (kjeve) - Pink styling:**
```html
<div class="related-box">  <!-- Has inline pink gradient styling -->
  <h3>Relaterte artikler</h3>
  <a href="...">→ Article title</a>
</div>
```

---

### 12. Footer Script

**CORRECT (korsrygg):**
```html
<script src="../js/script.min.js" defer></script>
<script src="../js/language-toggle.min.js" defer></script>
<script src="../js/modern-enhancements.min.js" defer></script>
<script src="../js/blog-carousel.js" defer></script>
<script>
  // Simple scroll tracking for TOC
  document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.hub-section');
    const navLinks = document.querySelectorAll('.hub-toc-card a');
    // ... scroll tracking logic
  });
</script>
```

---

## Files That Need Updating

### Hub Pages to Fix (Match korsrygg structure):
- [ ] kjevesmerte.html - Major restructure needed
- [ ] nakkesmerter.html - Check structure
- [ ] hodepine.html - Check structure
- [ ] skuldersmerter.html - Check structure
- [ ] knesmerter.html - Check structure
- [ ] svimmelhet.html - Check structure
- [ ] hofte-og-bekkensmerter.html - Check structure
- [ ] brystryggsmerter.html - Check structure
- [ ] fotsmerte.html - Check structure
- [ ] albue-arm-smerte.html - Check structure

### Tjeneste Pages (Need hub-article.css + structure):
- [ ] graston.html
- [ ] trykkbolge.html
- [ ] fasciemanipulasjon.html
- [ ] dry-needling.html
- [ ] blotvevsteknikker.html
- [ ] svimmelhet.html
- [ ] rehabilitering.html
- [ ] forebyggende-behandling.html
- [ ] akutt-behandling.html
- [x] kiropraktikk.html (Already has some hub styling)

### Blog Pages (54 files):
All files in `/blogg/` except index.html need consistent styling.

---

## Quick Checklist for Hub Pages

1. [ ] Has `hub-article.css` stylesheet
2. [ ] Minimal inline CSS (only variables, not full layout)
3. [ ] Hero section OUTSIDE hub-wrapper
4. [ ] Uses `.hub-sidebar` (not `.hub-sidenav`)
5. [ ] Has `.hub-conversion-card` with image
6. [ ] Has `.hub-toc-card` for navigation
7. [ ] Uses `.section-header` (not `.section-heading`)
8. [ ] Uses correct component classes from hub-article.css
9. [ ] Blog carousel uses simple styling
10. [ ] Related box without custom inline styling

---
---

# SUB-ARTICLE Style Guide

## Gold Standard: `plager/korsrygg/skiveprolaps.html`

---

## Key Differences: Korsrygg Sub-Article (Correct) vs Kjeve Sub-Article (Wrong)

### 1. Stylesheets

**CORRECT (korsrygg/skiveprolaps.html):**
```html
<link rel="stylesheet" href="../../css/main.min.css?v=20260101">
<link rel="stylesheet" href="../../css/index-2026-fixes.css">
<link rel="stylesheet" href="../../css/hub-article.css">  <!-- REQUIRED -->
```

**WRONG (kjeve/tanngnissing-bruksisme.html):**
```html
<link rel="stylesheet" href="../../css/main.min.css?v=20260101-fix" />
<link rel="stylesheet" href="../../css/index-2026-fixes.css">
<!-- MISSING hub-article.css! -->
```

---

### 2. Inline CSS

**CORRECT (korsrygg) - ~50 lines, only variables + supplementary:**
```css
<style>
  /* Minimal embedded CSS - matches hub pattern. Main styles from hub-article.css */
  :root {
    --hub-primary: #1a5f7a;
    --hub-dark: #0d3d4d;
    --hub-red: #dc2626;
    --hub-green: #059669;
    --hub-blue: #2563eb;
    --hub-purple: #7c3aed;
    --hub-orange: #ea580c;
  }
  /* Only styles that supplement hub-article.css */
</style>
```

**WRONG (kjeve) - ~150 lines, ALL layout defined inline:**
```css
<style>
  :root {
    --hub-primary: #e8a838;  /* Different color scheme */
    --hub-primary-dark: #d4922e;
    --hub-dark: #1a1a2e;
    --hub-dark-light: #16213e;
  }

  /* WRONG: Defines entire layout inline */
  .hub-wrapper {
    max-width: 900px;
    margin: 0 auto;
    /* ... full layout ... */
  }

  .hub-hero {
    /* ... full hero styling ... */
  }

  .hub-content {
    /* ... content wrapper ... */
  }
  /* etc. */
</style>
```

---

### 3. Page Layout Structure

**CORRECT (korsrygg sub-article):**
```html
<main class="page">
  <!-- Hero OUTSIDE hub-wrapper (same as hub page) -->
  <section class="hub-hero">
    <div class="hub-hero__container">
      <h1>Skiveprolaps i Korsryggen</h1>
      <p class="hub-hero__subtitle">Subtitle | Kiropraktor Mads Finstad</p>
    </div>
  </section>

  <div class="hub-wrapper">
    <article class="hub-main">
      <section class="hub-intro">...</section>
      <section class="hub-section" id="s1">...</section>
      <section class="hub-section" id="s2">...</section>
    </article>
    <!-- Note: Sub-articles may or may not have sidebar -->
  </div>
</main>
```

**WRONG (kjeve sub-article):**
```html
<main class="page">
  <div class="hub-wrapper">
    <article class="hub-main">
      <!-- Hero INSIDE article (WRONG) -->
      <header class="hub-hero">
        <h1>Title</h1>
        <p class="author">Author info</p>
      </header>

      <!-- Uses hub-content wrapper (WRONG) -->
      <div class="hub-content">
        <h2>Section</h2>
        <p>Content...</p>
      </div>
    </article>
  </div>
</main>
```

---

### 4. Hero Section

**CORRECT (korsrygg):**
```html
<section class="hub-hero">
  <div class="hub-hero__container">
    <h1>Skiveprolaps i Korsryggen</h1>
    <p class="hub-hero__subtitle">Symptomer, spontan resorpsjon, behandling og prognose | Kiropraktor Mads Finstad, Majorstua</p>
  </div>
</section>
```

**WRONG (kjeve):**
```html
<header class="hub-hero">
  <h1>Tanngnissing (Bruksisme): Komplett Guide til Årsaker og Behandling</h1>
  <p class="author">Kiropraktor Mads Finstad, TheBackROM Majorstua</p>
</header>
```

| Element | CORRECT | WRONG |
|---------|---------|-------|
| Tag | `<section>` | `<header>` |
| Container | `.hub-hero__container` | None |
| Subtitle class | `.hub-hero__subtitle` | `.author` |
| Position | Outside hub-wrapper | Inside hub-main |

---

### 5. Intro Section

**CORRECT (korsrygg):**
```html
<section class="hub-intro">
  <div class="intro-text">
    <p>Intro paragraph...</p>
  </div>

  <div class="premium-summary-card">
    <h3>Kort oppsummert</h3>
    <ul>
      <li><strong>Stat</strong> description</li>
    </ul>
  </div>

  <nav class="hub-subnav">
    <h3>Relaterte artikler</h3>
    <div class="hub-subnav__grid hub-subnav__grid--detailed">
      <a href="..." class="hub-subnav__card">
        <strong>Title</strong>
        <span>Description</span>
      </a>
    </div>
  </nav>

  <div class="red-flag-alert">
    <h4>Når må du søke hjelp?</h4>
    <p>Warning text</p>
    <a href="...">Les mer →</a>
  </div>
</section>
```

**WRONG (kjeve):**
```html
<div class="hub-content">
  <div class="tldr-box">  <!-- Wrong class name -->
    <h3>TL;DR - Title</h3>
    <ul>...</ul>
  </div>

  <!-- Uses inline-styled warning box -->
  <div class="warning-box" style="background: linear-gradient(...);">
    <h3 style="color: #dc2626;">Warning</h3>
    <p>Text...</p>
  </div>

  <h2>Section</h2>
  <p>Content...</p>
</div>
```

---

### 6. Section Structure

**CORRECT (korsrygg):**
```html
<section class="hub-section" id="s1">
  <div class="section-header">
    <span class="section-number">1</span>
    <h2>Section Title</h2>
  </div>
  <p>Content...</p>

  <div class="condition-card">
    <h4>Card Title</h4>
    <p>Description</p>
  </div>

  <div class="nerve-box">
    <h4>L4-L5 prolaps</h4>
    <ul>...</ul>
  </div>
</section>
```

**WRONG (kjeve) - No section structure:**
```html
<h2>Section Title</h2>  <!-- Just bare h2, no section wrapper -->
<p>Content...</p>

<h3>Subsection</h3>
<ul>...</ul>

<!-- Inline-styled boxes instead of component classes -->
<div style="background: #f0f9ff; border-left: 4px solid #0284c7; padding: 20px; margin: 30px 0; border-radius: 8px;">
  <h4 style="margin-top: 0; color: #0369a1;">Title</h4>
  <p style="margin-bottom: 0;">Content</p>
</div>
```

---

### 7. Component Classes

**CORRECT (korsrygg) - Uses defined classes:**

| Component | Class Name |
|-----------|------------|
| Summary card | `.premium-summary-card` |
| Related navigation | `.hub-subnav`, `.hub-subnav__grid`, `.hub-subnav__card` |
| Warning alert | `.red-flag-alert` |
| Red flag box | `.red-flag-box` |
| Condition card | `.condition-card` |
| Nerve info | `.nerve-box` |
| Treatment info | `.treatment-box` |
| Info box | `.info-box` |
| Stats grid | `.stat-grid`, `.stat-item` |
| FAQ item | `.faq-item`, `.faq-question`, `.faq-answer` |
| Sources | `.sources-section` |

**WRONG (kjeve) - Uses different/inline classes:**

| Component | Class Name (WRONG) |
|-----------|-------------------|
| Summary card | `.tldr-box` |
| Warning | `.warning-box` with inline styles |
| Info box | `.info-box` with inline styles |
| CTA | `.cta-box`, `.cta-button` |
| All boxes | Inline `style="..."` attributes |

---

### 8. CTA Box

**CORRECT (korsrygg):**
```html
<div class="hub-cta">
  <h3>Book time direkte</h3>
  <p>Nytt problem: 1105 kr (45 min) | Oppfølging: 780 kr (30 min)</p>
  <a href="..." class="button">Bestill time online</a>
  <p style="margin-top: 16px; font-size: 0.9rem;">
    Eller ring: <a href="tel:..." style="color: white;">400 35 400</a>
  </p>
</div>
```

**WRONG (kjeve):**
```html
<div class="cta-box">  <!-- Different class name -->
  <h3>Title</h3>
  <p>Description</p>
  <a href="..." class="cta-button">Bestill time →</a>  <!-- Different button class -->
</div>
```

---

### 9. Internal Links

**CORRECT (korsrygg) - Links to related articles:**
```html
<p>95% rammer <a href="../../blogg/l4-l5-prolaps.html">L4-L5</a> eller
<a href="../../blogg/l5-s1-prolaps.html">L5-S1</a>.</p>

<div class="hub-subnav__card">
  <a href="isjias.html">
    <strong>Isjias</strong>
    <span>Nervesmerter ned i benet</span>
  </a>
</div>
```

**WRONG (kjeve) - Fewer contextual links:**
```html
<p>...som <a href="../kjevesmerte.html">kjevesmerter</a> avslører det.</p>
<!-- Missing hub-subnav structure -->
```

---

### 10. Mobile CTA

**CORRECT (korsrygg):**
```html
<div class="mobile-sticky-cta">
  <a href="...">Bestill time</a>
  <a href="tel:..." style="background: transparent; border: 2px solid white; color: white;">Ring oss</a>
</div>
```

**WRONG (kjeve):**
- Missing mobile sticky CTA entirely

---

## Quick Checklist for Sub-Articles

1. [ ] Has `hub-article.css` stylesheet (path: `../../css/hub-article.css`)
2. [ ] Minimal inline CSS (~50 lines max, only variables + supplementary)
3. [ ] Hero section OUTSIDE hub-wrapper using `<section class="hub-hero">`
4. [ ] Hero uses `.hub-hero__container` and `.hub-hero__subtitle`
5. [ ] Uses `.hub-intro` section with `.intro-text`
6. [ ] Uses `.premium-summary-card` (not `.tldr-box`)
7. [ ] Uses `.hub-subnav` for related article links
8. [ ] Uses `.red-flag-alert` for prominent warnings
9. [ ] Uses `.hub-section` with `.section-header` containing `.section-number`
10. [ ] Uses component classes (`.condition-card`, `.nerve-box`, `.treatment-box`, etc.)
11. [ ] Uses `.hub-cta` with `.button` class
12. [ ] Has `.mobile-sticky-cta` for mobile
13. [ ] No inline style attributes on boxes (use classes instead)

---

## Files That Need Updating

### Kjeve Sub-Articles (21 files - ALL need restructuring):
- [ ] kjevehodepine.html
- [ ] glossopharyngeal-nevralgi.html
- [ ] tanngnissing-bruksisme.html
- [ ] barn-ungdom-tmd.html
- [ ] kampsport-tmd.html
- [ ] nakke-kjeve-sammenheng.html
- [ ] icr-syndrom.html
- [ ] oresmerter-tinnitus.html
- [ ] stress-og-kjevesmerter.html
- [ ] hypermobilitet-eds-tmd.html
- [ ] musikere-tmd.html
- [ ] graviditet-kjevesmerter.html
- [ ] adhd-autisme-tmd.html
- [ ] pifp-ansiktssmerte.html
- [ ] klikking-lasing-leddproblemer.html
- [ ] ovelser-tmd.html
- [ ] tekstnakke-kjeve.html
- [ ] bittfeil-myter.html
- [ ] ibs-mage-kjeve.html
- [ ] botox-vs-manuell-behandling.html
- [ ] eagle-syndrom.html

### Other Sub-Article Folders to Check:
- [ ] nakke/ folder
- [ ] hodepine/ folder
- [ ] skulder/ folder
- [ ] kne/ folder
- [ ] hofte/ folder
- [ ] brystrygg/ folder
- [ ] fot/ folder
- [ ] albue-arm/ folder
- [ ] svimmelhet/ folder

