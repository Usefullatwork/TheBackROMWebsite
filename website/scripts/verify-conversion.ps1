# Verify Blog Conversion Status

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BlogDir = Join-Path (Split-Path -Parent $ScriptDir) "blogg"

$files = Get-ChildItem -Path $BlogDir -Filter "*.html" | Where-Object {
    $_.Name -ne "index.html" -and $_.DirectoryName -notmatch "_backup"
}

Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "Final Verification Report" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

$hubWrapper = 0
$tocCard = 0
$pagesCombined = 0
$encodingIssues = @()

foreach ($f in $files) {
    $c = [System.IO.File]::ReadAllText($f.FullName, [System.Text.UTF8Encoding]::new($true))
    if ($c -match 'hub-wrapper') { $hubWrapper++ }
    if ($c -match 'hub-toc-card') { $tocCard++ }
    if ($c -match 'pages-combined\.min\.css') { $pagesCombined++ }

    # Check for common encoding issues (mojibake)
    if ($c -match "$([char]0x00C3)$([char]0x00A5)" -or $c -match "$([char]0x00C3)$([char]0x00B8)") {
        $encodingIssues += $f.Name
    }
}

Write-Host "Total blog files: $($files.Count)" -ForegroundColor White
Write-Host ""
Write-Host "Hub layout (hub-wrapper): $hubWrapper / $($files.Count)" -ForegroundColor $(if ($hubWrapper -eq $files.Count) { 'Green' } else { 'Yellow' })
Write-Host "TOC sidebar (hub-toc-card): $tocCard / $($files.Count)" -ForegroundColor $(if ($tocCard -eq $files.Count) { 'Green' } else { 'Yellow' })
Write-Host "Correct CSS (pages-combined): $pagesCombined / $($files.Count)" -ForegroundColor $(if ($pagesCombined -eq $files.Count) { 'Green' } else { 'Yellow' })

if ($encodingIssues.Count -gt 0) {
    Write-Host "Encoding issues: $($encodingIssues.Count) files" -ForegroundColor Red
    Write-Host "  Files with issues: $($encodingIssues -join ', ')" -ForegroundColor Red
} else {
    Write-Host "Encoding issues: 0 files" -ForegroundColor Green
}

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
