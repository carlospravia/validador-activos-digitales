# Ejemplo oficial: activo digital tipo artículo de blog

Ejemplo pedagógico incremental alineado con la **Clase 3 — Hoja de Trabajo: Construyendo una página optimizada para personas e IA** del Curso Profesional de SEO (LEAD).

## Tema

**Cómo crear un activo digital tipo artículo de blog útil para personas y buscadores**

Intención: explicar qué es un activo digital en este contexto, cómo estructurarlo como artículo y qué señales mínimas colaboran con la comprensión (personas, buscadores e IA), sin inventar evidencia.

## Archivos (flujo incremental)

| Archivo | Paso del ejercicio | Qué se añade |
|---------|--------------------|--------------|
| [`index-v1.html`](./index-v1.html) | 1 — Estructura semántica | HTML semántico, H1/H2, `[EVIDENCIA PENDIENTE]`. Sin `title`, meta description, CSS, JS ni `lang`. |
| [`index-v2.html`](./index-v2.html) | 2 — On-page | `title`, meta description, enlace interno relativo y CTA medible. |
| [`index-v3.html`](./index-v3.html) | 3 — Accesibilidad | `lang="es"`, listas escaneables, formulario con labels y textos de acción claros. |
| [`index-v4.html`](./index-v4.html) | 4 — Schema.org | JSON-LD `Article` con propiedades respaldadas por contenido visible. |
| [`index-final.html`](./index-final.html) | 5 — Auditoría | Conserva lo anterior; refuerza claridad y una vía de contacto medible. |

## Cómo usarlo con el validador

1. Abre la app (`npm run dev`).
2. Selecciona la etapa correspondiente (Paso 1…5).
3. Carga el ejemplo desde el selector **o** sube el archivo HTML de esta carpeta (el nombre `index-v*.html` / `index-final.html` se valida cuando la fuente es archivo).
4. Ejecuta **Validar archivo** y revisa errores, advertencias y revisiones humanas.

También están disponibles en la UI como “Ejemplo oficial …” (mismo contenido embebido desde esta carpeta).

## Principios del ejemplo

- No inventa cifras, testimonios, reseñas ni rich results.
- Conserva `[EVIDENCIA PENDIENTE]` donde la hoja de trabajo lo exige.
- El marcado Schema describe lo visible; no promete resultados enriquecidos.
- Cada versión conserva y mejora la anterior.

## Relación con la documentación del producto

Ver [`docs/SPEC-Validador-de-Activos-Digitales.md`](../../SPEC-Validador-de-Activos-Digitales.md) y el índice de ejemplos en [`docs/examples/README.md`](../README.md).
