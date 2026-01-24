// Blog filtering functionality for clinical diagnosis tags
// This now works with the infinite scroll system
document.addEventListener('DOMContentLoaded', function () {
    const blogContainer = document.getElementById('blog-posts-container');
    const tagFilters = document.querySelectorAll('.tag-filter');
    const categoryDropdown = document.getElementById('blog-category-dropdown');

    // Check if infinite scroll is enabled
    const useInfiniteScroll = true; // Set to false to disable infinite scroll

    // Initialize blog posts display (legacy function for backward compatibility)
    function displayPosts(posts) {
        if (!blogContainer) return;

        // If infinite scroll is active, let it handle the display
        if (useInfiniteScroll && window.infiniteScrollBlog) {
            // The infinite scroll system will handle this
            return;
        }

        // Legacy display method - updated to match new design
        // Clear container safely
        blogContainer.innerHTML = '';

        posts.forEach(post => {
            // Create article element
            const article = document.createElement('article');
            article.className = 'klinisk-hjorne__item';

            // Create image container
            const imageDiv = document.createElement('div');
            imageDiv.className = 'klinisk-hjorne__image';

            const img = document.createElement('img');
            img.src = post.image;
            img.alt = post.title; // Safe: alt attribute is properly escaped by browser
            img.loading = 'lazy';
            img.decoding = 'async';

            const categorySpan = document.createElement('span');
            categorySpan.className = 'klinisk-hjorne__category';
            categorySpan.textContent = post.categories[0] || '';

            imageDiv.appendChild(img);
            imageDiv.appendChild(categorySpan);

            // Create content container
            const contentDiv = document.createElement('div');
            contentDiv.className = 'klinisk-hjorne__content';

            const title = document.createElement('h3');
            title.className = 'klinisk-hjorne__item-title';
            title.textContent = post.title;

            const metaDiv = document.createElement('div');
            metaDiv.className = 'klinisk-hjorne__meta';

            const dateSpan = document.createElement('span');
            dateSpan.className = 'klinisk-hjorne__date';
            dateSpan.textContent = post.date;

            const readTimeSpan = document.createElement('span');
            readTimeSpan.className = 'post-read-time';
            readTimeSpan.textContent = post.readTime;

            metaDiv.appendChild(dateSpan);
            metaDiv.appendChild(readTimeSpan);
            contentDiv.appendChild(title);
            contentDiv.appendChild(metaDiv);

            article.appendChild(imageDiv);
            article.appendChild(contentDiv);
            blogContainer.appendChild(article);
        });

        // Add click handlers for condition links
        document.querySelectorAll('.condition-link').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const condition = this.dataset.condition;
                filterPostsByCondition(condition);
            });
        });
    }

    // Format clinical tag names for display
    function formatTagName(tag) {
        return tag.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    // Category mappings for broader filtering (Norwegian and English keys)
    const CATEGORY_MAPPINGS = {
        // Norwegian Mappings
        'skulder': ['skulder', 'armsmerter', 'albuesmerter', 'håndleddsmerter', 'skulder-og-arm'],
        'hoftesmerter': ['hoftesmerter', 'bekkensmerter', 'lyskesmerter', 'hofte'],
        'fotsmerter': ['fotsmerter', 'ankelsmerter', 'hælsmerter', 'fot', 'fot-og-ankel'],
        'hodepine': ['hodepine', 'migrene'],
        'ryggsmerter': ['ryggsmerter', 'korsryggsmerter', 'korsrygg', 'isjias', 'rygg'],
        'nakkesmerter': ['nakkesmerter', 'nakke', 'stiv-nakke', 'nakkeprolaps'],
        'kjevesmerter': ['kjevesmerter', 'kjeve', 'tmd'],
        'andre-interesser': ['andre-interesser', 'boktips', 'litteratur'],
        'kurs': ['kurs', 'foredrag', 'undervisning'],

        // English Mappings (mapping English UI keys to Norwegian content tags)
        'back-pain': ['ryggsmerter', 'korsryggsmerter', 'korsrygg', 'isjias', 'rygg'],
        'neck-pain': ['nakkesmerter', 'nakke', 'stiv-nakke', 'nakkeprolaps'],
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
        'all': ['alle'] // Map 'all' to 'alle' logic if needed, though 'all' usually bypasses filter
    };

    // Helper to check if a post matches a selected tag/category
    function postMatchesTag(post, selectedTag) {
        // Get all variations of the selected tag
        const tagVariations = CATEGORY_MAPPINGS[selectedTag] || [selectedTag];

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

    // Filter posts by condition
    function filterPostsByCondition(condition) {
        const filteredPosts = BLOG_POSTS.filter(post => postMatchesTag(post, condition));
        displayPosts(filteredPosts);
        updateActiveTag(condition);
    }

    // Update active tag styling
    function updateActiveTag(activeTag) {
        tagFilters.forEach(filter => {
            filter.classList.remove('active');
            if (filter.dataset.tag === activeTag ||
                (activeTag === 'alle' && (filter.dataset.tag === 'alle' || filter.dataset.tag === 'all')) ||
                (activeTag === 'all' && (filter.dataset.tag === 'alle' || filter.dataset.tag === 'all'))) {
                filter.classList.add('active');
            }
        });

        // Also update dropdown selection
        if (categoryDropdown) {
            categoryDropdown.value = activeTag;
        }
    }

    // Add click handlers for tag filters
    tagFilters.forEach(filter => {
        filter.addEventListener('click', function () {
            const tag = this.dataset.tag;

            // If infinite scroll is active, let it handle the filtering
            if (!useInfiniteScroll || !window.infiniteScrollBlog) {
                if (tag === 'alle' || tag === 'all') {
                    displayPosts(BLOG_POSTS);
                } else {
                    const filteredPosts = BLOG_POSTS.filter(post => postMatchesTag(post, tag));
                    displayPosts(filteredPosts);
                }
            }

            updateActiveTag(tag);
        });
    });

    // Add dropdown change handler
    if (categoryDropdown) {
        categoryDropdown.addEventListener('change', function () {
            const selectedTag = this.value;

            // If infinite scroll is active, let it handle the filtering
            if (!useInfiniteScroll || !window.infiniteScrollBlog) {
                if (selectedTag === 'alle' || selectedTag === 'all') {
                    displayPosts(BLOG_POSTS);
                } else {
                    const filteredPosts = BLOG_POSTS.filter(post => postMatchesTag(post, selectedTag));
                    displayPosts(filteredPosts);
                }
            }

            updateActiveTag(selectedTag);
        });
    }

    // Initialize with all posts (only if infinite scroll is disabled)
    if (typeof BLOG_POSTS !== 'undefined' && (!useInfiniteScroll || !window.infiniteScrollBlog)) {
        displayPosts(BLOG_POSTS);
        updateActiveTag('alle');
    }
});
