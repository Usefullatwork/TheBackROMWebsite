# Fix Missing CSS in Blog Files
# Adds pages-combined.min.css to files that are missing it

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BlogDir = Join-Path (Split-Path -Parent $ScriptDir) "blogg"

# CSS to add
$cssToAdd = @"
<link rel="preload" as="style" href="../css/pages-combined.min.css?v=20260118">
  <link rel="stylesheet" href="../css/pages-combined.min.css?v=20260118">
  <link rel="stylesheet" href="../css/font-awesome-minimal.css" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="../css/font-awesome-minimal.css"></noscript>
"@

# Get all blog files (excluding index.html and backup directories)
$blogFiles = Get-ChildItem -Path $BlogDir -Filter "*.html" | Where-Object {
    $_.Name -ne "index.html" -and $_.DirectoryName -notmatch "_backup"
}

Write-Host "Found $($blogFiles.Count) blog files to check" -ForegroundColor Cyan
Write-Host ""

$fixed = 0
$skipped = 0

foreach ($file in $blogFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.UTF8Encoding]::new($true))

    # Check if file is missing pages-combined.min.css
    if ($content -notmatch 'pages-combined\.min\.css') {
        Write-Host "Fixing: $($file.Name)" -ForegroundColor Yellow

        # Insert CSS just before </head>
        $content = $content -replace '</head>', "  $cssToAdd`n</head>"

        # Save with UTF-8 BOM
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.UTF8Encoding]::new($true))
        $fixed++
    } else {
        $skipped++
    }
}

Write-Host ""
Write-Host "===============================================" -ForegroundColor White
Write-Host "CSS Fix Complete" -ForegroundColor White
Write-Host "===============================================" -ForegroundColor White
Write-Host "Fixed: $fixed" -ForegroundColor Green
Write-Host "Skipped (already has CSS): $skipped" -ForegroundColor Yellow

# Verification
Write-Host ""
Write-Host "Verification:" -ForegroundColor Cyan
$pagesCombinedCount = 0
Get-ChildItem -Path $BlogDir -Filter "*.html" | Where-Object {
    $_.Name -ne "index.html" -and $_.DirectoryName -notmatch "_backup"
} | ForEach-Object {
    $c = [System.IO.File]::ReadAllText($_.FullName, [System.Text.UTF8Encoding]::new($true))
    if ($c -match 'pages-combined\.min\.css') { $script:pagesCombinedCount++ }
}

Write-Host "Files with pages-combined.min.css: $pagesCombinedCount / $($blogFiles.Count)" -ForegroundColor $(if ($pagesCombinedCount -eq $blogFiles.Count) { 'Green' } else { 'Yellow' })
