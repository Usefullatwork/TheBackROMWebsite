$webPath = 'F:\0 - 0 - Totall Clarity\0 - 0 - Nettside code – Kopi\website'
$files = Get-ChildItem -Path $webPath -Recurse -Filter '*.html' | Where-Object { (Get-Content $_.FullName -Raw) -match 'images/conditions/' }
$count = 0
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $content = $content -replace 'images/conditions/arm-elbow/', 'images/plager albue-arm/'
    $content = $content -replace 'images/conditions/foot/', 'images/plager fotsmerter/'
    $content = $content -replace 'images/conditions/headache/', 'images/plager hodepine-og-migrene/'
    $content = $content -replace 'images/conditions/hip/', 'images/Plager hofte-og-bekkensmerter/'
    $content = $content -replace 'images/conditions/jaw/', 'images/plager kjevesmerter/'
    $content = $content -replace 'images/conditions/knee/', 'images/plager knesmerter/'
    $content = $content -replace 'images/conditions/lower-back/', 'images/plager korsryggsmerter/'
    $content = $content -replace 'images/conditions/back/', 'images/plager ryggsmerter/'
    $content = $content -replace 'images/conditions/neck/', 'images/plager nakkesmerter/'
    $content = $content -replace 'images/conditions/shoulder/', 'images/plager skuldersmerter/'
    $content = $content -replace 'images/conditions/dizziness/', 'images/plager svimmelhet/'
    $content = $content -replace 'images/conditions/general/', 'images/plager ryggsmerter/'
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
    Write-Host "Fixed: $($file.Name)"
    $count++
}
Write-Host "Total files fixed: $count"
