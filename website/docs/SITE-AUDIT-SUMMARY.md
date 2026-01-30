# Website Audit Summary

**Generated:** 2026-01-29
**Total Pages Scanned:** 492
**Site:** thebackrom.com (Norwegian + English bilingual healthcare site)

---

## Executive Summary

| Category | Status | Count |
|----------|--------|-------|
| Critical Issues | 🔴 | 21 |
| Warnings | 🟡 | 71 |
| Info/Recommendations | 🔵 | 500+ |

### Critical Issues (Fix Immediately)

1. **21 Broken Hreflang Targets** - URLs in HTML pointing to wrong domains (`thebackrom.no`, `www.thebackrom.com`)
2. **1 Missing Image** - `images/plager%20hodepine-og-migrene/hodepine-optimized.webp` on index.html

### Warnings (Fix Soon)

1. **51 Missing Bidirectional Hreflang** - Pages A→B but B doesn't link back to A
2. **45 Orphan Pages** - No internal links pointing to them
3. **17 Hub Subnavs Incomplete** - Hub pages missing links to their sub-articles
4. **36 Sub-Articles Missing Hub Backlink** - Sub-articles not linking to parent hub
5. **2 Blog Index Pages** - 9 external scripts (1 over limit)

---

## Detailed Reports

| Report | Location | Summary |
|--------|----------|---------|
| Full Audit | [FULL-AUDIT-REPORT.md](FULL-AUDIT-REPORT.md) | Meta, Schema, Performance, Accessibility |
| Interlinking | [INTERLINKING-REPORT.md](INTERLINKING-REPORT.md) | Hub↔Article linking patterns |
| Hreflang | [HREFLANG-REPORT.md](HREFLANG-REPORT.md) | Bidirectional consistency, missing translations |
| Orphan Pages | [ORPHAN-PAGES-REPORT.md](ORPHAN-PAGES-REPORT.md) | Pages with zero inbound links |
| Mirror Structure | [MIRROR-STRUCTURE-REPORT.md](MIRROR-STRUCTURE-REPORT.md) | NO↔EN content parity |

---

## Site Structure Overview

### Content Distribution

| Content Type | Norwegian | English | Total |
|--------------|-----------|---------|-------|
| Hub Pages | 13 | 12 | 25 |
| Sub-Articles | 151 | 148 | 299 |
| Blog Posts | 43 | 43 | 86 |
| FAQ Pages | 13 | 13 | 26 |
| Other Pages | ~28 | ~28 | ~56 |
| **Total** | **~248** | **~244** | **492** |

### Hreflang Status

- **491 pages** have hreflang tags
- **2 pages** intentionally single-language (piriformis-syndrom.html, nociplastisk-smerte.html)
- **Sitemap.xml** now includes xhtml:link hreflang entries for all applicable URLs

---

## Priority Action Items

### 🔴 Priority 1: Critical (Do Now)

1. **Fix broken hreflang URLs** (21 files)
   - Replace `thebackrom.no` → `thebackrom.com`
   - Replace `www.thebackrom.com` → `thebackrom.com`
   - Files: `en/conditions/elbow-arm/*.html`, `en/conditions/hip/bursitis-myth.html`

2. **Fix missing image** (1 file)
   - `index.html` → `images/plager%20hodepine-og-migrene/hodepine-optimized.webp`

### 🟡 Priority 2: Warnings (This Week)

1. **Add bidirectional hreflang links** (51 pages)
   - Mostly in `/faq/` directory - Norwegian FAQs missing return links

2. **Add orphan pages to navigation** (45 pages)
   - 10 sub-articles → add to hub subnavs
   - 19 blog posts → add to blog index/related posts
   - 9 FAQ pages → add to faq.html
   - 3 service pages → add to services.html

3. **Update hub subnavs** (17 hubs)
   - Add missing sub-article links to hub page navigation sections
   - See INTERLINKING-REPORT.md for specific files

4. **Add hub backlinks** (36 sub-articles)
   - Add "Back to [Parent Hub]" links in breadcrumbs
   - Mostly in `/plager/hofte/` and `/plager/fot/`

### 🔵 Priority 3: Recommendations (When Time Permits)

1. **Low word count pages** (12 pages) - Consider expanding content
2. **Missing breadcrumbs** (4 pages) - Add navigation breadcrumbs
3. **Low link count pages** (52 pages) - Add more internal links
4. **Missing translations** - Consider creating EN versions of top NO content

---

## Scripts Created

| Script | Purpose | Usage |
|--------|---------|-------|
| `audit-interlinking.js` | Check Blog↔Hub, Hub↔Article links | `node scripts/audit-interlinking.js` |
| `audit-hreflang.js` | Verify bidirectional hreflang consistency | `node scripts/audit-hreflang.js` |
| `audit-orphans.js` | Find pages with zero inbound links | `node scripts/audit-orphans.js` |
| `audit-mirror.js` | Compare NO↔EN structure | `node scripts/audit-mirror.js` |
| `add-sitemap-hreflang.js` | Add xhtml:link to sitemap.xml | `node scripts/add-sitemap-hreflang.js` |

### Run All Audits

```bash
cd website
node scripts/full-audit.js
node scripts/audit-interlinking.js
node scripts/audit-hreflang.js
node scripts/audit-orphans.js
node scripts/audit-mirror.js
```

---

## Metrics Comparison

### Before This Audit
- Sitemap: No hreflang entries
- Orphan pages: Unknown
- Interlinking issues: Unknown

### After This Audit
- Sitemap: 491 URLs with hreflang entries ✅
- Orphan pages: 45 identified with suggested parents
- Interlinking issues: 53 hub/sub-article link gaps identified
- Bidirectional hreflang issues: 51 identified

---

## Next Steps

1. Run `node scripts/full-audit.js` after fixes to verify
2. Re-run individual audits to confirm issues resolved
3. Consider automating audits in CI/CD pipeline
4. Schedule monthly audit runs to catch regressions

---

## Known Acceptable Issues

These are intentional and don't need fixing:

1. **2 single-language pages** without hreflang
   - `plager/hofte/piriformis-syndrom.html`
   - `plager/korsrygg/nociplastisk-smerte.html`

2. **Low word count on index pages** (expected - these are navigation pages)
   - `blogg/index.html`
   - `plager.html`
   - `services.html`

3. **Missing breadcrumbs on homepages** (design choice)
   - `index.html`
   - `en/index.html`
   - `404.html`
