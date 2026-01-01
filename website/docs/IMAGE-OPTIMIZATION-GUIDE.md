# 📸 BILDEOPTIMALISERING GUIDE
## TheBackROM Website - Kritisk Ytelsesf orbedring

---

## 🚨 KRITISK: 15MB BILDE MÅ FIKSES FØRST!

### Problem:
- **Fil:** `pictures.final/kunnskapshjørnet/behbadling model.jpg`
- **Størrelse:** 15MB (ekstrem!)
- **Duplikat:** `Final pics/kunnskapshjørnet/behbadling model.jpg` (også 15MB)
- **Impact:** Nettsiden laster 5-8 sekunder lenger enn nødvendig

### Løsning:
1. Komprimer dette bildet til **maks 300KB**
2. Slett duplikatet

---

## 📊 OVERSIKT OVER STORE BILDER (>1MB)

Totalt funnet: **30 bilder over 1MB**

### Topp 20 Største Bilder:

| Fil | Størrelse | Anbefalt | Potensiale |
|-----|-----------|----------|------------|
| behbadling model.jpg | 15MB | 300KB | 🔥 14.7MB |
| behandling (2).jpg | 3.5MB | 400KB | 3.1MB |
| home 2.jpg | 3.5MB | 400KB | 3.1MB |
| hodepine 5.jpg | 2.8MB | 350KB | 2.45MB |
| kjeve 2.jpg | 2.7MB | 350KB | 2.35MB |
| svimmel 4 (2).jpg | 2.4MB | 350KB | 2.05MB |
| skulder.jpg | 2.1MB | 300KB | 1.8MB |
| aktiv.jpg | 2.0MB | 300KB | 1.7MB |

**Totalt potensiale:** Reduser fra 93MB til ~30MB = **63MB spart!**

---

## 🛠️ STEG-FOR-STEG KOMPRIMERINGSGUIDE

### Metode 1: Online Verktøy (Enklest)

#### TinyPNG / TinyJPG (Anbefalt)
1. Gå til https://tinypng.com eller https://tinyjpg.com
2. Dra og slipp bilder (maks 20 av gangen)
3. Venter på automatisk komprimering (lossy, kvalitet 85%)
4. Last ned komprimerte filer
5. Erstatt originale filer

**Fordeler:**
- Veldig enkelt
- God kvalitet
- Automatisk optimalisering

**Ulemper:**
- Maksbilder per gang
- Krever internettilkobling

#### Squoosh (Google)
1. Gå til https://squoosh.app
2. Last opp bilde
3. Velg format (WebP anbefalt) eller JPG
4. Juster kvalitet (80-85 anbefalt)
5. Last ned optimalisert bilde

**Fordeler:**
- Sammenlign før/etter
- Konvertere til WebP
- Offline-støtte

---

### Metode 2: Desktop Software

#### ImageOptim (Mac - GRATIS)
```bash
# Installer via Homebrew
brew install imageoptim

# Eller last ned fra
https://imageoptim.com/mac
```

**Bruk:**
1. Åpne ImageOptim
2. Dra mapper med bilder inn
3. Programmet optimaliserer automatisk
4. Ferdig!

#### RIOT (Windows - GRATIS)
```
Last ned fra:
https://riot-optimizer.com/
```

**Bruk:**
1. Åpne RIOT
2. Last inn bilde
3. Juster kvalitet (slider)
4. Se størrelse i sanntid
5. Lagre

---

### Metode 3: Kommandolinje (Avansert)

#### ImageMagick (Cross-platform)

**Installer:**
```bash
# Windows (via Chocolatey)
choco install imagemagick

# Mac
brew install imagemagick

# Linux
sudo apt-get install imagemagick
```

**Komprimer enkeltbilde:**
```bash
magick convert input.jpg -quality 85 -strip output.jpg
```

**Batch-komprimering (alle JPG i mappe):**
```bash
# Windows PowerShell
Get-ChildItem -Path "E:\...\pictures.final" -Recurse -Filter *.jpg | ForEach-Object {
    magick convert $_.FullName -quality 85 -strip $_.FullName
}

# Mac/Linux Bash
find "pictures.final" -name "*.jpg" -exec magick convert {} -quality 85 -strip {} \;
```

**Konverter til WebP:**
```bash
magick convert input.jpg -quality 85 output.webp
```

---

## 📋 KOMPLETT OPTIMALISERINGSPLAN

