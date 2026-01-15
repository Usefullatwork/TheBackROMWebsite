# Video Summary Component

## Overview
Add YouTube video summaries to hub pages for users who prefer watching/listening over reading.

**Placement:** After the premium-summary-card, before the hub-subnav links.

---

## HTML Template

Copy this and paste it after the `</div>` of the `premium-summary-card`:

```html
            <!-- Video Summary -->
            <div class="hub-video-summary">
              <div class="hub-video-summary__header">
                <div class="hub-video-summary__icon">
                  <i class="fas fa-play"></i>
                </div>
                <h3 class="hub-video-summary__title">Watch & Listen</h3>
              </div>
              <p class="hub-video-summary__subtitle">Prefer listening? Here's a quick audio summary of this guide.</p>
              <div class="hub-video-summary__wrapper">
                <iframe
                  src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                  title="[Condition] - Quick Guide Summary"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen>
                </iframe>
              </div>
            </div>
```

---

## How to Get the Video ID

YouTube URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`

Video ID: `dQw4w9WgXcQ` (the part after `v=`)

So your embed URL becomes: `https://www.youtube.com/embed/dQw4w9WgXcQ`

---

## Example for Knee Pain

```html
            </div> <!-- end of premium-summary-card -->

            <!-- Video Summary -->
            <div class="hub-video-summary">
              <div class="hub-video-summary__header">
                <div class="hub-video-summary__icon">
                  <i class="fas fa-play"></i>
                </div>
                <h3 class="hub-video-summary__title">Watch & Listen</h3>
              </div>
              <p class="hub-video-summary__subtitle">Prefer listening? Here's a quick audio summary of this guide.</p>
              <div class="hub-video-summary__wrapper">
                <iframe
                  src="https://www.youtube.com/embed/abc123xyz"
                  title="Knee Pain - Quick Guide Summary"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen>
                </iframe>
              </div>
            </div>

            <!-- Sub-article navigation with descriptions -->
            <nav class="hub-subnav">
```

---

## Video IDs Per Page

Fill in as you upload videos:

| Page | YouTube Video ID | Status |
|------|-----------------|--------|
| knee-pain.html | | Pending |
| lower-back-pain.html | | Pending |
| neck-pain.html | | Pending |
| headache.html | | Pending |
| shoulder-pain.html | | Pending |
| hip-pain.html | | Pending |
| jaw-pain.html | | Pending |
| foot-pain.html | | Pending |
| arm-pain.html | | Pending |
| thoracic-pain.html | | Pending |
| dizziness.html | | Pending |
| back-pain.html | | Pending |
| sports-injuries.html | | Pending |

---

## Performance Notes

- `loading="lazy"` = video only loads when user scrolls to it
- Adds ~100KB to page when scrolled into view
- No impact on initial page load
- Increases time-on-page (good for SEO)

---

## Styling

The component uses these CSS classes (already in hub-article.css):
- `.hub-video-summary` - container with gradient background
- `.hub-video-summary__header` - icon + title row
- `.hub-video-summary__wrapper` - 16:9 responsive video container

Colors match the hub-article design system.
