        // ========================================================================
        //  CONFIG / CONSTANTS
        // ========================================================================
        const STORAGE_KEY = 'poemStudio.v2';
        const BASE_WIDTH = 2160;

        // Aspect ratio presets — width fixed, height derived
        const RATIOS = [
            { key: 'post',     label: 'Post 4:5',   w: 2160, h: 2700 },
            { key: 'square',   label: 'Cuadro 1:1', w: 2160, h: 2160 },
            { key: 'portrait', label: 'Vert. 3:4',  w: 2160, h: 2880 },
            { key: 'story',    label: 'Story 9:16',  w: 2160, h: 3840 },
        ];

        // Available fonts (web + system). label shown, family used by canvas.
        const FONTS = [
            { label: 'Playfair Display', family: 'Playfair Display' },
            { label: 'Cormorant Garamond', family: 'Cormorant Garamond' },
            { label: 'EB Garamond', family: 'EB Garamond' },
            { label: 'Libre Baskerville', family: 'Libre Baskerville' },
            { label: 'Lora', family: 'Lora' },
            { label: 'Montserrat', family: 'Montserrat' },
            { label: 'Ubuntu', family: 'Ubuntu' },
            { label: 'Inter', family: 'Inter' },
            { label: 'Times New Roman', family: 'Times New Roman' },
            { label: 'Georgia', family: 'Georgia' },
            { label: 'Palatino', family: 'Palatino' },
            { label: 'Garamond', family: 'Garamond' },
            { label: 'Courier New', family: 'Courier New' },
        ];

        // Theme presets — one click sets colors + fonts
        const THEMES = [
            { key: 'sangre',     name: 'Sangre',     bgType: 'solid',    bg: '#0a0a0a', bg2: '#3a0000', text: '#f5f5f5', titleFont: 'Playfair Display', bodyFont: 'Palatino' },
            { key: 'medianoche', name: 'Medianoche', bgType: 'gradient', bg: '#0d1b2a', bg2: '#1b263b', text: '#e0e1dd', titleFont: 'Playfair Display', bodyFont: 'Lora' },
            { key: 'sepia',      name: 'Sepia',      bgType: 'solid',    bg: '#f4ecd8', bg2: '#e8dcc0', text: '#3a2f1d', titleFont: 'Cormorant Garamond', bodyFont: 'EB Garamond' },
            { key: 'papel',      name: 'Papel',      bgType: 'solid',    bg: '#fbfbf7', bg2: '#ececec', text: '#1a1a1a', titleFont: 'Libre Baskerville', bodyFont: 'Lora' },
            { key: 'bosque',     name: 'Bosque',     bgType: 'gradient', bg: '#14241b', bg2: '#28402f', text: '#e8f0e3', titleFont: 'Cormorant Garamond', bodyFont: 'EB Garamond' },
            { key: 'ocaso',      name: 'Ocaso',      bgType: 'gradient', bg: '#2b1055', bg2: '#7a1f3d', text: '#ffe9d6', titleFont: 'Playfair Display', bodyFont: 'Montserrat' },
            { key: 'tinta',      name: 'Tinta',      bgType: 'solid',    bg: '#1a1a2e', bg2: '#0f0f1a', text: '#e6e6fa', titleFont: 'EB Garamond', bodyFont: 'Lora' },
            { key: 'niebla',     name: 'Niebla',     bgType: 'solid',    bg: '#2c3539', bg2: '#1f262a', text: '#dfe6e9', titleFont: 'Montserrat', bodyFont: 'Inter' },
        ];

        // Default state
        const DEFAULTS = {
            ratio: 'post',
            title: '', poem: '',
            titleFont: 'Playfair Display', fontFamily: 'Palatino',
            align: 'center',
            columns: 'auto',
            fontSize: 85, titleSize: 120,
            titleSpacing: 120, lineSpacing: 80, lineHeight: 120,
            marginX: 200, marginTop: 250,
            forceSize: true,
            letterSpacing: 0,
            bgType: 'solid', backgroundColor: '#0a0a0a', backgroundColor2: '#3a0000', gradientAngle: 135,
            textColor: '#f5f5f5',
            shadowEnabled: false, shadowBlur: 14,
            borderEnabled: false, borderColor: '#8b0000', borderWidth: 10,
            watermarkEnabled: false, watermarkText: '@sr.zrro', watermarkOpacity: 45,
            theme: 'sangre',
        };

        let state = { ...DEFAULTS };
        let currentImageUrl = null;
        let updateTimeout = null;
        const supportsLetterSpacing = (() => {
            try { const c = document.createElement('canvas').getContext('2d'); c.letterSpacing = '1px'; return c.letterSpacing === '1px'; }
            catch (e) { return false; }
        })();

        // ========================================================================
        //  TEXT ENGINE  (parsing / wrapping / hyphenation — preserved & extended)
        // ========================================================================
        function slugify(text) {
            return text.toLowerCase().replace(/[^a-z0-9áéíóúñ]+/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
        }

        function parseFormattedSegments(text) {
            const segments = [];
            let buffer = '';
            let i = 0;
            const st = { bold: false, italic: false, underline: false, strike: false };
            const flush = () => { if (buffer.length > 0) { segments.push({ text: buffer, ...st }); buffer = ''; } };
            while (i < text.length) {
                if (text.startsWith('***', i)) { flush(); st.bold = !st.bold; st.italic = !st.italic; i += 3; continue; }
                if (text.startsWith('**', i))  { flush(); st.bold = !st.bold; i += 2; continue; }
                if (text.startsWith('__', i))  { flush(); st.underline = !st.underline; i += 2; continue; }
                if (text.startsWith('~~', i))  { flush(); st.strike = !st.strike; i += 2; continue; }
                if (text[i] === '*')           { flush(); st.italic = !st.italic; i += 1; continue; }
                buffer += text[i]; i += 1;
            }
            flush();
            if (segments.length === 0) segments.push({ text: text || '', bold: false, italic: false, underline: false, strike: false });
            return segments;
        }

        function getFontStyle(seg, fontSize, fontFamily) {
            return `${seg.italic ? 'italic ' : ''}${seg.bold ? 'bold ' : ''}${fontSize}px "${fontFamily}", serif`.trim();
        }
        function measureTextSegment(ctx, seg, fontSize, fontFamily) {
            ctx.font = getFontStyle(seg, fontSize, fontFamily);
            return ctx.measureText(seg.text).width;
        }

        function hyphenateWord(ctx, word, seg, fontSize, fontFamily, firstAvailable, maxWidth) {
            const pieces = [];
            let current = '';
            let limit = firstAvailable || maxWidth;
            for (let i = 0; i < word.length; i++) {
                const test = current + word[i];
                ctx.font = getFontStyle(seg, fontSize, fontFamily);
                const width = ctx.measureText(test + '-').width;
                if (width <= limit) { current = test; }
                else {
                    if (current) { pieces.push(current + '-'); current = word[i]; limit = maxWidth; }
                    else { pieces.push(word[i]); current = ''; limit = maxWidth; }
                }
            }
            if (current) pieces.push(current);
            return pieces;
        }

        function wrapSegments(ctx, segments, maxWidth, fontSize, fontFamily) {
            const lines = [];
            let currentLine = [];
            let currentWidth = 0;
            const pushSegment = (text, base) => {
                if (!text) return;
                const seg = { ...base, text };
                currentLine.push(seg);
                currentWidth += measureTextSegment(ctx, seg, fontSize, fontFamily);
            };
            for (const seg of segments) {
                const words = seg.text.split(' ');
                for (let idx = 0; idx < words.length; idx++) {
                    const word = words[idx];
                    const needsSpace = idx > 0 || currentLine.length > 0;
                    const token = needsSpace ? ' ' + word : word;
                    const tokenWidth = measureTextSegment(ctx, { ...seg, text: token }, fontSize, fontFamily);
                    if (currentWidth + tokenWidth <= maxWidth) { pushSegment(token, seg); continue; }
                    if (currentLine.length > 0) { lines.push(currentLine); currentLine = []; currentWidth = 0; }
                    const cleanWidth = measureTextSegment(ctx, { ...seg, text: word }, fontSize, fontFamily);
                    if (cleanWidth <= maxWidth) { pushSegment(word, seg); continue; }
                    const pieces = hyphenateWord(ctx, word, seg, fontSize, fontFamily, maxWidth - currentWidth, maxWidth);
                    for (const piece of pieces) {
                        const pieceWidth = measureTextSegment(ctx, { ...seg, text: piece }, fontSize, fontFamily);
                        if (currentWidth + pieceWidth > maxWidth && currentLine.length > 0) {
                            lines.push(currentLine); currentLine = []; currentWidth = 0;
                        }
                        pushSegment(piece, seg);
                    }
                }
            }
            if (currentLine.length > 0) lines.push(currentLine);
            if (lines.length === 0) lines.push([{ text: '', bold: false, italic: false, underline: false, strike: false }]);
            return lines;
        }

        function wrapTextLines(ctx, lines, maxWidth, fontSize, fontFamily) {
            const wrapped = [];
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line.trim() === '') {
                    if (wrapped.length > 0) wrapped[wrapped.length - 1].isParagraphEnd = true;
                } else {
                    const segments = parseFormattedSegments(line);
                    const wrappedLine = wrapSegments(ctx, segments, maxWidth, fontSize, fontFamily);
                    for (let j = 0; j < wrappedLine.length; j++) {
                        wrapped.push({ segments: wrappedLine[j], isParagraphEnd: false });
                    }
                }
            }
            return wrapped;
        }

        function findOptimalFontSize(ctx, lines, maxWidth, maxHeight, initialSize, fontFamily, paragraphSpacing, lineHeightFactor) {
            let size = initialSize;
            let wrappedLines = [];
            while (size >= 40) {
                wrappedLines = wrapTextLines(ctx, lines, maxWidth, size, fontFamily);
                const baseLineHeight = size * lineHeightFactor;
                let totalHeight = 0;
                for (const line of wrappedLines) {
                    totalHeight += baseLineHeight;
                    if (line.isParagraphEnd) totalHeight += paragraphSpacing;
                }
                if (totalHeight <= maxHeight) break;
                size -= 2;
            }
            return { fontSize: size < 40 ? 40 : size, wrappedLines };
        }

        function lineWidth(ctx, segments, fontSize, fontFamily) {
            let w = 0;
            for (const seg of segments) w += measureTextSegment(ctx, seg, fontSize, fontFamily);
            return w;
        }

        function drawFormattedLine(ctx, lineSegments, x, y, fontSize, fontFamily) {
            let cursorX = x;
            for (const seg of lineSegments) {
                ctx.font = getFontStyle(seg, fontSize, fontFamily);
                ctx.fillText(seg.text, cursorX, y);
                const width = ctx.measureText(seg.text).width;
                if (seg.underline) ctx.fillRect(cursorX, y + fontSize * 0.9, width, Math.max(1, fontSize * 0.05));
                if (seg.strike)    ctx.fillRect(cursorX, y + fontSize * 0.45, width, Math.max(1, fontSize * 0.05));
                cursorX += width;
            }
        }

        function drawWrappedLines(ctx, wrappedLines, startX, startY, blockWidth, fontSize, fontFamily, paragraphSpacing, align, lineHeightFactor) {
            const baseLineHeight = fontSize * lineHeightFactor;
            let y = startY;
            for (const lineObj of wrappedLines) {
                const lw = lineWidth(ctx, lineObj.segments, fontSize, fontFamily);
                let x = startX;
                if (align === 'center') x = startX + (blockWidth - lw) / 2;
                else if (align === 'right') x = startX + (blockWidth - lw);
                drawFormattedLine(ctx, lineObj.segments, x, y, fontSize, fontFamily);
                y += baseLineHeight;
                if (lineObj.isParagraphEnd) y += paragraphSpacing;
            }
        }

        // ========================================================================
        //  RENDER
        // ========================================================================
        function getRatio() { return RATIOS.find(r => r.key === state.ratio) || RATIOS[0]; }

        function paintBackground(ctx, w, h) {
            if (state.bgType === 'gradient') {
                const a = (state.gradientAngle - 90) * Math.PI / 180;
                const cx = w / 2, cy = h / 2;
                const len = Math.abs(w * Math.cos(a)) + Math.abs(h * Math.sin(a));
                const dx = Math.cos(a) * len / 2, dy = Math.sin(a) * len / 2;
                const g = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);
                g.addColorStop(0, state.backgroundColor);
                g.addColorStop(1, state.backgroundColor2);
                ctx.fillStyle = g;
            } else {
                ctx.fillStyle = state.backgroundColor;
            }
            ctx.fillRect(0, 0, w, h);
        }

        function generateImage() {
            const ratio = getRatio();
            const WIDTH = ratio.w, HEIGHT = ratio.h;
            const canvas = document.getElementById('canvas');
            canvas.width = WIDTH;
            canvas.height = HEIGHT;
            const ctx = canvas.getContext('2d');

            const lineHeightFactor = state.lineHeight / 100;
            const MARGIN_X = state.marginX;
            const MARGIN_TOP = state.marginTop;

            // Background (never shadowed)
            ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
            paintBackground(ctx, WIDTH, HEIGHT);

            // Optional frame
            if (state.borderEnabled) {
                ctx.strokeStyle = state.borderColor;
                ctx.lineWidth = state.borderWidth;
                const inset = state.borderWidth / 2 + Math.round(WIDTH * 0.018);
                ctx.strokeRect(inset, inset, WIDTH - inset * 2, HEIGHT - inset * 2);
            }

            ctx.textBaseline = 'top';
            if (supportsLetterSpacing) ctx.letterSpacing = state.letterSpacing + 'px';

            // Text shadow
            if (state.shadowEnabled) {
                ctx.shadowColor = 'rgba(0,0,0,0.55)';
                ctx.shadowBlur = state.shadowBlur;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = Math.round(state.shadowBlur * 0.35);
            }

            ctx.fillStyle = state.textColor;
            const align = state.align;
            const blockWidth = WIDTH - 2 * MARGIN_X;

            // Title
            let y = MARGIN_TOP;
            const title = state.title || (isPreviewEmpty() ? 'Lorem Ipsum' : '');
            if (title) {
                ctx.font = `bold ${state.titleSize}px "${state.titleFont}", serif`;
                const tw = ctx.measureText(title).width;
                let tx = MARGIN_X;
                if (align === 'center') tx = MARGIN_X + (blockWidth - tw) / 2;
                else if (align === 'right') tx = MARGIN_X + (blockWidth - tw);
                ctx.fillText(title, tx, y);
                y += state.titleSize + state.titleSpacing;
            }

            // Poem
            const poemText = state.poem || (isPreviewEmpty()
                ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\nSed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris.'
                : '');
            const poemLines = poemText.split('\n');
            const maxPoemWidth = blockWidth;
            const maxPoemHeight = HEIGHT - y - MARGIN_TOP;

            let fontSize, wrappedLines;
            const columnGap = 100;
            const columnWidth = (maxPoemWidth - columnGap) / 2;

            // Draw the poem split into two balanced columns at a given size
            const drawTwoColumns = (size) => {
                const wl = wrapTextLines(ctx, poemLines, columnWidth, size, state.fontFamily);
                const mid = Math.ceil(wl.length / 2);
                drawWrappedLines(ctx, wl.slice(0, mid), MARGIN_X, y, columnWidth, size, state.fontFamily, state.lineSpacing, align, lineHeightFactor);
                drawWrappedLines(ctx, wl.slice(mid), MARGIN_X + columnWidth + columnGap, y, columnWidth, size, state.fontFamily, state.lineSpacing, align, lineHeightFactor);
            };
            const drawOneColumn = (size, wl) => {
                drawWrappedLines(ctx, wl, MARGIN_X, y, maxPoemWidth, size, state.fontFamily, state.lineSpacing, align, lineHeightFactor);
            };

            if (state.forceSize) {
                fontSize = state.fontSize;
                wrappedLines = wrapTextLines(ctx, poemLines, maxPoemWidth, fontSize, state.fontFamily);
                let totalHeight = 0;
                for (const line of wrappedLines) {
                    totalHeight += fontSize * lineHeightFactor;
                    if (line.isParagraphEnd) totalHeight += state.lineSpacing;
                }
                // 'auto' splits only when the text overflows; '1'/'2' force the choice
                const wantTwo = state.columns === '2' || (state.columns === 'auto' && totalHeight > maxPoemHeight);
                if (wantTwo) drawTwoColumns(fontSize);
                else drawOneColumn(fontSize, wrappedLines);
            } else {
                const single = findOptimalFontSize(ctx, poemLines, maxPoemWidth, maxPoemHeight, state.fontSize, state.fontFamily, state.lineSpacing, lineHeightFactor);
                fontSize = single.fontSize;
                wrappedLines = single.wrappedLines;
                // 'auto' splits when the single column shrinks too much; '1'/'2' force it
                const wantTwo = state.columns === '2' || (state.columns === 'auto' && fontSize < state.fontSize * 0.7);
                if (wantTwo) {
                    const columns = findOptimalFontSize(ctx, poemLines, columnWidth, maxPoemHeight, state.fontSize, state.fontFamily, state.lineSpacing, lineHeightFactor);
                    fontSize = columns.fontSize;
                    drawTwoColumns(fontSize);
                } else {
                    drawOneColumn(fontSize, wrappedLines);
                }
            }

            // Watermark / signature (drawn last, no shadow, own opacity)
            if (state.watermarkEnabled && state.watermarkText.trim()) {
                ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
                if (supportsLetterSpacing) ctx.letterSpacing = '0px';
                ctx.globalAlpha = state.watermarkOpacity / 100;
                ctx.fillStyle = state.textColor;
                const wmSize = Math.round(WIDTH * 0.022);
                ctx.font = `600 ${wmSize}px "Montserrat", sans-serif`;
                ctx.textBaseline = 'alphabetic';
                const wmText = state.watermarkText.trim();
                const wmW = ctx.measureText(wmText).width;
                ctx.fillText(wmText, (WIDTH - wmW) / 2, HEIGHT - MARGIN_TOP * 0.42);
                ctx.globalAlpha = 1;
            }

            const dataUrl = canvas.toDataURL('image/png');
            currentImageUrl = dataUrl;
            document.getElementById('preview').src = dataUrl;
            document.getElementById('previewMeta').textContent = `${WIDTH} × ${HEIGHT}`;
        }

        function isPreviewEmpty() { return !state.title && !state.poem; }

        async function updatePreview() {
            try {
                // Ensure web fonts are ready so the canvas measures/draws correctly
                if (document.fonts && document.fonts.load) {
                    await Promise.all([
                        document.fonts.load(`bold ${state.titleSize}px "${state.titleFont}"`),
                        document.fonts.load(`${state.fontSize}px "${state.fontFamily}"`),
                    ]).catch(() => {});
                }
                generateImage();
            } catch (error) {
                console.error('Error al generar la imagen:', error);
            }
        }

        function scheduleUpdate() {
            if (updateTimeout) clearTimeout(updateTimeout);
            updateTimeout = setTimeout(updatePreview, 200);
        }

        // ========================================================================
        //  PERSISTENCE
        // ========================================================================
        function saveState() {
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
        }
        function loadState() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (raw) state = { ...DEFAULTS, ...JSON.parse(raw) };
            } catch (e) { state = { ...DEFAULTS }; }
        }

        // ========================================================================
        //  UI BUILDERS
        // ========================================================================
        function buildFonts() {
            const opts = FONTS.map(f => `<option value="${f.family}">${f.label}</option>`).join('');
            document.getElementById('titleFont').innerHTML = opts;
            document.getElementById('fontFamily').innerHTML = opts;
        }

        function buildRatios() {
            const grid = document.getElementById('ratioGrid');
            grid.innerHTML = RATIOS.map(r => {
                const maxDim = 40;
                const scale = maxDim / Math.max(r.w, r.h);
                const bw = Math.round(r.w * scale), bh = Math.round(r.h * scale);
                return `<div class="ratio" data-ratio="${r.key}">
                    <div class="ratio-box" style="width:${bw}px;height:${bh}px"></div>
                    <div class="ratio-label">${r.label}</div>
                </div>`;
            }).join('');
            grid.querySelectorAll('.ratio').forEach(el => {
                el.addEventListener('click', () => {
                    state.ratio = el.dataset.ratio;
                    syncRatioUI();
                    apply();
                });
            });
        }

        function buildPresets() {
            const grid = document.getElementById('presetGrid');
            grid.innerHTML = THEMES.map(t => {
                const swatch = t.bgType === 'gradient'
                    ? `background:linear-gradient(135deg, ${t.bg}, ${t.bg2})`
                    : `background:${t.bg}`;
                return `<div class="preset" data-theme="${t.key}">
                    <div class="preset-swatch" style="${swatch}"><span style="color:${t.text};font-family:'${t.titleFont}'">Aa</span></div>
                    <div class="preset-name">${t.name}</div>
                </div>`;
            }).join('');
            grid.querySelectorAll('.preset').forEach(el => {
                el.addEventListener('click', () => applyTheme(el.dataset.theme));
            });
        }

        function applyTheme(key) {
            const t = THEMES.find(x => x.key === key);
            if (!t) return;
            state.theme = key;
            state.bgType = t.bgType;
            state.backgroundColor = t.bg;
            state.backgroundColor2 = t.bg2;
            state.textColor = t.text;
            state.titleFont = t.titleFont;
            state.fontFamily = t.bodyFont;
            syncControlsFromState();
            apply();
            showToast(`Tema "${t.name}" aplicado`);
        }

        // ========================================================================
        //  STATE <-> CONTROLS SYNC
        // ========================================================================
        function syncRatioUI() {
            document.querySelectorAll('.ratio').forEach(el => el.classList.toggle('active', el.dataset.ratio === state.ratio));
        }
        function syncSegmented(id, val) {
            document.querySelectorAll(`#${id} button`).forEach(b => b.classList.toggle('active', b.dataset.val === val));
        }
        function syncBgTypeVisibility() {
            const grad = state.bgType === 'gradient';
            document.getElementById('bgColor2Group').style.display = grad ? '' : 'none';
            document.getElementById('gradientAngleGroup').style.display = grad ? '' : 'none';
            document.getElementById('bgColorLabel').textContent = grad ? 'Color inicial' : 'Color de fondo';
        }
        function syncConditionalControls() {
            document.getElementById('shadowControls').style.display = state.shadowEnabled ? '' : 'none';
            document.getElementById('borderControls').style.display = state.borderEnabled ? '' : 'none';
            document.getElementById('watermarkControls').style.display = state.watermarkEnabled ? '' : 'none';
        }

        // Push state -> all DOM controls (used on load and theme apply)
        function syncControlsFromState() {
            const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
            set('title', state.title);
            set('poem', state.poem);
            set('titleFont', state.titleFont);
            set('fontFamily', state.fontFamily);
            set('fontSize', state.fontSize);
            set('titleSize', state.titleSize);
            set('titleSpacing', state.titleSpacing);
            set('lineSpacing', state.lineSpacing);
            set('lineHeight', state.lineHeight);
            set('marginX', state.marginX);
            set('marginTop', state.marginTop);
            set('letterSpacing', state.letterSpacing);
            set('backgroundColor', state.backgroundColor);
            set('backgroundColorHex', state.backgroundColor);
            set('backgroundColor2', state.backgroundColor2);
            set('backgroundColor2Hex', state.backgroundColor2);
            set('gradientAngle', state.gradientAngle);
            set('textColor', state.textColor);
            set('textColorHex', state.textColor);
            set('borderColor', state.borderColor);
            set('borderColorHex', state.borderColor);
            set('borderWidth', state.borderWidth);
            set('shadowBlur', state.shadowBlur);
            set('watermarkText', state.watermarkText);
            set('watermarkOpacity', state.watermarkOpacity);
            document.getElementById('forceSize').checked = state.forceSize;
            document.getElementById('shadowEnabled').checked = state.shadowEnabled;
            document.getElementById('borderEnabled').checked = state.borderEnabled;
            document.getElementById('watermarkEnabled').checked = state.watermarkEnabled;

            syncSegmented('bgTypeSeg', state.bgType);
            syncSegmented('alignSeg', state.align);
            syncSegmented('columnsSeg', state.columns);
            syncRatioUI();
            syncBgTypeVisibility();
            syncConditionalControls();
            document.querySelectorAll('.preset').forEach(el => el.classList.toggle('active', el.dataset.theme === state.theme));
            updateRangeLabels();
        }

        function updateRangeLabels() {
            document.getElementById('fontSizeValue').textContent = state.fontSize + ' px';
            document.getElementById('titleSizeValue').textContent = state.titleSize + ' px';
            document.getElementById('titleSpacingValue').textContent = state.titleSpacing + ' px';
            document.getElementById('lineSpacingValue').textContent = state.lineSpacing + ' px';
            document.getElementById('lineHeightValue').textContent = (state.lineHeight / 100).toFixed(2) + '×';
            document.getElementById('marginXValue').textContent = state.marginX + ' px';
            document.getElementById('marginTopValue').textContent = state.marginTop + ' px';
            document.getElementById('letterSpacingValue').textContent = state.letterSpacing + ' px';
            document.getElementById('gradientAngleValue').textContent = state.gradientAngle + '°';
            document.getElementById('shadowBlurValue').textContent = state.shadowBlur + ' px';
            document.getElementById('borderWidthValue').textContent = state.borderWidth + ' px';
            document.getElementById('watermarkOpacityValue').textContent = state.watermarkOpacity + '%';
        }

        // Central apply: refresh labels, persist, re-render
        function apply() {
            updateRangeLabels();
            saveState();
            updatePreview();
        }
        function applyDebounced() {
            updateRangeLabels();
            saveState();
            scheduleUpdate();
        }

        // ========================================================================
        //  EVENT WIRING
        // ========================================================================
        function bindRange(id, key, immediate) {
            const el = document.getElementById(id);
            el.addEventListener('input', () => {
                state[key] = parseInt(el.value, 10);
                immediate ? apply() : applyDebounced();
            });
        }
        function bindColor(colorId, hexId, key) {
            const color = document.getElementById(colorId);
            const hex = document.getElementById(hexId);
            color.addEventListener('input', () => { state[key] = color.value; hex.value = color.value; apply(); });
            hex.addEventListener('input', () => {
                if (/^#[0-9A-Fa-f]{6}$/.test(hex.value)) { state[key] = hex.value; color.value = hex.value; apply(); }
            });
        }
        function bindSegmented(segId, key) {
            document.querySelectorAll(`#${segId} button`).forEach(btn => {
                btn.addEventListener('click', () => {
                    state[key] = btn.dataset.val;
                    syncSegmented(segId, btn.dataset.val);
                    if (key === 'bgType') syncBgTypeVisibility();
                    apply();
                });
            });
        }
        function bindToggle(id, key, onChange) {
            const el = document.getElementById(id);
            el.addEventListener('change', () => {
                state[key] = el.checked;
                if (onChange) onChange();
                apply();
            });
        }

        function wireEvents() {
            // Content
            document.getElementById('title').addEventListener('input', e => { state.title = e.target.value; applyDebounced(); });
            document.getElementById('poem').addEventListener('input', e => { state.poem = e.target.value; applyDebounced(); });

            // Fonts
            document.getElementById('titleFont').addEventListener('change', e => { state.titleFont = e.target.value; apply(); });
            document.getElementById('fontFamily').addEventListener('change', e => { state.fontFamily = e.target.value; apply(); });

            // Ranges
            bindRange('fontSize', 'fontSize', true);
            bindRange('titleSize', 'titleSize', false);
            bindRange('titleSpacing', 'titleSpacing', false);
            bindRange('lineSpacing', 'lineSpacing', false);
            bindRange('lineHeight', 'lineHeight', false);
            bindRange('marginX', 'marginX', false);
            bindRange('marginTop', 'marginTop', false);
            bindRange('letterSpacing', 'letterSpacing', false);
            bindRange('gradientAngle', 'gradientAngle', false);
            bindRange('shadowBlur', 'shadowBlur', false);
            bindRange('borderWidth', 'borderWidth', false);
            bindRange('watermarkOpacity', 'watermarkOpacity', false);

            // Colors
            bindColor('backgroundColor', 'backgroundColorHex', 'backgroundColor');
            bindColor('backgroundColor2', 'backgroundColor2Hex', 'backgroundColor2');
            bindColor('textColor', 'textColorHex', 'textColor');
            bindColor('borderColor', 'borderColorHex', 'borderColor');

            // Segmented
            bindSegmented('bgTypeSeg', 'bgType');
            bindSegmented('alignSeg', 'align');
            bindSegmented('columnsSeg', 'columns');

            // Toggles
            bindToggle('forceSize', 'forceSize');
            bindToggle('shadowEnabled', 'shadowEnabled', syncConditionalControls);
            bindToggle('borderEnabled', 'borderEnabled', syncConditionalControls);
            bindToggle('watermarkEnabled', 'watermarkEnabled', syncConditionalControls);

            // Watermark text
            document.getElementById('watermarkText').addEventListener('input', e => { state.watermarkText = e.target.value; applyDebounced(); });

            // Markdown toolbar
            const poemTextarea = document.getElementById('poem');
            document.getElementById('boldBtn').addEventListener('click', () => applyFormat('**'));
            document.getElementById('italicBtn').addEventListener('click', () => applyFormat('*'));
            document.getElementById('boldItalicBtn').addEventListener('click', () => applyFormat('***'));
            document.getElementById('underlineBtn').addEventListener('click', () => applyFormat('__'));
            document.getElementById('strikeBtn').addEventListener('click', () => applyFormat('~~'));
            document.getElementById('clearFormatBtn').addEventListener('click', clearFormatting);

            // Collapsible sections
            document.querySelectorAll('[data-section] .section-head').forEach(head => {
                head.addEventListener('click', () => head.closest('[data-section]').classList.toggle('collapsed'));
            });

            // Reset
            document.getElementById('resetBtn').addEventListener('click', () => {
                state = { ...DEFAULTS };
                syncControlsFromState();
                apply();
                showToast('Valores restablecidos');
            });

            // Download
            document.getElementById('downloadBtn').addEventListener('click', () => {
                if (!currentImageUrl) return;
                const a = document.createElement('a');
                a.href = currentImageUrl;
                a.download = `${slugify(state.title) || 'poema'}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                showToast('Imagen descargada');
            });

            document.getElementById('poemForm').addEventListener('submit', e => e.preventDefault());
        }

        // ========================================================================
        //  MARKDOWN HELPERS
        // ========================================================================
        function applyFormat(marker) {
            const ta = document.getElementById('poem');
            const start = ta.selectionStart, end = ta.selectionEnd;
            const selectedText = ta.value.substring(start, end);
            if (!selectedText) { showToast('Selecciona texto primero'); return; }
            const before = ta.value.substring(start - marker.length, start);
            const after = ta.value.substring(end, end + marker.length);
            let newText, newCursorPos;
            if (before === marker && after === marker) {
                newText = ta.value.substring(0, start - marker.length) + selectedText + ta.value.substring(end + marker.length);
                newCursorPos = start - marker.length + selectedText.length;
            } else {
                newText = ta.value.substring(0, start) + marker + selectedText + marker + ta.value.substring(end);
                newCursorPos = end + marker.length * 2;
            }
            ta.value = newText;
            state.poem = newText;
            ta.focus();
            ta.setSelectionRange(newCursorPos, newCursorPos);
            applyDebounced();
        }

        function clearFormatting() {
            const ta = document.getElementById('poem');
            const start = ta.selectionStart, end = ta.selectionEnd;
            const text = ta.value;
            const target = start !== end ? text.substring(start, end) : text;
            const cleaned = target.replace(/\*\*\*|\*\*|\*|__|~~/g, '');
            const newText = start !== end ? text.slice(0, start) + cleaned + text.slice(end) : cleaned;
            ta.value = newText;
            state.poem = newText;
            const pos = start !== end ? start + cleaned.length : cleaned.length;
            ta.focus();
            ta.setSelectionRange(pos, pos);
            applyDebounced();
        }

        // ========================================================================
        //  TOAST
        // ========================================================================
        let toastTimeout = null;
        function showToast(msg) {
            const t = document.getElementById('toast');
            t.textContent = msg;
            t.classList.add('show');
            if (toastTimeout) clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => t.classList.remove('show'), 1800);
        }

        // ========================================================================
        //  INIT
        // ========================================================================
        function init() {
            buildFonts();
            buildRatios();
            buildPresets();
            loadState();
            syncControlsFromState();
            wireEvents();
            if (window.lucide) lucide.createIcons();
            updatePreview();
        }

        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => updatePreview());
        }
        window.addEventListener('DOMContentLoaded', init);
    
