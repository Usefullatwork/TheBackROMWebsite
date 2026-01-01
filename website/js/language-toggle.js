/**
 * Language Toggle functionality
 * Handles the sliding indicator animation for language switcher
 */

document.addEventListener('DOMContentLoaded', function() {
    initLanguageToggle();
});

/**
 * Show a toast notification instead of alert()
 * @param {string} message - The message to display
 * @param {number} duration - How long to show the toast (ms)
 */
function showToast(message, duration = 3000) {
    // Remove existing toast if any
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    // Create message span (using textContent to prevent XSS)
    const messageSpan = document.createElement('span');
    messageSpan.className = 'toast-notification__message';
    messageSpan.textContent = message;

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.className = 'toast-notification__close';
    closeButton.setAttribute('aria-label', 'Close notification');
    closeButton.innerHTML = '&times;';

    toast.appendChild(messageSpan);
    toast.appendChild(closeButton);

    // Add styles if not already present
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast-notification {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                background: var(--color-primary, #1a202c);
                color: var(--color-white, #fff);
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                gap: 1rem;
                z-index: 10000;
                opacity: 0;
                transition: transform 0.3s ease, opacity 0.3s ease;
                max-width: 90vw;
                font-family: var(--font-family-body, 'Inter', sans-serif);
            }
            .toast-notification.show {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
            .toast-notification__message {
                font-size: 0.95rem;
                line-height: 1.4;
            }
            .toast-notification__close {
                background: none;
                border: none;
                color: inherit;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
                opacity: 0.7;
                transition: opacity 0.2s;
            }
            .toast-notification__close:hover {
                opacity: 1;
            }
            @media (prefers-reduced-motion: reduce) {
                .toast-notification {
                    transition: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    // Close button handler
    closeButton.addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    });

    // Auto-remove after duration
    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }
    }, duration);
}

