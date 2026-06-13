// ========================================================================
//  SAVED COMPOSITIONS  (named pieces, stored separately from the live state)
//  Reads/writes the engine globals: getStateSnapshot(), applyLoadedState(),
//  showToast(), slugify(). Independent of the canvas engine internals.
// ========================================================================
(function () {
    'use strict';

    const LIB_KEY = 'poemStudio.library.v1';

    function loadLibrary() {
        try { return JSON.parse(localStorage.getItem(LIB_KEY)) || []; }
        catch (e) { return []; }
    }
    function persistLibrary(arr) {
        try { localStorage.setItem(LIB_KEY, JSON.stringify(arr)); return true; }
        catch (e) { return false; } // quota (heavy bg images across many pieces)
    }

    function formatDate(ts) {
        try { return new Date(ts).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' }); }
        catch (e) { return ''; }
    }

    function render() {
        const list = document.getElementById('compList');
        if (!list) return;
        const lib = loadLibrary();
        if (!lib.length) {
            list.innerHTML = '<p class="hint">Todavía no guardaste ninguna composición.</p>';
            return;
        }
        list.innerHTML = lib.map(c =>
            `<div class="comp-item">
                <div class="comp-info">
                    <span class="comp-name">${escapeHtml(c.name)}</span>
                    <span class="comp-date">${formatDate(c.savedAt)}</span>
                </div>
                <div class="comp-actions">
                    <button class="ghost-btn icon-only" type="button" data-load="${c.id}" title="Cargar"><i data-lucide="folder-open"></i></button>
                    <button class="ghost-btn icon-only" type="button" data-del="${c.id}" title="Borrar"><i data-lucide="trash-2"></i></button>
                </div>
            </div>`
        ).join('');
        list.querySelectorAll('[data-load]').forEach(b => b.addEventListener('click', () => loadComposition(b.dataset.load)));
        list.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => deleteComposition(b.dataset.del)));
        if (window.lucide) lucide.createIcons();
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    function save() {
        const input = document.getElementById('compName');
        const name = (input.value || '').trim() || (typeof state !== 'undefined' && state.title) || 'Sin título';
        const lib = loadLibrary();
        const item = { id: 'c' + Date.now(), name: name, savedAt: Date.now(), state: getStateSnapshot() };
        lib.unshift(item);
        if (persistLibrary(lib)) {
            input.value = '';
            render();
            showToast(`Guardado: "${name}"`);
        } else {
            // Retry without the (heavy) background image so the rest still saves.
            item.state.bgImage = '';
            lib[0] = item;
            if (persistLibrary(lib)) { input.value = ''; render(); showToast('Guardado (sin la imagen de fondo: muy pesada)'); }
            else showToast('No se pudo guardar: almacenamiento lleno');
        }
    }

    function loadComposition(id) {
        const item = loadLibrary().find(c => c.id === id);
        if (!item) return;
        applyLoadedState(item.state);
        showToast(`Cargado: "${item.name}"`);
    }

    function deleteComposition(id) {
        const lib = loadLibrary().filter(c => c.id !== id);
        persistLibrary(lib);
        render();
        showToast('Composición borrada');
    }

    function init() {
        const saveBtn = document.getElementById('compSaveBtn');
        if (!saveBtn) return;
        saveBtn.addEventListener('click', save);
        const input = document.getElementById('compName');
        if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); save(); } });
        render();
    }

    if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', init);
    else init();
})();
