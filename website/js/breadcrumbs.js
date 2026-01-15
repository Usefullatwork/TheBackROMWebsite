// Breadcrumb Navigation System
const BASE_URL = 'https://thebackrom.com';

document.addEventListener('DOMContentLoaded', function() {
    createBreadcrumbs();
});

function createBreadcrumbs() {
    // Don't add breadcrumbs to homepage
    if (window.location.pathname === '/' ||
        window.location.pathname.endsWith('index.html')) {
        return;
    }

    // Parse current path (used for both visual and schema)
    const pathParts = getCurrentPathParts();

    // Determine if this is an English page
    const isEnglish = window.location.pathname.includes('/en/') ||
                      window.location.pathname.includes('-en.html');
    const homeName = isEnglish ? 'Home' : 'Hjem';

    // Create visual breadcrumbs
    const breadcrumbContainer = document.createElement('nav');
    breadcrumbContainer.className = 'breadcrumb';
    breadcrumbContainer.setAttribute('aria-label', isEnglish ? 'Breadcrumb navigation' : 'Brødsmulenavigasjon');

    const breadcrumbList = document.createElement('ol');
    breadcrumbList.className = 'breadcrumb__list';

    // Add home link
    const homeItem = createBreadcrumbItem(homeName, getRelativePath() + 'index.html', false);
    breadcrumbList.appendChild(homeItem);

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

    // Create JSON-LD schema for SEO
    createBreadcrumbSchema(pathParts);
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
    let path = window.location.pathname;

    // Handle local file paths - extract only the website-relative portion
    if (window.location.protocol === 'file:') {
        const websiteIndex = path.toLowerCase().indexOf('/website/');
        if (websiteIndex !== -1) {
            path = path.substring(websiteIndex + '/website'.length);
        }
    }

    const parts = path.split('/').filter(part => part !== '');
    const pathParts = [];
    let currentPath = getRelativePath();
    let absolutePath = '/';

    // Mapping of subfolders to their parent hub pages
    const subfolderToHub = {
        'nakke': 'nakkesmerter.html',
        'korsrygg': 'korsryggsmerte.html',
        'hodepine': 'hodepine.html',
        'hofte': 'hofte-og-bekkensmerter.html',
        'bekken': 'hofte-og-bekkensmerter.html',
        'skulder': 'skuldersmerter.html',
        'kne': 'knesmerter.html',
        'fot': 'fotsmerte.html',
        'kjeve': 'kjevesmerte.html',
        'brystrygg': 'brystryggsmerter.html',
        'albue': 'albue-arm.html',
        'svimmelhet': 'svimmelhet.html'
    };

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        // Skip index.html files
        if (part === 'index.html') continue;

        if (part.endsWith('.html')) {
            // This is a file
            pathParts.push({
                name: part.replace('.html', ''),
                url: currentPath + part,
                absolutePath: absolutePath + part
            });
        } else {
            // This is a directory - check if it maps to a hub page
            const parentFolder = parts[i - 1]; // Check if we're in plager or tjeneste

            if (parentFolder === 'plager' && subfolderToHub[part]) {
                // Link to the hub page instead of the folder
                pathParts.push({
                    name: part,
                    url: currentPath + subfolderToHub[part],
                    absolutePath: absolutePath + subfolderToHub[part]
                });
            } else if (parentFolder === 'tjeneste' && part === 'svimmelhet') {
                // Special case for tjeneste/svimmelhet subfolder
                pathParts.push({
                    name: part,
                    url: currentPath + 'svimmelhet.html',
                    absolutePath: absolutePath + 'svimmelhet.html'
                });
            } else if (part === 'plager') {
                // Link to plager.html instead of the folder
                pathParts.push({
                    name: part,
                    url: currentPath + 'plager.html',
                    absolutePath: absolutePath + 'plager.html'
                });
            } else if (part === 'tjeneste') {
                // Link to services.html instead of the folder
                pathParts.push({
                    name: part,
                    url: currentPath + 'services.html',
                    absolutePath: absolutePath + 'services.html'
                });
            } else if (part === 'blogg') {
                // Link to blogg/index.html instead of the folder
                pathParts.push({
                    name: part,
                    url: currentPath + 'blogg/index.html',
                    absolutePath: absolutePath + 'blogg/index.html'
                });
            } else {
                // Default: link to the folder
                pathParts.push({
                    name: part,
                    url: currentPath,
                    absolutePath: absolutePath
                });
            }

            currentPath += part + '/';
            absolutePath += part + '/';
        }
    }

    return pathParts;
}