### FASE 1: Kritisk (Gjør NÅ!)

#### 1. Komprimer 15MB bildet
```bash
cd "E:\1- Tottal mappe Web-  Combinned - 95% - Finished material - Publish ready - Folder pr Site with pictures and sortments\0 - 0 - Nettside code – Kopi\website\pictures.final\kunnskapshjørnet"

# Metode 1: TinyJPG
# Last opp til tinyjpg.com, last ned, erstatt

# Metode 2: ImageMagick
magick convert "behbadling model.jpg" -quality 80 -resize 2000x -strip "behbadling model.jpg"
```

**Forventet resultat:** 15MB → 300KB

#### 2. Slett Duplikater
```bash
# Slett hele "Final pics" mappen (duplikat av pictures.final)
rmdir /s "E:\...\Final pics"
```

**Forventet resultat:** Spar 45MB

---

### FASE 2: Høy Prioritet (Denne uken)

#### Komprimer alle bilder >1MB

**Automatisk script (PowerShell):**
```powershell
# Naviger til website-mappen
cd "E:\1- Tottal mappe Web-  Combinned - 95% - Finished material - Publish ready - Folder pr Site with pictures and sortments\0 - 0 - Nettside code – Kopi\website"

# Finn og komprimer alle JPG over 1MB
Get-ChildItem -Path "pictures.final" -Recurse -Filter *.jpg | Where-Object {$_.Length -gt 1MB} | ForEach-Object {
    Write-Host "Komprimerer: $($_.Name) ($([math]::Round($_.Length/1MB, 2))MB)"
    magick convert $_.FullName -quality 85 -strip $_.FullName
    Write-Host "Ferdig! Ny størrelse: $([math]::Round((Get-Item $_.FullName).Length/1KB, 0))KB"
}
```

**Forventet resultat:** 93MB → 30MB

---

### FASE 3: Langsiktig (Neste måned)

#### Konverter til moderne format (WebP)

**Hvorfor WebP?**
- 25-35% mindre enn JPG
- Bedre kvalitet på lavere filstørrelse
- Støttet av alle moderne browsere

**Implementering:**

1. **Konverter bilder:**
```bash
# Konverter alle JPG til WebP
Get-ChildItem -Path "pictures.final" -Recurse -Filter *.jpg | ForEach-Object {
    $webpPath = $_.FullName -replace '\.jpg$', '.webp'
    magick convert $_.FullName -quality 85 $webpPath
}
```

2. **Oppdater HTML:**
```html
<!-- Gammelt -->
<img src="pictures.final/Home/home-hero.jpg" alt="Hero">

<!-- Nytt - med fallback -->
<picture>
  <source srcset="pictures.final/Home/home-hero.webp" type="image/webp">
  <img src="pictures.final/Home/home-hero.jpg" alt="Hero">
</picture>
```

---

## 🎯 ANBEFALTE BILDESTØRRELSER

### Per Bruksområde:

| Bruk | Max Bredde | Max Størrelse | Format |
|------|------------|---------------|--------|
| Hero bilder | 2000px | 400KB | WebP/JPG |
| Featured bilder | 1600px | 350KB | WebP/JPG |
| Service cards | 800px | 200KB | WebP/JPG |
| Thumbnails | 400px | 100KB | WebP/JPG |
| Ikoner | 64px | 20KB | SVG/PNG |

### Kvalitetsinnstillinger:

| Format | Kvalitet | Bruk |
|--------|----------|------|
| JPG | 85% | Standard for foto |
| JPG | 80% | Akseptabel kompromiss |
| JPG | 75% | Bakgrunnsbilder |
| WebP | 85% | Beste for alle |
| PNG | Lossless | Kun logoer/ikoner |

---

## 📱 RESPONSIV BILDE-STRATEGI

### Implementer srcset for forskjellige skjermstørrelser:

```html
<img
  src="bilde-800w.webp"
  srcset="
    bilde-400w.webp 400w,
    bilde-800w.webp 800w,
    bilde-1200w.webp 1200w,
    bilde-1600w.webp 1600w
  "
  sizes="
    (max-width: 480px) 400px,
    (max-width: 768px) 800px,
    (max-width: 1200px) 1200px,
    1600px
  "
  alt="Beskrivelse"
  loading="lazy"
>
```

### Generer forskjellige størrelser:

