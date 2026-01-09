// Enhanced Scroll and Navigation Features - Performance Optimized
document.addEventListener('DOMContentLoaded', function () {
    initScrollController();
    initSmoothScroll();
});

function initScrollController() {
    const header = document.querySelector('.header');
    const backToTopBtn = document.querySelector('.back-to-top-btn');

    // Config
    const headerThreshold = 100;
    const backToTopThreshold = 300;

    let lastScrollY = window.pageYOffset;
    let ticking = false;

    function updateScrollState() {
        const scrollY = window.pageYOffset;

        // 1. Header Scroll Effect
        if (header) {
            if (scrollY > headerThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // 2. Back to Top Button Visibility
        if (backToTopBtn) {
            if (scrollY > backToTopThreshold) {
                // Show button
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.visibility = 'visible';
                backToTopBtn.style.transform = 'translateY(0)';
            } else {
                // Hide button
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.visibility = 'hidden';
                backToTopBtn.style.transform = 'translateY(20px)';
            }
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(updateScrollState);
            ticking = true;
        }
    }, { passive: true });

    // Back to Top Click Handler
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function (e) {
            e.preventDefault();

            // Visual feedback
            this.style.transform = 'scale(0.9)';

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            setTimeout(() => {
                // Return to normal state (will be handled by scroll listener, 
                // but we reset scale here)
                if (window.pageYOffset > backToTopThreshold) {
                    this.style.transform = 'translateY(0) scale(1)';
                } else {
                    this.style.transform = 'translateY(20px) scale(1)';
                }
            }, 150);
        });
    }
}

function initSmoothScroll() {
    // Enhanced smooth scroll for anchor links with Header Offset
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if href is just "#" or empty
            if (href === '#' || !href) return;

            // Allow default behavior for specialized links if needed (none currently)

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            // Calculate offset for fixed header
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Update URL cleanly
            history.pushState(null, null, href);
        });
    });
}
