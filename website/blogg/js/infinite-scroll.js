// Infinite Scroll functionality for TheBackROM Blog
// Loads blog posts progressively as user scrolls down

class InfiniteScrollBlog {
    constructor() {
        this.currentPage = 1;
        this.postsPerPage = 6; // Antal posts per side
        this.isLoading = false;
        this.hasMorePosts = true;
        this.currentFilter = 'alle';
        this.allPosts = [];
        this.filteredPosts = [];

        // Category mappings for grouped filtering (Norwegian and English keys)
        this.categoryMappings = {
            // Norwegian Mappings
            'skulder': ['skulder', 'armsmerter', 'albuesmerter', 'håndleddsmerter', 'skulder-og-arm'],
            'hoftesmerter': ['hoftesmerter', 'bekkensmerter', 'lyskesmerter', 'hofte'],
            'fotsmerter': ['fotsmerter', 'ankelsmerter', 'hælsmerter', 'fot', 'fot-og-ankel'],
            'hodepine': ['hodepine', 'migrene'],
            'ryggsmerter': ['ryggsmerter', 'korsryggsmerter', 'prolaps', 'rygg'],
            'nakkesmerter': ['nakkesmerter', 'nakke', 'stiv-nakke'],
            'kjevesmerter': ['kjevesmerter', 'kjeve', 'tmd'],
            'andre-interesser': ['andre-interesser', 'boktips', 'litteratur'],
            'kurs': ['kurs', 'foredrag', 'undervisning'],

            // English Mappings (mapping English UI keys to Norwegian content tags)
            'back-pain': ['ryggsmerter', 'korsryggsmerter', 'prolaps', 'rygg'],
            'neck-pain': ['nakkesmerter', 'nakke', 'stiv-nakke'],
            'shoulder': ['skulder', 'armsmerter', 'albuesmerter', 'håndleddsmerter', 'skulder-og-arm'],
            'hip-pain': ['hoftesmerter', 'bekkensmerter', 'lyskesmerter', 'hofte'],
            'knee-pain': ['knesmerter', 'menisk', 'kne'],
            'foot-pain': ['fotsmerter', 'ankelsmerter', 'hælsmerter', 'fot', 'fot-og-ankel'],
            'headache': ['hodepine', 'migrene'],
            'dizziness': ['svimmelhet', 'krystallsyke'],
            'jaw-pain': ['kjevesmerter', 'kjeve', 'tmd'],
            'sports-injuries': ['idrettsskader', 'strekk'],
            'chiropractic': ['kiropraktikk'],
            'research': ['forskning'],
            'other-interests': ['andre-interesser', 'boktips', 'litteratur'],
            'courses': ['kurs', 'foredrag', 'undervisning'],
            'all': ['alle']
        };

        this.blogContainer = document.getElementById('blog-posts-container');
        this.loadingIndicator = null;

        this.init();
    }

    init() {
        if (!this.blogContainer) return;

        // Wait for BLOG_POSTS to be available
        if (typeof BLOG_POSTS !== 'undefined') {
            this.allPosts = [...BLOG_POSTS];
            this.filteredPosts = [...BLOG_POSTS];
            this.createLoadingIndicator();
            this.loadInitialPosts();
            this.setupScrollListener();
            this.setupFilterListeners();
        } else {
            // Retry after a short delay
            setTimeout(() => this.init(), 100);
        }
    }

    createLoadingIndicator() {
        this.loadingIndicator = document.createElement('div');
        this.loadingIndicator.className = 'blog-loading-indicator';
        this.loadingIndicator.style.cssText = `
            display: none;
            text-align: center;
            padding: var(--spacing-lg);
            color: var(--color-text-light);
            font-size: 0.9rem;
        `;
        this.loadingIndicator.innerHTML = `
            <div style="display: inline-flex; align-items: center; gap: var(--spacing-sm);">
                <div class="loading-spinner" style="width: 20px; height: 20px; border: 2px solid var(--color-border); border-top: 2px solid var(--color-accent); border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <span>Laster flere innlegg...</span>
            </div>
        `;

        // Add spinner animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        this.blogContainer.parentNode.appendChild(this.loadingIndicator);
    }

    loadInitialPosts() {
        this.blogContainer.innerHTML = '';
        this.currentPage = 1;
        this.hasMorePosts = true;
        this.loadPosts();
    }

    loadPosts() {
        if (this.isLoading || !this.hasMorePosts) return;

        this.isLoading = true;
        this.showLoading();

        // Simulate loading delay for better UX
        setTimeout(() => {
            const startIndex = (this.currentPage - 1) * this.postsPerPage;
            const endIndex = startIndex + this.postsPerPage;
            const postsToLoad = this.filteredPosts.slice(startIndex, endIndex);

            if (postsToLoad.length === 0) {
                this.hasMorePosts = false;
                this.hideLoading();
                this.showEndMessage();
            } else {
                this.renderPosts(postsToLoad);
                this.currentPage++;

                // Check if there are more posts
                if (endIndex >= this.filteredPosts.length) {
                    this.hasMorePosts = false;
                    this.showEndMessage();
                }
            }

            this.isLoading = false;
            this.hideLoading();
        }, 500); // 500ms delay for loading animation
    }