```bash
# Lag 4 versjoner av hvert bilde
magick convert original.jpg -resize 400x -quality 85 bilde-400w.webp
magick convert original.jpg -resize 800x -quality 85 bilde-800w.webp
magick convert original.jpg -resize 1200x -quality 85 bilde-1200w.webp
magick convert original.jpg -resize 1600x -quality 85 bilde-1600w.webp
```

---

## ✅ SJEKKLISTE

### Umiddelbar Aksjon:
- [ ] Komprimer 15MB bildet til 300KB
- [ ] Slett "Final pics" duplikat-mappe
- [ ] Test at nettsiden fortsatt laster bilder

### Denne Uken:
- [ ] Komprimer alle bilder >1MB
- [ ] Verifiser bildekvalitet er akseptabel
- [ ] Test lastetid (burde være 2-3 sek nå)

### Denne Måneden:
- [ ] Konverter topp 50 bilder til WebP
- [ ] Implementer `<picture>` element med fallback
- [ ] Generer responsive bildestørrelser (srcset)

### Langsiktig:
- [ ] Konverter ALLE bilder til WebP
- [ ] Sett opp automatisk bilde-prosessering
- [ ] Implementer lazy loading på alle bilder
- [ ] Vurder CDN for bildelevering

---

## 🧪 TESTING

### Før og Etter Sammenligning:

**Test lastetid:**
1. Åpne Chrome DevTools (F12)
2. Gå til Network tab
3. Last siden på nytt (Ctrl+Shift+R)
4. Se på "Finish" tid nederst

**Forventet forbedring:**
- **Før:** 5-8 sekunder (3G)
- **Etter Fase 1:** 3-4 sekunder
- **Etter Fase 2:** 2-3 sekunder
- **Etter Fase 3:** 1-2 sekunder

### Online Testing Tools:

1. **PageSpeed Insights**
   - https://pagespeed.web.dev/
   - Før: ~40-50 score
   - Etter: ~80-90 score

2. **GTmetrix**
   - https://gtmetrix.com/
   - Se "Total Page Size" før/etter

3. **WebPageTest**
   - https://www.webpagetest.org/
   - Detaljert laste-analyse

---

## 💡 TIPS OG BEST PRACTICES

### Generelt:
1. **Alltid ta backup** før bulk-komprimering
2. **Test bildekvalitet** visuelt etter komprimering
3. **Sammenlign filstørrelser** for å verifisere gevinst
4. **Optimaliser i batch** for effektivitet
5. **Dokumenter endringer** i versjonskontroll

### Unngå:
- ❌ Ikke komprimer samme bilde flere ganger
- ❌ Ikke gå under 75% kvalitet for hero-bilder
- ❌ Ikke slett originaler før du har testet
- ❌ Ikke komprimer logoer/ikoner (bruk SVG)

### Vedlikehold:
- ✅ Komprimer nye bilder før opplasting
- ✅ Sett maks filstørrelse-policy (500KB)
- ✅ Automatiser optimalisering i build-prosess
- ✅ Overvåk total side-størrelse månedlig

---

## 📞 HJELP OG RESSURSER

### Verktøy:
- **TinyPNG:** https://tinypng.com
- **Squoosh:** https://squoosh.app
- **ImageOptim:** https://imageoptim.com
- **RIOT:** https://riot-optimizer.com
- **ImageMagick:** https://imagemagick.org

### Dokumentasjon:
- WebP Guide: https://developers.google.com/speed/webp
- Responsive Images: https://web.dev/responsive-images/
- Image Optimization: https://web.dev/fast/#optimize-your-images

### Support:
- ImageMagick forum: https://github.com/ImageMagick/ImageMagick/discussions
- Web.dev community: https://web.dev/community/

---

## 🎉 FORVENTET RESULTAT

### Etter Komplett Optimalisering:

**Ytelse:**
- **Før:** 5-8 sek lastetid (3G)
- **Etter:** 1-2 sek lastetid
- **Forbedring:** 300-400% raskere

**Filstørrelser:**
- **Før:** 93MB totalt
- **Etter:** ~25-30MB
- **Spart:** 63-68MB (68% reduksjon)

**SEO/Ranking:**
- PageSpeed score: +40 poeng
- Mobile usability: Kraftig forbedret
- Bounce rate: -15-20%
- Organic traffic: +20-30%

**Konvertering:**
- Raskere side = høyere konvertering
- **Estimat:** +15-20% flere bookinger

---

**Sist oppdatert:** 2025-01-24
**Versjon:** 1.0
**Status:** Klar for implementering
