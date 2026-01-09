# Blog Post Creation Guide

## Overview

This guide explains how to create individual blog posts using the new `blogg/posts/` folder structure. You have two options for creating blog posts:

1. **JavaScript-based posts** (current system)
2. **Individual HTML files** (new system)
3. **Hybrid approach** (recommended)

## Folder Structure

```
website/
├── blogg/
│   ├── index.html                    # Main blog page
│   ├── klinisk-blogg.html           # Klinisk section
│   ├── spesialinteresser-blogg.html  # Whatever Tickles My Brain
│   ├── create-post-template.html     # Content creation tool
│   ├── post-template.html           # Template for individual posts
│   ├── js/
│   │   ├── blog-categories.js        # Category system
│   │   └── blog-posts.js            # Post data (summaries)
│   └── posts/                       # Individual blog post files
│       ├── 2025-01-15-nakkesmerter-tips.html
│       ├── 2025-01-20-dry-needling-guide.html
│       └── [more posts...]
```

## Creating a New Blog Post

### Step 1: Plan Your Post

Before creating, decide:
- **Title**: Clear, descriptive title
- **Categories**: Which sections should it appear in? (innlegg, klinisk, brain)
- **Tags**: Relevant tags from your category system
- **Target audience**: Patients, clinicians, or both?

### Step 2: Choose Your Method

#### Option A: Use Create Tool (Recommended)
1. Open `blogg/create-post-template.html`
2. Fill in all post details
3. Select appropriate categories and tags
4. Generate the code for both JavaScript and individual HTML file

#### Option B: Manual Creation
1. Copy `blogg/post-template.html`
2. Rename following naming convention: `YYYY-MM-DD-post-title.html`
3. Replace all placeholders with your content
4. Save in `blogg/posts/` folder

### Step 3: Naming Convention

**File naming pattern**: `YYYY-MM-DD-post-title.html`

Examples:
- `2025-01-15-nakkesmerter-hjemmetrening.html`
- `2025-01-20-dry-needling-complete-guide.html`
- `2025-01-25-forskning-korsryggsmerter.html`
- `2025-02-01-svimmelhet-bppv-behandling.html`

### Step 4: Replace Template Placeholders

In your new HTML file, replace these placeholders:

| Placeholder | Example | Description |
|-------------|---------|-------------|
| `[POST_TITLE]` | "5 Øvelser for Nakkesmerter" | Main title of your post |
| `[POST_DESCRIPTION]` | "Enkle øvelser du kan gjøre hjemme..." | Meta description for SEO |
| `[POST_KEYWORDS]` | "nakkesmerter, øvelser, hjemmetrening" | SEO keywords |
| `[POST_CATEGORY]` | "Nakke" | Main category for display |
| `[POST_DATE]` | "15. januar 2025" | Publication date |
| `[READING_TIME]` | "5" | Estimated reading time |
| `[POST_IMAGE]` | "plager nakkesmerter/Nakkesmerte 2.jpg" | Featured image path |
| `[POST_FILENAME]` | "2025-01-15-nakkesmerter-tips.html" | Your file name |
| `[POST_CONTENT]` | Your full article content | Main content of the post |
| `[POST_TAGS]` | Generated tag links | HTML for category tags |

### Step 5: Content Guidelines

#### Post Structure
```html
<h2>Introduction</h2>
<p>Brief introduction to the topic...</p>

<h2>Main Content Section 1</h2>
<p>Detailed explanation...</p>
<ul>
  <li>Key point 1</li>
  <li>Key point 2</li>
</ul>

<h3>Subsection</h3>
<p>More specific information...</p>

<h2>Conclusion</h2>
<p>Summary and call-to-action...</p>
```

#### Writing Tips
- **Use clear headings** (H2, H3) to break up content
- **Include lists** for easy scanning
- **Add images** where relevant
- **Keep paragraphs short** (3-4 sentences max)
- **Include internal links** to other pages on your site
- **End with a call-to-action** (book appointment, contact, etc.)

### Step 6: Generate Tags HTML

Replace `[POST_TAGS]` with links to related content:

```html
<a href="../index.html?tag=nakkesmerter" class="blog-post__tag">Nakkesmerter</a>
<a href="../index.html?tag=hjemmetrening" class="blog-post__tag">Hjemmetrening</a>
<a href="../index.html?tag=tips" class="blog-post__tag">Tips</a>
```

### Step 7: Update JavaScript Index (Optional)

To make your post appear in the main blog sections, add an entry to `blogg/js/blog-posts.js`:

```javascript
{
  id: 'nakkesmerter-tips-2025',
  title: '5 Øvelser for Nakkesmerter',
  excerpt: 'Enkle øvelser du kan gjøre hjemme for å redusere nakkesmerter...',
  content: '', // Can be empty if using individual files
  author: 'Mads Finstad',
  date: '2025-01-15',
  categories: ['innlegg', 'tips', 'nakkesmerter', 'hjemmetrening'],
  image: 'plager nakkesmerter/Nakkesmerte 2.jpg',
  url: 'posts/2025-01-15-nakkesmerter-tips.html', // Link to individual file
  readTime: 5
}
```

## Image Guidelines

### Image Paths
- Use existing images from `images/` folders
- Reference with: `../../images/[folder]/[image-file]`
- Examples:
  - `../../images/plager nakkesmerter/Nakkesmerte 2.jpg`
  - `../../images/Tjenester/Dry needle.jpg`

### Image Requirements
- **Featured image**: 1200x600px recommended
- **In-content images**: 800px width max
- **Format**: JPG for photos, PNG for graphics
- **Alt text**: Always include descriptive alt text

## SEO Best Practices

### Meta Tags
- **Title**: 50-60 characters, include main keyword
- **Description**: 150-160 characters, compelling summary
- **Keywords**: 5-10 relevant keywords, comma-separated

### Content SEO
- **H1 tag**: One per page (your main title)
- **H2/H3 tags**: Use for structure and include keywords
- **Internal links**: Link to other relevant pages on your site
- **External links**: Link to authoritative sources when relevant

## Publishing Workflow

1. **Create post** using template
2. **Replace all placeholders**
3. **Test locally** (check all links and images)
4. **Add to JavaScript index** (if using hybrid approach)
5. **Upload to server**
6. **Test live version**
7. **Share on social media**

## Category Guidelines

### Innlegg (Main Blog)
- Mixed content for all audiences
- General health tips
- Patient-focused information

### Klinisk
- Professional content
- Research-based articles
- Clinical techniques and findings

### Whatever Tickles My Brain
- Personal thoughts and reflections
- Interesting health topics
- Patient education with personal touch

Use multiple categories to have posts appear in multiple sections!

## Maintenance Tips

- **Regular updates**: Review and update older posts
- **Broken links**: Check links periodically
- **Image optimization**: Compress images for faster loading
- **Backup**: Keep backups of your posts folder
- **Analytics**: Track which posts perform best

## Need Help?

If you need assistance with:
- Template customization
- JavaScript integration
- SEO optimization
- Image handling

Refer back to your `create-post-template.html` tool or consult this guide for reference! 🚀 

