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

        // Available fonts. All non-system families are self-hosted (css/fonts.css,
        // no runtime API). `group` is just for visual grouping in the picker.
        const FONTS = [
            // Serif
            { label: 'Playfair Display', family: 'Playfair Display', group: 'Serif' },
            { label: 'Cormorant Garamond', family: 'Cormorant Garamond', group: 'Serif' },
            { label: 'Cormorant', family: 'Cormorant', group: 'Serif' },
            { label: 'Cormorant Upright', family: 'Cormorant Upright', group: 'Serif' },
            { label: 'EB Garamond', family: 'EB Garamond', group: 'Serif' },
            { label: 'Libre Baskerville', family: 'Libre Baskerville', group: 'Serif' },
            { label: 'Lora', family: 'Lora', group: 'Serif' },
            { label: 'Crimson Text', family: 'Crimson Text', group: 'Serif' },
            { label: 'Spectral', family: 'Spectral', group: 'Serif' },
            { label: 'Bitter', family: 'Bitter', group: 'Serif' },
            { label: 'Cardo', family: 'Cardo', group: 'Serif' },
            { label: 'Vollkorn', family: 'Vollkorn', group: 'Serif' },
            { label: 'PT Serif', family: 'PT Serif', group: 'Serif' },
            { label: 'Merriweather', family: 'Merriweather', group: 'Serif' },
            { label: 'Source Serif 4', family: 'Source Serif 4', group: 'Serif' },
            { label: 'Domine', family: 'Domine', group: 'Serif' },
            { label: 'Alegreya', family: 'Alegreya', group: 'Serif' },
            { label: 'Newsreader', family: 'Newsreader', group: 'Serif' },
            { label: 'Marcellus', family: 'Marcellus', group: 'Serif' },
            { label: 'Cinzel', family: 'Cinzel', group: 'Serif' },
            { label: 'Cinzel Decorative', family: 'Cinzel Decorative', group: 'Serif' },
            { label: 'Frank Ruhl Libre', family: 'Frank Ruhl Libre', group: 'Serif' },
            // Caligráficas / display
            { label: 'Dancing Script', family: 'Dancing Script', group: 'Caligráficas' },
            { label: 'Great Vibes', family: 'Great Vibes', group: 'Caligráficas' },
            { label: 'Parisienne', family: 'Parisienne', group: 'Caligráficas' },
            { label: 'Sacramento', family: 'Sacramento', group: 'Caligráficas' },
            { label: 'Pinyon Script', family: 'Pinyon Script', group: 'Caligráficas' },
            { label: 'Tangerine', family: 'Tangerine', group: 'Caligráficas' },
            { label: 'Allura', family: 'Allura', group: 'Caligráficas' },
            { label: 'Italianno', family: 'Italianno', group: 'Caligráficas' },
            { label: 'Petit Formal Script', family: 'Petit Formal Script', group: 'Caligráficas' },
            { label: 'Pacifico', family: 'Pacifico', group: 'Caligráficas' },
            { label: 'Caveat', family: 'Caveat', group: 'Caligráficas' },
            { label: 'Satisfy', family: 'Satisfy', group: 'Caligráficas' },
            // Sans
            { label: 'Montserrat', family: 'Montserrat', group: 'Sans' },
            { label: 'Inter', family: 'Inter', group: 'Sans' },
            { label: 'Ubuntu', family: 'Ubuntu', group: 'Sans' },
            { label: 'Raleway', family: 'Raleway', group: 'Sans' },
            { label: 'Josefin Sans', family: 'Josefin Sans', group: 'Sans' },
            { label: 'Quicksand', family: 'Quicksand', group: 'Sans' },
            { label: 'Poppins', family: 'Poppins', group: 'Sans' },
            { label: 'Nunito', family: 'Nunito', group: 'Sans' },
            { label: 'Work Sans', family: 'Work Sans', group: 'Sans' },
            // Del sistema
            { label: 'Palatino', family: 'Palatino', group: 'Del sistema' },
            { label: 'Georgia', family: 'Georgia', group: 'Del sistema' },
            { label: 'Times New Roman', family: 'Times New Roman', group: 'Del sistema' },
            { label: 'Garamond', family: 'Garamond', group: 'Del sistema' },
            { label: 'Courier New', family: 'Courier New', group: 'Del sistema' },
        ];

        // Theme presets — one click sets colors + fonts
        const THEMES = [
            { key: 'azabache',   name: 'Azabache',   bgType: 'solid',    bg: '#000000', bg2: '#000000', text: '#ffffff', titleFont: 'Palatino', bodyFont: 'Palatino' },
            { key: 'sangre',     name: 'Sangre',     bgType: 'solid',    bg: '#0a0a0a', bg2: '#3a0000', text: '#f5f5f5', titleFont: 'Playfair Display', bodyFont: 'Palatino' },
            { key: 'medianoche', name: 'Medianoche', bgType: 'gradient', bg: '#0d1b2a', bg2: '#1b263b', text: '#e0e1dd', titleFont: 'Playfair Display', bodyFont: 'Lora' },
            { key: 'sepia',      name: 'Sepia',      bgType: 'solid',    bg: '#f4ecd8', bg2: '#e8dcc0', text: '#3a2f1d', titleFont: 'Cormorant Garamond', bodyFont: 'EB Garamond' },
            { key: 'papel',      name: 'Papel',      bgType: 'solid',    bg: '#fbfbf7', bg2: '#ececec', text: '#1a1a1a', titleFont: 'Libre Baskerville', bodyFont: 'Lora' },
            { key: 'bosque',     name: 'Bosque',     bgType: 'gradient', bg: '#14241b', bg2: '#28402f', text: '#e8f0e3', titleFont: 'Cormorant Garamond', bodyFont: 'EB Garamond' },
            { key: 'ocaso',      name: 'Ocaso',      bgType: 'gradient', bg: '#2b1055', bg2: '#7a1f3d', text: '#ffe9d6', titleFont: 'Playfair Display', bodyFont: 'Montserrat' },
            { key: 'tinta',      name: 'Tinta',      bgType: 'solid',    bg: '#1a1a2e', bg2: '#0f0f1a', text: '#e6e6fa', titleFont: 'EB Garamond', bodyFont: 'Lora' },
            { key: 'niebla',     name: 'Niebla',     bgType: 'solid',    bg: '#2c3539', bg2: '#1f262a', text: '#dfe6e9', titleFont: 'Montserrat', bodyFont: 'Inter' },
            { key: 'marfil',     name: 'Marfil',     bgType: 'solid',    bg: '#f5f1ea', bg2: '#e8e0d2', text: '#2b2b2b', titleFont: 'Cormorant Garamond', bodyFont: 'EB Garamond' },
            { key: 'vino',       name: 'Vino',       bgType: 'gradient', bg: '#2b0a14', bg2: '#4a0e1f', text: '#f0d9c0', titleFont: 'Playfair Display', bodyFont: 'Lora' },
            { key: 'oceano',     name: 'Océano',     bgType: 'gradient', bg: '#06283d', bg2: '#1363df', text: '#eaf6ff', titleFont: 'Marcellus', bodyFont: 'Montserrat' },
            { key: 'arena',      name: 'Arena',      bgType: 'solid',    bg: '#e9dcc3', bg2: '#d8c9a8', text: '#4a3b28', titleFont: 'Cardo', bodyFont: 'EB Garamond' },
            { key: 'esmeralda',  name: 'Esmeralda',  bgType: 'solid',    bg: '#0b3d2e', bg2: '#0b3d2e', text: '#e8f5ee', titleFont: 'Cinzel', bodyFont: 'Lora' },
            { key: 'lavanda',    name: 'Lavanda',    bgType: 'solid',    bg: '#2e1a47', bg2: '#2e1a47', text: '#f3e8ff', titleFont: 'Cormorant', bodyFont: 'Quicksand' },
            { key: 'carbon',     name: 'Carbón',     bgType: 'solid',    bg: '#1c1c1c', bg2: '#1c1c1c', text: '#e0e0e0', titleFont: 'Spectral', bodyFont: 'Inter' },
            { key: 'durazno',    name: 'Durazno',    bgType: 'gradient', bg: '#ffb997', bg2: '#f67e7d', text: '#3a1f1f', titleFont: 'Dancing Script', bodyFont: 'Nunito' },
            { key: 'pizarra',    name: 'Pizarra',    bgType: 'solid',    bg: '#2c3e50', bg2: '#2c3e50', text: '#ecf0f1', titleFont: 'Raleway', bodyFont: 'Work Sans' },
            { key: 'rosa',       name: 'Rosa',       bgType: 'solid',    bg: '#fff0f3', bg2: '#ffe0e6', text: '#6a2c3e', titleFont: 'Parisienne', bodyFont: 'Lora' },
            { key: 'pradera',    name: 'Pradera',    bgType: 'solid',    bg: '#eef3e7', bg2: '#dfe8d2', text: '#34492f', titleFont: 'Vollkorn', bodyFont: 'PT Serif' },
            { key: 'estrellada', name: 'Estrellada', bgType: 'gradient', bg: '#0f2027', bg2: '#2c5364', text: '#f0f0f0', titleFont: 'Great Vibes', bodyFont: 'Montserrat' },
            { key: 'oro',        name: 'Oro',        bgType: 'solid',    bg: '#14110a', bg2: '#14110a', text: '#e8c87a', titleFont: 'Cinzel', bodyFont: 'Cormorant Garamond' },
            { key: 'manuscrito', name: 'Manuscrito', bgType: 'solid',    bg: '#f4ecd8', bg2: '#e8dcc0', text: '#3a2f1d', titleFont: 'Tangerine', bodyFont: 'Cardo' },
            { key: 'nocturno',   name: 'Nocturno',   bgType: 'gradient', bg: '#000428', bg2: '#004e92', text: '#e8eefc', titleFont: 'Cormorant Upright', bodyFont: 'Spectral' },
            { key: 'cafe',       name: 'Café',       bgType: 'solid',    bg: '#2c1810', bg2: '#2c1810', text: '#e8d5c4', titleFont: 'Frank Ruhl Libre', bodyFont: 'Bitter' },
        ];

        // Default state
        const DEFAULTS = {
            ratio: 'post',
            title: '', poem: '',
            titleFont: 'Playfair Display', fontFamily: 'Palatino',
            align: 'center',
            valign: 'top',
            columns: 'auto',
            fontSize: 85, titleSize: 120,
            titleSpacing: 120, lineSpacing: 80, lineHeight: 120,
            marginX: 200, marginTop: 250,
            forceSize: true,
            letterSpacing: 0,
            bgType: 'solid', backgroundColor: '#0a0a0a', backgroundColor2: '#3a0000', gradientAngle: 135,
            bgImage: '', bgImageOpacity: 100, bgOverlay: 35,
            textColor: '#f5f5f5',
            shadowEnabled: false, shadowBlur: 14,
            outlineEnabled: false, outlineColor: '#000000', outlineWidth: 6,
            borderEnabled: false, borderColor: '#8b0000', borderWidth: 10,
            watermarkEnabled: false, watermarkText: '@sr.zrro', watermarkOpacity: 45,
            theme: 'sangre',
        };

        let state = { ...DEFAULTS };
        let currentImageUrl = null;
        let updateTimeout = null;
        // Hit map: rectangles (in CANVAS coordinates) for every drawn word, the
        // title, and each stanza, plus the source range each maps back to.
        // Repopulated on every generateImage(). Read by js/interactive.js.
        let hitRegions = [];
        // Background image: decoded <img> kept ready for the canvas. Loaded async
        // from the (data-URL) state.bgImage; bgImageLoadedSrc dedupes reloads.
        let bgImageObj = null, bgImageLoadedSrc = null;
        function loadBgImage(cb) {
            if (!state.bgImage) { bgImageObj = null; bgImageLoadedSrc = null; if (cb) cb(); return; }
            if (state.bgImage === bgImageLoadedSrc && bgImageObj) { if (cb) cb(); return; }
            const img = new Image();
            img.onload = () => { bgImageObj = img; bgImageLoadedSrc = state.bgImage; if (cb) cb(); else updatePreview(); };
            img.onerror = () => { bgImageObj = null; bgImageLoadedSrc = null; };
            img.src = state.bgImage;
        }
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

        // Each segment carries [start, end): its index range within the SOURCE
        // line (markers included), so a drawn word can be mapped back to the
        // exact slice of state.poem it came from.
        function parseFormattedSegments(text) {
            const segments = [];
            let buffer = '';
            let bufStart = -1;
            let i = 0;
            const st = { bold: false, italic: false, underline: false, strike: false };
            const flush = () => { if (buffer.length > 0) { segments.push({ text: buffer, start: bufStart, end: i, ...st }); buffer = ''; bufStart = -1; } };
            while (i < text.length) {
                if (text.startsWith('***', i)) { flush(); st.bold = !st.bold; st.italic = !st.italic; i += 3; continue; }
                if (text.startsWith('**', i))  { flush(); st.bold = !st.bold; i += 2; continue; }
                if (text.startsWith('__', i))  { flush(); st.underline = !st.underline; i += 2; continue; }
                if (text.startsWith('~~', i))  { flush(); st.strike = !st.strike; i += 2; continue; }
                if (text[i] === '*')           { flush(); st.italic = !st.italic; i += 1; continue; }
                if (buffer.length === 0) bufStart = i;
                buffer += text[i]; i += 1;
            }
            flush();
            if (segments.length === 0) segments.push({ text: text || '', start: 0, end: 0, bold: false, italic: false, underline: false, strike: false });
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

        // lineOffset = absolute index of this source line within state.poem, so
        // each produced word carries its absolute [srcStart, srcEnd) range.
        function wrapSegments(ctx, segments, maxWidth, fontSize, fontFamily, lineOffset) {
            const base0 = lineOffset || 0;
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
                let cursor = 0; // offset of the current word within seg.text
                for (let idx = 0; idx < words.length; idx++) {
                    const word = words[idx];
                    const wordOffset = cursor;
                    cursor += word.length + 1; // advance past the word + its split space
                    // Word carries its source range; hyphen pieces inherit the whole word's range.
                    const wbase = {
                        bold: seg.bold, italic: seg.italic, underline: seg.underline, strike: seg.strike,
                        srcStart: base0 + (seg.start || 0) + wordOffset,
                        srcEnd: base0 + (seg.start || 0) + wordOffset + word.length,
                    };
                    const needsSpace = idx > 0 || currentLine.length > 0;
                    const token = needsSpace ? ' ' + word : word;
                    const tokenWidth = measureTextSegment(ctx, { ...wbase, text: token }, fontSize, fontFamily);
                    if (currentWidth + tokenWidth <= maxWidth) { pushSegment(token, wbase); continue; }
                    if (currentLine.length > 0) { lines.push(currentLine); currentLine = []; currentWidth = 0; }
                    const cleanWidth = measureTextSegment(ctx, { ...wbase, text: word }, fontSize, fontFamily);
                    if (cleanWidth <= maxWidth) { pushSegment(word, wbase); continue; }
                    const pieces = hyphenateWord(ctx, word, wbase, fontSize, fontFamily, maxWidth - currentWidth, maxWidth);
                    for (const piece of pieces) {
                        const pieceWidth = measureTextSegment(ctx, { ...wbase, text: piece }, fontSize, fontFamily);
                        if (currentWidth + pieceWidth > maxWidth && currentLine.length > 0) {
                            lines.push(currentLine); currentLine = []; currentWidth = 0;
                        }
                        pushSegment(piece, wbase);
                    }
                }
            }
            if (currentLine.length > 0) lines.push(currentLine);
            if (lines.length === 0) lines.push([{ text: '', bold: false, italic: false, underline: false, strike: false, srcStart: -1, srcEnd: -1 }]);
            return lines;
        }

        function wrapTextLines(ctx, lines, maxWidth, fontSize, fontFamily, lineOffsets) {
            const wrapped = [];
            let stanza = 0;
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line.trim() === '') {
                    if (wrapped.length > 0) wrapped[wrapped.length - 1].isParagraphEnd = true;
                    stanza++; // a blank line ends the current stanza
                } else {
                    const segments = parseFormattedSegments(line);
                    const off = lineOffsets ? lineOffsets[i] : 0;
                    const wrappedLine = wrapSegments(ctx, segments, maxWidth, fontSize, fontFamily, off);
                    for (let j = 0; j < wrappedLine.length; j++) {
                        wrapped.push({ segments: wrappedLine[j], isParagraphEnd: false, stanza: stanza });
                    }
                }
            }
            return wrapped;
        }

        function findOptimalFontSize(ctx, lines, maxWidth, maxHeight, initialSize, fontFamily, paragraphSpacing, lineHeightFactor, lineOffsets) {
            let size = initialSize;
            let wrappedLines = [];
            while (size >= 40) {
                wrappedLines = wrapTextLines(ctx, lines, maxWidth, size, fontFamily, lineOffsets);
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

        // Draw text with an optional outline (stroke behind the fill). Shared by
        // the title and the poem so the outline setting applies everywhere.
        function strokeAndFillText(ctx, text, x, y) {
            if (state.outlineEnabled && state.outlineWidth > 0) {
                ctx.save();
                ctx.lineWidth = state.outlineWidth * 2; // inner half sits under the fill
                ctx.strokeStyle = state.outlineColor;
                ctx.lineJoin = 'round';
                ctx.miterLimit = 2;
                ctx.strokeText(text, x, y);
                ctx.restore();
            }
            ctx.fillText(text, x, y);
        }

        function drawFormattedLine(ctx, lineSegments, x, y, fontSize, fontFamily) {
            let cursorX = x;
            for (const seg of lineSegments) {
                ctx.font = getFontStyle(seg, fontSize, fontFamily);
                strokeAndFillText(ctx, seg.text, cursorX, y);
                const width = ctx.measureText(seg.text).width;
                if (seg.underline) ctx.fillRect(cursorX, y + fontSize * 0.9, width, Math.max(1, fontSize * 0.05));
                if (seg.strike)    ctx.fillRect(cursorX, y + fontSize * 0.45, width, Math.max(1, fontSize * 0.05));
                // Register a clickable word region (only for real poem text).
                // Trim the leading/trailing space the wrapper added between words
                // so the hit area (and highlight) hugs just the glyphs.
                if (state.poem && seg.srcStart != null && seg.srcStart >= 0 && seg.text.trim()) {
                    const lead = seg.text.length - seg.text.replace(/^\s+/, '').length;
                    const trail = seg.text.length - seg.text.replace(/\s+$/, '').length;
                    const leadW = lead ? ctx.measureText(seg.text.slice(0, lead)).width : 0;
                    const trailW = trail ? ctx.measureText(seg.text.slice(seg.text.length - trail)).width : 0;
                    hitRegions.push({
                        type: 'word', x: cursorX + leadW, y: y, w: Math.max(1, width - leadW - trailW), h: fontSize,
                        srcStart: seg.srcStart, srcEnd: seg.srcEnd,
                        bold: !!seg.bold, italic: !!seg.italic, underline: !!seg.underline, strike: !!seg.strike,
                    });
                }
                cursorX += width;
            }
        }

        function drawWrappedLines(ctx, wrappedLines, startX, startY, blockWidth, fontSize, fontFamily, paragraphSpacing, align, lineHeightFactor) {
            const baseLineHeight = fontSize * lineHeightFactor;
            let y = startY;
            const stanzas = {}; // stanza index -> bounding box + source range (this column)
            for (const lineObj of wrappedLines) {
                const lw = lineWidth(ctx, lineObj.segments, fontSize, fontFamily);
                let x = startX;
                if (align === 'center') x = startX + (blockWidth - lw) / 2;
                else if (align === 'right') x = startX + (blockWidth - lw);
                drawFormattedLine(ctx, lineObj.segments, x, y, fontSize, fontFamily);
                const s = lineObj.stanza || 0;
                let st = stanzas[s];
                if (!st) st = stanzas[s] = { minY: y, maxY: y + fontSize, minSrc: Infinity, maxSrc: -Infinity };
                st.maxY = y + fontSize;
                for (const seg of lineObj.segments) {
                    if (seg.srcStart != null && seg.srcStart >= 0) {
                        if (seg.srcStart < st.minSrc) st.minSrc = seg.srcStart;
                        if (seg.srcEnd > st.maxSrc) st.maxSrc = seg.srcEnd;
                    }
                }
                y += baseLineHeight;
                if (lineObj.isParagraphEnd) y += paragraphSpacing;
            }
            // Register one stanza region per stanza drawn in this column.
            if (state.poem) {
                for (const k in stanzas) {
                    const st = stanzas[k];
                    if (st.maxSrc >= 0) hitRegions.push({ type: 'stanza', x: startX, y: st.minY, w: blockWidth, h: st.maxY - st.minY, srcStart: st.minSrc, srcEnd: st.maxSrc });
                }
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

            // Background photo: cover-fit (centred crop) over the base color, with
            // its own opacity and an optional dark overlay for text legibility.
            if (state.bgType === 'image' && bgImageObj && bgImageObj.complete && bgImageObj.naturalWidth) {
                const iw = bgImageObj.naturalWidth, ih = bgImageObj.naturalHeight;
                const scale = Math.max(w / iw, h / ih);
                const dw = iw * scale, dh = ih * scale;
                ctx.save();
                ctx.globalAlpha = Math.max(0, Math.min(1, (state.bgImageOpacity == null ? 100 : state.bgImageOpacity) / 100));
                ctx.drawImage(bgImageObj, (w - dw) / 2, (h - dh) / 2, dw, dh);
                ctx.restore();
                const ov = (state.bgOverlay || 0) / 100;
                if (ov > 0) { ctx.fillStyle = 'rgba(0,0,0,' + ov + ')'; ctx.fillRect(0, 0, w, h); }
            }
        }

        function generateImage() {
            const ratio = getRatio();
            const WIDTH = ratio.w, HEIGHT = ratio.h;
            const canvas = document.getElementById('canvas');
            canvas.width = WIDTH;
            canvas.height = HEIGHT;
            const ctx = canvas.getContext('2d');

            hitRegions = []; // rebuilt as we draw the title and poem

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

            // ----- Poem source + per-line offsets (for hit mapping) -----
            const title = state.title || (isPreviewEmpty() ? 'Lorem Ipsum' : '');
            const poemText = state.poem || (isPreviewEmpty()
                ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\nSed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris.'
                : '');
            const poemLines = poemText.split('\n');
            const maxPoemWidth = blockWidth;
            const lineOffsets = [];
            { let acc = 0; for (let li = 0; li < poemLines.length; li++) { lineOffsets.push(acc); acc += poemLines[li].length + 1; } }

            const columnGap = 100;
            const columnWidth = (maxPoemWidth - columnGap) / 2;
            const titleBlock = title ? (state.titleSize + state.titleSpacing) : 0;
            const maxPoemHeight = HEIGHT - 2 * MARGIN_TOP - titleBlock;
            const wrappedHeight = (wl, size) => {
                let h = 0;
                for (const line of wl) { h += size * lineHeightFactor; if (line.isParagraphEnd) h += state.lineSpacing; }
                return h;
            };

            // ----- Decide layout (font size + columns) WITHOUT drawing yet -----
            let fontSize, wantTwo, wlSingle = null, colFull = null, colMid = 0, poemHeight = 0;
            if (state.forceSize) {
                fontSize = state.fontSize;
                wlSingle = wrapTextLines(ctx, poemLines, maxPoemWidth, fontSize, state.fontFamily, lineOffsets);
                wantTwo = state.columns === '2' || (state.columns === 'auto' && wrappedHeight(wlSingle, fontSize) > maxPoemHeight);
            } else {
                const single = findOptimalFontSize(ctx, poemLines, maxPoemWidth, maxPoemHeight, state.fontSize, state.fontFamily, state.lineSpacing, lineHeightFactor, lineOffsets);
                fontSize = single.fontSize; wlSingle = single.wrappedLines;
                wantTwo = state.columns === '2' || (state.columns === 'auto' && fontSize < state.fontSize * 0.7);
                if (wantTwo) {
                    const columns = findOptimalFontSize(ctx, poemLines, columnWidth, maxPoemHeight, state.fontSize, state.fontFamily, state.lineSpacing, lineHeightFactor, lineOffsets);
                    fontSize = columns.fontSize;
                }
            }
            if (wantTwo) {
                colFull = wrapTextLines(ctx, poemLines, columnWidth, fontSize, state.fontFamily, lineOffsets);
                colMid = Math.ceil(colFull.length / 2);
                poemHeight = wrappedHeight(colFull.slice(0, colMid), fontSize);
            } else {
                poemHeight = wrappedHeight(wlSingle, fontSize);
            }

            // ----- Vertical alignment of the whole content block -----
            const totalHeight = titleBlock + poemHeight;
            let contentTop = MARGIN_TOP;
            if (state.valign === 'center') contentTop = Math.max(MARGIN_TOP, (HEIGHT - totalHeight) / 2);
            else if (state.valign === 'bottom') contentTop = Math.max(MARGIN_TOP, HEIGHT - MARGIN_TOP - totalHeight);

            // ----- Title -----
            if (title) {
                ctx.font = `bold ${state.titleSize}px "${state.titleFont}", serif`;
                const tw = ctx.measureText(title).width;
                let tx = MARGIN_X;
                if (align === 'center') tx = MARGIN_X + (blockWidth - tw) / 2;
                else if (align === 'right') tx = MARGIN_X + (blockWidth - tw);
                strokeAndFillText(ctx, title, tx, contentTop);
                if (state.title) hitRegions.push({ type: 'title', x: tx, y: contentTop, w: tw, h: state.titleSize });
            }

            // ----- Poem -----
            const poemY = contentTop + titleBlock;
            if (wantTwo) {
                drawWrappedLines(ctx, colFull.slice(0, colMid), MARGIN_X, poemY, columnWidth, fontSize, state.fontFamily, state.lineSpacing, align, lineHeightFactor);
                drawWrappedLines(ctx, colFull.slice(colMid), MARGIN_X + columnWidth + columnGap, poemY, columnWidth, fontSize, state.fontFamily, state.lineSpacing, align, lineHeightFactor);
            } else {
                drawWrappedLines(ctx, wlSingle, MARGIN_X, poemY, maxPoemWidth, fontSize, state.fontFamily, state.lineSpacing, align, lineHeightFactor);
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
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
            catch (e) {
                // Quota exceeded (usually a heavy bg image): persist everything
                // EXCEPT the image so the rest of the settings still survive.
                try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, bgImage: '' })); } catch (e2) {}
            }
        }
        function loadState() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (raw) state = { ...DEFAULTS, ...JSON.parse(raw) };
            } catch (e) { state = { ...DEFAULTS }; }
        }
        // Replace the whole state with a saved snapshot (used by js/library.js).
        // Merges with DEFAULTS so older snapshots stay forward-compatible.
        function applyLoadedState(obj) {
            state = { ...DEFAULTS, ...obj };
            syncControlsFromState();
            apply();
        }
        // Read-only access to the current state for the library to snapshot.
        function getStateSnapshot() { return JSON.parse(JSON.stringify(state)); }

        // ========================================================================
        //  UI BUILDERS
        // ========================================================================
        function buildFonts() {
            // The font selectors are custom dropdowns built by js/fontpicker.js
            // (each option previewed in its own font). Nothing to populate here.
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

        // ----- Custom (user-saved) themes -----
        const CUSTOM_THEMES_KEY = 'poemStudio.themes.v1';
        function loadCustomThemes() {
            try { return JSON.parse(localStorage.getItem(CUSTOM_THEMES_KEY)) || []; } catch (e) { return []; }
        }
        function escapeHtml(s) {
            return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
        }
        function findTheme(key) {
            return THEMES.find(x => x.key === key) || loadCustomThemes().find(x => x.key === key) || null;
        }

        function buildPresets() {
            const grid = document.getElementById('presetGrid');
            const renderOne = (t, custom) => {
                const swatch = t.bgType === 'gradient'
                    ? `background:linear-gradient(135deg, ${t.bg}, ${t.bg2})`
                    : `background:${t.bg}`;
                return `<div class="preset${custom ? ' preset-custom' : ''}" data-theme="${t.key}">
                    ${custom ? `<button type="button" class="preset-del" data-del="${t.key}" title="Borrar tema">&times;</button>` : ''}
                    <div class="preset-swatch" style="${swatch}"><span style="color:${t.text};font-family:'${escapeHtml(t.titleFont)}'">Aa</span></div>
                    <div class="preset-name">${escapeHtml(t.name)}</div>
                </div>`;
            };
            grid.innerHTML = THEMES.map(t => renderOne(t, false)).join('') + loadCustomThemes().map(t => renderOne(t, true)).join('');
            grid.querySelectorAll('.preset').forEach(el => {
                el.addEventListener('click', () => applyTheme(el.dataset.theme));
            });
            grid.querySelectorAll('.preset-del').forEach(b => {
                b.addEventListener('click', e => { e.stopPropagation(); deleteCustomTheme(b.dataset.del); });
            });
        }

        function applyTheme(key) {
            const t = findTheme(key);
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

        // Save the current colours + fonts as a reusable custom theme.
        function saveCustomTheme(name) {
            const arr = loadCustomThemes();
            const t = {
                key: 'u' + Date.now(),
                name: (name || '').trim() || 'Mi tema',
                bgType: state.bgType === 'image' ? 'solid' : state.bgType, // themes don't carry images
                bg: state.backgroundColor, bg2: state.backgroundColor2,
                text: state.textColor, titleFont: state.titleFont, bodyFont: state.fontFamily,
            };
            arr.push(t);
            try { localStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(arr)); }
            catch (e) { showToast('No se pudo guardar el tema'); return; }
            buildPresets();
            showToast(`Tema "${t.name}" guardado`);
        }
        function deleteCustomTheme(key) {
            const arr = loadCustomThemes().filter(t => t.key !== key);
            try { localStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(arr)); } catch (e) {}
            buildPresets();
            showToast('Tema borrado');
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
            const img = state.bgType === 'image';
            document.getElementById('bgColor2Group').style.display = grad ? '' : 'none';
            document.getElementById('gradientAngleGroup').style.display = grad ? '' : 'none';
            document.getElementById('bgImageGroup').style.display = img ? '' : 'none';
            document.getElementById('bgColorLabel').textContent = grad ? 'Color inicial' : 'Color de fondo';
        }
        function syncConditionalControls() {
            document.getElementById('shadowControls').style.display = state.shadowEnabled ? '' : 'none';
            document.getElementById('outlineControls').style.display = state.outlineEnabled ? '' : 'none';
            document.getElementById('borderControls').style.display = state.borderEnabled ? '' : 'none';
            document.getElementById('watermarkControls').style.display = state.watermarkEnabled ? '' : 'none';
        }

        // Push state -> all DOM controls (used on load and theme apply)
        function syncControlsFromState() {
            const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
            set('title', state.title);
            const _poemEl = document.getElementById('poem'); if (_poemEl) _poemEl.value = stripMarkers(state.poem);
            if (window.refreshFontPickers) refreshFontPickers();
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
            set('outlineColor', state.outlineColor);
            set('outlineColorHex', state.outlineColor);
            set('outlineWidth', state.outlineWidth);
            set('shadowBlur', state.shadowBlur);
            set('watermarkText', state.watermarkText);
            set('watermarkOpacity', state.watermarkOpacity);
            document.getElementById('forceSize').checked = state.forceSize;
            document.getElementById('shadowEnabled').checked = state.shadowEnabled;
            document.getElementById('outlineEnabled').checked = state.outlineEnabled;
            document.getElementById('borderEnabled').checked = state.borderEnabled;
            document.getElementById('watermarkEnabled').checked = state.watermarkEnabled;

            set('bgImageOpacity', state.bgImageOpacity);
            set('bgOverlay', state.bgOverlay);
            syncSegmented('bgTypeSeg', state.bgType);
            syncSegmented('alignSeg', state.align);
            syncSegmented('valignSeg', state.valign);
            syncSegmented('columnsSeg', state.columns);
            syncRatioUI();
            syncBgTypeVisibility();
            loadBgImage();
            syncConditionalControls();
            document.querySelectorAll('.preset').forEach(el => el.classList.toggle('active', el.dataset.theme === state.theme));
            updateRangeLabels();
        }

        function updateRangeLabels() {
            document.querySelectorAll('input[type="range"]').forEach(updateRangeFill);
            document.getElementById('fontSizeValue').textContent = state.fontSize + ' px';
            document.getElementById('titleSizeValue').textContent = state.titleSize + ' px';
            document.getElementById('titleSpacingValue').textContent = state.titleSpacing + ' px';
            document.getElementById('lineSpacingValue').textContent = state.lineSpacing + ' px';
            document.getElementById('lineHeightValue').textContent = (state.lineHeight / 100).toFixed(2) + '×';
            document.getElementById('marginXValue').textContent = state.marginX + ' px';
            document.getElementById('marginTopValue').textContent = state.marginTop + ' px';
            document.getElementById('letterSpacingValue').textContent = state.letterSpacing + ' px';
            document.getElementById('gradientAngleValue').textContent = state.gradientAngle + '°';
            document.getElementById('bgImageOpacityValue').textContent = state.bgImageOpacity + '%';
            document.getElementById('bgOverlayValue').textContent = state.bgOverlay + '%';
            document.getElementById('shadowBlurValue').textContent = state.shadowBlur + ' px';
            document.getElementById('borderWidthValue').textContent = state.borderWidth + ' px';
            document.getElementById('outlineWidthValue').textContent = state.outlineWidth + ' px';
            document.getElementById('watermarkOpacityValue').textContent = state.watermarkOpacity + '%';
        }

        // Central apply: refresh labels, persist, re-render
        function apply() {
            updateRangeLabels();
            saveState();
            scheduleHistory();
            updatePreview();
        }
        function applyDebounced() {
            updateRangeLabels();
            saveState();
            scheduleHistory();
            scheduleUpdate();
        }

        // ========================================================================
        //  UNDO / REDO  (coalesced snapshots of `state`)
        // ========================================================================
        let history = [], histIndex = -1, restoringHistory = false, histTimer = null;
        function pushHistory() {
            if (restoringHistory) return;
            const snap = JSON.stringify(state);
            if (history[histIndex] === snap) return;     // no real change
            history = history.slice(0, histIndex + 1);    // drop the redo branch
            history.push(snap);
            if (history.length > 60) history.shift();      // cap memory
            histIndex = history.length - 1;
        }
        function scheduleHistory() {
            if (restoringHistory) return;
            if (histTimer) clearTimeout(histTimer);
            histTimer = setTimeout(pushHistory, 450);      // coalesce rapid edits
        }
        function restoreHistory(snap) {
            restoringHistory = true;
            if (histTimer) { clearTimeout(histTimer); histTimer = null; }
            state = JSON.parse(snap);
            syncControlsFromState();                        // also reloads the bg image
            saveState();
            updatePreview();
            restoringHistory = false;
        }
        function undo() {
            if (histIndex <= 0) { showToast('Nada para deshacer'); return; }
            histIndex--; restoreHistory(history[histIndex]); showToast('Deshecho');
        }
        function redo() {
            if (histIndex >= history.length - 1) { showToast('Nada para rehacer'); return; }
            histIndex++; restoreHistory(history[histIndex]); showToast('Rehecho');
        }

        // ========================================================================
        //  EVENT WIRING
        // ========================================================================
        function updateRangeFill(el) {
            const min = parseFloat(el.min) || 0;
            const max = parseFloat(el.max) || 100;
            const pct = ((el.value - min) / (max - min)) * 100;
            el.style.setProperty('--range-progress', pct + '%');
        }
        function bindRange(id, key, immediate) {
            const el = document.getElementById(id);
            updateRangeFill(el);
            el.addEventListener('input', () => {
                state[key] = parseInt(el.value, 10);
                updateRangeFill(el);
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
            document.getElementById('poem').addEventListener('input', e => { state.poem = reconcilePoem(state.poem, e.target.value); applyDebounced(); });

            // Fonts
            // Font selection is handled by the custom pickers (js/fontpicker.js).

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
            bindRange('outlineWidth', 'outlineWidth', false);
            bindRange('borderWidth', 'borderWidth', false);
            bindRange('watermarkOpacity', 'watermarkOpacity', false);
            bindRange('bgImageOpacity', 'bgImageOpacity', false);
            bindRange('bgOverlay', 'bgOverlay', false);

            // Colors
            bindColor('backgroundColor', 'backgroundColorHex', 'backgroundColor');
            bindColor('backgroundColor2', 'backgroundColor2Hex', 'backgroundColor2');
            bindColor('textColor', 'textColorHex', 'textColor');
            bindColor('borderColor', 'borderColorHex', 'borderColor');
            bindColor('outlineColor', 'outlineColorHex', 'outlineColor');

            // Background image upload / remove
            document.getElementById('bgImageInput').addEventListener('change', e => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                    state.bgImage = reader.result;
                    state.bgType = 'image';
                    syncSegmented('bgTypeSeg', 'image');
                    syncBgTypeVisibility();
                    loadBgImage(() => apply());
                };
                reader.readAsDataURL(file);
                e.target.value = ''; // allow re-uploading the same file
            });
            document.getElementById('bgImageRemove').addEventListener('click', () => {
                state.bgImage = '';
                bgImageObj = null; bgImageLoadedSrc = null;
                apply();
                showToast('Imagen quitada');
            });

            // Segmented
            bindSegmented('bgTypeSeg', 'bgType');
            bindSegmented('alignSeg', 'align');
            bindSegmented('valignSeg', 'valign');
            bindSegmented('columnsSeg', 'columns');

            // Toggles
            bindToggle('forceSize', 'forceSize');
            bindToggle('shadowEnabled', 'shadowEnabled', syncConditionalControls);
            bindToggle('outlineEnabled', 'outlineEnabled', syncConditionalControls);
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

            // Save current colours + fonts as a custom theme
            const themeSave = () => { const inp = document.getElementById('themeName'); saveCustomTheme(inp.value); inp.value = ''; };
            document.getElementById('themeSaveBtn').addEventListener('click', themeSave);
            document.getElementById('themeName').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); themeSave(); } });

            // Undo / redo (buttons + keyboard shortcuts)
            document.getElementById('undoBtn').addEventListener('click', undo);
            document.getElementById('redoBtn').addEventListener('click', redo);
            document.addEventListener('keydown', e => {
                const mod = e.metaKey || e.ctrlKey;
                if (!mod) return;
                const k = e.key.toLowerCase();
                if (k === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
                else if (k === 'y' || (k === 'z' && e.shiftKey)) { e.preventDefault(); redo(); }
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
                downloadDataUrl(currentImageUrl, `${slugify(state.title) || 'poema'}.png`);
                showToast('Imagen descargada');
            });

            // Copy to clipboard
            document.getElementById('copyBtn').addEventListener('click', copyImage);

            // Share (mobile) — only shown when the Web Share API can share files
            const shareBtn = document.getElementById('shareBtn');
            if (navigator.share && navigator.canShare) {
                shareBtn.style.display = '';
                shareBtn.addEventListener('click', shareImage);
            }

            document.getElementById('poemForm').addEventListener('submit', e => e.preventDefault());
        }

        // ========================================================================
        //  EXPORT / SHARE
        // ========================================================================
        function downloadDataUrl(url, filename) {
            const a = document.createElement('a');
            a.href = url; a.download = filename;
            document.body.appendChild(a); a.click(); document.body.removeChild(a);
        }

        function copyImage() {
            const canvas = document.getElementById('canvas');
            if (!navigator.clipboard || !window.ClipboardItem) { showToast('Tu navegador no permite copiar imágenes'); return; }
            canvas.toBlob(async (blob) => {
                try {
                    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                    showToast('Imagen copiada al portapapeles');
                } catch (e) { showToast('No se pudo copiar la imagen'); }
            }, 'image/png');
        }

        function shareImage() {
            const canvas = document.getElementById('canvas');
            canvas.toBlob(async (blob) => {
                const file = new File([blob], `${slugify(state.title) || 'poema'}.png`, { type: 'image/png' });
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    try { await navigator.share({ files: [file], title: state.title || 'Poema' }); }
                    catch (e) { /* user cancelled */ }
                } else { showToast('Compartir no está disponible aquí'); }
            }, 'image/png');
        }

        // ========================================================================
        //  MARKDOWN HELPERS
        // ========================================================================
        // ----- Plain <-> marked text bridge -------------------------------------
        // The textarea shows CLEAN text (no markdown markers); state.poem keeps the
        // markers so the engine still knows what to style. These helpers translate
        // between the two so edits in either place stay in sync.
        function markedToPlain(marked) {
            let plain = '';
            const map = []; // map[i] = index in `marked` of the i-th plain char
            let i = 0;
            while (i < marked.length) {
                if (marked.startsWith('***', i)) { i += 3; continue; }
                if (marked.startsWith('**', i))  { i += 2; continue; }
                if (marked.startsWith('__', i))  { i += 2; continue; }
                if (marked.startsWith('~~', i))  { i += 2; continue; }
                if (marked[i] === '*')           { i += 1; continue; }
                map.push(i); plain += marked[i]; i += 1;
            }
            map.push(marked.length); // end sentinel
            return { plain, map };
        }
        function stripMarkers(marked) { return markedToPlain(marked).plain; }

        // Rebuild the marked source after the user edited the clean textarea: keep
        // markers outside the edited span, replace the changed middle with the
        // freshly typed (plain) text. Common prefix/suffix diff.
        function reconcilePoem(oldMarked, newPlain) {
            const { plain: oldPlain, map } = markedToPlain(oldMarked);
            if (newPlain === oldPlain) return oldMarked;
            let p = 0;
            const maxP = Math.min(oldPlain.length, newPlain.length);
            while (p < maxP && oldPlain[p] === newPlain[p]) p++;
            let s = 0;
            const maxS = Math.min(oldPlain.length - p, newPlain.length - p);
            while (s < maxS && oldPlain[oldPlain.length - 1 - s] === newPlain[newPlain.length - 1 - s]) s++;
            const inserted = newPlain.slice(p, newPlain.length - s);
            return oldMarked.slice(0, map[p]) + inserted + oldMarked.slice(map[oldPlain.length - s]);
        }

        // Toolbar formatting: the selection is in PLAIN coordinates; map it to the
        // marked source and toggle there. The textarea stays clean.
        function applyFormat(marker) {
            const ta = document.getElementById('poem');
            const ps = ta.selectionStart, pe = ta.selectionEnd;
            if (ps === pe) { showToast('Selecciona texto primero'); return; }
            const { map } = markedToPlain(state.poem);
            applyFormatToRange(marker, map[ps], map[pe]);
            ta.focus();
            ta.setSelectionRange(ps, pe);
        }

        // Apply/toggle a markdown marker around an arbitrary [start,end) range of
        // state.poem. Used by the on-image editing bubbles (js/interactive.js).
        function applyFormatToRange(marker, start, end) {
            const text = state.poem;
            if (start == null || end == null || start < 0 || end > text.length || start >= end) return;
            const before = text.substring(start - marker.length, start);
            const after = text.substring(end, end + marker.length);
            let newText;
            if (before === marker && after === marker) {
                newText = text.substring(0, start - marker.length) + text.substring(start, end) + text.substring(end + marker.length);
            } else {
                newText = text.substring(0, start) + marker + text.substring(start, end) + marker + text.substring(end);
            }
            state.poem = newText;
            const ta = document.getElementById('poem');
            if (ta) ta.value = stripMarkers(newText); // textarea stays clean
            apply(); // immediate re-render so the hit map refreshes
        }

        // Remove all markdown formatting from the selection (or the whole poem).
        // Selection is in PLAIN coordinates; map it into the marked source.
        function clearFormatting() {
            const ta = document.getElementById('poem');
            const ps = ta.selectionStart, pe = ta.selectionEnd;
            const re = /\*\*\*|\*\*|\*|__|~~/g;
            if (ps !== pe) {
                const { map } = markedToPlain(state.poem);
                const ms = map[ps], me = map[pe];
                state.poem = state.poem.slice(0, ms) + state.poem.slice(ms, me).replace(re, '') + state.poem.slice(me);
            } else {
                state.poem = state.poem.replace(re, '');
            }
            const plain = markedToPlain(state.poem).plain;
            ta.value = plain;
            ta.focus();
            ta.setSelectionRange(Math.min(ps, plain.length), Math.min(pe, plain.length));
            apply();
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
            pushHistory(); // seed the initial state so the first undo has a target
        }

        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => updatePreview());
        }
        window.addEventListener('DOMContentLoaded', init);
    
