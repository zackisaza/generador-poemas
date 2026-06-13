# CLAUDE.md — Contexto del proyecto

Guía para cualquier agente (o persona) que trabaje en este repo. Leéla antes de tocar código.

## Qué es

**Instagrameador de poemas del Fantástico Sr. Zorro** — un "estudio de composición" 100% en el navegador, sin build ni backend, que convierte un poema en una imagen PNG lista para Instagram. Todo el render ocurre en un `<canvas>` y la imagen se descarga como PNG.

- Sin frameworks, sin bundler, sin dependencias de build. Es HTML + CSS + JS plano.
- Dependencia externa en runtime: solo **Lucide** (iconos, por CDN). Las **tipografías son self-hosted** (`css/fonts.css` + `fonts/*.woff2`, 43 familias, sin API de Google).
- Estado del usuario persistido en `localStorage` (clave `poemStudio.v2`).
- Idioma del producto: **español**. La UI, los textos y esta documentación van en español; los comentarios dentro del código están en inglés.

## Cómo correr

No requiere build. Abrí `index.html` en el navegador. Para evitar restricciones de `file://` con las fuentes/iconos, conviene servirlo:

```bash
python3 -m http.server 8000
# luego abrir http://localhost:8000
```

Necesita conexión a internet la primera vez (Lucide + Google Fonts por CDN).

## Estructura

```
generador-poemas/
├── index.html        # Markup: topbar, panel de controles (secciones), panel de preview, footer
├── manifest.webmanifest # PWA: instalable
├── sw.js              # Service worker: cachea el shell + CDN para uso offline
├── icon.svg           # Ícono de la app / PWA (la marca)
├── fonts/             # Tipografías self-hosted (.woff2) — sin API de Google
├── css/
│   ├── styles.css     # Todo el estilo: design tokens, tema claro, tabs, responsive, animaciones
│   └── fonts.css      # @font-face de las fuentes self-hosted (generado al descargarlas)
└── js/
    ├── engine.js      # Motor del canvas + estado + wiring de controles + persistencia
    ├── fontpicker.js  # Dropdown custom de fuentes (cada opción en su propia fuente). Independiente.
    ├── animations.js  # Capa de animación (entrada con stagger, pulse del preview). Independiente.
    ├── tabs.js        # Convierte las 7 secciones en pestañas (tabs desktop + bottom-nav móvil). Independiente.
    ├── interactive.js # Edición directa sobre la imagen del preview (burbujas). Independiente.
    └── library.js     # Composiciones guardadas (guardar/cargar/borrar piezas). Independiente.
```

Orden de carga en `index.html` (NO cambiar el orden): `lucide` (CDN) → `engine.js` → `fontpicker.js` → `animations.js` → `tabs.js` → `interactive.js` → `library.js`. `engine.js` registra su `DOMContentLoaded` primero (corre `init()`); las otras capas corren después y dependen de que el DOM y el wiring ya existan.

### Edición directa sobre la imagen (`interactive.js` + hit map del motor)

El preview es un PNG (no texto). Para editar "sobre la imagen" el motor construye un **hit map**: en cada `generateImage()` se rellena el array global `hitRegions` con rectángulos en coordenadas de canvas para cada **palabra**, el **título** y cada **estrofa**, junto al rango `[srcStart, srcEnd)` que cada uno ocupa en `state.poem`.

- La propagación de índices va por todo el pipeline de texto: `parseFormattedSegments` marca `start/end` por segmento; `wrapSegments` deriva el rango por palabra (las piezas guionadas comparten el de la palabra completa); `wrapTextLines` numera estrofas; `drawFormattedLine`/`drawWrappedLines` registran las regiones.
- `applyFormatToRange(marker, start, end)` (en `engine.js`) aplica/togglea un marcador markdown sobre un rango arbitrario de `state.poem` y re-renderiza inmediato.
- `interactive.js` traduce el clic sobre el `<img>` (con `object-fit:contain`, hay que descontar el letterboxing) a coordenadas de canvas, busca la región (prioridad título > palabra > estrofa) y muestra una burbuja `.hit-popover`: palabra/estrofa → B/I/U/S; título → tamaño ± y fuente. Un `MutationObserver` sobre `preview.src` reposiciona la burbuja tras cada re-render.
- Solo se registran regiones de palabra/estrofa cuando `state.poem` tiene contenido real (el lorem placeholder no es editable), y la del título solo si hay título real.

