## Why

Tras la foundation, los estudiantes necesitan validar el Paso 1 (estructura semántica) y el Paso 2 (on-page) con reglas pedagógicas explícitas y revisiones humanas. Sin estas reglas el validador no cumple el flujo incremental del curso.

## What Changes

- Añadir reglas del Paso 1 para `index-v1.html`: documento semántico, encabezados, contenido, restricciones pedagógicas y checklist de revisión humana.
- Añadir reglas del Paso 2 para `index-v2.html`: title, meta description, relación H1, CTA, enlaces, heurística de keyword stuffing y revisión humana.
- El Paso 2 MUST reutilizar validaciones del Paso 1 excepto las restricciones sobre `title` y meta description del Paso 1.

## Non-goals

- Accesibilidad/axe, Schema.org, auditoría final, medición GA4, Firebase Hosting.
- Corrección automática del HTML.

## Capabilities

### New Capabilities

- `stage-1-semantic`: Requisitos y escenarios del Paso 1 — Estructura semántica.
- `stage-2-onpage`: Requisitos y escenarios del Paso 2 — Optimización On-Page (incluye Paso 1 con excepciones).

### Modified Capabilities

- (ninguna — no se modifican requisitos de foundation; se componen en el pipeline)

## Impact

- Código futuro: `semanticValidator.ts`, `onPageValidator.ts`, `stage1Rules.ts`, `stage2Rules.ts`.
- Depende de `validation-engine` y `general-rules` del change foundation.
- Fuente: `docs/SPEC-Validador-de-Activos-Digitales.md` §§9–10.
