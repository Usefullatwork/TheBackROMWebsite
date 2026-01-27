# TheBackROM Website Audit Report
**Date:** 2026-01-27
**Auditor:** Claude AI
**Scope:** ~746 HTML pages (Norwegian + English)

---

## Executive Summary

| Severity | Issues Found | Status |
|----------|--------------|--------|
| CRITICAL | 0 | ✅ All Fixed |
| MAJOR | 6 | Action Required |
| MINOR | 3 | Recommended |
| PASS | 6 | No Action Needed |

**Overall Health Score: 85/100** (improved from 78)

---

## CRITICAL Issues (Fix Immediately)

### 1. CSS Class Regression: `warning-box`
**Status:** ✅ FIXED
**Impact:** 163 files fixed
**Severity:** CRITICAL → RESOLVED

The `warning-box` class has been successfully renamed to `red-flag-alert` in all 163+ affected files.

**Fixed on:** 2026-01-27
**Script used:** `scripts/fix-warning-box.js`

**Verification:**
```bash
grep -rl 'warning-box' --include="*.html" | wc -l
# Result: 0 ✅
```

---

## MAJOR Issues (Fix Before Launch)

### 2. Hub Page Validation Failures
**Status:** FAILED
**Impact:** 12/12 English hub pages
**Severity:** MAJOR

All English hub pages fail validation checks:
- `en/conditions/arm-pain.html`
- `en/conditions/headache.html`
- `en/conditions/dizziness.html`
- `en/conditions/foot-pain.html`
- `en/conditions/hip-pain.html`
- `en/conditions/jaw-pain.html`
- `en/conditions/knee-pain.html`
- `en/conditions/thoracic-pain.html`
- `en/conditions/lower-back-pain.html`
- `en/conditions/shoulder-pain.html`
- `en/conditions/neck-pain.html`
- `en/conditions/sports-injuries.html`

**Common issues:**
- Missing featured image
- File size slightly over 50KB limit
- Minor Norwegian word remnants (og, med)

**Fix command:**
```bash
node scripts/validate-page.js en/conditions/<file>
```

---

### 3. Missing Images
**Status:** FAILED
**Impact:** 4 missing images
**Severity:** MAJOR

**Missing:**
1. `en/about.html` → `../images/Tjenester Kiropraktikk/behandling (2).jpg`
2. `en/index.html` → `../images/Tjenester Kiropraktikk/behandling-optimized.webp`
3. `en/services.html` → `../images/Tjenester Kiropraktikk/behandling (1).avif` (2x)

---

### 4. Missing Open Graph Tags
**Status:** FAILED
**Impact:** 6 pages
**Severity:** MAJOR

**Files missing `og:title`:**
1. `plager/nakke/triggerpunkter-nakke.html`
2. `plager/nakke/nakkesleng-hodepine.html`
3. `plager/nakke/rode-flagg-nakkesmerter.html`
4. `plager/kjeve/kjevehodepine.html`
5. `plager/albue-arm/de-quervains.html`
6. `plager/idrettsskader.html`

---

### 5. Missing FAQPage Schema
**Status:** WARNING
**Impact:** 60 pages
**Severity:** MAJOR

60 medical pages in `plager/` and `en/conditions/` lack FAQPage schema markup.

**Sample files affected:**
- Dizziness section (12 files)
- Neck section (5 files)
- Jaw section (2 files)
- Various sub-articles

---

### 6. Missing Mobile Sticky CTA
**Status:** WARNING
**Impact:** 10 pages
**Severity:** MAJOR

**Files missing `mobile-sticky-cta`:**
1. `akutt-svimmelhet-helg.html`
2. `akutt-behandling.html`
3. `blogg/index.html`
4. `en/conditions/headache/cervicogenic-headache.html`
5. `en/blog/index.html`
6. `en/404.html`
7. `en/emergency-dizziness.html`
8. `en/emergency-treatment.html`
9. `en/index.html`
10. *(node_modules file - ignore)*

---

### 7. MedicalWebPage Schema Coverage
**Status:** PARTIAL
**Impact:** 402 pages without schema
**Severity:** MAJOR (for medical content)

- **With MedicalWebPage:** 344 files
- **Without:** 402 files

Note: Not all pages require MedicalWebPage schema (blog index, FAQ, etc.)

---

## MINOR Issues (Recommended Fixes)

### 8. Images Without Lazy Loading
**Status:** INFO
**Impact:** 282 images
**Severity:** MINOR

- English pages: 162 images
- Norwegian pages: 120 images

These images load immediately instead of on-demand.

---

### 9. Inline Styles
**Status:** INFO
**Impact:** 316 files with inline styles
**Severity:** MINOR

316 files use `style=""` attributes. Consider extracting to CSS classes for maintainability.

---

### 10. Style Blocks in HTML
**Status:** INFO
**Impact:** 329 files
**Severity:** MINOR

329 medical pages have embedded `<style>` blocks. Consider consolidating to external CSS files.

---

## PASSED Checks

| Check | Result | Files Checked |
|-------|--------|---------------|
| CSS Class: `hub-sidenav` | PASS (0 found) | All HTML |
| CSS Class: `section-heading` | PASS (0 found) | All HTML |
| CSS Class: `tldr-box` | PASS (0 found) | All HTML |
| CSS Class: `cta-box` | PASS (0 found) | All HTML |
| CSS Class: `header.hub-hero` | PASS (0 found) | All HTML |
| Broken Internal Links | PASS | 398 files |
| Missing Alt Text | PASS | All images |
| External Link Security | PASS | All external links |
| Hreflang Coverage | PASS | 719 EN, 721 NB |
| Meta Descriptions | PASS | All medical pages |
| H1 Tags | PASS | All pages |
| ARIA Labels | PASS (1 minor) | All pages |

---

## Fix Priority Matrix

### Immediate (Today)
1. **Fix `warning-box` → `red-flag-alert`** (163 files)
   - Use find/replace with `replace_all: true`
   - Verify CSS includes `.red-flag-alert` styles

### This Week
2. **Fix missing images** (4 files)
3. **Add missing `og:title`** (6 files)
4. **Add mobile-sticky-cta** (9 files)

### This Month
5. **Add FAQPage schema** (60 files)
6. **Optimize hub page file sizes** (12 files)
7. **Add lazy loading** (282 images)

### Backlog
8. **Extract inline styles** (316 files)
9. **Consolidate style blocks** (329 files)

---

## Verification Commands

After fixes, run:
```bash
# Check for warning-box class (should return 0)
grep -rl 'class="warning-box"' --include="*.html" | wc -l

# Validate all hubs
npm run validate:hubs

# Full audit
npm run audit

# Check links
npm run check-links en/
npm run check-links plager/

# Check images
npm run check-images en/
npm run check-images plager/
```

---

## Appendix: File Counts

| Directory | Files | With hub-article.css |
|-----------|-------|---------------------|
| `plager/` | 166 | 154 |
| `en/conditions/` | 163 | 163 |
| `tjeneste/` | 10 | N/A |
| `en/services/` | 10 | N/A |
| `blogg/` | 42 | N/A |
| `en/blog/` | 42 | N/A |
| **Total** | **746** | **317** |

---

*Report generated by Claude AI automated audit system*