### Textarea limpio vs. fuente marcada (puente plain ↔ marked)

`state.poem` guarda los marcadores markdown (`**`, `*`, `__`, `~~`) — es la fuente de verdad para el render y el hit-map. Pero el **textarea muestra texto limpio sin marcadores**. El puente vive en `engine.js`:

- `markedToPlain(marked)` → `{ plain, map }`: quita los marcadores y devuelve un mapa de índice-plain → índice-marked.
- `stripMarkers(marked)`: el texto limpio que se pone en el textarea (en `syncControlsFromState`, `applyFormatToRange`, `clearFormatting`).
- `reconcilePoem(oldMarked, newPlain)`: cuando el usuario edita el textarea (texto limpio), reconstruye la fuente marcada con un diff de prefijo/sufijo común — conserva los marcadores fuera del tramo editado y reemplaza el medio por lo recién tipeado. Los marcadores dentro del tramo que el usuario editó se descartan (editó ahí).
- `applyFormat` (toolbar) mapea la selección del textarea (coordenadas plain) a índices marked vía el `map` y togglea con `applyFormatToRange`. Las burbujas ya operan en índices marked directamente.

## Arquitectura del motor (`engine.js`)

Flujo de datos unidireccional simple:

```
controles (input) → state → apply()/applyDebounced() → updatePreview() → generateImage() → canvas → <img id="preview">
                                                      ↘ saveState() → localStorage
```

Piezas clave:

- **`state`**: objeto único con toda la configuración. Arranca desde `DEFAULTS`, se hidrata desde `localStorage` en `loadState()`.
- **Motor de texto** (no tocar sin cuidado): `parseFormattedSegments` (markdown → segmentos con bold/italic/underline/strike), `wrapSegments` + `hyphenateWord` (ajuste de línea con guionado), `wrapTextLines`, `findOptimalFontSize` (autoajuste del tamaño), `drawWrappedLines`/`drawFormattedLine` (dibujo con alineación izq/centro/der).
- **`generateImage()`**: pinta fondo (sólido o degradado), marco opcional, título, poema (1 o 2 columnas según `state.columns`), y marca de agua. Escribe el dataURL en `#preview`.
- **Sync**: `syncControlsFromState()` empuja `state` → DOM. `bindRange/bindColor/bindSegmented/bindToggle` enganchan DOM → `state`.
- **Builders**: `buildFonts`, `buildRatios`, `buildPresets` generan controles dinámicos desde los arrays `FONTS`, `RATIOS`, `THEMES`.

## Funcionalidades

- **Contenido**: título + cuerpo del poema, con barra de formato markdown (`**negrita**`, `*cursiva*`, `***ambas***`, `__subrayado__`, `~~tachado~~`). Línea en blanco = separación de estrofa.
- **Formato del lienzo**: 4 proporciones (Post 4:5, Cuadro 1:1, Vert. 3:4, Story 9:16) y selector de **columnas** (Auto / 1 / 2).
- **Temas**: 25 presets que setean colores + fuentes del poema de un clic (Azabache = negro total + Palatino, Sangre, Medianoche, Sepia, Papel, Marfil, Vino, Océano, etc.), más **temas propios** que el usuario guarda/borra (clave `poemStudio.themes.v1`; `buildPresets` renderiza built-ins + custom; `findTheme` busca en ambos).
- **Colores**: fondo sólido, degradado (con ángulo) o **imagen** (foto subida, cover-fit, con opacidad y oscurecido para legibilidad), color de texto. La imagen se guarda como data-URL en `state.bgImage` y se decodifica en `bgImageObj`; `saveState` excluye la imagen si excede la cuota de `localStorage`.
- **Deshacer / rehacer**: historial de snapshots de `state` (coalescido a 450 ms). Botones en la topbar + atajos Ctrl/Cmd+Z y Ctrl+Shift+Z / Ctrl+Y. `restoreHistory` repone el estado y recarga la imagen de fondo.
- **Tipografía**: fuente del título y del poema por separado (**48 fuentes self-hosted**, dropdown custom con preview en `fontpicker.js`), alineación horizontal y **vertical** (arriba/centro/abajo — `generateImage` mide el alto del bloque y calcula `contentTop`), tamaños, "forzar tamaño aunque no quepa", espacio entre letras.
- **Espaciado**: título↔poema, entre estrofas, interlineado, márgenes.
- **Acabados**: sombra de texto, **contorno del texto** (`strokeAndFillText` dibuja el stroke detrás del fill; aplica a título y poema), marco/borde, marca de agua configurable.
- **PWA / offline**: instalable (manifest) y funciona sin conexión gracias a `sw.js` (precachea el shell en `install`, runtime-cachea fuentes/Lucide; estrategia cache-first, rutas relativas para servir en raíz o subpath). El SW se registra desde `index.html` en el evento `load`. **Bump `CACHE` en `sw.js` al cambiar assets** o el SW sirve la versión vieja cacheada.
- **Persistencia**: todo se guarda en `localStorage`. Botón "Restablecer" vuelve a `DEFAULTS`.
- **Composiciones guardadas** (`library.js`): guardás piezas con nombre (clave `poemStudio.library.v1`, separada del estado vivo) y las cargás/borrás. Usa `getStateSnapshot()` / `applyLoadedState()` del motor. Guard de cuota: si una pieza con imagen pesada no entra, reintenta sin la imagen.
- **Exportar / compartir** (`engine.js`): descargar PNG, **copiar** al portapapeles (`ClipboardItem`), y **compartir** vía Web Share API (botón visible solo si el dispositivo lo soporta).

