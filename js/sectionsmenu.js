/* ============================================================================
 *  sectionsmenu.js — mobile section launcher (independent layer)
 *
 *  Replaces the always-on bottom tab bar with a small square FAB at the
 *  bottom-right. Tapping it opens the section list (the existing .bottom-nav,
 *  restyled by CSS into a popup) so all 8 sections show with full labels
 *  without permanently eating vertical space.
 *
 *  Presentation layer only: it reuses the buttons tabs.js already built (their
 *  click handlers switch sections); this just toggles `body.sections-open` and
 *  closes the menu after a pick or an outside tap. Runs after tabs.js.
 * ========================================================================== */
(function () {
    'use strict';

    function init() {
        if (document.querySelector('.sections-fab')) return;   // already built
        var nav = document.querySelector('.bottom-nav');
        if (!nav) { window.addEventListener('load', init, { once: true }); return; }  // wait for tabs.js

        var fab = document.createElement('button');
        fab.type = 'button';
        fab.className = 'sections-fab';
        fab.setAttribute('aria-label', 'Secciones');
        fab.setAttribute('aria-haspopup', 'true');
        fab.innerHTML = '<i data-lucide="layout-grid"></i>';

        var backdrop = document.createElement('div');
        backdrop.className = 'sections-backdrop';

        document.body.appendChild(backdrop);
        document.body.appendChild(fab);

        function open() { document.body.classList.add('sections-open'); fab.setAttribute('aria-expanded', 'true'); }
        function close() { document.body.classList.remove('sections-open'); fab.setAttribute('aria-expanded', 'false'); }
        function toggle() { document.body.classList.contains('sections-open') ? close() : open(); }

        fab.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });
        backdrop.addEventListener('click', close);
        // Picking a section closes the menu (the button's own handler switches tab).
        nav.addEventListener('click', function (e) {
            if (e.target.closest('.bottom-nav-btn')) close();
        });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

        if (window.lucide) lucide.createIcons();
    }

    // Register on window (bubble phase) so this runs AFTER tabs.js builds the nav.
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
