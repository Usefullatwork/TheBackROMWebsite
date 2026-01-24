# Update CSS Stack in Blog Files
# Changes from main.min.css + index-2026-fixes.css + hub-article.css
# to pages-combined.min.css

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BlogDir = Join-Path (Split-Path -Parent $ScriptDir) "blogg"

# Get all blog files (excluding index.html and backup directories)
$blogFiles = Get-ChildItem -Path $BlogDir -Filter "*.html" | Where-Object {
    $_.Name -ne "index.html" -and $_.DirectoryName -notmatch "_backup"
}

Write-Host "Found $($blogFiles.Count) blog files to check" -ForegroundColor Cyan
Write-Host ""

$updated = 0
$skipped = 0

foreach ($file in $blogFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.UTF8Encoding]::new($true))

    # Check if file uses old CSS stack
    if ($content -match 'main\.min\.css') {
        Write-Host "Updating: $($file.Name)" -ForegroundColor Yellow

        # Replace the old CSS links with new ones
        # Pattern 1: preload and stylesheet for main.min.css
        $content = $content -replace '<link rel="preload" as="style" href="\.\./css/main\.min\.css[^"]*">\s*\n?', ''
        $content = $content -replace '<link rel="stylesheet" href="\.\./css/main\.min\.css[^"]*">\s*\n?', ''

        # Pattern 2: index-2026-fixes.css
        $content = $content -replace '<link rel="stylesheet" href="\.\./css/index-2026-fixes\.css[^"]*">\s*\n?', ''

        # Pattern 3: hub-article.css
        $content = $content -replace '<link rel="stylesheet" href="\.\./css/hub-article\.css[^"]*">\s*\n?', ''

        # Add pages-combined.min.css if not already present
        if ($content -notmatch 'pages-combined\.min\.css') {
            # Find where to insert (after font-awesome-minimal preload or after noscript for fonts)
            $insertPattern = '(<noscript><link href="https://fonts\.googleapis\.com/[^<]+></noscript>)'
            $replacement = '$1
  <link rel="preload" as="style" href="../css/pages-combined.min.css?v=20260118">
  <link rel="stylesheet" href="../css/pages-combined.min.css?v=20260118">'

            if ($content -match $insertPattern) {
                $content = $content -replace $insertPattern, $replacement
            }
        }

        # Save with UTF-8 BOM
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.UTF8Encoding]::new($true))
        $updated++
    } else {
        $skipped++
    }
}

Write-Host ""
Write-Host "===============================================" -ForegroundColor White
Write-Host "CSS Stack Update Complete" -ForegroundColor White
Write-Host "===============================================" -ForegroundColor White
Write-Host "Updated: $updated" -ForegroundColor Green
Write-Host "Skipped (already using pages-combined): $skipped" -ForegroundColor Yellow

# Verification
Write-Host ""
Write-Host "Verification:" -ForegroundColor Cyan
$mainCssCount = (Get-ChildItem -Path $BlogDir -Filter "*.html" | Where-Object {
    $_.Name -ne "index.html" -and $_.DirectoryName -notmatch "_backup"
} | ForEach-Object {
    $c = [System.IO.File]::ReadAllText($_.FullName, [System.Text.UTF8Encoding]::new($true))
    if ($c -match 'main\.min\.css') { 1 } else { 0 }
} | Measure-Object -Sum).Sum

$pagesCombinedCount = (Get-ChildItem -Path $BlogDir -Filter "*.html" | Where-Object {
    $_.Name -ne "index.html" -and $_.DirectoryName -notmatch "_backup"
} | ForEach-Object {
    $c = [System.IO.File]::ReadAllText($_.FullName, [System.Text.UTF8Encoding]::new($true))
    if ($c -match 'pages-combined\.min\.css') { 1 } else { 0 }
} | Measure-Object -Sum).Sum

Write-Host "Files still using main.min.css: $mainCssCount" -ForegroundColor $(if ($mainCssCount -eq 0) { 'Green' } else { 'Red' })
Write-Host "Files using pages-combined.min.css: $pagesCombinedCount" -ForegroundColor Green
