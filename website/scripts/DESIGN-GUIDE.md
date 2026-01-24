# TheBackROM Blog Design Guide

## Overview
This guide documents the design system for blog posts, matching the hub page design
established in `plager/hofte-og-bekkensmerter.html`.

## CSS Architecture

### Primary CSS Files
- `css/pages-combined.min.css` - Main styles (use for all pages)
- `css/hub-article.css` - Hub component definitions (reference only)

### Inline CSS Required
Blog posts require inline CSS in `<style>` tag within `<head>` for:
- CSS custom properties (variables)
- Component-specific styles not in combined CSS
- Mobile responsive overrides

### CSS Variables
```css
:root {
  --hub-primary: #1a5f7a;   /* Primary teal */
  --hub-dark: #0d3d4d;      /* Dark teal for headings */
  --hub-red: #dc2626;       /* Red flags, warnings */
  --hub-green: #059669;     /* Treatment, positive */
  --hub-blue: #2563eb;      /* Info boxes */
  --hub-purple: #7c3aed;    /* Stats, highlights */
  --hub-orange: #ea580c;    /* Accent */
}
```

---

## Component Reference

### 1. Hub Intro Section
```html
<section class="hub-intro">
  <div class="intro-text">
    <p>Introduction paragraph...</p>
    <p><strong>Key point:</strong> Important information...</p>
  </div>
  <!-- Add premium-summary-card, red-flag-alert, infographic, stat-grid here -->
</section>
```

CSS:
```css
.hub-intro { margin-bottom: 48px; }
.intro-text { font-size: 1.1rem; line-height: 1.8; color: #374151; }
.intro-text p { margin-bottom: 16px; }
```

### 2. Premium Summary Card (TL;DR)
```html
<div class="premium-summary-card">
  <h3>Kort oppsummert</h3>
  <ul>
    <li>Point 1 - <strong>key stat</strong></li>
    <li>Point 2</li>
  </ul>
</div>
```

CSS:
```css
.premium-summary-card {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12px;
  padding: 24px;
  margin: 24px 0;
  border-left: 4px solid var(--hub-primary);
}
```

### 3. Section with Number Badge
```html
<section class="hub-section" id="s1">
  <div class="section-header">
    <span class="section-number">1</span>
    <h2>Section Title</h2>
  </div>
  <!-- content -->
</section>
```

CSS:
```css
.hub-section { margin-bottom: 48px; scroll-margin-top: 100px; }
.section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
.section-number {
  background: var(--hub-primary);
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}
```

### 4. Red Flag Alert (Prominent Warning)
```html
<div class="red-flag-alert">
  <h4>Warning Title</h4>
  <p>Warning description</p>
  <a href="#section">Les mer</a>
</div>
```

CSS:
```css
.red-flag-alert {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 2px solid var(--hub-red);
  border-radius: 12px;
  padding: 20px;
  margin: 24px 0;
}
.red-flag-alert h4 { color: var(--hub-red); }
.red-flag-alert p { color: #7f1d1d; }
.red-flag-alert a { color: var(--hub-red); font-weight: 600; }
```

### 5. Red Flag Box (List of Warnings)
```html
<div class="red-flag-box">
  <h3>Warning Title</h3>
  <ul>
    <li><strong>Item</strong> - description</li>
  </ul>
</div>
```

CSS:
```css
.red-flag-box {
  background: #fef2f2;
  border: 2px solid #fca5a5;
  border-radius: 12px;
  padding: 24px;
  margin: 24px 0;
}
.red-flag-box h3 { color: var(--hub-red); }
.red-flag-box li { color: #7f1d1d; font-weight: 500; }
```

### 6. Treatment Box (Green)
```html
<div class="treatment-box">
  <h4>Treatment Title</h4>
  <p>Treatment description with <strong>key stats</strong>.</p>
  <ul>
    <li>Treatment item</li>
  </ul>
</div>
```

CSS:
```css
.treatment-box {
  background: #ecfdf5;
  border: 1px solid #6ee7b7;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
}
.treatment-box h4 { color: var(--hub-green); }
.treatment-box p, .treatment-box li { color: #065f46; }
```

### 7. Info Box (Blue)
```html
<div class="info-box">
  <h4>Info Title</h4>
  <p>Information content</p>
</div>
```

