document.addEventListener('DOMContentLoaded', function () {
  // Mobile menu toggle
  const iconMenu = document.querySelector('.icon-menu');
  const menuBody = document.querySelector('.menu__body');
  const body = document.body;

  if (iconMenu && menuBody) {
    const menuFocusableElements = menuBody.querySelectorAll('a, button');

    // Create overlay element for mobile menu
    const menuOverlay = document.createElement('div');
    menuOverlay.className = 'menu-overlay';
    body.appendChild(menuOverlay);

    // Helper to set focusability of menu items
    function setMenuFocusable(focusable) {
      menuFocusableElements.forEach(el => {
        el.setAttribute('tabindex', focusable ? '0' : '-1');
      });
    }

    // Initialize ARIA - menu closed by default
    iconMenu.setAttribute('aria-expanded', 'false');
    menuBody.setAttribute('aria-hidden', 'true');
    setMenuFocusable(false);

    iconMenu.addEventListener('click', function () {
      const isActive = iconMenu.classList.toggle('active');
      menuBody.classList.toggle('active');
      menuOverlay.classList.toggle('active');
      body.classList.toggle('menu-open');
      iconMenu.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      menuBody.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      setMenuFocusable(isActive);
    });

    // Helper to close menu
    function closeMenu() {
      iconMenu.classList.remove('active');
      menuBody.classList.remove('active');
      menuOverlay.classList.remove('active');
      body.classList.remove('menu-open');
      iconMenu.setAttribute('aria-expanded', 'false');
      menuBody.setAttribute('aria-hidden', 'true');
      setMenuFocusable(false);
    }

    // Close menu when clicking overlay
    menuOverlay.addEventListener('click', closeMenu);

    // Close menu when clicking on menu items
    const menuLinks = document.querySelectorAll('.menu__link');
    menuLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!menuBody.contains(e.target) && !iconMenu.contains(e.target) && !menuOverlay.contains(e.target) && menuBody.classList.contains('active')) {
        closeMenu();
      }
    });

    // Close menu with Escape key (accessibility improvement)
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuBody.classList.contains('active')) {
        closeMenu();
        iconMenu.focus(); // Return focus to the menu button
      }
    });
  }

  // Footer menu toggle
  const footerMenuToggle = document.querySelector('.footer__menu-toggle');
  const footerLinks = document.querySelector('.footer__links');

  if (footerMenuToggle && footerLinks) {
    footerMenuToggle.addEventListener('click', function () {
      footerLinks.classList.toggle('active');
    });
  }

  // Klinisk Hjørne scroll navigation
  const scrollContainer = document.querySelector('.klinisk-hjorne__scroll');
  const prevButton = document.querySelector('.klinisk-hjorne__nav-prev');
  const nextButton = document.querySelector('.klinisk-hjorne__nav-next');

  if (scrollContainer && prevButton && nextButton) {
    // Set buttons initial state
    updateNavButtons();

    // Scroll event to update button states (Throttled)
    let scrollTicking = false;
    scrollContainer.addEventListener('scroll', () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          updateNavButtons();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    }, { passive: true });

    // Click events for buttons
    prevButton.addEventListener('click', () => {
      const scrollAmount = scrollContainer.clientWidth * 0.8;
      scrollContainer.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    });

    nextButton.addEventListener('click', () => {
      const scrollAmount = scrollContainer.clientWidth * 0.8;
      scrollContainer.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    });

    // Function to update button states
    function updateNavButtons() {
      // Check if we can scroll left
      if (scrollContainer.scrollLeft <= 0) {
        prevButton.classList.add('disabled');
        prevButton.setAttribute('aria-disabled', 'true');
      } else {
        prevButton.classList.remove('disabled');
        prevButton.setAttribute('aria-disabled', 'false');
      }

      // Check if we can scroll right
      const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      if (Math.ceil(scrollContainer.scrollLeft) >= maxScrollLeft) {
        nextButton.classList.add('disabled');
        nextButton.setAttribute('aria-disabled', 'true');
      } else {
        nextButton.classList.remove('disabled');
        nextButton.setAttribute('aria-disabled', 'false');
      }
    }
  }

  // FAQ accordion functionality
  const spollerButtons = document.querySelectorAll("[data-spoller] .spollers-faq__button");

  spollerButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const currentItem = button.closest("[data-spoller]");
      const content = currentItem.querySelector(".spollers-faq__text");

      const parent = currentItem.parentNode;
      const isOneSpoller = parent.hasAttribute("data-one-spoller");

      if (isOneSpoller) {
        const allItems = parent.querySelectorAll("[data-spoller]");
        allItems.forEach((item) => {
          if (item !== currentItem) {
            const otherContent = item.querySelector(".spollers-faq__text");
            item.classList.remove("active");
            if (otherContent) {
              otherContent.style.maxHeight = null;
            }
          }
        });
      }

      if (currentItem.classList.contains("active")) {
        currentItem.classList.remove("active");
        if (content) {
          content.style.maxHeight = null;
        }
      } else {
        currentItem.classList.add("active");
        if (content) {
          content.style.maxHeight = content.scrollHeight + "px";
        }
      }
    });
  });

  // Blog toggle functionality
  const blogToggleButtons = document.querySelectorAll('.blog-toggle__button');

  if (blogToggleButtons.length > 0) {
    blogToggleButtons.forEach(button => {
      button.addEventListener('click', function (e) {
        e.preventDefault();

        // Remove active class from all buttons
        blogToggleButtons.forEach(btn => btn.classList.remove('active'));

        // Add active class to clicked button
        this.classList.add('active');

        // Get the target page from the href attribute
        const targetHref = this.getAttribute('href');

        // Navigate to the target page
        if (targetHref) {
          window.location.href = targetHref;
        }
      });
    });
  }

  // Set aria-current="page" on active menu items
  setAriaCurrentPage();
});

/**
 * Set aria-current="page" on the active menu item
 * Improves accessibility for screen readers
 */
function setAriaCurrentPage() {
  const currentUrl = window.location.href.split(/[?#]/)[0];
  const menuLinks = document.querySelectorAll('.menu__link');

  menuLinks.forEach(link => {
    // Use the absolute href property which resolves relative paths
    const linkUrl = link.href.split(/[?#]/)[0];

    // Check for exact match or equivalent match (handling / vs /index.html)
    let isActive = false;

    if (linkUrl === currentUrl) {
      isActive = true;
    } else {
      // Handle "folder/" vs "folder/index.html" mismatch
      const linkIndex = linkUrl.lastIndexOf('index.html');
      const currentIndex = currentUrl.lastIndexOf('index.html');

      if (linkIndex !== -1 && currentIndex === -1) {
        // Link has index.html, current does not. Check if they match otherwise.
        if (linkUrl.substring(0, linkIndex) === currentUrl) isActive = true;
      } else if (linkIndex === -1 && currentIndex !== -1) {
        // Current has index.html, link does not.
        if (linkUrl === currentUrl.substring(0, currentIndex)) isActive = true;
      }
    }

    if (isActive) {
      link.setAttribute('aria-current', 'page');
      link.classList.add('menu__link--active');
    } else {
      link.removeAttribute('aria-current');
      link.classList.remove('menu__link--active');
    }
  });
}