function formatBreadcrumbText(text) {
    const translations = {
        // Main sections
        'plager': 'Plager',
        'tjeneste': 'Tjenester',
        'blogg': 'Blogg',
        'faq': 'FAQ',
        'en': 'English',

        // Root pages - Norwegian
        'about': 'Om meg',
        'contact': 'Kontakt',
        'services': 'Tjenester',
        'priser': 'Priser',
        'nye-pasienter': 'Nye pasienter',
        'akutt-behandling': 'Akutt behandling',
        'personvern': 'Personvern',

        // Root pages - English
        'about-en': 'About me',
        'contact-en': 'Contact',
        'services-en': 'Services',
        'priser-en': 'Prices',
        'faq-en': 'FAQ',

        // English section pages
        'conditions': 'Conditions',
        'blog': 'Blog',

        // Body areas - Norwegian
        'hofte': 'Hofte',
        'bekken': 'Bekken',
        'nakke': 'Nakke',
        'skulder': 'Skulder',
        'kne': 'Kne',
        'fot': 'Fot',
        'kjeve': 'Kjeve',
        'korsrygg': 'Korsrygg',
        'brystrygg': 'Brystrygg',
        'albue-arm': 'Albue og arm',

        // Hub pages - Norwegian
        'svimmelhet': 'Svimmelhet',
        'nakkesmerter': 'Nakkesmerter',
        'ryggsmerter': 'Ryggsmerter',
        'hodepine': 'Hodepine',
        'knesmerter': 'Knesmerter',
        'skuldersmerte': 'Skuldersmerte',
        'skuldersmerter': 'Skuldersmerter',
        'kjevesmerte': 'Kjevesmerte',
        'fotsmerte': 'Fotsmerte',
        'korsryggsmerte': 'Korsryggsmerte',
        'brystryggsmerter': 'Brystryggsmerter',
        'hofte-og-bekkensmerter': 'Hofte- og bekkensmerter',
        'idrettsskader': 'Idrettsskader',

        // Hub pages - English
        'svimmelhet-en': 'Dizziness',
        'nakkesmerter-en': 'Neck Pain',
        'ryggsmerter-en': 'Back Pain',
        'hodepine-en': 'Headache',
        'knesmerter-en': 'Knee Pain',
        'skuldersmerte-en': 'Shoulder Pain',
        'kjevesmerte-en': 'Jaw Pain',
        'dizziness': 'Dizziness',
        'neck-pain': 'Neck Pain',
        'back-pain': 'Back Pain',
        'headache': 'Headache',
        'knee-pain': 'Knee Pain',
        'shoulder-pain': 'Shoulder Pain',
        'jaw-pain': 'Jaw Pain',
        'foot-pain': 'Foot Pain',
        'hip-pain': 'Hip Pain',
        'lower-back-pain': 'Lower Back Pain',
        'thoracic-pain': 'Thoracic Pain',
        'arm-pain': 'Arm Pain',
        'sports-injuries': 'Sports Injuries',

        // Services - Norwegian
        'kiropraktikk': 'Kiropraktikk',
        'dry-needling': 'Dry Needling',
        'fasciemanipulasjon': 'Fasciemanipulasjon',
        'trykkbolge': 'Trykkbølgeterapi',
        'graston': 'Graston-teknikk',
        'rehabilitering': 'Rehabilitering',
        'massasje': 'Massasje',
        'blotvevsteknikker': 'Bløtvevsteknikker',
        'forebyggende-behandling': 'Forebyggende behandling',

        // Services - English
        'kiropraktikk-en': 'Chiropractic',
        'dry-needling-en': 'Dry Needling',
        'fasciemanipulasjon-en': 'Fascial Manipulation',
        'trykkbolge-en': 'Shockwave Therapy',
        'chiropractic': 'Chiropractic',
        'shockwave-therapy': 'Shockwave Therapy',
        'fascial-manipulation': 'Fascial Manipulation',
        'rehabilitation': 'Rehabilitation',

        // Dizziness subcategories
        'krystallsyke': 'Krystallsyke',
        'krystallsyke-bppv': 'Krystallsyke (BPPV)',
        'bakre-kanal': 'Bakre kanal',
        'fremre-kanal': 'Fremre kanal',
        'horisontal-kanal': 'Horisontal kanal',
        'vestibulaer-migrene': 'Vestibulær migrene',
        'nakkesvimmelhet': 'Nakkesvimmelhet',
        'menieres-sykdom': 'Ménières sykdom',
        'pppd-kronisk-svimmelhet': 'PPPD',
        'vestibularisnevritt': 'Vestibularisnevritt',
        'pots-syndrom': 'POTS-syndrom',

        // Common conditions
        'isjias': 'Isjias',
        'prolaps': 'Prolaps',
        'artrose': 'Artrose',
        'tendinopati': 'Tendinopati',
        'bursitt': 'Bursitt',
        'whiplash': 'Whiplash',
        'tmd': 'TMD',
        'migrene': 'Migrene',
        'spenningshodepine': 'Spenningshodepine'
    };

    return translations[text] || capitalizeWords(text.replace(/-/g, ' '));
}

function capitalizeWords(str) {
    return str.replace(/\b\w/g, l => l.toUpperCase());
}

function getRelativePath() {
    let path = window.location.pathname;

    // Handle local file paths - extract only the website-relative portion
    if (window.location.protocol === 'file:') {
        const websiteIndex = path.toLowerCase().indexOf('/website/');
        if (websiteIndex !== -1) {
            path = path.substring(websiteIndex + '/website'.length);
        }
    }

    const depth = (path.split('/').length - 1) - (path.endsWith('/') ? 1 : 0);

    if (depth <= 1) return './';

    return '../'.repeat(depth - 1);
}

function createBreadcrumbSchema(pathParts) {
    // Check if schema already exists to prevent duplicates
    if (document.querySelector('script[data-breadcrumb-schema]')) {
        return;
    }

    const itemListElement = [];

    // Determine if this is an English page
    const isEnglish = window.location.pathname.includes('/en/') ||
                      window.location.pathname.includes('-en.html');
    const homeName = isEnglish ? 'Home' : 'Hjem';

    // Add home as first item
    itemListElement.push({
        "@type": "ListItem",
        "position": 1,
        "name": homeName,
        "item": BASE_URL + "/"
    });

    // Add each path part
    for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i];
        const item = {
            "@type": "ListItem",
            "position": i + 2,
            "name": formatBreadcrumbText(part.name),
            "item": BASE_URL + part.absolutePath
        };

        itemListElement.push(item);
    }

    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": itemListElement
    };

    // Create and inject script element
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-breadcrumb-schema', 'true');
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
}
