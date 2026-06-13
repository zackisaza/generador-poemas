/* ============================================================================
 *  wheel.js — Instagram-style horizontal value wheel (independent layer)
 *
 *  Replaces every native <input type="range"> with a curved, rotating wheel
 *  picker (like Instagram's filter selector): a horizontal strip of numbers
 *  that curves toward the edges, snaps to the centered value, and advances
 *  one step at a time on scroll/drag/keyboard.
 *
 *  Design contract (mirrors fontpicker.js): this is a PRESENTATION layer only.
 *  The native input stays in the DOM as the single source of truth — the wheel
 *  writes to input.value and dispatches a bubbling 'input' event so engine.js's
 *  bindRange() runs untouched. External value changes (undo/redo, presets,
 *  reset, load) are picked up by intercepting the input's value property and
 *  repositioning the wheel.
 * ========================================================================== */
(function () {
    'use strict';

    var TICK_W = 40;            // px between consecutive value ticks
    var WHEEL_THRESHOLD = 18;   // scroll delta needed to advance one tick
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function clamp(n, lo, hi) { return n < lo ? lo : n > hi ? hi : n; }

    function buildWheel(input) {
        var min = parseFloat(input.min);
        var max = parseFloat(input.max);
        var step = parseFloat(input.step) || 1;
        if (isNaN(min)) min = 0;
        if (isNaN(max)) max = 100;
        var count = Math.round((max - min) / step) + 1;

        var row = input.closest('.range-row') || input.parentElement;
        row.classList.add('wheel-on');

        // --- structure ---------------------------------------------------
        var wheel = document.createElement('div');
        wheel.className = 'wheel';
        wheel.tabIndex = 0;
        wheel.setAttribute('role', 'slider');
        wheel.setAttribute('aria-valuemin', String(min));
        wheel.setAttribute('aria-valuemax', String(max));

        var track = document.createElement('div');
        track.className = 'wheel-track';

        var ticks = [];
        for (var i = 0; i < count; i++) {
            var t = document.createElement('span');
            t.className = 'wheel-tick';
            var val = min + i * step;
            // integers stay clean; fractional steps keep one decimal
            t.textContent = step % 1 === 0 ? String(val) : val.toFixed(1);
            track.appendChild(t);
            ticks.push(t);
        }

        var center = document.createElement('div');
        center.className = 'wheel-center';

        wheel.appendChild(track);
        wheel.appendChild(center);
        row.appendChild(wheel);

        // --- state -------------------------------------------------------
        var pos = valueToIndex(parseFloat(input.value));   // continuous index
        var dragging = false;
        var internalSet = false;
        var raf = 0;

        function valueToIndex(v) { return clamp(Math.round((v - min) / step), 0, count - 1); }
        function indexToValue(idx) { return min + idx * step; }

        function render(animate) {
            var half = wheel.clientWidth / 2;
            if (half <= 0) return;                     // hidden / not laid out yet
            var R = half;                               // fade radius
            track.style.transition = animate && !reduce ? 'transform 0.28s cubic-bezier(0.22,1,0.36,1)' : 'none';
            track.style.transform = 'translateX(' + (half - TICK_W / 2 - pos * TICK_W) + 'px)';

            var activeIdx = Math.round(pos);
            for (var i = 0; i < ticks.length; i++) {
                var dx = (i - pos) * TICK_W;            // signed px offset from center
                var ratio = clamp(dx / R, -1, 1);
                var tk = ticks[i];
                if (reduce) {
                    tk.style.transform = 'none';
                    tk.style.opacity = Math.abs(i - pos) > half / TICK_W ? '0' : (1 - Math.min(0.7, Math.abs(ratio))).toFixed(3);
                } else {
                    var scale = 1 - Math.min(0.42, Math.abs(ratio) * 0.5);
                    tk.style.transform = 'rotateY(' + (-ratio * 52) + 'deg) scale(' + scale + ')';
                    tk.style.opacity = (1 - Math.min(0.82, Math.abs(ratio) * 1.05)).toFixed(3);
                }
                tk.classList.toggle('active', i === activeIdx);
            }
            wheel.setAttribute('aria-valuenow', String(indexToValue(activeIdx)));
        }

        function scheduleRender(animate) {
            if (raf) cancelAnimationFrame(raf);
            raf = requestAnimationFrame(function () { raf = 0; render(animate); });
        }

        // Push a committed value back into the native input + notify engine.
        function commit(idx, animate) {
            idx = clamp(idx, 0, count - 1);
            pos = idx;
            scheduleRender(animate);
            var v = indexToValue(idx);
            if (parseFloat(input.value) === v) return;
            internalSet = true;
            input.value = v;
            internalSet = false;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }

        // --- scroll: one notch = one tick -------------------------------
        var scrollAcc = 0;
        wheel.addEventListener('wheel', function (e) {
            e.preventDefault();
            scrollAcc += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            while (Math.abs(scrollAcc) >= WHEEL_THRESHOLD) {
                var dir = scrollAcc > 0 ? 1 : -1;
                scrollAcc -= dir * WHEEL_THRESHOLD;
                var next = clamp(Math.round(pos) + dir, 0, count - 1);
                if (next === Math.round(pos)) { scrollAcc = 0; break; }
                commit(next, true);
            }
        }, { passive: false });

        // --- drag (pointer covers mouse + touch) ------------------------
        var startX = 0, startPos = 0;
        wheel.addEventListener('pointerdown', function (e) {
            dragging = true;
            startX = e.clientX;
            startPos = pos;
            wheel.setPointerCapture(e.pointerId);
            track.style.transition = 'none';
        });
        wheel.addEventListener('pointermove', function (e) {
            if (!dragging) return;
            pos = clamp(startPos - (e.clientX - startX) / TICK_W, 0, count - 1);
            scheduleRender(false);
            var idx = Math.round(pos);
            var v = indexToValue(idx);
            if (parseFloat(input.value) !== v) {
                internalSet = true; input.value = v; internalSet = false;
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
        function endDrag() {
            if (!dragging) return;
            dragging = false;
            commit(Math.round(pos), true);     // snap to nearest
        }
        wheel.addEventListener('pointerup', endDrag);
        wheel.addEventListener('pointercancel', endDrag);

        // --- keyboard ----------------------------------------------------
        wheel.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); commit(Math.round(pos) - 1, true); }
            else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); commit(Math.round(pos) + 1, true); }
            else if (e.key === 'Home') { e.preventDefault(); commit(0, true); }
            else if (e.key === 'End') { e.preventDefault(); commit(count - 1, true); }
        });

        // --- external value changes (undo/redo, presets, reset, load) ---
        // Intercept the native value setter so programmatic updates reposition
        // the wheel, without reacting to the wheel's own writes or mid-drag.
        var desc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
        Object.defineProperty(input, 'value', {
            configurable: true,
            get: function () { return desc.get.call(this); },
            set: function (v) {
                desc.set.call(this, v);
                if (internalSet || dragging) return;
                pos = valueToIndex(parseFloat(v));
                scheduleRender(true);
            }
        });

        // Re-measure when the control becomes visible or the layout changes.
        if (window.ResizeObserver) {
            var ro = new ResizeObserver(function () { render(false); });
            ro.observe(wheel);
        }

        render(false);
    }

    function init() {
        document.querySelectorAll('input[type="range"]').forEach(buildWheel);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
