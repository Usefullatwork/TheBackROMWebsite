/**
 * MODERN ENHANCEMENTS - THE "VISION" UPDATE
 * Handles Scroll Animations, Glassmorphism Header, Parallax, and Magnetic Interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initGlassHeader();
    initParallax();
    initMagneticButtons();
    initFloatingAnimation();
});


/**
 * 1. SCROLL ANIMATIONS (Fade In Up)
 * Uses IntersectionObserver for performance.
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                entry.target.classList.remove('js-scroll-hidden');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
        '.item-services, .problems__item, .klinisk-hjorne__item, .title-section__content, .main__title, .main__button'
    );

    animatedElements.forEach(el => {
        el.classList.add('js-scroll-hidden');
        observer.observe(el);
    });
}

/**
 * 2. GLASSMORPHISM HEADER
 * Adds background blur when scrolling down.
 */
function initGlassHeader() {
    const header = document.querySelector('.header') || document.querySelector('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('glass-active');
        } else {
            header.classList.remove('glass-active');
        }
    });
}

/**
 * 3. PARALLAX EFFECT
 * Low-cost parallax for Hero section background.
 */
function initParallax() {
    const hero = document.querySelector('.main_home');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        // Move background at 50% speed of scroll
        if (scrolled < window.innerHeight) {
            hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
        }
    });
}

/**
 * 4. MAGNETIC BUTTONS (Micro-interaction)
 * Buttons "stick" to the mouse slightly.
 */
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.main__button, .button--accent, .btn-cta');

    buttons.forEach(btn => {
        btn.classList.add('magnetic-btn'); // Ensure CSS transition class is added

        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Move button slightly (divided by 5 for resistance)
            btn.style.transform = `translate(${x / 5}px, ${y / 5}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

/**
 * 5. FLOATING "BREATHING" ANIMATION
 * Adds a subtle organic float to cards with random delays.
 */
function initFloatingAnimation() {
    // Select all floating cards
    const cards = document.querySelectorAll('.item-services, .problems__item, .klinisk-hjorne__item');

    cards.forEach(card => {
        card.classList.add('float-animation');
        // Add random negative delay so they start at different positions in the cycle
        // ensuring they feel distinct and organic, not robotic.
        card.style.animationDelay = `-${Math.random() * 5}s`;
    });
}
