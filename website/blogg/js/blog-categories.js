// Blog Categories and Tags System for TheBackROM
// This system allows blog posts to appear in multiple sections based on their categories

// Main blog sections
const BLOG_SECTIONS = {
    innlegg: 'innlegg',        // General posts (mix of content)
    klinisk: 'klinisk'         // Clinical posts for professionals
};

// Plager (Conditions/Problems) tags
const PLAGER_TAGS = {
    nakkesmerter: 'nakkesmerter',           // Neck pain
    skuldersmerter: 'skuldersmerter',       // Shoulder pain
    hoftesmerter: 'hoftesmerter',           // Hip pain
    idrettsskader: 'idrettsskader',         // Sports injuries
    korsryggsmerte: 'korsryggsmerte',       // Lower back pain
    svimmelhet: 'svimmelhet',               // Dizziness
    hodepine: 'hodepine',                   // Headache
    ryggsmerter: 'ryggsmerter',             // Back pain
    knesmerter: 'knesmerter',               // Knee pain
    kjevesmerter: 'kjevesmerter',           // Jaw pain
    fotsmerter: 'fotsmerter',               // Foot pain
    albuesmerter: 'albuesmerter',           // Elbow pain
    handsmerter: 'handsmerter'              // Hand/wrist pain
};

// Tjenester (Services/Treatments) tags
const TJENESTER_TAGS = {
    dryneedling: 'dryneedling',             // Dry needling
    fasciemanipulasjon: 'fasciemanipulasjon', // Fascia manipulation
    graston: 'graston',                     // Graston technique
    rehabilitering: 'rehabilitering',       // Rehabilitation
    trykkbolge: 'trykkbolge',              // Shockwave therapy
    kiropraktikk: 'kiropraktikk',          // Chiropractic
    blotvevsteknikker: 'blotvevsteknikker', // Soft tissue techniques
    massasje: 'massasje',                   // Massage
    svimmelhetbehandling: 'svimmelhetbehandling' // Dizziness treatment
};

// Additional general tags
const GENERAL_TAGS = {
    forskning: 'forskning',                 // Research
    casestudy: 'casestudy',                // Case study
    tips: 'tips',                          // Tips and advice
    anatomi: 'anatomi',                    // Anatomy
    fysiologi: 'fysiologi',                // Physiology
    forebygging: 'forebygging',            // Prevention
    hjemmetrening: 'hjemmetrening',        // Home exercise
    ernering: 'ernering',                  // Nutrition
    livsstil: 'livsstil'                   // Lifestyle
};

// Combine all tags
const ALL_TAGS = {
    ...BLOG_SECTIONS,
    ...PLAGER_TAGS,
    ...TJENESTER_TAGS,
    ...GENERAL_TAGS
};

// Blog post template structure
/*
Example blog post data structure:

const blogPost = {
    id: 'unique-post-id',
    title: 'Post Title',
    excerpt: 'Short description...',
    content: 'Full post content...',
    image: 'path/to/image.jpg',
    date: '2025-01-20',
    author: 'Mads',
    categories: ['innlegg', 'brain', 'nakkesmerter', 'kiropraktikk'], // Multiple categories
    readTime: '5 min'
};
*/

// Function to filter posts by category
function filterPostsByCategory(posts, category) {
    return posts.filter(post => post.categories.includes(category));
}

// Function to get posts for specific blog section
function getPostsForSection(posts, section) {
    switch(section) {
        case 'innlegg':
            return filterPostsByCategory(posts, BLOG_SECTIONS.innlegg);
        case 'klinisk':
            return filterPostsByCategory(posts, BLOG_SECTIONS.klinisk);
        default:
            return [];
    }
}

// Function to render blog posts
function renderBlogPosts(posts, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = posts.map(post => `
        <article class="klinisk-hjorne__item" data-categories="${post.categories.join(' ')}">
            <div class="klinisk-hjorne__image">
                <img src="${post.image}" alt="${post.title}" />
            </div>
            <div class="klinisk-hjorne__content">
                <span class="klinisk-hjorne__category">${post.categories[0]}</span>
                <h3 class="klinisk-hjorne__item-title">${post.title}</h3>
                <p class="klinisk-hjorne__text">${post.excerpt}</p>
                <div class="klinisk-hjorne__meta">
                    <span class="klinisk-hjorne__date">${post.date}</span>
                    <a href="post/${post.id}.html" class="klinisk-hjorne__link">Les mer</a>
                </div>
            </div>
        </article>
    `).join('');
}

// Initialize blog system
function initBlogSystem() {
    // This would be called when the page loads
    // You would load your blog posts data and render them based on current page
    const currentPage = window.location.pathname;

    if (currentPage.includes('klinisk-blogg.html') || currentPage.includes('klinisk-blogg-en.html')) {
        // Load and display klinisk posts
        // const kliniskPosts = getPostsForSection(allPosts, 'klinisk');
        // renderBlogPosts(kliniskPosts, 'blog-posts-container');
    } else {
        // Load and display all innlegg posts
        // const innleggPosts = getPostsForSection(allPosts, 'innlegg');
        // renderBlogPosts(innleggPosts, 'blog-posts-container');
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ALL_TAGS,
        BLOG_SECTIONS,
        PLAGER_TAGS,
        TJENESTER_TAGS,
        GENERAL_TAGS,
        filterPostsByCategory,
        getPostsForSection,
        renderBlogPosts,
        initBlogSystem
    };
} 