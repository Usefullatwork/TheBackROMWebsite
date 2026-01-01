// Blog Initialization Script for TheBackROM
// This script renders blog posts on page load

// Function to render blog posts to the DOM
function renderBlogPostsToDOM(posts, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID '${containerId}' not found`);
        return;
    }
    
    container.innerHTML = posts.map(post => {
        const linkUrl = post.link || '#';
        return `
        <a href="${linkUrl}" class="klinisk-hjorne__link" style="text-decoration: none; color: inherit;">
            <article class="klinisk-hjorne__item" data-categories="${post.categories.join(' ')}">
                <div class="klinisk-hjorne__image">
                    <img src="${post.image}" alt="${post.title}" loading="lazy" decoding="async" />
                    <span class="klinisk-hjorne__category">${post.categories[0]}</span>
                </div>
                <div class="klinisk-hjorne__content">
                    <h3 class="klinisk-hjorne__item-title">${post.title}</h3>
                    <p class="klinisk-hjorne__excerpt" style="font-size: 0.9rem; color: var(--color-text-light); margin: 0.5rem 0;">${post.excerpt}</p>
                    <div class="klinisk-hjorne__meta">
                        <span class="klinisk-hjorne__date">${post.date}</span>
                        <span class="post-read-time" style="font-size: 0.75rem; color: var(--color-accent); font-weight: 600;">${post.readTime}</span>
                    </div>
                </div>
            </article>
        </a>
    `}).join('');
}

// Initialize blog system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we have the blog posts data available
    if (typeof BLOG_POSTS !== 'undefined' && BLOG_POSTS.length > 0) {
        // Render all blog posts to the container
        renderBlogPostsToDOM(BLOG_POSTS, 'blog-posts-container');
        console.log(`Rendered ${BLOG_POSTS.length} blog posts`);
    } else {
        console.error('BLOG_POSTS data not found. Make sure blog-posts.js is loaded first.');
        
        // Show a fallback message
        const container = document.getElementById('blog-posts-container');
        if (container) {
            container.innerHTML = `
                <div class="blog-loading-message">
                    <p>Laster blogginnlegg...</p>
                </div>
            `;
        }
    }
    
    // Initialize tag filtering if the filter buttons exist
    const tagFilters = document.querySelectorAll('.tag-filter');
    if (tagFilters.length > 0) {
        tagFilters.forEach(button => {
            button.addEventListener('click', function() {
                const tag = this.dataset.tag;
                filterPostsByTag(tag);
                
                // Update active state
                tagFilters.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
});

// Function to filter posts by tag
function filterPostsByTag(tag) {
    const allPosts = document.querySelectorAll('.klinisk-hjorne__item');
    
    allPosts.forEach(post => {
        const postCategories = post.dataset.categories;
        
        if (tag === 'alle' || postCategories.includes(tag)) {
            post.style.display = 'flex';
        } else {
            post.style.display = 'none';
        }
    });
}

// Export functions for use in other scripts
if (typeof window !== 'undefined') {
    window.BlogInit = {
        renderBlogPostsToDOM,
        filterPostsByTag
    };
}