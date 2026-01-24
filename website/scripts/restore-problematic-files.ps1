# Restore 14 problematic files from backup for reconversion

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BlogDir = Join-Path (Split-Path -Parent $ScriptDir) "blogg"
$BackupDir = Join-Path $BlogDir "_backup_20260123_225455"

$files = @(
    'musikere-kjevesmerter.html',
    'kjeveovelser-hjemme.html',
    'stress-kjevesmerter.html',
    'facettleddssyndrom.html',
    'botox-vs-manuell-behandling-kjeve.html',
    'tmd-ibs-mage-kjeve.html',
    'hypermobilitet-eds-kjeve.html',
    'styrkeovelser-korsrygg.html',
    'bittfeil-myter-fakta.html',
    'adhd-autisme-kjevesmerter.html',
    'kjevesmerter-barn-ungdom.html',
    'tekstnakke-kjevesmerter.html',
    'kampsport-kjeveskader.html',
    'graviditet-kjevesmerter.html'
)

Write-Host "Restoring $($files.Count) files from backup..." -ForegroundColor Cyan
Write-Host ""

foreach ($f in $files) {
    $sourcePath = Join-Path $BackupDir $f
    $destPath = Join-Path $BlogDir $f

    if (Test-Path $sourcePath) {
        Copy-Item $sourcePath -Destination $destPath -Force
        Write-Host "Restored: $f" -ForegroundColor Green
    } else {
        Write-Host "Not found in backup: $f" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Restore complete. Run convert-to-hub-layout.ps1 to reconvert." -ForegroundColor Cyan
