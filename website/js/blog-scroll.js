// Blog Scroll Navigation
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('blog-scroll-container');
    const prevBtn = document.querySelector('.blog-scroll-prev');
    const nextBtn = document.querySelector('.blog-scroll-next');

    if (!container || !prevBtn || !nextBtn) return;

    const scrollAmount = 400;
    let ticking = false;

    // Click handlers for scroll buttons
    prevBtn.addEventListener('click', function() {
        container.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });

    nextBtn.addEventListener('click', function() {
        container.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    function updateButtonStates() {
        // Check if at start
        if (container.scrollLeft <= 10) {
            prevBtn.classList.add('disabled');
            prevBtn.setAttribute('aria-disabled', 'true');
        } else {
            prevBtn.classList.remove('disabled');
            prevBtn.setAttribute('aria-disabled', 'false');
        }

        // Check if at end
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxScroll - 10) {
            nextBtn.classList.add('disabled');
            nextBtn.setAttribute('aria-disabled', 'true');
        } else {
            nextBtn.classList.remove('disabled');
            nextBtn.setAttribute('aria-disabled', 'false');
        }

        ticking = false;
    }

    // Update on scroll with throttling using requestAnimationFrame
    container.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateButtonStates);
            ticking = true;
        }
    }, { passive: true });

    // Initial state
    updateButtonStates();
});
