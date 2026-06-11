# Instagrameador de poemas · Fantástico Sr. Zorro

Estudio de composición en el navegador para convertir poemas en imágenes listas para Instagram. Sin build, sin backend: HTML + CSS + JS plano, todo el render en `<canvas>`.

## Características

- **4 proporciones**: Post 4:5, Cuadro 1:1, Vertical 3:4 y Story 9:16.
- **Formato markdown** en el poema: `**negrita**`, `*cursiva*`, `***ambas***`, `__subrayado__`, `~~tachado~~`.
- **8 temas** de un clic (Sangre, Medianoche, Sepia, Papel, Bosque, Ocaso, Tinta, Niebla).
- **Columnas** automáticas o forzadas (1 o 2).
- Fondo sólido o **degradado**, fuente del título y del poema por separado, alineación, sombra de texto, marco y **marca de agua** configurable.
- Tu configuración se **guarda sola** en el navegador (`localStorage`).
- Interfaz clara, full-width, en un solo viewport en desktop y con navegación inferior en móvil.

## Uso

No necesita instalación. Serví la carpeta y abrila en el navegador:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

> Requiere internet la primera vez (iconos Lucide y Google Fonts por CDN).

## Estructura

```
index.html        # Markup
css/styles.css     # Estilos (tema, tabs, responsive, animaciones)
js/engine.js       # Motor del canvas + estado + controles
js/animations.js   # Animaciones de entrada y del preview
js/tabs.js         # Sistema de pestañas (desktop) y bottom-nav (móvil)
```

Para detalles de arquitectura y reglas de contribución, ver [`CLAUDE.md`](CLAUDE.md).

## Créditos

Hecho para [@sr.zrro](https://instagram.com/sr.zrro).
