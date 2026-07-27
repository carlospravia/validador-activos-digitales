## Why

Completar el flujo pedagógico requiere accesibilidad/legibilidad (Paso 3), datos estructurados (Paso 4), auditoría integral con puntaje (Paso 5) y sugerencias de medición sin implementar GA4.

## What Changes

- Añadir reglas Paso 3 (`index-v3.html`): lang, imágenes, formularios, ARIA redundante, legibilidad; axe-core como integración objetivo con deferral explícito si bloquea el MVP (§23).
- Añadir reglas Paso 4 (`index-v4.html`): JSON-LD, Schema.org, validación por tipo y coherencia visible.
- Añadir Paso 5 (`index-final.html`): categorías de reporte, scoring simple + disclaimer, ejecución de reglas previas.
- Añadir sugerencias de eventos medibles (sin implementar analytics).

## Non-goals

- Implementar GA4 u otros analytics.
- Garantizar rich results de Google.
- Firebase Hosting (change siguiente).
- Corrección automática con IA.

## Capabilities

### New Capabilities

- `stage-3-accessibility`: Paso 3 — accesibilidad y legibilidad (+ axe objetivo/diferible).
- `stage-4-schema`: Paso 4 — JSON-LD / Schema.org / coherencia.
- `stage-5-final-audit`: Paso 5 — auditoría integral, categorías y puntaje.
- `measurement-suggestions`: Tabla de eventos sugeridos en Paso 5.

### Modified Capabilities

- (ninguna a nivel de requisitos foundation; composición de pipeline)

## Impact

- Código futuro: `accessibilityValidator.ts`, `schemaValidator.ts`, `finalAuditValidator.ts`, `measurementValidator.ts`, `scoring.ts`, `extractJsonLd.ts`.
- Deps: `axe-core`, `ajv`, `json5`.
- Fuente: SPEC §§11–14, 23.
