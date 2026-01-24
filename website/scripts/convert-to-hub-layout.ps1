# Convert Blog Posts to Hub Layout with Sidebar
# This script converts Norwegian blog posts to the full hub layout pattern
# with sidebar containing "Innhold" (TOC) and conversion card

$ErrorActionPreference = "Stop"

# Paths
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BlogDir = Join-Path (Split-Path -Parent $ScriptDir) "blogg"
$TemplatePath = Join-Path $ScriptDir "blog-template.html"
$BackupDir = Join-Path $BlogDir "_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"

# Read template
$Template = [System.IO.File]::ReadAllText($TemplatePath, [System.Text.UTF8Encoding]::new($true))

# Function to create slug from text (for IDs)
function Get-Slug {
    param([string]$Text)
    $slug = $Text.ToLower()
    # Norwegian characters
    $slug = $slug -replace [char]0x00E6, 'ae'
    $slug = $slug -replace [char]0x00F8, 'o'
    $slug = $slug -replace [char]0x00E5, 'a'
    $slug = $slug -replace [char]0x00C6, 'AE'
    $slug = $slug -replace [char]0x00D8, 'O'
    $slug = $slug -replace [char]0x00C5, 'A'
    # Remove special characters
    $slug = $slug -replace '[^a-z0-9\s-]', ''
    $slug = $slug -replace '\s+', '-'
    $slug = $slug -replace '-+', '-'
    $slug = $slug.Trim('-')
    return $slug
}

# Function to fix encoding issues
function Fix-Encoding {
    param([string]$Text)
    # Common mojibake fixes (UTF-8 misread as Latin-1)
    $Text = $Text -replace "$([char]0x00C3)$([char]0x00A5)", "$([char]0x00E5)"  # a with ring
    $Text = $Text -replace "$([char]0x00C3)$([char]0x00A6)", "$([char]0x00E6)"  # ae
    $Text = $Text -replace "$([char]0x00C3)$([char]0x00B8)", "$([char]0x00F8)"  # o with stroke
    $Text = $Text -replace "$([char]0x00C3)$([char]0x0085)", "$([char]0x00C5)"  # A with ring
    $Text = $Text -replace "$([char]0x00C3)$([char]0x0086)", "$([char]0x00C6)"  # AE
    $Text = $Text -replace "$([char]0x00C3)$([char]0x0098)", "$([char]0x00D8)"  # O with stroke
    $Text = $Text -replace "$([char]0x00C3)$([char]0x00A9)", "$([char]0x00E9)"  # e acute
    $Text = $Text -replace "$([char]0x00C2)$([char]0x00AB)", "$([char]0x00AB)"  # left guillemet
    $Text = $Text -replace "$([char]0x00C2)$([char]0x00BB)", "$([char]0x00BB)"  # right guillemet
    $Text = $Text -replace "$([char]0x00C2)$([char]0x00A0)", " "  # nbsp
    return $Text
}

# Function to extract content between patterns
function Get-ContentBetween {
    param(
        [string]$Content,
        [string]$StartPattern,
        [string]$EndPattern,
        [switch]$IncludeStart,
        [switch]$IncludeEnd
    )
    if ($Content -match "(?s)$StartPattern(.*?)$EndPattern") {
        $result = $Matches[1]
        if ($IncludeStart) { $result = $Matches[0] }
        return $result.Trim()
    }
    return ""
}

