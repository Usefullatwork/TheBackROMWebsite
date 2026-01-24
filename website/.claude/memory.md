# Project Memory - TheBackROM Website

## Website Audit & Fixes (January 24, 2026) ✅ COMPLETED

### Audit Summary
- **492 files scanned** for CSS issues
- **0 CSS issues remaining** after standardization

### Critical Fixes Applied

#### 1. Truncated File Restored
- **File:** `en/conditions/hip/osteitis-pubis.html`
- **Issue:** File was truncated mid-tag at line 533
- **Fix:** Completed with FAQ, CTA, sidebar, footer, scripts

#### 2. Broken Links Fixed in en/index.html (8 links)
| Old Link | New Link |
|----------|----------|
| `services/dizziness.html` | `services/dizziness-treatment.html` |
| `conditions/lower-back/chronic-pain.html` | `conditions/lower-back/nociplastic-pain.html` |
| `conditions/dizziness/bppv.html` | `conditions/dizziness/bppv-crystal-disease.html` |
| `conditions/dizziness/pppd.html` | `conditions/dizziness/pppd-chronic-dizziness.html` |
| `conditions/jaw/clicking-locking.html` | `conditions/jaw/clicking-locking-joint-problems.html` |
| `conditions/jaw/chewing-pain.html` | `conditions/jaw-pain.html` |
| `conditions/jaw/teeth-grinding.html` | `conditions/jaw/bruxism.html` |
| `conditions/hip/pelvic-girdle-pain.html` | `conditions/hip/pelvic-pain-pregnancy.html` |

#### 3. Broken Links Fixed in English Blog Posts (7 files)
Fixed `bppv.html` → `bppv-crystal-disease.html` in:
- dizzy-when-standing-up.html
- elderly-dizziness-fall-risk.html
- dizziness-myths.html
- dizziness-not-bppv.html
- subtle-bppv.html
- dizzy-and-nauseous.html
- dizzy-in-bed.html

### CSS Standardization Applied
- Mobile CTA colors: teal → orange (#F26522)
- Stat-number/stat-label font sizes standardized
- Location-section CSS added where missing
- Hub-hero CSS added to 268+ files

### FAQ Pages Status
- **24 FAQ pages** exist in `/faq/` folder
- **Already linked** from both `faq.html` (NO) and `en/faq.html` (EN)
- No orphan pages - all properly connected

### Header/Footer Status
- 493/494 files have proper header/footer
- 1 file was broken (osteitis-pubis.html) - now fixed

---

## Blog Design Standardization (January 2026)

### Project Status
- **Phase 1 COMPLETE:** All 42 blog files have hub-wrapper structure
- **Phase 2 COMPLETE:** Full design components implemented on proof of concept
- **Phase 2 Visual QA:** CSS fixes applied to test files (svimmel-og-kvalm.html, gtps-gluteal-tendinopati.html, krystallsyke-bppv.html)

### Visual Fixes Applied (Jan 2026)
1. **Mobile CTA Button:** Orange background (#F26522) with WHITE button and orange text (high contrast)
2. **Infographic:** max-width: 100% (was 800px)
3. **Stat-grid:** stat-number: 1.5rem (was 2rem), stat-label: 0.75rem (was 0.9rem)
4. **Location-section CSS:** Added for green line design pattern
5. **Internal links:** Added to condition cards and info boxes
6. **Hub Hero CSS:** Full styling with teal gradient, 150px top padding for header
7. **Hub CTA:** Orange button on teal gradient, with box-shadow
8. **Sidebar conversion card:** Styled with orange CTA button

### New Components Added to Template (Jan 2026)
- `myth-box` - Amber background for myth busting
- `key-points` - Blue gradient summary box
- `insight-card` - Gray card with variants (.tip, .warning)
- `quote-block` - Styled blockquote
- `step-list` - Numbered steps with circular badges
- `test-card` - Gray card for tests/exercises
- `comparison-table` - Styled table

### Reference Files
- **Gold standard:** `plager/hofte-og-bekkensmerter.html` (hip hub)
- **Blog proof of concept:** `blogg/svimmel-og-kvalm.html` (fully enhanced)
- **Design guide:** `scripts/DESIGN-GUIDE.md`

### CSS Stack
- Use `pages-combined.min.css` for all blog/hub pages
- Include inline `<style>` with CSS variables and component styles
- Copy inline CSS from hip hub for consistency

### Key Components
1. `premium-summary-card` - TL;DR box with blue gradient
2. `hub-section` + `section-header` + `section-number` - Numbered sections
3. `red-flag-alert` - Prominent warning with link
4. `red-flag-box` - Warning list
5. `treatment-box` - Green treatment info
6. `info-box` - Blue info cards
7. `condition-card` - White cards for conditions
8. `stat-grid` + `stat-item` - Statistics display
9. `prognosis-highlight` - Green positive outcome box
10. `faq-item` - FAQ styling
11. `hub-cta` - Call to action with gradient
12. `related-box` - Related articles
13. `sources-section` - Citations
14. `medical-disclaimer` - Disclaimer at bottom
15. `hub-infographic` - Featured images

### CSS Variables
```css
:root {
  --hub-primary: #1a5f7a;   /* Primary teal */
  --hub-dark: #0d3d4d;      /* Dark teal */
  --hub-red: #dc2626;       /* Warnings */
  --hub-green: #059669;     /* Treatment */
  --hub-blue: #2563eb;      /* Info */
  --hub-purple: #7c3aed;    /* Stats */
  --hub-orange: #ea580c;    /* Accent */
}
```

### Encoding
ALWAYS use UTF-8 BOM:
```powershell
[System.IO.File]::WriteAllText($path, $content, [System.Text.UTF8Encoding]::new($true))
```

### Image Sources
- **Infographics:** `images/infographics/[category]/` (webp format)
- **Photos:** `images/plager [condition]/` or `images/Tjenester [service]/`
- **Original PNGs:** `images-originals/Google LM/[folder]/`

### Schema.org
All blog posts should include:
- `MedicalWebPage` type
- `FAQPage` type (if FAQs present)
- Author: Mads Finstad, Kiropraktor
- Publisher: Klinikk for alle Majorstua

### Scripts Location
`F:\0 - 0 - Totall Clarity\0 - 0 - Nettside code – Kopi\website\scripts\`
- `convert-to-hub-layout.ps1` - Structural conversion
- `blog-template.html` - Master template (needs update)
- `DESIGN-GUIDE.md` - Component documentation

### Common Issues
1. **Encoding:** Check for mojibake (Ã¥ instead of å)
2. **Missing CSS:** Verify pages-combined.min.css is linked
3. **TOC:** Ensure h2 elements have id attributes
4. **Images:** Use webp format, lazy loading

### Next Steps
1. Update `scripts/blog-template.html` with full design
2. Create enhancement script for batch processing
3. Run batch enhancement on remaining 41 files
4. Final verification

---

## Website Structure

### Main Directories
- `/blogg/` - Blog articles (42 files)
- `/plager/` - Condition hub pages
- `/css/` - Stylesheets
- `/js/` - JavaScript files
- `/images/` - Image assets
- `/scripts/` - PowerShell scripts and templates

### Key Files
- `css/pages-combined.min.css` - Main stylesheet
- `css/hub-article.css` - Hub component styles
- `js/script.min.js` - Main JavaScript
- `js/modern-enhancements.min.js` - Modern features
