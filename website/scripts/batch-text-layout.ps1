# batch-text-layout.ps1
# Standardizes text layout across all content pages to match gold standard pattern
# Gold standard: blogg/svimmel-og-kvalm.html, plager/hofte-og-bekkensmerter.html

param(
    [string]$Path = "",
    [switch]$DryRun = $false,
    [switch]$Verbose = $false,
    [switch]$AddSectionBadges = $false
)

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$websitePath = Split-Path -Parent $scriptPath

if ([string]::IsNullOrEmpty($Path)) {
    $Path = $websitePath
}

# Counter for tracking changes
$script:processedCount = 0
$script:modifiedCount = 0
$script:skippedCount = 0

function Write-Log {
    param([string]$Message, [string]$Type = "INFO")
    $color = switch ($Type) {
        "INFO" { "White" }
        "SUCCESS" { "Green" }
        "WARNING" { "Yellow" }
        "ERROR" { "Red" }
        "VERBOSE" { "Cyan" }
    }
    Write-Host "[$Type] $Message" -ForegroundColor $color
}

function Test-HasHubSectionPattern {
    param([string]$Content)
    return $Content -match '<section[^>]*class="[^"]*hub-section[^"]*"' -and
           $Content -match '<div[^>]*class="[^"]*section-header[^"]*"' -and
           $Content -match '<span[^>]*class="[^"]*section-number[^"]*"'
}

function Test-HasPremiumSummaryCard {
    param([string]$Content)
    return $Content -match 'class="[^"]*premium-summary-card[^"]*"'
}

function Test-HasMedicalDisclaimer {
    param([string]$Content)
    return $Content -match 'class="[^"]*medical-disclaimer[^"]*"'
}

function Test-HasSourcesSection {
    param([string]$Content)
    return $Content -match 'class="[^"]*sources-section[^"]*"'
}

function Add-SectionNumberBadges {
    param([string]$Content)

    # Pattern: <h2 id="some-id">Title</h2>
    # becomes:
    # <section class="hub-section" id="sN">
    #   <div class="section-header">
    #     <span class="section-number">N</span>
    #     <h2>Title</h2>
    #   </div>
    #   ... content ...
    # </section>

    # Find all h2 elements with id attributes that are NOT already in a hub-section
    $h2Pattern = '(?<!section-header">\s*<span class="section-number">\d+</span>\s*)(<h2\s+id="([^"]+)"[^>]*>([^<]+)</h2>)'

    $matches = [regex]::Matches($Content, $h2Pattern)

    if ($matches.Count -eq 0) {
        return $Content
    }

    # Process from last to first to maintain positions
    $sortedMatches = $matches | Sort-Object { $_.Index } -Descending
    $sectionNum = $matches.Count

    $result = $Content

    foreach ($match in $sortedMatches) {
        $fullMatch = $match.Groups[1].Value
        $originalId = $match.Groups[2].Value
        $title = $match.Groups[3].Value

        # Check if this h2 is already inside a hub-section (within 200 chars before)
        $startPos = [Math]::Max(0, $match.Index - 200)
        $beforeContext = $result.Substring($startPos, $match.Index - $startPos)

        if ($beforeContext -match 'class="[^"]*hub-section[^"]*"') {
            continue # Skip, already wrapped
        }

        # Create the new section
        $newSection = @"
<section class="hub-section" id="s$sectionNum">
                <div class="section-header">
                  <span class="section-number">$sectionNum</span>
                  <h2>$title</h2>
                </div>
"@

        # Replace the h2 tag
        $result = $result.Substring(0, $match.Index) + $newSection + $result.Substring($match.Index + $match.Length)
        $sectionNum--
    }

    return $result
}

function Add-MedicalDisclaimer {
    param([string]$Content)

    $disclaimer = @'

              <div class="medical-disclaimer">
                <strong>Medisinsk informasjon:</strong> Denne artikkelen er skrevet av Kiropraktor Mads Finstad hos Klinikk for alle Majorstua. Informasjonen erstatter ikke individuell medisinsk vurdering. Ved akutte eller bekymringsfulle symptomer, kontakt lege umiddelbart.
              </div>
'@

    $disclaimerEn = @'

              <div class="medical-disclaimer">
                <strong>Medical Information:</strong> This article is written by Chiropractor Mads Finstad at Klinikk for alle Majorstua, Oslo. The information does not replace individual medical evaluation. For acute or concerning symptoms, contact a doctor immediately.
              </div>
'@

    # Determine if English or Norwegian (check <html lang="en"> specifically)
    $isEnglish = $Content -match '<html[^>]+lang="en"'

    $disclaimerToUse = if ($isEnglish) { $disclaimerEn } else { $disclaimer }

    # Find the best insertion point - before </div></article> or before </div> class="blog-post__content"
    # Look for the pattern that closes the main content area

    # Try to find the closing of blog-post__content
    if ($Content -match '(?s)(</div>\s*</div>\s*</article>)') {
        $closingPattern = '</div>\s*</div>\s*</article>'
        $insertMatch = [regex]::Match($Content, $closingPattern)
        if ($insertMatch.Success) {
            $insertPoint = $insertMatch.Index
            $result = $Content.Insert($insertPoint, $disclaimerToUse + "`n              ")
            return $result
        }
    }

    # Alternative: look for </article>
    if ($Content -match '</article>') {
        $insertPoint = $Content.LastIndexOf('</article>')
        # Find the </div> before it
        $beforeArticle = $Content.Substring(0, $insertPoint)
        $lastDivClose = $beforeArticle.LastIndexOf('</div>')
        if ($lastDivClose -gt 0) {
            $result = $Content.Insert($lastDivClose, $disclaimerToUse + "`n              ")
            return $result
        }
    }

    return $Content
}