# Function to extract meta tags
function Get-MetaTags {
    param([string]$Content)
    $metaTags = @()

    # Extract title
    if ($Content -match '<title>([^<]+)</title>') {
        $metaTags += "  <title>$($Matches[1])</title>"
    }

    # Extract meta tags (description, keywords, og:*, twitter:*, author, robots)
    $metaPattern = '<meta\s+(?:name|property)="([^"]+)"\s+content="([^"]+)"[^>]*/?\s*>'
    $metaMatches = [regex]::Matches($Content, $metaPattern)
    foreach ($match in $metaMatches) {
        $name = $match.Groups[1].Value
        $contentVal = $match.Groups[2].Value
        if ($name -match '^(description|keywords|author|robots|og:|twitter:)') {
            if ($name -match '^og:') {
                $metaTags += "  <meta property=`"$name`" content=`"$contentVal`">"
            } else {
                $metaTags += "  <meta name=`"$name`" content=`"$contentVal`">"
            }
        }
    }

    # Also check for property first format
    $metaPattern2 = '<meta\s+property="([^"]+)"\s+content="([^"]+)"[^>]*/?\s*>'
    $metaMatches2 = [regex]::Matches($Content, $metaPattern2)
    foreach ($match in $metaMatches2) {
        $name = $match.Groups[1].Value
        $contentVal = $match.Groups[2].Value
        $tag = "  <meta property=`"$name`" content=`"$contentVal`">"
        if ($metaTags -notcontains $tag) {
            $metaTags += $tag
        }
    }

    # Extract canonical and hreflang
    $linkPattern = '<link\s+rel="(canonical|alternate)"[^>]+>'
    $linkMatches = [regex]::Matches($Content, $linkPattern)
    foreach ($match in $linkMatches) {
        $metaTags += "  $($match.Value)"
    }

    # Extract JSON-LD schema
    $schemaPattern = '(?s)<script\s+type="application/ld\+json">\s*(\{.*?\})\s*</script>'
    if ($Content -match $schemaPattern) {
        $schema = $Matches[1]
        $metaTags += ""
        $metaTags += "  <script type=`"application/ld+json`">"
        $metaTags += "  $schema"
        $metaTags += "  </script>"
    }

    return ($metaTags -join "`n")
}

# Function to extract H1 title
function Get-H1Title {
    param([string]$Content)
    # Try main__title class first
    if ($Content -match '<h1[^>]*class="[^"]*main__title[^"]*"[^>]*>([^<]+)</h1>') {
        return $Matches[1].Trim()
    }
    # Try any h1
    if ($Content -match '<h1[^>]*>([^<]+)</h1>') {
        return $Matches[1].Trim()
    }
    return "Untitled"
}

# Function to extract category
function Get-Category {
    param([string]$Content)
    if ($Content -match '<span\s+class="blog-post__category">([^<]+)</span>') {
        return $Matches[1].Trim()
    }
    return "Artikkel"
}

# Function to extract date
function Get-DateInfo {
    param([string]$Content)
    $result = @{
        ISO = (Get-Date).ToString("yyyy-MM-dd")
        Display = (Get-Date).ToString("d. MMMM yyyy", [System.Globalization.CultureInfo]::GetCultureInfo("nb-NO"))
    }

    # Try datetime attribute
    if ($Content -match '<time[^>]*datetime="([^"]+)"[^>]*>([^<]+)</time>') {
        $result.ISO = $Matches[1]
        $result.Display = $Matches[2].Trim()
    }
    # Try date span
    elseif ($Content -match '<span\s+class="blog-post__date">([^<]+)</span>') {
        $result.Display = $Matches[1].Trim()
        # Try to parse and format
        if ($result.Display -match '(\d{1,2})\.\s*(\w+)\s*(\d{4})') {
            $day = $Matches[1]
            $month = $Matches[2]
            $year = $Matches[3]
            $months = @{
                'januar' = '01'
                'februar' = '02'
                'mars' = '03'
                'april' = '04'
                'mai' = '05'
                'juni' = '06'
                'juli' = '07'
                'august' = '08'
                'september' = '09'
                'oktober' = '10'
                'november' = '11'
                'desember' = '12'
            }
            if ($months.ContainsKey($month.ToLower())) {
                $result.ISO = "$year-$($months[$month.ToLower()])-$($day.PadLeft(2,'0'))"
            }
        }
    }

    return $result
}

# Function to extract subtitle
function Get-Subtitle {
    param([string]$Content)
    # Try main__text
    if ($Content -match '<div\s+class="[^"]*main__text[^"]*"[^>]*>\s*([^<]+)') {
        return $Matches[1].Trim()
    }
    # Try hub-hero__subtitle
    if ($Content -match '<p\s+class="hub-hero__subtitle">([^<]+)</p>') {
        return $Matches[1].Trim()
    }
    return "Kiropraktor Mads Finstad, Majorstua"
}

# Function to extract main content
function Get-MainContent {
    param([string]$Content)

    $result = ""

    # Pattern 1: Look for blog-post__content and capture until we hit related-box, tags, or navigation
    $pattern1 = '(?s)<div\s+class="blog-post__content">\s*(.*?)\s*</div>\s*(?:<div\s+class="related-box|<div\s+class="blog-post__tags|<nav\s+class="blog-post__navigation)'
    if ($Content -match $pattern1) {
        $result = $Matches[1].Trim()
        if ($result.Length -gt 500) {
            return $result
        }
    }

    # Pattern 2: blog-post__content inside section - capture until </div></div></section>
    $pattern2 = '(?s)<div\s+class="blog-post__content">\s*(.*?)\s*</div>\s*</div>\s*</section>'
    if ($Content -match $pattern2) {
        $result = $Matches[1].Trim()
        if ($result.Length -gt 500) {
            return $result
        }
    }

    # Pattern 3: blog-post__container inside section
    $pattern3 = '(?s)<section[^>]*class="[^"]*blog-post[^"]*"[^>]*>\s*<div\s+class="blog-post__container">\s*(.*?)\s*</div>\s*</section>'
    if ($Content -match $pattern3) {
        $containerContent = $Matches[1]
        # Remove meta and breadcrumb if present
        $containerContent = $containerContent -replace '(?s)<div\s+class="blog-post__meta">.*?</div>', ''
        $containerContent = $containerContent -replace '(?s)<nav\s+class="breadcrumb"[^>]*>.*?</nav>', ''
        # Remove outer blog-post__content wrapper if exists
        if ($containerContent -match '(?s)<div\s+class="blog-post__content">\s*(.*?)\s*</div>\s*$') {
            $containerContent = $Matches[1]
        }
        $result = $containerContent.Trim()
        if ($result.Length -gt 500) {
            return $result
        }
    }

    # Pattern 4: article.blog-post structure
    $pattern4 = '(?s)<article\s+class="blog-post">\s*<div\s+class="blog-post__container">\s*(.*?)\s*</div>\s*</article>'
    if ($Content -match $pattern4) {
        $containerContent = $Matches[1]
        # Extract just the blog-post__content part
        if ($containerContent -match '(?s)<div\s+class="blog-post__content">\s*(.*?)\s*</div>\s*<div\s+class="related-box') {
            $result = $Matches[1].Trim()
        } elseif ($containerContent -match '(?s)<div\s+class="blog-post__content">\s*(.*?)\s*</div>\s*<div\s+class="blog-post__tags') {
            $result = $Matches[1].Trim()
        } elseif ($containerContent -match '(?s)<div\s+class="blog-post__content">\s*(.*?)\s*</div>\s*<nav') {
            $result = $Matches[1].Trim()
        }
        if ($result.Length -gt 500) {
            return $result
        }
    }

    # Pattern 5: More aggressive - find first h2 and capture from there to related-box or tags
    $pattern5 = '(?s)(<h2[^>]*>.*?)</div>\s*(?:<div\s+class="related-box|<div\s+class="blog-post__tags|<nav\s+class="blog-post__navigation)'
    if ($Content -match $pattern5) {
        # Also need to include any TL;DR or intro before the first h2
        $h2Content = $Matches[1]
        # Try to also capture premium-summary-card or tldr-box before the h2
        if ($Content -match '(?s)(<div\s+class="(?:premium-summary-card|tldr-box)".*?</div>\s*)(<h2[^>]*>.*)') {
            $beforeH2 = $Matches[1]
            if ($Content -match "(?s)$([regex]::Escape($beforeH2))\s*(.*?)\s*</div>\s*(?:<div\s+class=`"related-box|<div\s+class=`"blog-post__tags|<nav\s+class=`"blog-post__navigation)") {
                $result = ($beforeH2 + $Matches[1]).Trim()
            }
        }
        if ([string]::IsNullOrWhiteSpace($result)) {
            $result = $h2Content.Trim()
        }
        if ($result.Length -gt 500) {
            return $result
        }
    }

    return $result
}

# Function to extract and process H2 headings for TOC
function Get-TOCAndProcessContent {
    param([string]$Content)

    $tocItems = @()
    $processedContent = $Content
    $usedIds = @{}

    # Find all h2 elements
    $h2Pattern = '<h2[^>]*>([^<]+)</h2>'
    $h2Matches = [regex]::Matches($Content, $h2Pattern)

    foreach ($match in $h2Matches) {
        $fullMatch = $match.Value
        $heading = $match.Groups[1].Value.Trim()
        $baseSlug = Get-Slug $heading

        # Ensure unique ID
        $id = $baseSlug
        if ($usedIds.ContainsKey($id)) {
            $usedIds[$id]++
            $id = "$baseSlug-$($usedIds[$id])"
        } else {
            $usedIds[$id] = 1
        }

        # Create TOC item
        $tocItems += "              <li><a href=`"#$id`">$heading</a></li>"

        # Replace h2 with id attribute
        $newH2 = "<h2 id=`"$id`">$heading</h2>"
        $processedContent = $processedContent.Replace($fullMatch, $newH2)
    }

    return @{
        TOC = ($tocItems -join "`n")
        Content = $processedContent
    }
}

# Main conversion function
function Convert-BlogFile {
    param([string]$FilePath)

    $fileName = Split-Path -Leaf $FilePath
    Write-Host "Processing: $fileName" -ForegroundColor Cyan

    # Read file
    $content = [System.IO.File]::ReadAllText($FilePath, [System.Text.UTF8Encoding]::new($true))

    # Fix encoding issues
    $content = Fix-Encoding $content

    # Skip if fully converted (has hub-wrapper AND hub-toc-card)
    if ($content -match 'class="hub-wrapper"' -and $content -match 'hub-toc-card') {
        Write-Host "  - Already converted, skipping" -ForegroundColor Yellow
        return $false
    }

    # Note: will reconvert files that have hub-wrapper but missing hub-toc-card
    if ($content -match 'class="hub-wrapper"' -and $content -notmatch 'hub-toc-card') {
        Write-Host "  - Missing TOC, will reconvert" -ForegroundColor Cyan
    }

    # Extract components
    $metaTags = Get-MetaTags $content
    $h1Title = Get-H1Title $content
    $category = Get-Category $content
    $dateInfo = Get-DateInfo $content
    $subtitle = Get-Subtitle $content
    $mainContent = Get-MainContent $content

    if ([string]::IsNullOrWhiteSpace($mainContent)) {
        Write-Host "  - WARNING: Could not extract main content" -ForegroundColor Red
        return $false
    }

    # Process content and generate TOC
    $tocResult = Get-TOCAndProcessContent $mainContent

    if ([string]::IsNullOrWhiteSpace($tocResult.TOC)) {
        Write-Host "  - WARNING: No H2 headings found for TOC" -ForegroundColor Yellow
        $tocResult.TOC = "              <li><a href=`"#`">Innhold</a></li>"
    }

    # Build new file from template
    $newContent = $Template
    $newContent = $newContent.Replace('{{META_TAGS}}', $metaTags)
    $newContent = $newContent.Replace('{{H1_TITLE}}', $h1Title)
    $newContent = $newContent.Replace('{{CATEGORY}}', $category)
    $newContent = $newContent.Replace('{{DATE_ISO}}', $dateInfo.ISO)
    $newContent = $newContent.Replace('{{DATE_DISPLAY}}', $dateInfo.Display)
    $newContent = $newContent.Replace('{{SUBTITLE}}', $subtitle)
    $newContent = $newContent.Replace('{{MAIN_CONTENT}}', $tocResult.Content)
    $newContent = $newContent.Replace('{{TOC_ITEMS}}', $tocResult.TOC)

    # Fix encoding one more time
    $newContent = Fix-Encoding $newContent

    # Save with UTF-8 BOM
    [System.IO.File]::WriteAllText($FilePath, $newContent, [System.Text.UTF8Encoding]::new($true))

    Write-Host "  - Converted successfully" -ForegroundColor Green
    return $true
}

# Main execution
Write-Host "===============================================" -ForegroundColor White
Write-Host "Blog Post Hub Layout Conversion Script" -ForegroundColor White
Write-Host "===============================================" -ForegroundColor White
Write-Host ""

# Create backup
Write-Host "Creating backup at: $BackupDir" -ForegroundColor Yellow
New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
Get-ChildItem -Path $BlogDir -Filter "*.html" | Where-Object { $_.Name -ne "index.html" } | ForEach-Object {
    Copy-Item $_.FullName -Destination $BackupDir
}
Write-Host "Backup complete: $((Get-ChildItem $BackupDir).Count) files" -ForegroundColor Green
Write-Host ""

# Get all blog files (excluding index.html)
$blogFiles = Get-ChildItem -Path $BlogDir -Filter "*.html" | Where-Object { $_.Name -ne "index.html" }

Write-Host "Found $($blogFiles.Count) blog files to process" -ForegroundColor White
Write-Host ""

# Process files
$converted = 0
$skipped = 0
$failed = 0

foreach ($file in $blogFiles) {
    try {
        $result = Convert-BlogFile -FilePath $file.FullName
        if ($result) {
            $converted++
        } else {
            $skipped++
        }
    }
    catch {
        Write-Host "  - ERROR: $_" -ForegroundColor Red
        $failed++
    }
}

# Summary
Write-Host ""
Write-Host "===============================================" -ForegroundColor White
Write-Host "Conversion Complete" -ForegroundColor White
Write-Host "===============================================" -ForegroundColor White
Write-Host "Converted: $converted" -ForegroundColor Green
Write-Host "Skipped: $skipped" -ForegroundColor Yellow
Write-Host "Failed: $failed" -ForegroundColor Red
Write-Host ""
Write-Host "Backup location: $BackupDir" -ForegroundColor Cyan
Write-Host ""

# Verification
Write-Host "Running verification..." -ForegroundColor White
$hubWrapperCount = 0
$tocCardCount = 0
Get-ChildItem -Path $BlogDir -Filter "*.html" | Where-Object { $_.Name -ne "index.html" } | ForEach-Object {
    $c = [System.IO.File]::ReadAllText($_.FullName, [System.Text.UTF8Encoding]::new($true))
    if ($c -match 'hub-wrapper') { $script:hubWrapperCount++ }
    if ($c -match 'hub-toc-card') { $script:tocCardCount++ }
}

Write-Host "Files with hub-wrapper: $hubWrapperCount / $($blogFiles.Count)" -ForegroundColor $(if ($hubWrapperCount -eq $blogFiles.Count) { 'Green' } else { 'Yellow' })
Write-Host "Files with hub-toc-card: $tocCardCount / $($blogFiles.Count)" -ForegroundColor $(if ($tocCardCount -eq $blogFiles.Count) { 'Green' } else { 'Yellow' })
