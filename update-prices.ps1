$basePath = "F:\0 - 0 - Totall Clarity\0 - 0 - Nettside code – Kopi\website"

# Update 1105 kr to 1 140 kr
Get-ChildItem -Path $basePath -Recurse -Filter "*.html" | ForEach-Object {
    $content = [System.IO.File]::ReadAllText($_.FullName, [System.Text.Encoding]::UTF8)
    if ($content -match "1105 kr") {
        Write-Host "Updating 1105 kr in: $($_.FullName)"
        $content = $content -replace "1105 kr", "1 140 kr"
        [System.IO.File]::WriteAllText($_.FullName, $content, [System.Text.Encoding]::UTF8)
    }
}

# Update 780 kr to 795 kr
Get-ChildItem -Path $basePath -Recurse -Filter "*.html" | ForEach-Object {
    $content = [System.IO.File]::ReadAllText($_.FullName, [System.Text.Encoding]::UTF8)
    if ($content -match "780 kr") {
        Write-Host "Updating 780 kr in: $($_.FullName)"
        $content = $content -replace "780 kr", "795 kr"
        [System.IO.File]::WriteAllText($_.FullName, $content, [System.Text.Encoding]::UTF8)
    }
}

Write-Host "Price update complete!"
