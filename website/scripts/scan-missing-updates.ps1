# Scan for pages missing CSS updates
$websiteRoot = $PSScriptRoot | Split-Path -Parent

# Get all HTML files
$allFiles = @()
$allFiles += Get-ChildItem (Join-Path $websiteRoot "blogg\*.html") -File -ErrorAction SilentlyContinue | Where-Object { $_.Name -ne "index.html" -and $_.DirectoryName -notlike "*_backup*" }
$allFiles += Get-ChildItem (Join-Path $websiteRoot "plager\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "plager\hofte\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "plager\svimmelhet\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "plager\svimmelhet\krystallsyke\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "plager\nakke\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "plager\rygg\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "plager\kjeve\*.html") -File -ErrorAction SilentlyContinue

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
Write-Host "SCAN RESULTS" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

$totalIssues = 0
foreach ($issue in $issues.Keys) {
    $count = $issues[$issue].Count
    $totalIssues += $count

    if ($count -gt 0) {
        Write-Host "$issue ($count files):" -ForegroundColor Red
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