CSS:
```css
.info-box {
  background: #eff6ff;
  border: 1px solid #93c5fd;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
}
.info-box h4 { color: var(--hub-blue); }
.info-box p { color: #1e40af; }
```

### 8. Condition Card (White)
```html
<div class="condition-card">
  <h4>Condition Name</h4>
  <p>Description...</p>
  <p><strong>Who's affected?</strong> Statistics...</p>
</div>
```

CSS:
```css
.condition-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  margin: 20px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.condition-card h4 { color: var(--hub-primary); }
```

### 9. Stat Grid
```html
<div class="stat-grid">
  <div class="stat-item">
    <div class="stat-number">74%</div>
    <div class="stat-label">Description of stat</div>
  </div>
</div>
```

CSS:
```css
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin: 24px 0;
}
.stat-item {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}
.stat-number { font-size: 1.5rem; font-weight: 700; color: var(--hub-primary); }
.stat-label { color: #64748b; font-size: 0.75rem; margin-top: 4px; }
```

### 10. Prognosis Highlight (Positive Outcome)
```html
<div class="prognosis-highlight">
  <p>Positive message about outcomes.</p>
</div>
```

CSS:
```css
.prognosis-highlight {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  border-left: 4px solid var(--hub-green);
}
.prognosis-highlight p { color: #065f46; font-weight: 500; margin: 0; }
```

### 11. FAQ Item
```html
<div class="faq-item">
  <h4>Question?</h4>
  <p>Answer text</p>
</div>
```

CSS:
```css
.faq-item { border-bottom: 1px solid #e5e7eb; padding: 20px 0; }
.faq-item:last-child { border-bottom: none; }
.faq-item h4 { color: var(--hub-dark); font-size: 1.05rem; }
.faq-item p { color: #4b5563; line-height: 1.6; }
```

### 12. Hub CTA
```html
<div class="hub-cta">
  <h3>CTA Title</h3>
  <p>CTA description with pricing</p>
  <a href="..." class="button">Bestill time</a>
  <p style="margin-top: 16px; font-size: 0.9rem;">Phone: <a href="tel:..." style="color: white;">number</a></p>
</div>
```

CSS:
```css
.hub-cta {
  background: linear-gradient(135deg, var(--hub-primary) 0%, var(--hub-dark) 100%);
  color: white;
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  margin: 40px 0;
}
.hub-cta h3 { color: white !important; font-size: 1.5rem; }
.hub-cta .button {
  background: white;
  color: var(--hub-primary);
  padding: 14px 32px;
  border-radius: 8px;
  font-weight: 600;
}
```

### 13. Related Articles Box
```html
<div class="related-box">
  <h3>Relaterte artikler</h3>
  <a href="...">Article 1</a>
  <a href="...">Article 2</a>
</div>
```

CSS:
```css
.related-box {
  background: #f8fafc;
  border-radius: 12px;
  padding: 24px;
  margin-top: 32px;
}
.related-box a {
  display: block;
  padding: 12px 0;
  color: var(--hub-primary);
  border-bottom: 1px solid #e5e7eb;
}
.related-box a:hover { padding-left: 8px; }
```

### 14. Sources Section
```html
<div class="sources-section">
  <h3>Kilder</h3>
  <p>Author. Title. Journal. Year</p>
</div>
```

CSS:
```css
.sources-section {
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}
.sources-section p { font-size: 0.9rem; color: #64748b; }
```

### 15. Medical Disclaimer
```html
<div class="medical-disclaimer">
  <strong>Medisinsk informasjon:</strong> Denne artikkelen er skrevet av Kiropraktor Mads Finstad...
</div>
```

CSS:
```css
.medical-disclaimer {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  margin-top: 32px;
  font-size: 0.85rem;
  color: #64748b;
}
```

### 16. Hub Infographic Image
```html
<img src="../images/infographics/[category]/[image].webp"
     alt="Descriptive alt text"
     class="hub-infographic"
     loading="lazy"
     decoding="async" />
```