function Process-HtmlFile {
    param([string]$FilePath)

    $script:processedCount++

    try {
        $content = [System.IO.File]::ReadAllText($FilePath, [System.Text.Encoding]::UTF8)
        $originalContent = $content
        $modified = $false
        $changes = @()

        # Skip backup files
        if ($FilePath -match '_backup') {
            $script:skippedCount++
            if ($Verbose) { Write-Log "Skipping backup file: $FilePath" "VERBOSE" }
            return
        }

        # Skip index files
        if ($FilePath -match '\\index\.html$') {
            $script:skippedCount++
            if ($Verbose) { Write-Log "Skipping index file: $FilePath" "VERBOSE" }
            return
        }

        # Check if file has hub-wrapper (blog/article layout)
        if (-not ($content -match 'class="[^"]*hub-wrapper[^"]*"' -or $content -match 'class="[^"]*hub-main[^"]*"')) {
            $script:skippedCount++
            if ($Verbose) { Write-Log "Skipping non-hub file: $FilePath" "VERBOSE" }
            return
        }

        # Check current state
        $hasHubSection = Test-HasHubSectionPattern -Content $content
        $hasMedicalDisclaimer = Test-HasMedicalDisclaimer -Content $content

        # If file already has all required patterns, skip
        if ($hasMedicalDisclaimer -and ($hasHubSection -or -not $AddSectionBadges)) {
            $script:skippedCount++
            if ($Verbose) { Write-Log "File already standardized: $FilePath" "VERBOSE" }
            return
        }

        # Apply transformations

        # 1. Add section number badges if requested and not present
        if ($AddSectionBadges -and -not $hasHubSection) {
            $newContent = Add-SectionNumberBadges -Content $content
            if ($newContent -ne $content) {
                $content = $newContent
                $modified = $true
                $changes += "Added section number badges"
            }
        }

        # 2. Add medical disclaimer if not present
        if (-not $hasMedicalDisclaimer) {
            $newContent = Add-MedicalDisclaimer -Content $content
            if ($newContent -ne $content) {
                $content = $newContent
                $modified = $true
                $changes += "Added medical disclaimer"
            }
        }

        # Save if modified
        if ($modified) {
            $script:modifiedCount++

            if ($DryRun) {
                Write-Log "Would modify: $FilePath" "WARNING"
                foreach ($change in $changes) {
                    Write-Log "  - $change" "VERBOSE"
                }
            } else {
                # Write with UTF-8 BOM for Norwegian characters
                [System.IO.File]::WriteAllText($FilePath, $content, [System.Text.UTF8Encoding]::new($true))
                Write-Log "Modified: $FilePath" "SUCCESS"
                foreach ($change in $changes) {
                    Write-Log "  - $change" "VERBOSE"
                }
            }
        } else {
            if ($Verbose) { Write-Log "No changes needed: $FilePath" "VERBOSE" }
        }

    } catch {
        Write-Log "Error processing $FilePath : $_" "ERROR"
    }
}

function Process-Directory {
    param(
        [string]$DirectoryPath,
        [string]$Pattern = "*.html"
    )

    Write-Log "Processing directory: $DirectoryPath"

    $files = Get-ChildItem -Path $DirectoryPath -Filter $Pattern -Recurse -File |
             Where-Object { -not $_.FullName.Contains("_backup") }

    Write-Log "Found $($files.Count) HTML files"

    foreach ($file in $files) {
        Process-HtmlFile -FilePath $file.FullName
    }
}

# Main execution
Write-Log "========================================" "INFO"
Write-Log "Batch Text Layout Standardization Script" "INFO"
Write-Log "========================================" "INFO"
Write-Log "Website path: $websitePath" "INFO"
Write-Log "Dry run: $DryRun" "INFO"
Write-Log "Add section badges: $AddSectionBadges" "INFO"
Write-Log ""

# Process Norwegian blog posts
$bloggPath = Join-Path $websitePath "blogg"
if (Test-Path $bloggPath) {
    Write-Log "Processing Norwegian blog posts..." "INFO"
    Process-Directory -DirectoryPath $bloggPath
}

# Process Norwegian condition pages
$plagerPath = Join-Path $websitePath "plager"
if (Test-Path $plagerPath) {
    Write-Log "Processing Norwegian condition pages..." "INFO"
    Process-Directory -DirectoryPath $plagerPath
}

# Process English pages
$enPath = Join-Path $websitePath "en"
if (Test-Path $enPath) {
    Write-Log "Processing English pages..." "INFO"
    Process-Directory -DirectoryPath $enPath
}

# Summary
Write-Log ""
Write-Log "========================================" "INFO"
Write-Log "Summary" "INFO"
Write-Log "========================================" "INFO"
Write-Log "Files processed: $script:processedCount" "INFO"
Write-Log "Files modified: $script:modifiedCount" "SUCCESS"
Write-Log "Files skipped: $script:skippedCount" "WARNING"
Write-Log "Done!" "SUCCESS"
