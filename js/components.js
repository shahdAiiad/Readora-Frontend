/**
 * Readora Shared Components
 * Centralizes Navbar and Footer HTML to avoid duplication across pages.
 * Works with file:// protocol — no fetch(), import, or async needed.
 */

/**
 * Returns the full Navbar HTML.
 * @param {Object} [options]
 * @param {boolean} [options.scrolled=true] - Whether to add the 'scrolled' class (false only for index.html hero page).
 * @returns {string} Navbar HTML string.
 */
function Navbar(options) {
    var scrolled = (options && options.scrolled === false) ? '' : ' scrolled';

    return '<nav class="navbar' + scrolled + '">' +
        '<div class="container nav-container">' +
            '<a href="index.html" class="logo">' +
                '<i class="ph-fill ph-book-open-text"></i> Readora' +
            '</a>' +

            '<ul class="nav-links">' +
                '<li><a href="index.html" class="nav-link" data-i18n="nav_home">\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629</a></li>' +
                '<li><a href="explore.html" class="nav-link" data-i18n="nav_explore">\u062A\u0635\u0641\u062D</a></li>' +
                '<li><a href="favorites.html" class="nav-link" data-i18n="nav_favorites">\u0627\u0644\u0645\u0641\u0636\u0644\u0629</a></li>' +
                '<li><a href="about.html" class="nav-link" data-i18n="nav_about">\u0645\u0646 \u0646\u062D\u0646</a></li>' +
                '<li><a href="profile.html" class="nav-link" data-i18n="nav_profile">\u062D\u0633\u0627\u0628\u064A</a></li>' +
                '<li class="nav-login-item" id="nav-login-item"></li>' +
            '</ul>' +

            '<div class="nav-actions">' +
                '<div id="auth-header-slot"></div>' +
                '<button id="lang-toggle" class="btn-icon" aria-label="\u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0644\u063A\u0629 / Change language">' +
                    '<i class="ph ph-translate"></i>' +
                    '<span style="font-size: 0.8rem; margin: 0 4px; font-weight: bold;">EN</span>' +
                '</button>' +
                '<button id="theme-toggle" class="btn-icon" aria-label="\u062A\u0628\u062F\u064A\u0644 \u0627\u0644\u0648\u0636\u0639 \u0627\u0644\u0644\u064A\u0644\u064A \u0648\u0627\u0644\u0646\u0647\u0627\u0631\u064A">' +
                    '<i class="ph ph-sun"></i>' +
                '</button>' +
                '<button class="mobile-menu-btn btn-icon" aria-label="\u0641\u062A\u062D \u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u062A\u0646\u0642\u0644">' +
                    '<i class="ph ph-list"></i>' +
                '</button>' +
            '</div>' +
        '</div>' +
    '</nav>';
}

/**
 * Returns the full Footer HTML (canonical version from index.html).
 * @returns {string} Footer HTML string.
 */
function Footer() {
    return '<footer class="footer">' +
        '<div class="container">' +
            '<div class="footer-grid">' +
                '<div class="footer-col">' +
                    '<a href="index.html" class="logo" style="margin-bottom: 1rem;">' +
                        '<i class="ph-fill ph-book-open-text"></i> Readora' +
                    '</a>' +
                    '<p data-i18n="footer_desc">\u0631\u064A\u062F\u0648\u0631\u0627 \u0647\u064A \u0627\u0644\u0645\u0646\u0635\u0629 \u0627\u0644\u0631\u0627\u0626\u062F\u0629 \u0644\u0642\u0631\u0627\u0621\u0629 \u0627\u0644\u0631\u0648\u0627\u064A\u0627\u062A \u0648\u0627\u0644\u0645\u0627\u0646\u062C\u0627 \u0627\u0644\u0639\u0631\u0628\u064A\u0629 \u0648\u0627\u0644\u0645\u062A\u0631\u062C\u0645\u0629 \u0628\u062C\u0648\u062F\u0629 \u0639\u0627\u0644\u064A\u0629 \u0648\u062A\u062C\u0631\u0628\u0629 \u0645\u0633\u062A\u062E\u062F\u0645 \u0644\u0627 \u0645\u062B\u064A\u0644 \u0644\u0647\u0627.</p>' +
                    '<div class="social-links">' +
                        '<a href="#" class="social-link"><i class="ph-fill ph-twitter-logo"></i></a>' +
                        '<a href="#" class="social-link"><i class="ph-fill ph-instagram-logo"></i></a>' +
                        '<a href="#" class="social-link"><i class="ph-fill ph-discord-logo"></i></a>' +
                    '</div>' +
                '</div>' +
                '<div class="footer-col">' +
                    '<h4 data-i18n="footer_links">\u0631\u0648\u0627\u0628\u0637 \u0633\u0631\u064A\u0639\u0629</h4>' +
                    '<div class="footer-links">' +
                        '<a href="index.html" data-i18n="nav_home">\u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629</a>' +
                        '<a href="explore.html" data-i18n="nav_explore">\u062A\u0635\u0641\u062D</a>' +
                        '<a href="about.html" data-i18n="nav_about">\u0645\u0646 \u0646\u062D\u0646</a>' +
                    '</div>' +
                '</div>' +
                '<div class="footer-col">' +
                    '<h4 data-i18n="footer_legal">\u0642\u0627\u0646\u0648\u0646\u064A</h4>' +
                    '<div class="footer-links">' +
                        '<a href="#" data-i18n="footer_terms">\u0627\u0644\u0634\u0631\u0648\u0637 \u0648\u0627\u0644\u0623\u062D\u0643\u0627\u0645</a>' +
                        '<a href="#" data-i18n="footer_privacy">\u0633\u064A\u0627\u0633\u0629 \u0627\u0644\u062E\u0635\u0648\u0635\u064A\u0629</a>' +
                    '</div>' +
                '</div>' +
                '<div class="footer-col">' +
                    '<h4 data-i18n="footer_contact">\u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627</h4>' +
                    '<div class="footer-links">' +
                        '<a href="mailto:support@readora.com">support@readora.com</a>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="footer-bottom">' +
                '<p data-i18n="footer_rights">\u062C\u0645\u064A\u0639 \u0627\u0644\u062D\u0642\u0648\u0642 \u0645\u062D\u0641\u0648\u0638\u0629 \u0644\u0631\u064A\u062F\u0648\u0631\u0627 2026</p>' +
            '</div>' +
        '</div>' +
    '</footer>';
}

/**
 * Injects Navbar and Footer into their placeholder elements.
 * Call this at the top of each page, BEFORE other scripts that depend on navbar elements.
 * @param {Object} [navOptions] - Options to pass to Navbar().
 */
function initComponents(navOptions) {
    var navRoot = document.getElementById('navbar-root');
    var footerRoot = document.getElementById('footer-root');

    if (navRoot) {
        navRoot.innerHTML = Navbar(navOptions);
    }
    if (footerRoot) {
        footerRoot.innerHTML = Footer();
    }
}
