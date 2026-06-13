/* ============================================================================
 *  previewpeek.js — mobile preview "peek" behaviour (independent layer)
 *
 *  On phones the preview is pinned to the top. While the user edits (touches
 *  any control or focuses a field) the preview shrinks upward to free screen
 *  space; tapping the minimized preview restores it to full height.
 *
 *  Presentation layer only — toggles the `preview-min` class on <body>; all
 *  sizing lives in the mobile media query. The expand tap is captured before
 *  interactive.js's word-edit handler so the same tap doesn't open a bubble.
 * ========================================================================== */
(function () {
    'use strict';

    var MQ = '(max-width: 768px)';
    function isMobile() { return window.matchMedia(MQ).matches; }

    function init() {
        var editor = document.querySelector('.editor-panel');
        var panel = document.querySelector('.preview-panel');
        if (!editor || !panel) return;

        function collapse() {
            if (isMobile()) document.body.classList.add('preview-min');
        }
        function expand() {
            document.body.classList.remove('preview-min');
        }

        // Engaging the controls (focus a field, drag a wheel, tap a segment…)
        // minimizes the preview to make room for editing.
        editor.addEventListener('focusin', collapse);
        editor.addEventListener('pointerdown', collapse, { passive: true });

        // Tapping the minimized preview grows it back. Capture phase + swallow
        // the event so interactive.js doesn't treat the same tap as a word edit.
        panel.addEventListener('click', function (e) {
            if (isMobile() && document.body.classList.contains('preview-min')) {
                e.stopPropagation();
                e.preventDefault();
                expand();
            }
        }, true);

        // Rotating / resizing back to desktop clears the minimized state.
        window.matchMedia(MQ).addEventListener('change', function (ev) {
            if (!ev.matches) expand();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