CSS:
```css
.hub-infographic {
  width: 100%;
  max-width: 100%;  /* Full width for readability */
  height: auto;
  border-radius: 12px;
  margin: 24px 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

### 19. Hub Hero Section
```html
<section class="hub-hero">
  <div class="hub-hero__container">
    <span class="blog-post__category">Kategori</span>
    <h1>Artikkeltittel</h1>
    <p class="hub-hero__subtitle">Undertittel | Kiropraktor Mads Finstad</p>
    <div class="blog-post__meta">
      <time class="blog-post__date" datetime="2026-01-24">24. januar 2026</time>
      <span class="blog-post__author">Mads Finstad</span>
    </div>
  </div>
</section>
```

CSS:
```css
.hub-hero {
  background: linear-gradient(135deg, var(--hub-dark) 0%, var(--hub-primary) 100%);
  color: #ffffff !important;
  padding: 150px 20px 60px;
  text-align: center;
}
.hub-hero__container { max-width: 900px; margin: 0 auto; }
.hub-hero h1 { font-size: 2.5rem; font-weight: 700; color: #ffffff !important; }
.hub-hero__subtitle { font-size: 1.1rem; color: #ffffff !important; opacity: 0.95; }
```

### 20. Myth Box (Amber)
```html
<div class="myth-box">
  <h4>Myte: "Vanlig misforståelse"</h4>
  <p>Fakta: Sannheten er at...</p>
</div>
```

CSS:
```css
.myth-box {
  background: #fffbeb;
  border: 1px solid #fbbf24;
  border-radius: 12px;
  padding: 20px;
}
.myth-box h4 { color: #92400e; }
.myth-box p { color: #78350f; }
```

### 21. Key Points Box
```html
<div class="key-points">
  <h3>Viktige punkter</h3>
  <ul>
    <li>Punkt 1</li>
    <li>Punkt 2</li>
  </ul>
</div>
```

### 22. Insight Card
```html
<div class="insight-card tip">
  <h4>Tips</h4>
  <p>Nyttig informasjon...</p>
</div>
```
Variants: `.insight-card`, `.insight-card.tip` (green), `.insight-card.warning` (orange)

### 23. Quote Block
```html
<div class="quote-block">
  <p>"Sitat eller viktig utsagn her."</p>
  <cite>- Kilde</cite>
</div>
```

### 24. Step List
```html
<ol class="step-list">
  <li>Første steg med forklaring</li>
  <li>Andre steg med forklaring</li>
  <li>Tredje steg med forklaring</li>
</ol>
```

---

## Internal Linking

**All condition cards and info boxes should include relevant internal links.**

Pattern for adding links in cards:
```html
<div class="condition-card">
  <h4>Condition Name</h4>
  <p>Description text...</p>
  <p><a href="../plager/[category]/[condition].html" style="color: var(--hub-primary); font-weight: 600;">Les mer om [condition] →</a></p>
</div>
```

For info boxes, use matching color:
```html
<p><a href="..." style="color: var(--hub-blue); font-weight: 600;">Les mer →</a></p>
```

For treatment boxes:
```html
<p><a href="..." style="color: var(--hub-green); font-weight: 600;">Les mer →</a></p>
```

---

## Image Sources

**Primary source for infographics:** `images/infographics/[category]/`
- `korsrygg/` - Lower back
- `nakke/` - Neck
- `kjeve/` - Jaw/TMD
- `svimmelhet/` - Dizziness/vertigo
- `hodepine/` - Headache/migraine

**Photos:** `images/plager [condition]/` or `images/Tjenester [service]/`

**Stock photos:** `images/_stock/`

---

## Schema.org Structured Data

Add to `<head>` before closing:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalWebPage",
      "name": "Article Title",
      "description": "Article description",
      "url": "https://thebackrom.com/blogg/article.html",
      "mainContentOfPage": { "@type": "WebPageElement", "cssSelector": ".hub-main" },
      "medicalAudience": { "@type": "MedicalAudience", "audienceType": "Patient" },
      "specialty": { "@type": "MedicalSpecialty", "name": "Chiropractic" },
      "author": { "@type": "Person", "name": "Mads Finstad", "jobTitle": "Kiropraktor" },
      "publisher": {
        "@type": "MedicalBusiness",
        "name": "Klinikk for alle Majorstua",
        "address": { "@type": "PostalAddress", "streetAddress": "Gardeveien 17", "addressLocality": "Oslo", "postalCode": "0363" }
      },
      "datePublished": "YYYY-MM-DD",
      "lastReviewed": "YYYY-MM-DD"
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Question text?",
          "acceptedAnswer": { "@type": "Answer", "text": "Answer text" }
        }
      ]
    }
  ]
}
</script>
```

---

## Mobile Responsive

Key breakpoint at 900px:
```css
@media (max-width: 900px) {
  .hub-wrapper { flex-direction: column; padding: 20px; }
  .hub-sidebar { display: none; }
  .hub-main { max-width: 100%; padding-bottom: 100px; }
  .hub-intro h1 { font-size: 1.8rem; }
  .mobile-sticky-cta { display: block; }
  .stat-grid { grid-template-columns: repeat(2, 1fr); }
}
```

### 17. Mobile Sticky CTA (Orange with White Button)
```html
<div class="mobile-sticky-cta">
  <a href="https://onlinebooking.solvitjournal.no/..." target="_blank" rel="noopener">Bestill time</a>
</div>
```

CSS:
```css
.mobile-sticky-cta {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #F26522;
  padding: 12px 16px;
  z-index: 100;
  box-shadow: 0 -4px 20px rgba(0,0,0,0.2);
}
.mobile-sticky-cta a {
  display: block;
  background: white;
  color: #F26522;
  text-align: center;
  padding: 14px 24px;
  border-radius: 8px;
  font-weight: 700;
  text-decoration: none;
  font-size: 1.05rem;
}
@media (max-width: 900px) {
  .mobile-sticky-cta { display: block; }
}
```

### 18. Location Section (Green Line Design)
Used for subsections with green numbered circles and dark header bars.

```html
<div class="location-section">
  <div class="location-header">
    <span class="section-number" style="background: #059669;">1</span>
    <h4>Subsection Title</h4>
  </div>
  <div class="location-content">
    <p>Content here...</p>
  </div>
</div>
```

CSS:
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
  padding: 20px 24px;
}
.location-content p {
  color: #374151;
  line-height: 1.6;
  margin-bottom: 12px;
}
```

---

## TOC Active State Script

Add before `</body>`:
```html
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.hub-section');
    const navLinks = document.querySelectorAll('.hub-toc-card a');
    function updateActiveLink() {
      let currentSection = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 150) {
          currentSection = section.getAttribute('id');
        }
      });
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
          link.classList.add('active');
        }
      });
    }
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
  });
