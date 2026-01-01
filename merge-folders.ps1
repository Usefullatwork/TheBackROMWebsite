$source = 'E:\0 - 0 - Totall Clarity\0 - 0 - Nettside code – Kopi\Final pics'
$dest = 'E:\0 - 0 - Totall Clarity\0 - 0 - Nettside code – Kopi\pictures.final'

# Get all files with relative paths
$sourceFiles = Get-ChildItem -Path $source -Recurse -File | ForEach-Object {
    $relativePath = $_.FullName.Substring($source.Length + 1)
    [PSCustomObject]@{
        RelativePath = $relativePath
        Name = $_.Name
        Size = $_.Length
        FullPath = $_.FullName
    }
}

$destFiles = Get-ChildItem -Path $dest -Recurse -File | ForEach-Object {
    $relativePath = $_.FullName.Substring($dest.Length + 1)
    [PSCustomObject]@{
        RelativePath = $relativePath
        Name = $_.Name
        Size = $_.Length
        FullPath = $_.FullName
    }
}

# Find duplicates (same name and size)
$destLookup = @{}
foreach ($f in $destFiles) {
    $key = $f.Name + '_' + $f.Size
    $destLookup[$key] = $f
}

$duplicates = @()
$unique = @()

foreach ($f in $sourceFiles) {
    $key = $f.Name + '_' + $f.Size
    if ($destLookup.ContainsKey($key)) {
        $duplicates += $f
    } else {
        $unique += $f
    }
}

Write-Host "DUPLICATES (same name+size, will skip): $($duplicates.Count)"
Write-Host "UNIQUE files to copy: $($unique.Count)"
Write-Host ""

if ($unique.Count -gt 0) {
    Write-Host "=== Copying unique files ==="
    foreach ($f in $unique) {
        $destPath = Join-Path $dest $f.RelativePath
        $destDir = Split-Path $destPath -Parent
        if (!(Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        Copy-Item -Path $f.FullPath -Destination $destPath -Force
        Write-Host "Copied: $($f.RelativePath)"
    }
}

Write-Host ""
Write-Host "=== DONE ==="
Write-Host "Duplicates skipped: $($duplicates.Count)"
Write-Host "Files copied: $($unique.Count)"
