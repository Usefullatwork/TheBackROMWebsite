# Fix encoding issues in converted blog files

$bloggPath = Join-Path $PSScriptRoot "..\blogg"

# Get files that have encoding issues
$files = Get-ChildItem -Path $bloggPath -Filter "*.html" | Where-Object {
    $content = Get-Content $_.FullName -Raw
    $content -match 'SprÃ¥kvalg|Ã…pne|Ã¥' -and $_.Name -ne "index.html"
}

Write-Host "Found $($files.Count) files with encoding issues" -ForegroundColor Cyan

foreach ($file in $files) {
    Write-Host "Fixing: $($file.Name)" -ForegroundColor Yellow

    $content = Get-Content $file.FullName -Raw -Encoding UTF8

    # Fix common encoding issues
    $content = $content -replace 'SprÃ¥kvalg', 'Språkvalg'
    $content = $content -replace 'Ã…pne navigasjonsmeny', 'Åpne navigasjonsmeny'
    $content = $content -replace 'Ã¥', 'å'
    $content = $content -replace 'Ã…', 'Å'
    $content = $content -replace 'Ã¸', 'ø'
    $content = $content -replace 'Ã˜', 'Ø'
    $content = $content -replace 'Ã¦', 'æ'
    $content = $content -replace 'Ã†', 'Æ'

    # Write back with UTF8 BOM
    [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.UTF8Encoding]::new($true))

    Write-Host "  Fixed: $($file.Name)" -ForegroundColor Green
}

Write-Host "`nEncoding fix complete!" -ForegroundColor Cyan