</script>
```

---

## Encoding

ALWAYS save with UTF-8 BOM for Norwegian characters:
```powershell
[System.IO.File]::WriteAllText($path, $content, [System.Text.UTF8Encoding]::new($true))
```

---

## Checklist for Blog Conversion

- [ ] Schema.org MedicalWebPage + FAQPage added
- [ ] Inline CSS with variables and component styles
- [ ] og:image meta tag added
- [ ] Hub intro section with intro-text class
- [ ] Premium summary card (TL;DR)
- [ ] Red flag alert (if applicable)
- [ ] Main infographic image (max-width: 100%)
- [ ] Stat grid (if applicable) - font sizes: 1.5rem/0.75rem
- [ ] Sections with numbered badges (hub-section, section-header, section-number)
- [ ] Condition cards for conditions **with internal links**
- [ ] Treatment boxes (green) for treatments **with internal links**
- [ ] Info boxes (blue) for information **with internal links**
- [ ] Red flag box for warnings
- [ ] FAQ items properly styled
- [ ] Hub CTA with gradient
- [ ] Related articles box
- [ ] Sources section styled
- [ ] Medical disclaimer at bottom
- [ ] Mobile sticky CTA (orange #F26522 button)
- [ ] TOC active state script
- [ ] Location-section CSS (for green line design if needed)

---

## Reference Files

- **Gold standard:** `plager/hofte-og-bekkensmerter.html`
- **Blog proof of concept:** `blogg/svimmel-og-kvalm.html`
- **Template:** `scripts/blog-template.html` (needs update)

---

## Scripts Location

- `scripts/convert-to-hub-layout.ps1` - Structural conversion
- `scripts/blog-template.html` - Master template
- `scripts/DESIGN-GUIDE.md` - This file