function initLanguageToggle() {
    const languageToggles = document.querySelectorAll('.language-toggle');

    languageToggles.forEach(toggle => {
        // Check current page to set initial state
        const currentPath = window.location.pathname;
        const isEnglishPage = currentPath.includes('-en.html') || currentPath.includes('/en/');

        // Set initial state based on current page
        if (isEnglishPage) {
            toggle.classList.add('english-active');
        } else {
            toggle.classList.remove('english-active');
        }

        // Handle both button and link implementations
        const buttons = toggle.querySelectorAll('.language-toggle__button');
        const links = toggle.querySelectorAll('.language-toggle__link');

        // Handle button implementation (index page style)
        if (buttons.length > 0) {
            buttons.forEach((button, index) => {
                button.addEventListener('click', function(e) {
                    const targetLang = button.getAttribute('data-lang') || (button.textContent.trim() === 'EN' ? 'en' : 'no');
                    const currentPath = window.location.pathname;
                    const isCurrentlyEnglish = currentPath.includes('/en/');
                    let targetUrl;

                    // Update visual state first
                    buttons.forEach(b => b.classList.remove('language-toggle__button--active'));
                    button.classList.add('language-toggle__button--active');

                    // For file:// protocol, use relative paths directly
                    const isFileProtocol = window.location.protocol === 'file:';

                    // Service filename mappings (Norwegian → English)
                    const serviceNoToEn = {
                        'kiropraktikk.html': 'chiropractic.html',
                        'svimmelhet.html': 'dizziness-treatment.html',
                        'dry-needling.html': 'dry-needling.html',
                        'fasciemanipulasjon.html': 'fascia-manipulation.html',
                        'graston.html': 'graston.html',
                        'rehabilitering.html': 'rehabilitation.html',
                        'trykkbolge.html': 'shockwave.html',
                        'blotvevsteknikker.html': 'soft-tissue.html',
                        'forebyggende-behandling.html': 'preventive-treatment.html',
                        'akutt-behandling.html': 'acute-treatment.html'
                    };

                    // Service filename mappings (English → Norwegian)
                    const serviceEnToNo = {
                        'chiropractic.html': 'kiropraktikk.html',
                        'dizziness-treatment.html': 'svimmelhet.html',
                        'dry-needling.html': 'dry-needling.html',
                        'fascia-manipulation.html': 'fasciemanipulasjon.html',
                        'graston.html': 'graston.html',
                        'rehabilitation.html': 'rehabilitering.html',
                        'shockwave.html': 'trykkbolge.html',
                        'soft-tissue.html': 'blotvevsteknikker.html',
                        'preventive-treatment.html': 'forebyggende-behandling.html',
                        'acute-treatment.html': 'akutt-behandling.html'
                    };

                    // Condition filename mappings (Norwegian → English)
                    const conditionNoToEn = {
                        'ryggsmerter.html': 'back-pain.html',
                        'svimmelhet.html': 'dizziness.html',
                        'hodepine.html': 'headache.html',
                        'hofte-og-bekkensmerter.html': 'hip-pain.html',
                        'kjevesmerte.html': 'jaw-pain.html',
                        'knesmerter.html': 'knee-pain.html',
                        'korsryggsmerte.html': 'lower-back-pain.html',
                        'nakkesmerter.html': 'neck-pain.html',
                        'skuldersmerter.html': 'shoulder-pain.html',
                        'idrettsskader.html': 'sports-injuries.html',
                        'fotsmerte.html': 'foot-pain.html',
                        'albue-arm.html': 'arm-pain.html',
                        'brystryggsmerter.html': 'thoracic-pain.html'
                    };

                    // Condition filename mappings (English → Norwegian)
                    const conditionEnToNo = {
                        'back-pain.html': 'ryggsmerter.html',
                        'dizziness.html': 'svimmelhet.html',
                        'headache.html': 'hodepine.html',
                        'hip-pain.html': 'hofte-og-bekkensmerter.html',
                        'jaw-pain.html': 'kjevesmerte.html',
                        'knee-pain.html': 'knesmerter.html',
                        'lower-back-pain.html': 'korsryggsmerte.html',
                        'neck-pain.html': 'nakkesmerter.html',
                        'shoulder-pain.html': 'skuldersmerter.html',
                        'sports-injuries.html': 'idrettsskader.html',
                        'foot-pain.html': 'fotsmerte.html',
                        'arm-pain.html': 'albue-arm.html',
                        'thoracic-pain.html': 'brystryggsmerter.html'
                    };

                    if (targetLang === 'en' && !isCurrentlyEnglish) {
                        // Switch from Norwegian to English
                        toggle.classList.add('english-active');
                        const fileName = currentPath.split('/').pop();

                        // Map Norwegian file names to English relative paths
                        const relativePathMappings = {
                            'index.html': 'en/index.html',
                            'about.html': 'en/about.html',
                            'services.html': 'en/services.html',
                            'plager.html': 'en/conditions.html',
                            'priser.html': 'en/prices.html',
                            'faq.html': 'en/faq.html',
                            'contact.html': 'en/contact.html',
                            'akutt-behandling.html': 'en/emergency.html',
                            'nye-pasienter.html': 'en/new-patients.html',
                            'privacy-policy.html': 'en/privacy-policy.html',
                            'personvern.html': 'en/privacy-policy.html'
                        };

                        // Check folder-specific paths FIRST, before generic page mappings
                        if (currentPath.includes('/tjeneste/')) {
                            // From /tjeneste/file.html to /en/services/file.html
                            const englishFileName = serviceNoToEn[fileName] || fileName;
                            targetUrl = '../en/services/' + englishFileName;
                        } else if (currentPath.includes('/plager/')) {
                            // From /plager/file.html to /en/conditions/file.html
                            const englishConditionName = conditionNoToEn[fileName] || fileName;
                            targetUrl = '../en/conditions/' + englishConditionName;
                        } else if (currentPath.includes('/blogg/')) {
                            // From /blogg/file.html to /en/blog/index.html (no individual translations)
                            targetUrl = '../en/blog/index.html';
                        } else if (relativePathMappings[fileName]) {
                            // Only use generic page mappings if not in a subfolder
                            targetUrl = relativePathMappings[fileName];
                        }
                    } else if (targetLang === 'no' && isCurrentlyEnglish) {
                        // Switch from English to Norwegian
                        toggle.classList.remove('english-active');
                        const fileName = currentPath.split('/').pop();

                        // Map English file names to Norwegian relative paths
                        const relativePathMappings = {
                            'index.html': '../index.html',
                            'about.html': '../about.html',
                            'services.html': '../services.html',
                            'conditions.html': '../plager.html',
                            'prices.html': '../priser.html',
                            'faq.html': '../faq.html',
                            'contact.html': '../contact.html',
                            'emergency.html': '../akutt-behandling.html',
                            'new-patients.html': '../nye-pasienter.html',
                            'privacy-policy.html': '../privacy-policy.html'
                        };

                        if (currentPath.includes('/en/services/')) {
                            // From /en/services/file.html to /tjeneste/file.html
                            const norwegianFileName = serviceEnToNo[fileName] || fileName;
                            targetUrl = '../../tjeneste/' + norwegianFileName;
                        } else if (currentPath.includes('/en/conditions/')) {
                            // From /en/conditions/file.html to /plager/file.html
                            const norwegianConditionName = conditionEnToNo[fileName] || fileName;
                            targetUrl = '../../plager/' + norwegianConditionName;
                        } else if (currentPath.includes('/en/blog/')) {
                            // From /en/blog/file.html to /blogg/index.html
                            targetUrl = '../../blogg/index.html';
                        } else if (relativePathMappings[fileName]) {
                            targetUrl = relativePathMappings[fileName];
                        }
                    }

                    // Navigate to target URL if we have one
                    if (targetUrl) {
                        // Navigate directly for file:// protocol (fetch won't work)
                        if (isFileProtocol) {
                            window.location.href = targetUrl;
                            return;
                        }

                        // Check if file exists (basic check) for http(s) protocol
                        fetch(targetUrl, { method: 'HEAD' })
                            .then(response => {
                                if (response.ok) {
                                    window.location.href = targetUrl;
                                } else {
                                    // If target file doesn't exist, show toast
                                    showToast('Translation not available yet. / Oversettelse er ikke tilgjengelig ennå.');
                                    // Revert visual state
                                    buttons.forEach(b => b.classList.remove('language-toggle__button--active'));
                                    buttons.forEach(b => {
                                        const btnLang = b.getAttribute('data-lang') || (b.textContent.trim() === 'EN' ? 'en' : 'no');
                                        if ((isCurrentlyEnglish && btnLang === 'en') || (!isCurrentlyEnglish && btnLang === 'no')) {
                                            b.classList.add('language-toggle__button--active');
                                        }
                                    });
                                    if (isCurrentlyEnglish) {
                                        toggle.classList.add('english-active');
                                    } else {
                                        toggle.classList.remove('english-active');
                                    }
                                }
                            })
                            .catch(() => {
                                // On fetch error, still navigate (might be local development)
                                window.location.href = targetUrl;
                            });
                    }
                });
            });
        }

        // Handle link implementation (other pages style)
        if (links.length > 0) {
            links.forEach((link, index) => {
                link.addEventListener('click', function(e) {
                    // Only prevent default for span elements (non-functional links)
                    if (link.tagName.toLowerCase() === 'span') {
                        e.preventDefault();

                        // Try to navigate to the corresponding language page
                        const isEnglish = link.textContent.trim() === 'EN';
                        const currentFile = window.location.pathname.split('/').pop();
                        let targetFile;

                        if (isEnglish) {
                            targetFile = currentFile.replace('.html', '-en.html');
                        } else {
                            targetFile = currentFile.replace('-en.html', '.html');
                        }

                        // Navigate if different from current file
                        if (targetFile !== currentFile) {
                            const pathParts = window.location.pathname.split('/');
                            pathParts[pathParts.length - 1] = targetFile;
                            window.location.href = pathParts.join('/');
                        }
                    }

                    // Allow normal navigation for anchor tags but update visual state
                    const isEnglish = link.textContent.trim() === 'EN';

                    // Update toggle state
                    if (isEnglish) {
                        toggle.classList.add('english-active');
                    } else {
                        toggle.classList.remove('english-active');
                    }

                    // Update active states
                    links.forEach(l => l.classList.remove('language-toggle__link--active'));
                    link.classList.add('language-toggle__link--active');
                });
            });
        }
    });
}

// Export for use in other scripts if needed
window.initLanguageToggle = initLanguageToggle;
window.showToast = showToast;
