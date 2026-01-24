# Batch Add Hub-Hero CSS - Full Site Coverage
# Covers ALL folders including English pages, tjeneste, faq, and root
$websiteRoot = $PSScriptRoot | Split-Path -Parent

# Get ALL HTML files from all relevant folders
$allFiles = @()

# Norwegian - Already fixed but included for completeness
$allFiles += Get-ChildItem (Join-Path $websiteRoot "blogg\*.html") -File -ErrorAction SilentlyContinue | Where-Object { $_.Name -ne "index.html" -and $_.DirectoryName -notlike "*_backup*" }
$allFiles += Get-ChildItem (Join-Path $websiteRoot "plager\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "plager\hofte\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "plager\svimmelhet\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "plager\svimmelhet\krystallsyke\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "plager\nakke\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "plager\kjeve\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "plager\rygg\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "plager\korsrygg\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "plager\albue-arm\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "plager\brystrygg\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "plager\fot\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "plager\hodepine\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "plager\kne\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "plager\skulder\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "docs\*.html") -File -ErrorAction SilentlyContinue

# Norwegian - NEW folders
$allFiles += Get-ChildItem (Join-Path $websiteRoot "tjeneste\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "tjeneste\svimmelhet\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "faq\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem $websiteRoot -Filter "*.html" -File -ErrorAction SilentlyContinue  # Root level

# English - Already fixed
$allFiles += Get-ChildItem (Join-Path $websiteRoot "en\services\*.html") -File -ErrorAction SilentlyContinue

# English - NEW folders
$allFiles += Get-ChildItem (Join-Path $websiteRoot "en\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "en\blog\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "en\services\dizziness\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "en\conditions\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "en\conditions\dizziness\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "en\conditions\dizziness\bppv\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "en\conditions\hip\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "en\conditions\foot\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "en\conditions\neck\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "en\conditions\headache\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "en\conditions\thoracic\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "en\conditions\shoulder\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "en\conditions\knee\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "en\conditions\jaw\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "en\conditions\elbow-arm\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "en\conditions\lower-back\*.html") -File -ErrorAction SilentlyContinue

Write-Host "Found $($allFiles.Count) files to check" -ForegroundColor Cyan

$processed = 0
$skipped = 0
$errors = 0

# Hub-hero CSS to add
$hubHeroCSS = @"

    /* Hub Hero Section */
    .hub-hero { background: linear-gradient(135deg, var(--hub-dark) 0%, var(--hub-primary) 100%); color: #ffffff !important; padding: 150px 20px 60px; margin: 0; text-align: center; }
    .hub-hero__container { max-width: 900px; margin: 0 auto; }
    .hub-hero h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 16px; line-height: 1.2; color: #ffffff !important; }
    .hub-hero__subtitle { font-size: 1.1rem; color: #ffffff !important; opacity: 0.95; margin-bottom: 16px; }
    .hub-hero .blog-post__category { display: inline-block; background: rgba(255,255,255,0.2); color: #fff; padding: 6px 16px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; }
    .hub-hero .blog-post__meta { display: flex; justify-content: center; gap: 24px; margin-top: 20px; font-size: 0.95rem; color: rgba(255,255,255,0.85); }
    .hub-hero .blog-post__date, .hub-hero .blog-post__author { color: rgba(255,255,255,0.85); }
    @media (max-width: 900px) { .hub-hero { padding: 120px 20px 40px; } .hub-hero h1 { font-size: 1.8rem; } .hub-hero .blog-post__meta { flex-direction: column; gap: 8px; } }

"@

foreach ($file in $allFiles) {
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)

        # Skip if no style tag
        if ($content -notmatch '<style>') {
            Write-Host "Skipping $($file.Name) - no inline styles" -ForegroundColor Gray
            $skipped++
            continue
        }

        # Skip if doesn't use hub-hero in HTML
        if ($content -notmatch 'class="hub-hero"') {
            Write-Host "Skipping $($file.Name) - no hub-hero HTML" -ForegroundColor Gray
            $skipped++
            continue
        }

        # Skip if already has hub-hero CSS
        if ($content -match '\.hub-hero\s*\{') {
            Write-Host "Skipping $($file.Name) - already has hub-hero CSS" -ForegroundColor Gray
            $skipped++
            continue
        }

        # Add hub-hero CSS before </style>
        Write-Host "Processing: $($file.Name)" -ForegroundColor Yellow
        $content = $content -replace '</style>', ($hubHeroCSS + '</style>')

        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.UTF8Encoding]::new($true))
        $processed++
        Write-Host "  - Added hub-hero CSS" -ForegroundColor Green

    } catch {
        Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $errors++
    }
}

Write-Host ""
Write-Host "========================================"
Write-Host "Batch processing complete!"
Write-Host "Files updated: $processed"
Write-Host "Files skipped: $skipped"
Write-Host "Errors: $errors"
