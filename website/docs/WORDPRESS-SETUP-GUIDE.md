# WordPress Setup Guide

This guide shows how to set up your WordPress categories and tags to match the system we created.

## Perfect Workflow: Create Here → Post to WordPress

### Step 1: Use the Content Creator
1. Open `blogg/create-post-template.html`
2. Write your post
3. Select categories
4. Preview how it looks
5. Generate WordPress code
6. Copy to WordPress

### Step 2: Set Up WordPress Categories

In your WordPress admin, create these categories:

#### Main Blog Sections
- **Innlegg** (General posts)
- **Klinisk** (Clinical/professional content)
- **Whatever Tickles My Brain** (Patient-focused)

#### Plager Categories
- Nakkesmerter
- Skuldersmerter  
- Hoftesmerter
- Idrettsskader
- Korsryggsmerte
- Svimmelhet
- Hodepine
- Ryggsmerter
- Knesmerter
- Kjevesmerter
- Fotsmerter
- Albuesmerter
- Handsmerter

#### Tjenester Categories
- Dry Needling
- Fasciemanipulasjon
- Graston
- Rehabilitering
- Trykkbølge
- Kiropraktikk
- Bløtvevsteknikker
- Massasje
- Svimmelhet behandling

#### General Tags
- Forskning
- Case Study
- Tips
- Anatomi
- Fysiologi
- Forebygging
- Hjemmetrening
- Ernæring
- Livsstil

## WordPress Category Structure

```
Blog Sections (Main Categories)
├── Innlegg
├── Klinisk
└── Whatever Tickles My Brain

Plager (Sub-categories or Tags)
├── Nakkesmerter
├── Skuldersmerter
├── Hoftesmerter
└── ...

Tjenester (Sub-categories or Tags)  
├── Dry Needling
├── Fasciemanipulasjon
├── Graston
└── ...
```

## Your Content Creation Process

### 1. Plan & Create
- Use `create-post-template.html`
- Write content
- Select multiple categories
- Preview which sections it appears in

### 2. Transfer to WordPress
- Click "Generer WordPress Kode"
- Copy the generated text
- Paste into WordPress
- Set categories/tags as shown

### 3. Publish
- Set featured image
- Schedule or publish immediately

## Benefits of This Workflow

✅ **Organized Planning** - Use category system to plan content distribution  
✅ **Preview System** - See which sections posts appear in  
✅ **Consistent Tagging** - Same categories across both systems  
✅ **WordPress Ready** - Generated code ready to paste  
✅ **Multiple Audiences** - Easy to target different reader groups

## Example: Creating a Patient Tips Post

### In Content Creator:
1. **Title:** "5 hjemmeøvelser for nakkesmerter"
2. **Categories:** ✅ Innlegg, ✅ Whatever Tickles My Brain, ✅ Nakkesmerter, ✅ Tips, ✅ Hjemmetrening
3. **Preview shows:** Will appear in "Innlegg" and "Whatever Tickles My Brain" sections
4. **Generate WordPress code** → Copy

### In WordPress:
1. Paste title and content
2. Select categories: Innlegg, Whatever Tickles My Brain
3. Add tags: nakkesmerter, tips, hjemmetrening
4. Publish

**Result:** Post appears in both patient-friendly sections with proper categorization!

## WordPress Plugin Recommendations

### For Better Category Management:
- **Category Order and Taxonomy Terms Order** - Organize category display
- **Ultimate Member** - If you want member-only content for clinical posts

### For SEO:
- **Yoast SEO** - Optimize posts with your categories/tags
- **Rank Math** - Alternative SEO plugin

## Content Strategy Examples

### Clinical Post (Professionals Only):
- Categories: Klinisk
- Tags: forskning, casestudy, [specific treatment]
- Target: Other chiropractors, professionals

### Patient Education Post:
- Categories: Whatever Tickles My Brain, Innlegg  
- Tags: tips, forebygging, [condition], livsstil
- Target: Patients seeking help

### General Interest:
- Categories: Innlegg
- Tags: [condition/treatment], tips
- Target: Mixed audience

This system gives you the best of both worlds - organized content planning here, easy publishing in WordPress! 
