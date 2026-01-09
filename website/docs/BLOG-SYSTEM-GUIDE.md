# Blog Categories & Tags System Guide

This guide explains how to use the new blog categorization system for TheBackROM website.

## How It Works

Each blog post can have multiple categories/tags, allowing it to appear in different blog sections automatically.

## Blog Sections

1. **"Innlegg"** - Mix of content (general posts)
2. **"Klinisk"** - Professional/clinical content 
3. **"Whatever Tickles My Brain"** - Patient-focused content

## Available Tags

### Blog Section Tags (Required)
- `innlegg` - Post appears in "Innlegg" section
- `klinisk` - Post appears in "Klinisk" section  
- `brain` - Post appears in "Whatever Tickles My Brain" section

### Plager (Conditions) Tags
- `nakkesmerter` - Neck pain
- `skuldersmerter` - Shoulder pain
- `hoftesmerter` - Hip pain
- `idrettsskader` - Sports injuries
- `korsryggsmerte` - Lower back pain
- `svimmelhet` - Dizziness
- `hodepine` - Headache
- `ryggsmerter` - Back pain
- `knesmerter` - Knee pain
- `kjevesmerter` - Jaw pain
- `fotsmerter` - Foot pain
- `albuesmerter` - Elbow pain
- `handsmerter` - Hand/wrist pain

### Tjenester (Services) Tags
- `dryneedling` - Dry needling
- `fasciemanipulasjon` - Fascia manipulation
- `graston` - Graston technique
- `rehabilitering` - Rehabilitation
- `trykkbolge` - Shockwave therapy
- `kiropraktikk` - Chiropractic
- `blotvevsteknikker` - Soft tissue techniques
- `massasje` - Massage
- `svimmelhetbehandling` - Dizziness treatment

### General Tags
- `forskning` - Research
- `casestudy` - Case study
- `tips` - Tips and advice
- `anatomi` - Anatomy
- `fysiologi` - Physiology
- `forebygging` - Prevention
- `hjemmetrening` - Home exercise
- `ernering` - Nutrition
- `livsstil` - Lifestyle

## How to Create a Blog Post

### 1. Define Your Post Data
```javascript
const newPost = {
    id: 'unique-post-id',
    title: 'Your Post Title',
    excerpt: 'Short description of the post...',
    content: 'Full post content...',
    image: 'path/to/image.jpg',
    date: '20. januar 2025',
    author: 'Mads',
    categories: ['innlegg', 'brain', 'nakkesmerter', 'tips'], // Choose multiple categories
    readTime: '5 min'
};
```

### 2. Choose Categories Strategically

**Examples:**

**Clinical Post (Only for professionals):**
```javascript
categories: ['klinisk', 'nakkesmerter', 'forskning', 'casestudy']
// Only appears in "Klinisk" section
```

**Patient-Friendly Post:**
```javascript
categories: ['brain', 'innlegg', 'ryggsmerter', 'tips', 'hjemmetrening']
// Appears in both "Whatever Tickles My Brain" and "Innlegg" sections
```

**General Post:**
```javascript
categories: ['innlegg', 'hodepine', 'livsstil']
// Only appears in "Innlegg" section
```

## Post Distribution Examples

### Example 1: Research Article
```javascript
{
    title: 'Ny forskning på dry needling',
    categories: ['klinisk', 'dryneedling', 'forskning']
    // ✅ Appears in: Klinisk
    // ❌ Does NOT appear in: Innlegg, Whatever Tickles My Brain
}
```

### Example 2: Patient Tips
```javascript
{
    title: 'Hjemmeøvelser for nakkesmerter',
    categories: ['brain', 'innlegg', 'nakkesmerter', 'hjemmetrening', 'tips']
    // ✅ Appears in: Whatever Tickles My Brain, Innlegg
    // ❌ Does NOT appear in: Klinisk
}
```

### Example 3: General Interest
```javascript
{
    title: 'Hvorfor trening er viktig',
    categories: ['innlegg', 'forebygging', 'livsstil']
    // ✅ Appears in: Innlegg
    // ❌ Does NOT appear in: Klinisk, Whatever Tickles My Brain
}
```

## Benefits of This System

1. **Flexible Content Distribution** - One post can appear in multiple sections
2. **Targeted Audiences** - Different content for patients vs. professionals
3. **Easy Organization** - Tags help categorize by topic and treatment
4. **SEO Friendly** - Better content structure and categorization
5. **Future-Proof** - Easy to add new tags and categories

## Adding New Tags

To add new tags, simply update the relevant section in `js/blog-categories.js`:

```javascript
// Add to PLAGER_TAGS for new conditions
const PLAGER_TAGS = {
    // ... existing tags
    nytt_problem: 'nytt_problem',  // New condition
};

// Add to TJENESTER_TAGS for new treatments  
const TJENESTER_TAGS = {
    // ... existing tags
    ny_behandling: 'ny_behandling',  // New treatment
};
```

## Implementation Notes

- Each post must have at least one blog section tag (`innlegg`, `klinisk`, or `brain`)
- Posts can have multiple blog section tags to appear in multiple sections
- Use descriptive, consistent tag names in Norwegian
- Keep tag names lowercase and use underscores for spaces 
