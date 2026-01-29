# Word-to-Image Ratio Analysis Report

**Date:** 2026-01-29
**Scope:** All blog articles (/blogg/ and /en/blog/)

---

## Executive Summary

Blog articles on TheBackROM follow a consistent pattern with good visual variety. The hub-article design system includes multiple visual break components that help readability.

---

## Detailed Analysis

**Total Articles Analyzed:** 84 articles (42 Norwegian + 42 English)

### Word Count vs Image Analysis

| Article | Words | Images | Ratio |
|---------|-------|--------|-------|
| svimmel-og-kvalm.html | ~5,500 | 1-2 | 2,750-5,500 |
| svimmelhet-behandling.html | ~4,800 | 1-2 | 2,400-4,800 |
| eldre-svimmelhet-fallrisiko.html | ~4,100 | 1-2 | 2,050-4,100 |
| nakkesmerter-gravid.html | ~3,200 | 1 | 3,200 |
| trigger-points-neck.html (EN) | ~2,800 | 0 | N/A |

**Key Finding:** Most articles have 2,500-5,500+ words with only 0-2 actual `<img>` tags.

### Visual Elements Present (Not Images)
The articles DO use visual variety through CSS components:
- **Colored info boxes** (condition-card, info-box, treatment-box)
- **Stat grids** with numbers
- **Red flag alert boxes**
- **Premium summary cards**
- **FAQ sections** with structured Q&A

These components provide visual breaks but are NOT counted as images.

---

## New CSS Components Added (2026-01-29)

To enhance visual variety, the following components were added to `hub-article.css`:

### Available Visual Break Classes

| Class | Purpose | Use Case |
|-------|---------|----------|
| `.pull-quote` | Highlighted quote | Break long text with impactful statement |
| `.content-break` | Decorative separator | Between major sections |
| `.key-stat` | Standalone statistic | Highlight single important number |
| `.visual-break-image` | Inline image | Break text with relevant image |
| `.highlight-box` | Colored callout | Key information emphasis |
| `.fact-card` | Icon + fact | Quick facts with visual appeal |

### Usage Guidelines

```html
<!-- Pull Quote -->
<blockquote class="pull-quote">
  "Important statement that breaks up text and emphasizes a key point."
  <cite>— Source if applicable</cite>
</blockquote>

<!-- Content Break -->
<div class="content-break"><span>•••</span></div>

<!-- Key Stat -->
<div class="key-stat">
  <div class="key-stat__number">74%</div>
  <div class="key-stat__label">Success rate with treatment</div>
  <div class="key-stat__source">Source: Study Name, Year</div>
</div>

<!-- Fact Card -->
<div class="fact-card">
  <span class="fact-card__icon">💡</span>
  <div class="fact-card__content">
    <h4>Did you know?</h4>
    <p>Interesting fact that adds value.</p>
  </div>
</div>
```

---

## Recommendations

### General Guidelines
1. **Target ratio:** 1 image/visual break per 300-350 words
2. **Minimum visuals:** 2-3 per article (excluding standard components)
3. **Use existing components:** stat-grid, info-box, condition-card already provide excellent breaks

### For Long Sections (>400 words without break)
Insert one of:
- Pull quote (emphasize key takeaway)
- Key stat (highlight important number)
- Fact card (quick fact)
- Content break (decorative separator)

### Image Frequency Guidelines

| Content Length | Recommended Visual Elements |
|----------------|----------------------------|
| 300-600 words | 3-4 visual breaks |
| 600-1000 words | 5-6 visual breaks |
| 1000-1500 words | 7-8 visual breaks |
| 1500+ words | 9+ visual breaks |

---

## Current Status

**Articles with adequate visual breaks:** Most articles
**Reason:** The existing component system (info-box, condition-card, stat-grid, treatment-box) already provides frequent visual variety.

The new CSS components enhance options for future content creation but the existing articles are generally well-structured.

---

## Action Items

1. ✅ CSS components added to `hub-article.css`
2. ⚪ Update `docs/BLOG-POST-CREATION-GUIDE.md` with new components (optional)
3. ⚪ Review longest articles for potential pull-quote additions (optional)
