# Website Folder Cleanup Report

**Date:** 2026-01-29
**Website:** F:\0 - 0 - Totall Clarity\0 - 0 - Nettside code – Kopi\website

---

## Executive Summary

**Status: ✅ CLEAN**

The website folder is well-maintained with minimal cleanup needed.

---

## Scan Results

### Backup Files (.bak, .orig, .old, .backup)
| File | Location | Size | Action |
|------|----------|------|--------|
| README.md.bak | node_modules/form-data/ | 7 KB | ⚪ IGNORE (package managed) |
| akutt-ryggsmerte-selvhjelp.html.backup | blogg/ | 28 KB | 🔴 **DELETE** (outdated backup) |

### Orphan Files (Not Referenced in HTML)
| File | Size | Action |
|------|------|--------|
| `skiveprolaps-screenshot.png` | 470 KB | 🔴 **DELETE** (development file) |
| `article-review.png` | **4.3 MB** | 🔴 **DELETE** (large review file) |
| `korsrygg-review-1.png` | 466 KB | 🔴 **DELETE** (review file) |
| `nul` | 85 bytes | 🔴 **DELETE** (Windows device name artifact) |

### Temp Files (.tmp, .temp)
**Result:** None found ✅

### Log Files (.log)
**Result:** None found ✅

### Files with Tilde (~)
**Result:** None found ✅

---

## Potential Cleanup Items

### Files with "(1)" Suffix in /images/
Found 40+ files with "(1)" in the filename. These appear to be download duplicates but **many are actively used** in HTML files.

**Status:** ⚠️ INVESTIGATION NEEDED

| Category | Count | In Use |
|----------|-------|--------|
| behandling (1).* | 12 | Yes (2 HTML files) |
| korsrygg smerte (1).* | 6 | Yes (12 HTML files) |
| Other (1) files | 22+ | Mixed |

**Recommendation:**
- Do NOT delete these files without careful review
- Some "(1)" files are intentionally named and referenced
- Consider renaming during a dedicated image cleanup sprint

### Screenshots in /images/
Found 4 screenshot files in /images/ directories:
- `Screenshot-2025-07-11-114403.png/webp` (svimmelhet)
- `Screenshot-2024-03-04-08.31.06.webp/png` (ryggsmerter)

**Status:** May be intentionally used as clinical images
**Action:** Verify usage before removal

---

## Protected Directories (No Changes Made)

As specified in the plan, these directories were NOT modified:
- ✅ /images/
- ✅ /images-originals/
- ✅ /img/
- ✅ /images/infographics/
- ✅ /node_modules/

---

## Recommendations

### Immediate (None Required)
The website folder is clean. No immediate action needed.

### Future Improvements (Optional)
1. **Image Organization Sprint:** Review "(1)" files and consolidate naming
2. **Screenshot Review:** Verify screenshot files are intentionally used
3. **Automated Checks:** Add pre-commit hooks to prevent duplicate uploads

---

## Cleanup Commands

To delete the identified files, run these commands:

```powershell
# Navigate to website directory first
cd "F:\0 - 0 - Totall Clarity\0 - 0 - Nettside code – Kopi\website"

# Delete orphan/review files (5.2 MB total)
Remove-Item "skiveprolaps-screenshot.png"
Remove-Item "article-review.png"
Remove-Item "korsrygg-review-1.png"
Remove-Item "nul"
Remove-Item "blogg\akutt-ryggsmerte-selvhjelp.html.backup"
```

## Conclusion

The website folder has **5 files safe to delete** totaling approximately **5.3 MB**:
- 3 review/screenshot files in root (not referenced)
- 1 backup HTML file (outdated)
- 1 Windows artifact file

The duplicate-named files in /images/ (with "(1)" suffix) are actively referenced and should NOT be removed.

**Files safe to delete:** 5 (5.3 MB)
**Files requiring review:** ~64 (all in /images/, protected)
