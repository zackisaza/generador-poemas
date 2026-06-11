# CLAUDE.md — Contexto del proyecto

Guía para cualquier agente (o persona) que trabaje en este repo. Leéla antes de tocar código.

## Qué es

**Instagrameador de poemas del Fantástico Sr. Zorro** — un "estudio de composición" 100% en el navegador, sin build ni backend, que convierte un poema en una imagen PNG lista para Instagram. Todo el render ocurre en un `<canvas>` y la imagen se descarga como PNG.

- Sin frameworks, sin bundler, sin dependencias de build. Es HTML + CSS + JS plano.
- Única dependencia externa: **Lucide** (iconos, por CDN) y **Google Fonts** (tipografías).
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
├── index.html        # Markup: topbar, panel de controles (7 secciones), panel de preview, footer
├── css/
│   └── styles.css     # Todo el estilo: design tokens, tema claro, tabs, responsive, animaciones
└── js/
    ├── engine.js      # Motor del canvas + estado + wiring de controles + persistencia
    ├── animations.js  # Capa de animación (entrada con stagger, pulse del preview). Independiente.
    └── tabs.js        # Convierte las 7 secciones en pestañas (tabs desktop + bottom-nav móvil). Independiente.
```

Orden de carga en `index.html` (NO cambiar el orden): `lucide` (CDN) → `engine.js` → `animations.js` → `tabs.js`. `engine.js` registra su `DOMContentLoaded` primero (corre `init()`); las otras dos capas corren después y dependen de que el DOM y el wiring ya existan.

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
- **Temas**: 8 presets que setean colores + fuentes del poema de un clic (Sangre, Medianoche, Sepia, Papel, Bosque, Ocaso, Tinta, Niebla).
- **Colores**: fondo sólido o degradado (con ángulo), color de texto.
- **Tipografía**: fuente del título y del poema por separado (13 opciones), alineación, tamaños, "forzar tamaño aunque no quepa", espacio entre letras.
- **Espaciado**: título↔poema, entre estrofas, interlineado, márgenes.
- **Acabados**: sombra de texto, marco/borde, marca de agua configurable.
- **Persistencia**: todo se guarda en `localStorage`. Botón "Restablecer" vuelve a `DEFAULTS`.

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
- Modo 100% offline (embeber Lucide y las fuentes en vez de CDN).
