# Website Design Flaws Report
**Generated:** 2026-01-26
**Gold Standard:** `/plager/korsryggsmerte.html` (structure), `/plager/hofte-og-bekkensmerter.html` (tables)

---

## Executive Summary

| Severity | Count | Description |
|----------|-------|-------------|
| **CRITICAL** | 7 | Wrong hero structure (`<header>` instead of `<section>`) |
| **MAJOR** | 30 | Wrong CSS class names |
| **MINOR** | 145+ | Excessive inline CSS in content pages |

**Total content pages scanned:** ~527 (excluding backups, node_modules)

---

## CRITICAL Issues

### 1. Wrong Hero Structure: `<header class="hub-hero">` instead of `<section class="hub-hero">`

**Impact:** Semantic HTML issue. Heroes should be `<section>` not `<header>` for accessibility and SEO.

**Files (7):**
```
/plager/hofte/vondt-i-hoften.html:755
/plager/korsrygg/nociplastisk-smerte.html:701
/plager/korsrygg/spondylolistese.html:698
/plager/korsrygg/bekhterevs-sykdom.html:700
/en/conditions/lower-back/spondylolisthesis.html:1022
/en/conditions/lower-back/ankylosing-spondylitis.html:1011
/en/conditions/hip/hip-pain.html:1052
```

**Fix:** Change `<header class="hub-hero">` to `<section class="hub-hero">`

---

## MAJOR Issues

### 2. Wrong Class: `hub-sidenav` (should be `hub-sidebar` or `hub-toc-card`)

**Files (13):**
```
/plager/kne/korsbandskade.html
/plager/kne/pes-anserine-bursitt.html
/plager/korsrygg/bekhterevs-sykdom.html
/plager/korsrygg/hekseskudd.html
/plager/korsrygg/nociplastisk-smerte.html
/plager/korsrygg/spinal-stenose.html
/plager/korsrygg/spondylolistese.html
/plager/ryggsmerter.html
/plager/hofte/hip-pointer.html
/plager/hofte/idrettsskader-hofte.html
/plager/hofte/rygg-hofte-isjias.html
/plager/hofte/triggerpunkter-hofte-bekken.html
/plager/hofte/vondt-i-hoften.html
```

**Fix:** Replace `.hub-sidenav` with `.hub-sidebar` and update inline CSS definitions

---

### 3. Wrong Class: `section-heading` (should be `section-header`)

**Files (5):**
```
/plager/korsryggsmerte.html:690
/plager/korsrygg/bekhterevs-sykdom.html
/plager/korsrygg/nociplastisk-smerte.html
/plager/korsrygg/spondylolistese.html
/plager/hofte/vondt-i-hoften.html
```

**Fix:** Replace `.section-heading` with `.section-header`

---

### 4. Wrong Class: `cta-box` (should be `hub-cta`)

**Files (2):**
```
/blogg/diskogen-smerte.html:413
/blogg/kjeve-nakke-svimmelhet.html
```

**Fix:** Replace `<div class="cta-box">` with `<section class="hub-cta">` and update content structure

---

### 5. Wrong Class: `tldr-box` (should be `premium-summary-card`)

**Files (10):**
```
/en/blog/text-neck-phone-neck.html
/en/blog/trigger-points-neck.html
/en/blog/neck-pain-pregnancy.html
/en/blog/numbness-fingers-neck-hand.html
/en/blog/stress-neck-trigger-points.html
/plager/korsrygg/graviditet.html
/plager/hofte/hip-pointer.html
/plager/hofte/vondt-i-hoften.html
/en/conditions/lower-back/pregnancy-back-pain.html
/en/conditions/hip/hip-pain.html
```

**Fix:** Replace `.tldr-box` with `.premium-summary-card` class structure

---

### 6. Missing Schema.org Structured Data

**Location:** `/tjeneste/svimmelhet.html` (missing from 1 of 13 tjeneste files)

