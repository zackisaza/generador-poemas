    (function () {
        function buildTabs() {
            const form = document.getElementById('poemForm');
            if (!form) return;
            const sections = Array.from(form.querySelectorAll(':scope > [data-section]'));
            if (!sections.length) return;

            document.body.classList.add('tabs-mode');

            // Collect icon + label from each existing .section-head (reuse structure).
            const meta = sections.map(sec => {
                const head = sec.querySelector('.section-head');
                const iconEl = head ? head.querySelector('.sec-icon i[data-lucide]') : null;
                const icon = iconEl ? iconEl.getAttribute('data-lucide') : 'circle';
                // Label = the head's text content minus the icon/chevron glyphs.
                let label = head ? head.textContent.replace(/\s+/g, ' ').trim() : 'Sección';
                // Short label for the compact bottom-nav.
                const short = label.split(' ')[0];
                return { sec, icon, label, short };
            });

            // Clear any pre-set collapsed state so the active section can open fully.
            sections.forEach(s => s.classList.remove('collapsed'));

            // ---- Desktop tab bar -------------------------------------------------
            const tabBar = document.createElement('div');
            tabBar.className = 'tab-bar';
            tabBar.setAttribute('role', 'tablist');

            // ---- Mobile bottom nav ----------------------------------------------
            const bottomNav = document.createElement('nav');
            bottomNav.className = 'bottom-nav';
            bottomNav.setAttribute('aria-label', 'Secciones');

            const tabButtons = [];
            const navButtons = [];

            meta.forEach((m, idx) => {
                const tb = document.createElement('button');
                tb.type = 'button';
                tb.className = 'tab-btn';
                tb.setAttribute('role', 'tab');
                tb.innerHTML = '<i data-lucide="' + m.icon + '"></i><span>' + m.label + '</span>';
                tb.addEventListener('click', () => activate(idx));
                tabBar.appendChild(tb);
                tabButtons.push(tb);

                const nb = document.createElement('button');
                nb.type = 'button';
                nb.className = 'bottom-nav-btn';
                nb.innerHTML = '<i data-lucide="' + m.icon + '"></i><span>' + m.short + '</span>';
                nb.addEventListener('click', () => activate(idx));
                bottomNav.appendChild(nb);
                navButtons.push(nb);
            });

            // Insert tab bar at the very top of the form (above the sections).
            form.insertBefore(tabBar, form.firstChild);
            document.body.appendChild(bottomNav);

            // ---- Floating mobile download button (mirrors #downloadBtn) ----------
            const dl = document.createElement('button');
            dl.type = 'button';
            dl.className = 'mobile-download';
            dl.innerHTML = '<i data-lucide="download"></i><span>PNG</span>';
            dl.addEventListener('click', () => {
                const real = document.getElementById('downloadBtn');
                if (real) real.click();
            });
            document.body.appendChild(dl);

            let activeIndex = -1;
            function activate(idx) {
                if (idx === activeIndex) return;
                activeIndex = idx;
                meta.forEach((m, i) => {
                    const on = i === idx;
                    m.sec.classList.toggle('tab-hidden', !on);
                    tabButtons[i].classList.toggle('active', on);
                    navButtons[i].classList.toggle('active', on);
                    tabButtons[i].setAttribute('aria-selected', on ? 'true' : 'false');
                });
            }

            activate(0);

            // Re-render Lucide icons for the freshly created tab/nav buttons.
            if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
        }

        // Run after init() (which registers its DOMContentLoaded listener earlier,
        // so it fires first and the sections/wiring already exist).
        if (document.readyState === 'loading') {
            window.addEventListener('DOMContentLoaded', buildTabs);
        } else {
            buildTabs();
        }
    })();
    