## Decisiones de diseño (historia, para no revertirlas sin querer)

1. **Tema claro editorial**: fondo marfil (`--bg-app: #f5f1ea`), superficies blanco translúcido (glassmorphism), texto carbón. El acento vive en `--accent` / `--accent-bright` / `--accent-soft` en `:root` — **cambiar el acento se hace SOLO ahí**.
2. **Acento negro**: el acento es negro (`#1a1a1a` / `#000`). Antes fue champagne/taupe; se cambió a negro a pedido. No quedan cafés del acento.
3. **Tipografía del chrome**: **Ubuntu** para títulos, **Montserrat** para el cuerpo de la interfaz. (Distinto de las fuentes del poema, que el usuario elige aparte.)
4. **Viewport único sin scroll (desktop)**: `100dvh` + flex column con `overflow:hidden`. Las 7 secciones se muestran como **pestañas** (una activa por vez) para que todo entre sin scroll de página. Lo arma `tabs.js`.
5. **Móvil**: preview pinneado arriba (~42dvh) + **bottom-nav fija** con las 7 pestañas + botón flotante "Descargar PNG". Respeta `safe-area`.
6. **Animaciones**: entrada con stagger, colapso fluido con `grid-template-rows: 1fr↔0fr`, pulse del preview al regenerar (vía `MutationObserver`). Todo gated por `prefers-reduced-motion`. En modo tabs la animación por-sección se anula para que el cambio de pestaña sea instantáneo (`body.tabs-mode .section { animation: none }`).
7. **Título de la página sin degradado**: es color sólido (se quitó el text-gradient a pedido).

## Reglas para modificar (IMPORTANTE)

- **No rompas los hooks**: `engine.js` referencia muchos IDs, `data-*` y clases por nombre. Si renombrás un `id`/clase en `index.html`, actualizá `engine.js`, `animations.js` y `tabs.js` en consecuencia. Hooks sensibles: todos los IDs de controles, `data-section/val/ratio/theme/lucide`, y clases `.section .collapsed .section-head .section-body .section-body-inner .chevron .ratio .preset .segmented .toggle-row .preset-grid .ratio-grid .hex-input .show .reveal .is-refreshing .tab-bar .bottom-nav .tabs-mode .tab-hidden`.
- **El motor de texto/canvas es delicado**: cambios en `wrapSegments`/`generateImage` afectan el render de TODOS los poemas. Probá con poemas largos, con markdown, y en las 4 proporciones.
- **Las 3 capas JS son independientes** por diseño. `animations.js` y `tabs.js` no deben modificar el estado ni el wiring del motor; solo orquestan clases CSS y estructura visual.
- **Tras cualquier cambio de JS**, validá sintaxis: `node --check js/<archivo>.js`.
- **Lucide**: si agregás iconos nuevos (`<i data-lucide="...">`) creados dinámicamente, volvé a llamar `lucide.createIcons()` después de inyectarlos.

## Pendientes / ideas

- Opción de pintar la parte recorrida del slider con el color de acento (barra de progreso) — requiere un poco de JS por slider.
- Deploy a GitHub Pages (los archivos ya son compatibles: estáticos + rutas relativas + SW con scope relativo). Falta el push + habilitar Pages en el repo.
