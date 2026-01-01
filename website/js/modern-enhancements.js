// Modern Website Enhancements
document.addEventListener('DOMContentLoaded', function () {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Create scroll progress indicator (skip if reduced motion preferred)
    if (!prefersReducedMotion) {
        createScrollProgressIndicator();
    }

    // Add intersection observer for animations (skip if reduced motion preferred)
    if (!prefersReducedMotion) {
        addScrollAnimations();
    }
});

// Scroll Progress Indicator - Optimized with requestAnimationFrame
function createScrollProgressIndicator() {
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';

    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';

    scrollIndicator.appendChild(scrollProgress);
    document.body.appendChild(scrollIndicator);

    let ticking = false;

    function updateProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        scrollProgress.style.width = scrollPercent + '%';
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(updateProgress);
            ticking = true;
        }
    }, { passive: true });
}

// Scroll Animations - Optimized
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    // Observe cards and sections
    const elementsToAnimate = document.querySelectorAll(
        '.item-services, .services-grid__item, .testimonial__item, .klinisk-hjorne__item, .about__container, .problems__item, .card, .about__content'
    );

    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}
