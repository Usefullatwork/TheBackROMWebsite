# fix-disclaimer-language.ps1
# Fixes incorrectly added English disclaimers on Norwegian pages

param(
    [switch]$DryRun = $false
)

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$websitePath = Split-Path -Parent $scriptPath

$englishDisclaimer = '<div class="medical-disclaimer">
                <strong>Medical Information:</strong> This article is written by Chiropractor Mads Finstad at Klinikk for alle Majorstua, Oslo. The information does not replace individual medical evaluation. For acute or concerning symptoms, contact a doctor immediately.
              </div>'

$norwegianDisclaimer = '<div class="medical-disclaimer">
                <strong>Medisinsk informasjon:</strong> Denne artikkelen er skrevet av Kiropraktor Mads Finstad hos Klinikk for alle Majorstua. Informasjonen erstatter ikke individuell medisinsk vurdering. Ved akutte eller bekymringsfulle symptomer, kontakt lege umiddelbart.
              </div>'

$fixedCount = 0

# Find all Norwegian HTML files (lang="nb" or lang="no") that have English disclaimer
$norwegianFiles = Get-ChildItem -Path $websitePath -Filter "*.html" -Recurse |
    Where-Object { -not $_.FullName.Contains("_backup") -and -not $_.FullName.Contains("\en\") }

foreach ($file in $norwegianFiles) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)

    # Check if this is a Norwegian file with English disclaimer
    $isNorwegian = $content -match '<html[^>]+lang="n[bo]"'
    $hasEnglishDisclaimer = $content -match 'Medical Information.*Chiropractor Mads Finstad'

    if ($isNorwegian -and $hasEnglishDisclaimer) {
        if ($DryRun) {
            Write-Host "[DRY RUN] Would fix: $($file.FullName)"
        } else {
            $newContent = $content -replace [regex]::Escape($englishDisclaimer), $norwegianDisclaimer
            [System.IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.UTF8Encoding]::new($true))
            Write-Host "[FIXED] $($file.FullName)"
        }
        $fixedCount++
    }
}

Write-Host ""
Write-Host "Fixed $fixedCount files"
