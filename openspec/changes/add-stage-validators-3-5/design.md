## Context

Extiende el pipeline tras Pasos 1–2 para cubrir accesibilidad, Schema.org, auditoría final y medición sugerida. Alinea deferral de axe-core con la priorización §23 del SPEC de producto.

## Goals / Non-Goals

**Goals:**
- Completar reglas de Pasos 3–5 y medición sugerida.
- Scoring simple transparente con disclaimer.
- Parseo JSON-LD seguro (`json5`/`JSON.parse` + `ajv` según necesidad).

**Non-Goals:**
- GA4 real, rich results garantizados, hosting.

## Decisions

### D1 — axe-core diferible
Implementar primero reglas a11y propias. Integrar axe sobre DOM aislado sin scripts del estudiante. Si el bundling/jsdom-like setup bloquea el MVP, diferir axe y mantener el resto.

### D2 — JSON-LD extraction
`extractJsonLd.ts` recolecta scripts `application/ld+json`, parsea de forma segura, normaliza `@graph` si aparece.

### D3 — Scoring
`scoring.ts` aplica penalizaciones del SPEC; clamp `[0, 100]`; manual-review no penaliza.

### D4 — Archivos
```text
src/validators/accessibilityValidator.ts
src/validators/schemaValidator.ts
src/validators/finalAuditValidator.ts
src/validators/measurementValidator.ts
src/utils/extractJsonLd.ts
src/utils/scoring.ts
src/rules/stage3Rules.ts
src/rules/stage4Rules.ts
```

## Risks / Trade-offs

- axe en browser puro puede ser pesado; deferral documentada.
- Coherencia Schema↔contenido es heurística; preferir `manual-review` ante ambigüedad.

## Open Questions

- Ninguna bloqueante.
