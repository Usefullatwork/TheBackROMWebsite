# Batch CSS Fixes V3 - All folders including korsrygg, docs, en
$websiteRoot = $PSScriptRoot | Split-Path -Parent

# Get ALL HTML files from all relevant folders
$allFiles = @()
$allFiles += Get-ChildItem (Join-Path $websiteRoot "blogg\*.html") -File -ErrorAction SilentlyContinue | Where-Object { $_.Name -ne "index.html" -and $_.DirectoryName -notlike "*_backup*" }
$allFiles += Get-ChildItem (Join-Path $websiteRoot "plager\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "plager\hofte\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "plager\svimmelhet\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "plager\svimmelhet\krystallsyke\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "plager\nakke\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "plager\kjeve\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "plager\rygg\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "plager\korsrygg\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "docs\*.html") -File -ErrorAction SilentlyContinue
$allFiles += Get-ChildItem (Join-Path $websiteRoot "en\services\*.html") -File -ErrorAction SilentlyContinue

Write-Host "Found $($allFiles.Count) files to process" -ForegroundColor Cyan

$processed = 0
$errors = 0

foreach ($file in $allFiles) {
    Write-Host "Processing: $($file.Name)" -ForegroundColor Yellow

    try {
        $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
        $modified = $false

        # Skip files without inline styles
        if ($content -notmatch '<style>') {
            Write-Host "  Skipping - no inline styles" -ForegroundColor Gray
            continue
        }

        # Fix 1: Mobile CTA background - Change teal to orange (standard pattern)
        if ($content -match '\.mobile-sticky-cta\s*\{[^}]*background:\s*var\(--hub-primary\)') {
            $content = $content -replace '(\.mobile-sticky-cta\s*\{[^}]*background:\s*)var\(--hub-primary\)', '${1}#F26522'
            $modified = $true
            Write-Host "  - Fixed mobile CTA background" -ForegroundColor Green
        }

        # Fix 1b: Mobile CTA button colors (btn-primary pattern)
        if ($content -match '\.mobile-sticky-cta\s+\.btn-primary\s*\{[^}]*background:\s*var\(--hub-primary\)') {
            $content = $content -replace '(\.mobile-sticky-cta\s+\.btn-primary\s*\{[^}]*background:\s*)var\(--hub-primary\)', '${1}#F26522'
            $modified = $true
            Write-Host "  - Fixed mobile CTA btn-primary" -ForegroundColor Green
        }

        # Fix 1c: Mobile CTA button outline (btn-outline pattern)
        if ($content -match '\.mobile-sticky-cta\s+\.btn-outline\s*\{[^}]*border:[^}]*var\(--hub-primary\)') {
            $content = $content -replace '(\.mobile-sticky-cta\s+\.btn-outline\s*\{[^}]*border:[^}]*)var\(--hub-primary\)', '${1}#F26522'
            $modified = $true
            Write-Host "  - Fixed mobile CTA btn-outline" -ForegroundColor Green
        }

        # Fix 2: Mobile CTA button - white bg with orange text
        if ($content -match '\.mobile-sticky-cta a\s*\{[^}]*background:\s*white[^}]*color:\s*var\(--hub-primary\)') {
            $content = $content -replace '(\.mobile-sticky-cta a\s*\{[^}]*background:\s*)white([^}]*color:\s*)var\(--hub-primary\)', '${1}white${2}#F26522'
            $modified = $true
            Write-Host "  - Fixed mobile CTA button colors" -ForegroundColor Green
        }

        # Fix 3: Stat-number font sizes (2rem -> 1.5rem)
        if ($content -match '\.stat-number\s*\{[^}]*font-size:\s*2rem') {
            $content = $content -replace '(\.stat-number\s*\{[^}]*font-size:\s*)2rem', '${1}1.5rem'
            $modified = $true
            Write-Host "  - Fixed stat-number (2rem)" -ForegroundColor Green
        }

        # Fix 4: Stat-number font sizes (1.8rem -> 1.5rem)
        if ($content -match '\.stat-number\s*\{[^}]*font-size:\s*1\.8rem') {
            $content = $content -replace '(\.stat-number\s*\{[^}]*font-size:\s*)1\.8rem', '${1}1.5rem'
            $modified = $true
            Write-Host "  - Fixed stat-number (1.8rem)" -ForegroundColor Green
        }

        # Fix 5: Stat-number font sizes (28px -> 1.5rem)
        if ($content -match '\.stat-number\s*\{[^}]*font-size:\s*28px') {
            $content = $content -replace '(\.stat-number\s*\{[^}]*font-size:\s*)28px', '${1}1.5rem'
            $modified = $true
            Write-Host "  - Fixed stat-number (28px)" -ForegroundColor Green
        }

        # Fix 6: Stat-label font sizes (0.9rem -> 0.75rem)
        if ($content -match '\.stat-label\s*\{[^}]*font-size:\s*0\.9rem') {
            $content = $content -replace '(\.stat-label\s*\{[^}]*font-size:\s*)0\.9rem', '${1}0.75rem'
            $modified = $true
            Write-Host "  - Fixed stat-label (0.9rem)" -ForegroundColor Green
        }

        # Fix 7: Stat-label font sizes (0.85rem -> 0.75rem)
        if ($content -match '\.stat-label\s*\{[^}]*font-size:\s*0\.85rem') {
            $content = $content -replace '(\.stat-label\s*\{[^}]*font-size:\s*)0\.85rem', '${1}0.75rem'
            $modified = $true
            Write-Host "  - Fixed stat-label (0.85rem)" -ForegroundColor Green
        }

        # Fix 8: Stat-label font sizes (12px -> 0.75rem)
        if ($content -match '\.stat-label\s*\{[^}]*font-size:\s*12px') {
            $content = $content -replace '(\.stat-label\s*\{[^}]*font-size:\s*)12px', '${1}0.75rem'
            $modified = $true
            Write-Host "  - Fixed stat-label (12px)" -ForegroundColor Green
        }

        # Fix 9: Infographic max-width
        if ($content -match '\.hub-infographic\s*\{[^}]*max-width:\s*800px') {
            $content = $content -replace '(\.hub-infographic\s*\{[^}]*max-width:\s*)800px', '${1}100%'
            $modified = $true
            Write-Host "  - Fixed infographic max-width" -ForegroundColor Green
        }

        # Fix 10: Add location-section CSS if not present
        if ($content -notmatch '\.location-header') {
            $locationCSS = "`n    .location-header { background: var(--hub-dark); color: #fff; padding: 16px 24px; border-radius: 12px 12px 0 0; display: flex; align-items: center; gap: 12px; }`n    .location-header h3, .location-header h4 { margin: 0; color: #fff !important; font-size: 18px; }`n    .location-section { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden; margin-bottom: 32px; }`n    .location-content { padding: 20px 24px; }`n    .location-content p { color: #374151; line-height: 1.6; margin-bottom: 12px; }`n  "
            $content = $content -replace '</style>', ($locationCSS + '</style>')
            $modified = $true
            Write-Host "  - Added location-section CSS" -ForegroundColor Green
        }

        # Save if modified
        if ($modified) {
            [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.UTF8Encoding]::new($true))
            $processed++
            Write-Host "  SAVED" -ForegroundColor Cyan
        } else {
            Write-Host "  No changes needed" -ForegroundColor Gray
        }

    } catch {
        Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $errors++
    }
}

Write-Host ""
Write-Host "========================================"
Write-Host "Batch processing complete!"
Write-Host "Files processed: $processed"
Write-Host "Errors: $errors"
