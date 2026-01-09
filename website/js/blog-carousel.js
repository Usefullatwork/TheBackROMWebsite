/**
 * Blog Carousel - Improved
 * TheBackROM.com - 2026 Final Update
 *
 * Starts at first card, smooth navigation
 * Multiple scroll reset points to ensure first card visible
 */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initBlogCarousel();
    });

    // Also reset on full window load
    window.addEventListener('load', function() {
        const scrollContainer = document.querySelector('.blog-grid, #blog-scroll-container, .klinisk-hjorne__scroll');
        if (scrollContainer) {
            scrollContainer.scrollLeft = 0;
        }
    });

    function initBlogCarousel() {
        const scrollContainer = document.querySelector('.blog-grid, #blog-scroll-container, .klinisk-hjorne__scroll');
        const wrapper = document.querySelector('.blog-scroll-wrapper');

        if (!scrollContainer) return;

        // Reset scroll to start immediately
        scrollContainer.scrollLeft = 0;

        // Reset again after short delay (for images loading)
        setTimeout(function() {
            scrollContainer.scrollLeft = 0;
        }, 100);

        // Get/create navigation buttons
        let prevBtn = wrapper?.querySelector('.blog-scroll-prev');
        let nextBtn = wrapper?.querySelector('.blog-scroll-next');

        if (wrapper && !prevBtn) {
            prevBtn = createButton('prev', '‹');
            wrapper.appendChild(prevBtn);
        }

        if (wrapper && !nextBtn) {
            nextBtn = createButton('next', '›');
            wrapper.appendChild(nextBtn);
        }

        // Calculate scroll amount (one card width + gap)
        const getScrollAmount = () => {
            const card = scrollContainer.querySelector('.blog-card, .klinisk-hjorne__item');
            if (!card) return 340;
            const style = window.getComputedStyle(scrollContainer);
            const gap = parseInt(style.gap) || 24;
            return card.offsetWidth + gap;
        };

        // Scroll handlers
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                scrollContainer.scrollBy({
                    left: -getScrollAmount(),
                    behavior: 'smooth'
                });
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                scrollContainer.scrollBy({
                    left: getScrollAmount(),
                    behavior: 'smooth'
                });
            });
        }

        // Update button states
        function updateButtons() {
            if (!prevBtn || !nextBtn) return;

            const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
            const atStart = scrollLeft <= 5;
            const atEnd = scrollLeft >= scrollWidth - clientWidth - 5;

            prevBtn.style.opacity = atStart ? '0.4' : '1';
            prevBtn.style.cursor = atStart ? 'default' : 'pointer';
            prevBtn.disabled = atStart;

            nextBtn.style.opacity = atEnd ? '0.4' : '1';
            nextBtn.style.cursor = atEnd ? 'default' : 'pointer';
            nextBtn.disabled = atEnd;
        }

        scrollContainer.addEventListener('scroll', updateButtons);
        window.addEventListener('resize', () => {
            scrollContainer.scrollLeft = 0;
            updateButtons();
        });

        // Keyboard navigation
        if (wrapper) {
            wrapper.setAttribute('tabindex', '0');
            wrapper.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft' && prevBtn) {
                    prevBtn.click();
                } else if (e.key === 'ArrowRight' && nextBtn) {
                    nextBtn.click();
                }
            });
        }

        // Initial state
        setTimeout(updateButtons, 100);
    }

    function createButton(type, symbol) {
        const btn = document.createElement('button');
        btn.className = `blog-scroll-btn blog-scroll-${type}`;
        btn.innerHTML = symbol;
        btn.setAttribute('aria-label', type === 'prev' ? 'Forrige' : 'Neste');
        btn.type = 'button';
        return btn;
    }
})();

