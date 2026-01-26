# Website TODO List

**Last Updated:** 2026-01-25

---

## Completed Work

### Blog Enhancement & Validation QA (Jan 25, 2026) ✅
- [x] Ran `validate-page.js` on all blog files - all pass
- [x] Ran `check-links.js` on blogg/ - 0 broken links
- [x] Ran `check-images.js` on blogg/ - issues only in backup folders
- [x] Ran `scan-full-site.ps1` - 0 issues after fixes
- [x] Fixed 2 blog files with old stat font sizes:
  - `blogg/tekstnakke-kjevesmerter.html`
  - `blogg/tmd-ibs-mage-kjeve.html`
- [x] Updated validation system for Norwegian blog pages:
  - Added `nb-blog-article` profile to `scripts/validate-config.json`
  - Updated `scripts/validate-page.js` to auto-detect blogg/ files
  - Skip Norwegian word check for Norwegian pages

### Blog Enhancement Project (Jan 25, 2026) ✅
- [x] Phase 1: All commits (CSS fixes, Norwegian hub, contact/FAQ, scripts)
- [x] Phase 2: Blog enhancement preparation
- [x] Phase 3: All 35 blog files enhanced with hub design
- [x] Phase 4: Verified 42 files have premium-summary-card
- [x] Phase 5: Committed, pushed, PR #1 created and merged
- [x] Added README.md to project

### Website Audit & Fixes (Jan 24, 2026) ✅
- [x] Scanned 492 files for CSS issues - 0 remaining
- [x] Fixed truncated file: `en/conditions/hip/osteitis-pubis.html`
- [x] Fixed 8 broken links in `en/index.html`
- [x] Fixed 7 broken links in English blog posts (bppv.html → bppv-crystal-disease.html)
- [x] Standardized mobile CTA colors to orange (#F26522)
- [x] Added hub-hero CSS to 268+ files
- [x] Added location-section CSS where missing
- [x] Verified 24 FAQ pages are properly linked from hub pages
- [x] Verified 493/494 files have proper header/footer

### Content Consolidation (Jan 15, 2026)
- [x] Merged 8 high-volume blog duplicates into condition pages (EN + NO)
- [x] Moved 11 niche topics from conditions to blog (EN + NO)
- [x] Resolved 5 cross-hub duplicates with canonical pages
- [x] Updated hub pages with cross-links
- [x] Cleaned up sitemap

### SEO Audit (Jan 15, 2026)
- [x] Fixed CSS version on 167+ pages
- [x] Added blog carousel to 52 condition pages
- [x] Fixed 189 broken image paths
- [x] Fixed 63 broken internal links
- [x] Shortened 223+ page titles to under 60 chars
- [x] Trimmed 69 long meta descriptions
- [x] Added 292 missing pages to sitemap (530 total)
- [x] Fixed footer text on English pages
- [x] Added Open Graph tags to 32 pages
- [x] Blog translations complete (53 posts both languages)
- [x] Condition translations complete (175+ pages)

### Hub Page Conversions (ALL COMPLETE - 12/12)
- [x] lower-back-pain.html (validated)
- [x] neck-pain.html (validated)
- [x] headache.html (validated)
- [x] shoulder-pain.html (validated)
- [x] knee-pain.html (validated)
- [x] sports-injuries.html (validated)
- [x] thoracic-pain.html (validated)
- [x] hip-pain.html (validated)
- [x] jaw-pain.html (validated)
- [x] foot-pain.html (validated)
- [x] arm-pain.html (validated)
- [x] dizziness.html (validated)

### Audit System Improvements (Jan 15, 2026)
- [x] Created `scripts/validate-hubs.js` - batch validates all hub pages
- [x] Added `validate:hubs` to audit command in package.json
- [x] Updated `cspell.json` with author names from references
- [x] Fixed `check-links.js` to recognize `sms:` protocol

---

## Remaining Hub Pages (0)

All hub pages have been converted to the full hub format with validation passing (35+ passed, 0 failed).

| # | File | Norwegian Source | Status |
|---|------|------------------|--------|
| ~~6~~ | ~~`/en/conditions/hip-pain.html`~~ | ~~`/plager/hofte-og-bekkensmerter.html`~~ | DONE |
| ~~7~~ | ~~`/en/conditions/jaw-pain.html`~~ | ~~`/plager/kjevesmerte.html`~~ | DONE |
| ~~8~~ | ~~`/en/conditions/foot-pain.html`~~ | ~~`/plager/fotsmerte.html`~~ | DONE |
| ~~9~~ | ~~`/en/conditions/arm-pain.html`~~ | ~~`/plager/albue-arm.html`~~ | DONE |
| ~~10~~ | ~~`/en/conditions/dizziness.html`~~ | ~~`/plager/svimmelhet.html`~~ | DONE |
| ~~11~~ | ~~`/en/conditions/thoracic-pain.html`~~ | ~~`/plager/brystryggsmerter.html`~~ | DONE |
| ~~12~~ | ~~`/en/conditions/back-pain.html`~~ | N/A (deleted - covered by lower-back) | SKIP |
| ~~13~~ | ~~`/en/conditions/sports-injuries.html`~~ | ~~`/plager/idrettsskader.html`~~ | DONE |

---

## Future Improvements

### Visual QA (Manual Browser Testing)
Test 3-5 representative blog files:
- [ ] Test mobile responsive layout
- [ ] Verify TOC navigation works (sidebar links)
- [ ] Confirm infographics load
- [ ] Test sticky CTA button (appears on scroll)
- [ ] Check hub design elements (hero, sidebar, stats grid)

Recommended test files:
- `blogg/diskogen-smerte.html` (standard)
- `blogg/kiropraktor-vs-fysioterapeut.html` (comparison)
- `blogg/isjias-prolaps-hekseskudd-forskjell.html` (infographic)

### Performance
- [ ] Run Lighthouse audit
- [ ] Check Core Web Vitals
- [ ] Test mobile performance

### Accessibility
- [ ] Run accessibility audit
- [ ] Check color contrast
- [ ] Verify keyboard navigation

### Manual Tasks (Require Login)
- [ ] Review Google Search Console
- [ ] Submit updated sitemap
- [ ] Check crawl errors

---

## Notes

### Hub Page Conversion Process
1. Read Norwegian source + English file
2. Use `knee-pain.html` as template (gold standard)
3. Convert content (translate, don't copy)
4. Run validation: `node scripts/validate-page.js [file]`
5. Run spell check: `npm run spellcheck:hub`
6. Fix until 0 issues
7. Move to next page

### Quality Gates
- Validation: 35+ passed, 0 failed
- Spell check: 0 issues
- File size: 25-50KB
