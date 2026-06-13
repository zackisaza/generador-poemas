// ========================================================================
//  CUSTOM FONT PICKER  (replaces the native <select> for fonts)
//  Each option is rendered in its OWN font, so the list doubles as a preview.
//  Reads/writes engine globals: FONTS, state, apply(). Exposes
//  window.refreshFontPickers() so the engine can sync the triggers on
//  theme apply / undo / load.
//
//  The dropdown panel is appended to <body> and positioned fixed, so it never
//  gets clipped by the scrollable controls panel.
// ========================================================================
(function () {
    'use strict';

    const pickers = [];

    function el(tag, cls, txt) {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        if (txt != null) e.textContent = txt;
        return e;
    }
    function labelFor(family) {
        const f = FONTS.find(x => x.family === family);
        return f ? f.label : family;
    }

    function createPicker(container) {
        const key = container.dataset.key; // 'titleFont' | 'fontFamily'
        let panel = null, built = false, isOpen = false;

        const trigger = el('button', 'fp-trigger');
        trigger.type = 'button';
        trigger.setAttribute('aria-haspopup', 'listbox');
        const labelSpan = el('span', 'fp-label');
        trigger.appendChild(labelSpan);
        trigger.appendChild(el('span', 'fp-chev', '▾'));
        container.appendChild(trigger);

        function buildPanel() {
            panel = el('div', 'fp-panel');
            panel.setAttribute('role', 'listbox');
            let lastGroup = null;
            FONTS.forEach(f => {
                if (f.group && f.group !== lastGroup) { lastGroup = f.group; panel.appendChild(el('div', 'fp-group', f.group)); }
                const opt = el('button', 'fp-opt', f.label);
                opt.type = 'button';
                opt.setAttribute('role', 'option');
                opt.dataset.family = f.family;
                opt.style.fontFamily = `'${f.family}', serif`; // the live preview
                opt.addEventListener('click', () => select(f.family));
                panel.appendChild(opt);
            });
            document.body.appendChild(panel); // escape the scroll container
            built = true;
        }

        function markSelected() {
            if (!built) return;
            panel.querySelectorAll('.fp-opt').forEach(o => o.classList.toggle('sel', o.dataset.family === state[key]));
        }

        function select(family) {
            state[key] = family;
            refresh();
            close();
            apply();
        }

        function refresh() {
            const fam = state[key];
            labelSpan.textContent = labelFor(fam);
            labelSpan.style.fontFamily = `'${fam}', serif`;
            markSelected();
        }

        function position() {
            const r = trigger.getBoundingClientRect();
            panel.style.minWidth = r.width + 'px';
            panel.style.left = Math.round(r.left) + 'px';
            panel.style.top = '-9999px';
            panel.classList.add('show'); // make it measurable
            const ph = panel.offsetHeight;
            let top = r.bottom + 6;
            if (top + ph > window.innerHeight - 8) top = Math.max(8, r.top - ph - 6);
            panel.style.top = Math.round(top) + 'px';
        }

        function open() {
            closeAll();
            if (!built) buildPanel();
            markSelected();
            position();
            container.classList.add('open');
            isOpen = true;
            const sel = panel.querySelector('.fp-opt.sel');
            if (sel) sel.scrollIntoView({ block: 'center' });
        }
        function close() {
            if (panel) panel.classList.remove('show');
            container.classList.remove('open');
            isOpen = false;
        }

        trigger.addEventListener('click', e => { e.stopPropagation(); isOpen ? close() : open(); });

        const api = { refresh, close, reposition: () => { if (isOpen) position(); } };
        pickers.push(api);
        refresh();
        return api;
    }

    function closeAll() { pickers.forEach(p => p.close()); }

    window.refreshFontPickers = function () { pickers.forEach(p => p.refresh()); };

    function init() {
        document.querySelectorAll('.font-picker[data-key]').forEach(createPicker);
        document.addEventListener('click', closeAll);
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });
        window.addEventListener('scroll', e => {
            // Ignore scroll events bubbling (capture phase) from inside an open panel itself
            if (e.target instanceof Element && e.target.closest('.fp-panel')) return;
            closeAll();
        }, true);
        window.addEventListener('resize', closeAll);
    }

    if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', init);
    else init();
})();
