# Convert blog header/footer to match site-wide template

$bloggPath = Join-Path $PSScriptRoot "..\blogg"

# Standard header template
$standardHeader = @'
<body id="top">
  <a href="#main" class="skip-link">Hopp til hovedinnhold</a>
  <div class="wrapper">
    <header class="header">
      <div class="header__container">
        <a href="../index.html" class="header__logo logo"><img src="../images/logo-header.webp" alt="Klinikk for alle Kiropraktor Majorstua Oslo logo" loading="lazy" decoding="async" /></a>
        <div class="header__navigation">
          <div class="language-toggle" role="group" aria-label="Språkvalg">
            <button class="language-toggle__button language-toggle__button--active" data-lang="no" aria-label="Norsk" aria-pressed="true">NO</button>
            <button class="language-toggle__button" data-lang="en" aria-label="Bytt til Engelsk" aria-pressed="false">EN</button>
            <div class="language-toggle__slider"></div>
          </div>
          <button type="button" class="icon-menu" aria-label="Åpne navigasjonsmeny" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <div class="menu__body">
            <ul class="menu__list">
              <li class="menu__item"><a href="../index.html" class="menu__link">Hjem</a></li>
              <li class="menu__item"><a href="../about.html" class="menu__link">Om meg</a></li>
              <li class="menu__item"><a href="../services.html" class="menu__link">Tjenester</a></li>
              <li class="menu__item"><a href="../plager.html" class="menu__link">Plager</a></li>
              <li class="menu__item"><a href="../priser.html" class="menu__link">Priser</a></li>
              <li class="menu__item"><a href="../faq.html" class="menu__link">FAQ</a></li>
              <li class="menu__item"><a href="../contact.html" class="menu__link">Kontakt</a></li>
              <li class="menu__item"><a href="index.html" class="menu__link">Blogg</a></li>
              <li class="menu__item">
                <a href="https://onlinebooking.solvitjournal.no/kfa_majorstuen/6562/book-available" rel="noopener noreferrer" class="actions-header__button">Bestill Time</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>

    <main class="page" id="main">
'@

# Standard footer template
$standardFooter = @'
    </main>

    <footer class="footer">
      <div class="footer__container">
        <div class="footer__left">
          <div class="footer__social">
            <a href="https://www.facebook.com/profile.php?id=61551540184975" rel="noopener noreferrer" class="footer__social-link">
              <img loading="lazy" decoding="async" src="../images/Media iconer/facebook_media_social_icon.png" alt="Følg TheBackROM på Facebook" />
            </a>
            <a href="https://www.instagram.com/chiro_mads/" rel="noopener noreferrer" class="footer__social-link">
              <img src="../images/Media iconer/instagramlogo.png" alt="Følg kiropraktor Mads Finstad på Instagram" />
            </a>
            <a href="https://www.youtube.com/@TheBackROM" rel="noopener noreferrer" class="footer__social-link">
              <img src="../images/Media iconer/youtube_icon.png" alt="Se videoer fra TheBackROM på YouTube" loading="lazy" decoding="async"/>
            </a>
            <a href="../contact.html" class="footer__social-link">
              <img loading="lazy" decoding="async" src="../images/Logo og identitet/ms-outlook-svgrepo-com.svg" alt="Send e-post til TheBackROM" />
            </a>
          </div>
        </div>

        <div class="footer__center">
          <div class="footer__logo">
            <a href="../index.html" class="logo"><img src="../images/Home/ryggmassasje-klinikk.png" alt="Klinikk for alle Kiropraktor Majorstua Oslo logo" /></a>
          </div>
          <div class="back-to-top-wrapper">
            <p class="back-to-top-text">Tilbake til start</p>
            <a href="#top" class="back-to-top-btn" aria-label="Gå til toppen av siden"><i class="fas fa-arrow-up" aria-hidden="true"></i> Opp</a>
          </div>
        </div>

        <div class="footer__right">
          <div class="footer__hours">
            <h3>Åpningstider</h3>
            <p>Mandag - Fredag: 08:00 - 19:00</p>
            <p>Lørdag: 10:00 - 16:00</p>
            <p>Søndag: Stengt</p>
          </div>
          <div class="footer__contact">
            <h3>Kontaktinformasjon</h3>
            <p>Gardeveien 17<br>0363 Oslo</p>
            <p>Telefon: <a href="tel:+4793043062">+47 93043062</a></p>
            <p>E-post: <a href="mailto:Mads.finstad@hotmail.com">Mads.finstad@hotmail.com</a></p>
          </div>
        </div>
      </div>

      <div class="footer__bottom">
        <a href="../personvern.html" class="footer__policy">Personvernerklæring</a>
        <p class="footer__copyright">&copy; 2026 Mads Finstad Kiropraktor - Alle rettigheter reservert</p>
      </div>
    </footer>
  </div>
  <!-- Mobile Sticky Booking Button -->
  <a href="https://onlinebooking.solvitjournal.no/kfa_majorstuen/6562/book-available" rel="noopener noreferrer"
     class="mobile-sticky-cta"
     aria-label="Bestill time hos kiropraktor">
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
    Bestill time
  </a>

  <script src="../js/script.min.js" defer></script>
  <script src="../js/modern-enhancements.min.js" defer></script>
  <script src="../js/language-toggle.min.js" defer></script>
  <script src="../js/breadcrumbs.js" defer></script>
</body>
</html>
'@

# Files to convert - those with old header structure (no wrapper div)
$files = Get-ChildItem -Path $bloggPath -Filter "*.html" | Where-Object {
    $content = Get-Content $_.FullName -Raw
    # Match files with old structure (have header__nav instead of header__navigation)
    ($content -match 'class="header__nav"' -or $content -match '<nav class="header__nav"') -and $_.Name -ne "index.html"
}

Write-Host "Found $($files.Count) files to convert header/footer" -ForegroundColor Cyan

foreach ($file in $files) {
    Write-Host "Processing: $($file.Name)" -ForegroundColor Yellow

    $content = Get-Content $file.FullName -Raw -Encoding UTF8

    # Extract everything between </head> and <main
    if ($content -match '(?s)</head>\s*(.*?)<main class="page" id="main">') {
        # Replace header section
        $content = $content -replace '(?s)</head>\s*<body[^>]*>.*?<main class="page" id="main">', "</head>`n$standardHeader"
    }

    # Extract and replace footer section
    if ($content -match '(?s)</main>\s*<footer.*?</html>') {
        $content = $content -replace '(?s)</section>\s*</main>\s*<footer.*?</html>', "</section>`n$standardFooter"
    }

    # Write back
    $content | Set-Content $file.FullName -Encoding UTF8 -NoNewline

    Write-Host "  Converted: $($file.Name)" -ForegroundColor Green
}

Write-Host "`nHeader/footer conversion complete!" -ForegroundColor Cyan
Write-Host "Converted $($files.Count) files" -ForegroundColor Green
