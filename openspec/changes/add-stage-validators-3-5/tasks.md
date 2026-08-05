## 1. Paso 3 — Accesibilidad

- [x] 1.1 Implementar reglas lang, imágenes, forms, botones/enlaces, ARIA redundante, legibilidad
- [x] 1.2 Integrar axe-core en DOM aislado sin ejecutar scripts del estudiante
- [x] 1.3 Si axe bloquea el MVP: documentar deferral y dejar checkbox pendiente explícito sin bloquear el resto
- [x] 1.4 Checklist `manual-review` Paso 3 + nombre `index-v3.html`
- [x] 1.5 Pruebas unitarias de reglas críticas Paso 3

## 2. Paso 4 — Schema

- [x] 2.1 Implementar `extractJsonLd.ts` fail-safe
- [x] 2.2 Validar sintaxis `@context`/`@type` y reglas por tipo frecuentes
- [x] 2.3 Coherencia visible + disclaimer de rich results
- [x] 2.4 Checklist `manual-review` Paso 4 + nombre `index-v4.html`
- [x] 2.5 Pruebas unitarias JSON-LD inválido y Product/FAQ edge cases

## 3. Paso 5 — Auditoría y medición

- [x] 3.1 Orquestar todas las reglas previas en Paso 5
- [x] 3.2 Categorías de reporte + resumen de conteos
- [x] 3.3 Implementar `scoring.ts` con disclaimer obligatorio
- [x] 3.4 Implementar sugerencias de medición (sin GA4) + UI `MeasurementSuggestions`
- [x] 3.5 Nombre `index-final.html` + pruebas de puntaje (piso 0, critical -15)

## Implementation notes

- `runAxeIfAvailable` existe y degrada con warning si axe no corre; el pipeline síncrono del MVP usa reglas propias (axe opcional / diferible sin bloquear).
