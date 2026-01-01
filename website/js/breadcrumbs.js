// Breadcrumb Navigation System
document.addEventListener('DOMContentLoaded', function() {
    createBreadcrumbs();
});

function createBreadcrumbs() {
    // Don't add breadcrumbs to homepage or when viewing locally
    if (window.location.pathname === '/' || 
        window.location.pathname.endsWith('index.html') ||
        window.location.protocol === 'file:') {
        return;
    }
    
    const breadcrumbContainer = document.createElement('nav');
    breadcrumbContainer.className = 'breadcrumb';
    breadcrumbContainer.setAttribute('aria-label', 'Breadcrumb navigation');
    
    const breadcrumbList = document.createElement('ol');
    breadcrumbList.className = 'breadcrumb__list';
    
    // Add home link
    const homeItem = createBreadcrumbItem('Hjem', getRelativePath() + 'index.html', false);
    breadcrumbList.appendChild(homeItem);
    
    // Parse current path
    const pathParts = getCurrentPathParts();
    
    for (let i = 0; i < pathParts.length; i++) {
        const isLast = i === pathParts.length - 1;
        const item = createBreadcrumbItem(
            formatBreadcrumbText(pathParts[i].name),
            pathParts[i].url,
            isLast
        );
        breadcrumbList.appendChild(item);
    }
    
    breadcrumbContainer.appendChild(breadcrumbList);
    
    // Insert breadcrumbs after header
    const header = document.querySelector('.header');
    const main = document.querySelector('.page');
    
    if (header && main) {
        main.insertBefore(breadcrumbContainer, main.firstChild);
    }
}

function createBreadcrumbItem(text, url, isLast) {
    const listItem = document.createElement('li');
    listItem.className = 'breadcrumb__item';
    
    if (isLast) {
        const span = document.createElement('span');
        span.className = 'breadcrumb__current';
        span.textContent = text;
        span.setAttribute('aria-current', 'page');
        listItem.appendChild(span);
    } else {
        const link = document.createElement('a');
        link.className = 'breadcrumb__link';
        link.href = url;
        link.textContent = text;
        listItem.appendChild(link);
    }
    
    return listItem;
}

function getCurrentPathParts() {
    const path = window.location.pathname;
    const parts = path.split('/').filter(part => part !== '');
    const pathParts = [];
    let currentPath = getRelativePath();
    
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        
        // Skip index.html files
        if (part === 'index.html') continue;
        
        if (part.endsWith('.html')) {
            // This is a file
            pathParts.push({
                name: part.replace('.html', ''),
                url: currentPath + part
            });
        } else {
            // This is a directory
            currentPath += part + '/';
            pathParts.push({
                name: part,
                url: currentPath
            });
        }
    }
    
    return pathParts;
}

function formatBreadcrumbText(text) {
    const translations = {
        'plager': 'Plager',
        'tjeneste': 'Tjenester',
        'blogg': 'Blogg',
        'about': 'Om meg',
        'about-en': 'About me',
        'contact': 'Kontakt',
        'contact-en': 'Contact',
        'services': 'Tjenester',
        'services-en': 'Services',
        'priser': 'Priser',
        'priser-en': 'Prices',
        'faq': 'FAQ',
        'faq-en': 'FAQ',
        'svimmelhet': 'Svimmelhet',
        'svimmelhet-en': 'Dizziness',
        'nakkesmerter': 'Nakkesmerter',
        'nakkesmerter-en': 'Neck Pain',
        'ryggsmerter': 'Ryggsmerter',
        'ryggsmerter-en': 'Back Pain',
        'hodepine': 'Hodepine',
        'hodepine-en': 'Headache',
        'knesmerter': 'Knesmerter',
        'knesmerter-en': 'Knee Pain',
        'skuldersmerte': 'Skuldersmerte',
        'skuldersmerte-en': 'Shoulder Pain',
        'kjevesmerte': 'Kjevesmerte',
        'kjevesmerte-en': 'Jaw Pain',
        'kiropraktikk': 'Kiropraktikk',
        'kiropraktikk-en': 'Chiropractic',
        'dry-needling': 'Dry Needling',
        'dry-needling-en': 'Dry Needling',
        'fasciemanipulasjon': 'Fasciemanipulasjon',
        'fasciemanipulasjon-en': 'Fascial Manipulation',
        'trykkbolge': 'Trykkbølgeterapi',
        'trykkbolge-en': 'Shockwave Therapy'
    };
    
    return translations[text] || capitalizeWords(text.replace(/-/g, ' '));
}

function capitalizeWords(str) {
    return str.replace(/\b\w/g, l => l.toUpperCase());
}

function getRelativePath() {
    const path = window.location.pathname;
    const depth = (path.split('/').length - 1) - (path.endsWith('/') ? 1 : 0);
    
    if (depth <= 1) return './';
    
    return '../'.repeat(depth - 1);
}