**Fix:** Add `<script type="application/ld+json">` with MedicalWebPage schema

---

## MINOR Issues

### 7. Excessive Inline CSS (>3000 characters in `<style>` tags)

**Count:** 145 files in `/plager/` folder

**Affected areas:**
- `/plager/kjeve/*` (all 12+ files)
- `/plager/kne/*` (most files)
- `/plager/korsrygg/*` (most files)
- `/plager/nakke/*` (all files)
- `/plager/skulder/*` (most files)
- `/plager/svimmelhet/*` (all files)
- `/plager/brystrygg/*` (all files)
- `/plager/fot/*` (all files)
- `/plager/hodepine/*` (most files)
- `/plager/hofte/*` (most files)

**Recommendation:** These pages have duplicated CSS that should be in `hub-article.css`. However, this is a lower priority as it affects performance, not functionality.

---

## Pages with Multiple Issues (Priority Fix)

These pages have 2+ issues and should be fixed first:

| Page | Issues |
|------|--------|
| `/plager/hofte/vondt-i-hoften.html` | Wrong hero `<header>`, `hub-sidenav`, `section-heading`, `tldr-box` |
| `/plager/korsrygg/bekhterevs-sykdom.html` | Wrong hero `<header>`, `hub-sidenav`, `section-heading` |
| `/plager/korsrygg/nociplastisk-smerte.html` | Wrong hero `<header>`, `hub-sidenav`, `section-heading` |
| `/plager/korsrygg/spondylolistese.html` | Wrong hero `<header>`, `hub-sidenav`, `section-heading` |
| `/en/conditions/hip/hip-pain.html` | Wrong hero `<header>`, `tldr-box` |
| `/en/conditions/lower-back/spondylolisthesis.html` | Wrong hero `<header>` |
| `/en/conditions/lower-back/ankylosing-spondylitis.html` | Wrong hero `<header>` |

---

## What's Working Well

- **417 files** have proper schema.org structured data
- **390 files** properly include `hub-article.css`
- **484 files** have `mobile-sticky-cta` component
- **All 13 `/tjeneste/` files** have both `hub-article.css` and `mobile-sticky-cta`

---

## Recommended Fix Order

1. **Phase 1 (CRITICAL):** Fix 7 files with wrong `<header class="hub-hero">`
2. **Phase 2 (MAJOR):** Fix 13 files with `hub-sidenav` class
3. **Phase 3 (MAJOR):** Fix 5 files with `section-heading` class
4. **Phase 4 (MAJOR):** Fix 2 blog files with `cta-box` class
5. **Phase 5 (MAJOR):** Fix 10 files with `tldr-box` class
6. **Phase 6 (MINOR):** Consider extracting inline CSS from 145 files to external CSS

---

## Reference: Gold Standard Structure

From `/plager/korsryggsmerte.html`:

```html
<section class="hub-hero">
  <div class="wrapper">
    <div class="hub-hero__breadcrumb">...</div>
    <h1>...</h1>
    <p class="hub-hero__subtitle">...</p>
  </div>
</section>

<div class="wrapper">
  <div class="hub-layout">
    <main class="hub-main">
      <article class="hub-article">
        <div class="premium-summary-card">...</div>
        <section class="hub-section" id="section-1">
          <div class="section-header">
            <span class="section-number">1</span>
            <h2>...</h2>
          </div>
        </section>
      </article>
    </main>
    <aside class="hub-sidebar">
      <div class="hub-toc-card">...</div>
    </aside>
  </div>
</div>
```

---

## Verification Notes

**Spot-checked files:**
- `/plager/hofte/vondt-i-hoften.html` - Confirmed: has schema.org, but uses wrong `<header>` hero and old class names
- `/blogg/diskogen-smerte.html` - Confirmed: uses old `cta-box` class at line 413
- `/tjeneste/svimmelhet.html` - Confirmed: properly uses `hub-article.css` and modern patterns

---

*Report generated by automated scan of website folder structure*
