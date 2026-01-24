# TheBackROM Website

Official website for TheBackROM - a chiropractic clinic in Oslo, Norway specializing in treatment of musculoskeletal conditions, dizziness/vertigo, and TMJ/jaw issues.

## Project Structure

```
website/
├── blogg/              # Norwegian blog articles (42 files)
├── behandlinger/       # Treatment pages
├── plager/             # Condition/symptom pages (Norwegian)
├── en/                 # English language pages
│   └── conditions/     # English condition pages
├── tjeneste/           # Service pages
├── faq/                # FAQ pages
├── css/                # Stylesheets
├── js/                 # JavaScript files
├── img/                # Images
├── images/             # Additional images
├── scripts/            # Development scripts
│   ├── DESIGN-GUIDE.md # Design system documentation
│   └── *.ps1           # PowerShell batch scripts
└── docs/               # Documentation
```

## Design System

The site uses a custom hub design system with the following components:

### CSS Variables
```css
--hub-primary: #2563EB   /* Primary blue */
--hub-dark: #1e293b      /* Dark text */
--hub-red: #EF4444       /* Red flags/warnings */
--hub-green: #10B981     /* Positive outcomes */
--hub-blue: #3B82F6      /* Info boxes */
--hub-light-blue: #EFF6FF /* Light backgrounds */
```

### Key Components
- **Premium Summary Card** - TL;DR box with key takeaways
- **Section Numbers** - Numbered badges on H2 headings
- **Stat Grid** - Statistics display with icons
- **Condition Cards** - Symptom/condition information
- **Treatment Boxes** - Treatment descriptions
- **Info Boxes** - General information
- **Red Flag Alerts** - Warning boxes for serious symptoms
- **Prognosis Highlights** - Green boxes for positive outcomes
- **Related Articles** - Links to related content
- **Medical Disclaimer** - Standard disclaimer

See `scripts/DESIGN-GUIDE.md` for full documentation.

## Languages

- **Norwegian** (primary) - `/blogg/`, `/plager/`, `/behandlinger/`
- **English** - `/en/`

## Development

### Scripts
Located in `/scripts/`:
- `validate-page.js` - Validate HTML structure
- `check-links.js` - Check for broken links
- `check-images.js` - Verify image paths
- `batch-*.ps1` - Batch processing scripts

### Validation
```powershell
node scripts/validate-page.js blogg/*.html
node scripts/check-links.js blogg/
node scripts/check-images.js blogg/
```

## Blog Articles

42 blog articles covering:
- **Dizziness/Vertigo** - BPPV, vestibular issues, central vertigo
- **TMJ/Jaw** - TMD, jaw pain, bite issues
- **Back/Spine** - Lower back pain, sciatica, facet syndrome
- **Neck** - Text neck, trigger points, nerve issues
- **Other** - Concussion, elderly balance, stress-related pain

All blog articles use the hub design system with:
- Schema.org MedicalWebPage structured data
- Mobile-responsive layout
- Sticky CTA button (orange #F26522)
- Table of contents with active state tracking
- Lazy-loaded infographics

## License

All rights reserved. TheBackROM.
