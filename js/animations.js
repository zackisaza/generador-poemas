    (function () {
        const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // 1) Per-section stagger index for the CSS entrance animation.
        function indexSections() {
            document.querySelectorAll('.editor-panel .section').forEach((sec, i) => {
                sec.style.setProperty('--i', i);
            });
        }

        // 2) Trigger the entrance reveal by adding .reveal to <body>.
        function reveal() {
            indexSections();
            // next frame so initial opacity:0 is committed before the animation starts
            requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('reveal')));
        }

        // 3) Preview refresh pulse — observe the <img id="preview"> src attribute.
        //    generateImage() sets preview.src directly; we react to that without
        //    touching the engine. Skipped entirely under reduced motion.
        function wirePreviewPulse() {
            if (reduceMotion) return;
            const img = document.getElementById('preview');
            if (!img || !window.MutationObserver) return;
            let pulseTimer = null;
            const obs = new MutationObserver(() => {
                img.classList.add('is-refreshing');
                if (pulseTimer) clearTimeout(pulseTimer);
                // hold the dimmed/scaled state briefly, then let it ease back to full
                pulseTimer = setTimeout(() => img.classList.remove('is-refreshing'), 110);
            });
            obs.observe(img, { attributes: true, attributeFilter: ['src'] });
        }

        function start() {
            reveal();
            wirePreviewPulse();
        }

        if (document.readyState === 'loading') {
            window.addEventListener('DOMContentLoaded', start);
        } else {
            start();
        }
    })();
    
