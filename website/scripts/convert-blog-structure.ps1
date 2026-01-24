# Convert blog HTML structure to match hub-article layout

$bloggPath = Join-Path $PSScriptRoot "..\blogg"

# Files to convert - those that have the old structure
$files = Get-ChildItem -Path $bloggPath -Filter "*.html" | Where-Object {
    $content = Get-Content $_.FullName -Raw
    # Match files with old structure (main id="main-content" without class="page")
    $content -match '<main id="main-content">' -and $_.Name -ne "index.html"
}

Write-Host "Found $($files.Count) files to convert structure" -ForegroundColor Cyan

foreach ($file in $files) {
    Write-Host "Processing: $($file.Name)" -ForegroundColor Yellow

    $content = Get-Content $file.FullName -Raw -Encoding UTF8

    # 1. Fix body tag
    $content = $content -replace '<body>', '<body id="top">'

    # 2. Fix main element
    $content = $content -replace '<main id="main-content">', '<main class="page" id="main">'

    # 3. Fix hero section class (blog-hero -> main_pages)
    $content = $content -replace 'class="page__main main main_services blog-hero"', 'class="page__main main main_services main_pages"'

    # 4. Fix hero container (add main__container_pages)
    $content = $content -replace '(<section class="page__main main main_services main_pages">\s*)<div class="main__container">', '$1<div class="main__container main__container_pages">'

    # 5. Fix article -> section with page__blog-post
    $content = $content -replace '<article class="blog-post">', '<section class="page__blog-post blog-post">'
    $content = $content -replace '</article>', '</section>'

    # 6. Fix container class
    $content = $content -replace '<div class="container container--narrow">', '<div class="blog-post__container">'

    # Write back
    $content | Set-Content $file.FullName -Encoding UTF8 -NoNewline

    Write-Host "  Converted: $($file.Name)" -ForegroundColor Green
}

Write-Host "`nStructure conversion complete!" -ForegroundColor Cyan
Write-Host "Converted $($files.Count) files" -ForegroundColor Green
