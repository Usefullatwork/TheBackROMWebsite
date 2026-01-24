# Scan Full Site for CSS Issues
# Covers ALL folders including English pages, tjeneste, faq, and root
$websiteRoot = $PSScriptRoot | Split-Path -Parent

# Get ALL HTML files from all relevant folders
$allFiles = @()

# Norwegian - Already fixed but included for verification
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

Write-Host "Scanning $($allFiles.Count) files for missing updates..." -ForegroundColor Cyan
Write-Host ""

$issues = @{
    "Old Mobile CTA (teal)" = @()
    "Old stat-number size (2rem/1.8rem/28px)" = @()
    "Old stat-label size (0.9rem/0.85rem/12px)" = @()
    "Old infographic width (800px)" = @()
    "Missing location-section CSS" = @()
    "Missing hub-hero CSS" = @()
    "No inline styles" = @()
}

foreach ($file in $allFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $relativePath = $file.FullName.Replace($websiteRoot, "").TrimStart("\")

    # Check if file has inline styles
    if ($content -notmatch '<style>') {
        $issues["No inline styles"] += $relativePath
        continue
    }

    # Check for old mobile CTA (teal background)
    if ($content -match 'mobile-sticky-cta[^}]*background:\s*var\(--hub-primary\)') {
        $issues["Old Mobile CTA (teal)"] += $relativePath
    }

    # Check for old stat-number sizes (must be CSS rule, not HTML class)
    if ($content -match '\.stat-number\s*\{[^}]*font-size:\s*(2rem|1\.8rem|28px)') {
        $issues["Old stat-number size (2rem/1.8rem/28px)"] += $relativePath
    }

    # Check for old stat-label sizes (must be CSS rule, not HTML class)
    if ($content -match '\.stat-label\s*\{[^}]*font-size:\s*(0\.9rem|0\.85rem|12px)') {
        $issues["Old stat-label size (0.9rem/0.85rem/12px)"] += $relativePath
    }

    # Check for old infographic width
    if ($content -match 'hub-infographic[^}]*max-width:\s*800px') {
        $issues["Old infographic width (800px)"] += $relativePath
    }

    # Check for missing location-section CSS
    if ($content -notmatch '\.location-header') {
        $issues["Missing location-section CSS"] += $relativePath
    }

    # Check for missing hub-hero CSS (only for files that use hub-hero in HTML)
    if (($content -match 'class="hub-hero"') -and ($content -notmatch '\.hub-hero\s*\{')) {
        $issues["Missing hub-hero CSS"] += $relativePath
    }
}

Write-Host "========================================" -ForegroundColor Yellow
Write-Host "SCAN RESULTS - FULL SITE" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

$totalIssues = 0
foreach ($issue in $issues.Keys) {
    $count = $issues[$issue].Count
    # Don't count "No inline styles" as issues - they use external CSS
    if ($issue -ne "No inline styles") {
        $totalIssues += $count
    }

    if ($count -gt 0) {
        $color = if ($issue -eq "No inline styles") { "Gray" } else { "Red" }
        Write-Host "$issue ($count files):" -ForegroundColor $color
        foreach ($file in $issues[$issue]) {
            Write-Host "  - $file" -ForegroundColor Gray
        }
        Write-Host ""
    } else {
        Write-Host "$issue - OK (0 files)" -ForegroundColor Green
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total issues found: $totalIssues" -ForegroundColor $(if ($totalIssues -gt 0) { "Red" } else { "Green" })
Write-Host "(Files with no inline styles: $($issues['No inline styles'].Count) - these use external CSS)"
