# Blog Folder Structure

## Current Organization

```
website/
├── blogg/
│   ├── index.html                     # Main blog page ("Innlegg" section)
│   ├── klinisk-blogg.html            # "Klinisk" section
│   ├── spesialinteresser-blogg.html   # "Whatever Tickles My Brain" section
│   ├── create-post-template.html      # Tool for creating new blog posts
│   ├── js/
│   │   ├── blog-categories.js         # Category system and filtering functions
│   │   └── blog-posts.js             # Example blog posts and data structure
│   └── posts/                        # Individual blog post files
│       ├── 2025-01-15-nakkesmerter-hjemmetrening.html
│       ├── 2025-01-20-dry-needling-guide.html
│       ├── 2025-01-25-ryggtrening-tips.html
│       └── [more individual blog posts...]
```

## Naming Convention for Individual Posts

Recommended file naming pattern: `YYYY-MM-DD-post-title.html`

Examples:
- `2025-01-15-nakkesmerter-hjemmetrening.html`
- `2025-01-20-dry-needling-guide.html`
- `2025-01-25-forskning-korsryggsmerter.html`
- `2025-02-01-svimmelhet-behandling.html`

## Blog System Options

### Option 1: JavaScript-Based System (Current)
- Blog posts are stored in `js/blog-posts.js`
- Main blog pages display posts dynamically
- No individual HTML files needed
- Easy to manage categories and filtering

### Option 2: Individual HTML Files + JavaScript Index
- Individual blog posts as HTML files in `posts/` folder
- JavaScript system references these files
- Each post has its own URL
- Better for SEO and direct linking

### Option 3: Hybrid Approach
- Full blog posts as HTML files in `posts/` folder
- Summary/preview data in JavaScript system
- Main blog pages show previews, link to full posts

## Recommended Implementation

For your use case, I recommend **Option 2** or **Option 3**:

1. **Create individual blog post HTML files** in `blogg/posts/`
2. **Update JavaScript system** to reference these files
3. **Maintain category system** for filtering and organization

## File Structure Benefits

✅ **Organized**: All blog content in one place
✅ **Scalable**: Easy to add new posts
✅ **SEO-friendly**: Individual URLs for each post
✅ **Maintainable**: Clear separation of concerns
✅ **Professional**: Industry-standard blog structure

## Implementation Steps

1. Create `blogg/posts/` folder
2. Create individual blog post HTML templates
3. Update JavaScript system to reference individual files
4. Maintain existing category/filtering system
5. Update create-post-template.html to generate files in posts/ folder 