    renderPosts(posts) {
        posts.forEach(post => {
            const postElement = this.createPostElement(post);
            this.blogContainer.appendChild(postElement);
        });

        // Add fade-in animation to new posts
        const newPosts = this.blogContainer.querySelectorAll('.klinisk-hjorne__item:not(.loaded)');
        newPosts.forEach((post, index) => {
            post.classList.add('loaded');
            post.style.opacity = '0';
            post.style.transform = 'translateY(20px)';
            post.style.transition = 'all 0.5s ease';

            setTimeout(() => {
                post.style.opacity = '1';
                post.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    createPostElement(post) {
        const article = document.createElement('article');
        article.className = 'klinisk-hjorne__item';
        article.innerHTML = `
            <div class="klinisk-hjorne__image">
                <img src="${post.image}" alt="${post.title}" loading="lazy" decoding="async" />
                <span class="klinisk-hjorne__category">${post.categories[0]}</span>
            </div>
            <div class="klinisk-hjorne__content">
                <h3 class="klinisk-hjorne__item-title">${post.title}</h3>
                <div class="klinisk-hjorne__meta">
                    <span class="klinisk-hjorne__date">${post.date}</span>
                    <span class="post-read-time" style="font-size: 0.75rem; color: var(--color-accent); font-weight: 600;">${post.readTime}</span>
                </div>
            </div>
        `;
        return article;
    }

    formatTagName(tag) {
        return tag.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    setupScrollListener() {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollPosition = window.innerHeight + window.scrollY;
                    const documentHeight = document.documentElement.offsetHeight;
                    const threshold = 200; // Start loading 200px before reaching bottom

                    if (scrollPosition >= documentHeight - threshold) {
                        this.loadPosts();
                    }

                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    setupFilterListeners() {
        // Listen for filter changes from the existing filter system
        const tagFilters = document.querySelectorAll('.tag-filter');
        const categoryDropdown = document.getElementById('blog-category-dropdown');

        tagFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                this.handleFilterChange(filter.dataset.tag);
            });
        });

        if (categoryDropdown) {
            categoryDropdown.addEventListener('change', () => {
                this.handleFilterChange(categoryDropdown.value);
            });
        }
    }

    postMatchesTag(post, selectedTag) {
        // Get all variations of the selected tag
        const tagVariations = this.categoryMappings[selectedTag] || [selectedTag];

        // Check exact category match (use exact match, not substring)
        const categoryMatch = post.categories.some(cat => tagVariations.includes(cat));

        // Check clinical tags (exact match)
        const clinicalMatch = post.clinicalTags && post.clinicalTags.some(tag =>
            tagVariations.includes(tag)
        );

        // Check related conditions (exact match)
        const relationMatch = post.relatedConditions && post.relatedConditions.some(cond =>
            tagVariations.includes(cond)
        );

        return categoryMatch || clinicalMatch || relationMatch;
    }

    handleFilterChange(filterTag) {
        this.currentFilter = filterTag;

        if (filterTag === 'alle' || filterTag === 'all') {
            this.filteredPosts = [...this.allPosts];
        } else {
            this.filteredPosts = this.allPosts.filter(post => this.postMatchesTag(post, filterTag));
        }

        this.loadInitialPosts();
    }

    showLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = 'block';
        }
    }

    hideLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.style.display = 'none';
        }
    }

    showEndMessage() {
        if (!this.hasMorePosts && this.filteredPosts.length > 0) {
            const endMessage = document.createElement('div');
            endMessage.className = 'blog-end-message';
            endMessage.style.cssText = `
                text-align: center;
                padding: var(--spacing-xl);
                color: var(--color-text-light);
                font-size: 0.9rem;
                border-top: 1px solid var(--color-border-light);
                margin-top: var(--spacing-lg);
            `;
            endMessage.innerHTML = `
                <p>Du har sett alle innleggene i denne kategorien.</p>
                <p style="margin-top: var(--spacing-sm); font-size: 0.8rem;">Totalt ${this.filteredPosts.length} innlegg</p>
            `;

            // Remove existing end message if it exists
            const existingEndMessage = document.querySelector('.blog-end-message');
            if (existingEndMessage) {
                existingEndMessage.remove();
            }

            this.blogContainer.parentNode.appendChild(endMessage);
        }
    }
}

// Initialize infinite scroll when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        window.infiniteScrollBlog = new InfiniteScrollBlog();
    }, 200);
});
