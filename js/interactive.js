// ========================================================================
//  INTERACTIVE EDITING LAYER  (independent of the canvas engine internals)
//  Lets you edit directly on the preview image:
//   · click a WORD   -> bubble with Bold / Italic / Underline / Strike
//   · click the TITLE -> bubble with size +/- and font
//   · click a STANZA  -> bubble with block-level Bold/Italic/Underline/Strike
//
//  How it works: engine.js populates the global `hitRegions` array on every
//  render — rectangles in CANVAS coordinates plus the source range each maps
//  back to. Here we translate a click on the (object-fit:contain) <img> into
//  canvas coordinates, find the region under it, and act through the engine's
//  global helpers (applyFormatToRange / state / apply / syncControlsFromState).
//  No engine code is modified.
// ========================================================================
(function () {
    'use strict';

    const WORD_ACTIONS = [
        { label: 'B', marker: '**', key: 'bold',      style: 'font-weight:800' },
        { label: 'I', marker: '*',  key: 'italic',    style: 'font-style:italic' },
        { label: 'U', marker: '__', key: 'underline', style: 'text-decoration:underline' },
        { label: 'S', marker: '~~', key: 'strike',    style: 'text-decoration:line-through' },
    ];

    let popover = null;
    let highlight = null;           // visible box over the selected region
    let isOpen = false;
    let activeKind = null;          // 'word' | 'title' | 'stanza'
    let activeRegion = null;        // current region object
    let anchor = { cx: 0, cy: 0 };  // region centre in canvas coords (for refresh)

    function el(tag, cls, html) {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        if (html != null) e.innerHTML = html;
        return e;
    }

    function ensurePopover() {
        if (popover) return popover;
        popover = el('div', 'hit-popover');
        popover.setAttribute('role', 'menu');
        // Clicks inside the popover must not bubble out and close it.
        popover.addEventListener('mousedown', e => e.stopPropagation());
        document.body.appendChild(popover);
        return popover;
    }

    // Visible selection box, overlaid on the preview (never part of the PNG).
    function ensureHighlight() {
        if (highlight) return highlight;
        highlight = el('div', 'hit-highlight');
        document.body.appendChild(highlight);
        return highlight;
    }
    function positionHighlight(region) {
        ensureHighlight();
        const s = regionToScreen(region);
        if (!s) { highlight.style.display = 'none'; return; }
        const pad = region.type === 'word' ? 4 : 3;
        highlight.style.display = 'block';
        highlight.style.left = Math.round(s.x - pad) + 'px';
        highlight.style.top = Math.round(s.y - pad) + 'px';
        highlight.style.width = Math.round(s.w + pad * 2) + 'px';
        highlight.style.height = Math.round(s.h + pad * 2) + 'px';
        requestAnimationFrame(() => highlight.classList.add('show'));
    }
    function hideHighlight() {
        if (!highlight) return;
        highlight.classList.remove('show');
        highlight.style.display = 'none';
    }

    // ---- Coordinate mapping: client <-> canvas (handles letterboxing) -------
    function metrics() {
        const img = document.getElementById('preview');
        const canvas = document.getElementById('canvas');
        if (!img || !canvas || !canvas.width) return null;
        const rect = img.getBoundingClientRect();
        if (!rect.width || !rect.height) return null;
        const cw = canvas.width, ch = canvas.height;
        const boxAspect = rect.width / rect.height;
        const canAspect = cw / ch;
        let renderedW, renderedH, offX, offY;
        if (boxAspect > canAspect) { renderedH = rect.height; renderedW = renderedH * canAspect; offX = (rect.width - renderedW) / 2; offY = 0; }
        else { renderedW = rect.width; renderedH = renderedW / canAspect; offX = 0; offY = (rect.height - renderedH) / 2; }
        return { rect, cw, ch, renderedW, renderedH, offX, offY };
    }

    function clientToCanvas(clientX, clientY) {
        const m = metrics();
        if (!m) return null;
        const px = clientX - m.rect.left - m.offX;
        const py = clientY - m.rect.top - m.offY;
        if (px < 0 || py < 0 || px > m.renderedW || py > m.renderedH) return null;
        const scale = m.cw / m.renderedW;
        return { cx: px * scale, cy: py * scale };
    }

    function regionToScreen(r) {
        const m = metrics();
        if (!m) return null;
        const s = m.renderedW / m.cw; // canvas px -> screen px
        return { x: m.rect.left + m.offX + r.x * s, y: m.rect.top + m.offY + r.y * s, w: r.w * s, h: r.h * s };
    }

    // ---- Hit testing -------------------------------------------------------
    function regions() { return (typeof hitRegions !== 'undefined' && hitRegions) || []; }

    function contains(r, cx, cy) {
        const padX = r.type === 'word' ? r.h * 0.18 : 0;
        const padY = r.type === 'word' ? r.h * 0.18 : 0;
        return cx >= r.x - padX && cx <= r.x + r.w + padX && cy >= r.y - padY && cy <= r.y + r.h + padY;
    }

    // Priority: title > word (smallest) > stanza
    function findRegion(cx, cy) {
        let title = null, word = null, stanza = null;
        for (const r of regions()) {
            if (!contains(r, cx, cy)) continue;
            if (r.type === 'title') title = r;
            else if (r.type === 'word') { if (!word || r.w < word.w) word = r; }
            else if (r.type === 'stanza') { if (!stanza) stanza = r; }
        }
        return title || word || stanza;
    }

    function findOfKind(kind, cx, cy) {
        if (kind === 'title') return regions().find(r => r.type === 'title') || null;
        let best = null;
        for (const r of regions()) {
            if (r.type !== kind || !contains(r, cx, cy)) continue;
            if (kind === 'word') { if (!best || r.w < best.w) best = r; }
            else if (!best) best = r;
        }
        return best;
    }

    // ---- Popover content ---------------------------------------------------
    function buildWordOrStanza(region) {
        const p = popover;
        p.innerHTML = '';
        p.appendChild(el('span', 'hit-tag', region.type === 'stanza' ? 'Estrofa' : 'Palabra'));
        WORD_ACTIONS.forEach(a => {
            const active = region.type === 'word' && region[a.key];
            const b = el('button', 'hit-btn' + (active ? ' on' : ''), a.label);
            b.type = 'button';
            b.setAttribute('style', a.style);
            const lbl = { bold: 'Negrita', italic: 'Cursiva', underline: 'Subrayado', strike: 'Tachado' }[a.key];
            b.title = lbl;
            b.setAttribute('aria-label', lbl);
            if (active) b.setAttribute('aria-pressed', 'true');
            b.addEventListener('click', () => {
                applyFormatToRange(a.marker, region.srcStart, region.srcEnd);
                // hit map refreshes via the preview MutationObserver below
            });
            p.appendChild(b);
        });
    }

    function buildTitle() {
        const p = popover;
        p.innerHTML = '';
        p.appendChild(el('span', 'hit-tag', 'Título'));

        const minus = el('button', 'hit-btn', '−'); minus.type = 'button'; minus.title = 'Más chico';
        const val = el('span', 'hit-val', state.titleSize + ' px');
        const plus = el('button', 'hit-btn', '+'); plus.type = 'button'; plus.title = 'Más grande';
        const setSize = (d) => {
            state.titleSize = Math.max(60, Math.min(240, state.titleSize + d));
            val.textContent = state.titleSize + ' px';
            syncControlsFromState();
            apply();
        };
        minus.addEventListener('click', () => setSize(-5));
        plus.addEventListener('click', () => setSize(5));

        const sel = el('select', 'hit-select');
        sel.innerHTML = FONTS.map(f => `<option value="${f.family}"${f.family === state.titleFont ? ' selected' : ''}>${f.label}</option>`).join('');
        sel.addEventListener('change', () => {
            state.titleFont = sel.value;
            syncControlsFromState();
            apply();
        });

        p.appendChild(minus);
        p.appendChild(val);
        p.appendChild(plus);
        p.appendChild(sel);
    }

    function build(region) {
        if (region.type === 'title') buildTitle();
        else buildWordOrStanza(region);
    }

    function position(region) {
        const s = regionToScreen(region);
        if (!s) return;
        const p = popover;
        p.style.visibility = 'hidden';
        p.style.display = 'flex';
        const pw = p.offsetWidth, ph = p.offsetHeight;
        let left = s.x + s.w / 2 - pw / 2;
        let top = s.y - ph - 12;            // above the region
        if (top < 8) top = s.y + s.h + 12;  // flip below if no room
        left = Math.max(8, Math.min(left, window.innerWidth - pw - 8));
        top = Math.max(8, Math.min(top, window.innerHeight - ph - 8));
        p.style.left = Math.round(left) + 'px';
        p.style.top = Math.round(top) + 'px';
        p.style.visibility = 'visible';
        p.classList.add('show');
    }

    function open(region) {
        ensurePopover();
        activeKind = region.type;
        activeRegion = region;
        anchor = { cx: region.x + region.w / 2, cy: region.y + region.h / 2 };
        build(region);
        position(region);
        positionHighlight(region);
        isOpen = true;
    }

    function close() {
        hideHighlight();
        if (!popover) return;
        popover.classList.remove('show');
        popover.style.display = 'none';
        isOpen = false;
        activeKind = null;
        activeRegion = null;
    }

    // Re-find the region at the stored anchor after a re-render, so the bubble
    // follows its target and shows fresh active states.
    function refresh() {
        if (!isOpen) return;
        const region = findOfKind(activeKind, anchor.cx, anchor.cy);
        if (!region) { close(); return; }
        activeRegion = region;
        if (activeKind !== 'title') anchor = { cx: region.x + region.w / 2, cy: region.y + region.h / 2 };
        build(region);
        position(region);
        positionHighlight(region);
    }

    // ---- Wiring ------------------------------------------------------------
    function init() {
        const preview = document.getElementById('preview');
        if (!preview) return;
        preview.style.cursor = 'pointer';
        preview.setAttribute('draggable', 'false');

        preview.addEventListener('click', (e) => {
            const pt = clientToCanvas(e.clientX, e.clientY);
            if (!pt) { close(); return; }
            const region = findRegion(pt.cx, pt.cy);
            if (!region) {
                close();
                // Help when the visible text is the (non-editable) placeholder.
                if (typeof state !== 'undefined' && !state.poem) showToast('Escribí tu poema para poder editarlo sobre la imagen');
                return;
            }
            open(region);
        });

        // Close when clicking anywhere outside the popover (popover stops its own).
        document.addEventListener('mousedown', (e) => {
            if (!isOpen) return;
            if (popover && popover.contains(e.target)) return;
            if (e.target === preview) return; // the preview click handler manages it
            close();
        });

        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
        window.addEventListener('resize', () => { if (isOpen && activeRegion) { position(activeRegion); positionHighlight(activeRegion); } });
        window.addEventListener('scroll', () => { if (isOpen) close(); }, true);

        // Follow re-renders: engine sets preview.src after repopulating hitRegions.
        if (window.MutationObserver) {
            new MutationObserver(() => { if (isOpen) requestAnimationFrame(refresh); })
                .observe(preview, { attributes: true, attributeFilter: ['src'] });
        }
    }

    if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', init);
    else init();
})();
