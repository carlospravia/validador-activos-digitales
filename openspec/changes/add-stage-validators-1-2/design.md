## Context

Depende de `add-validator-foundation`. Añade el primer tramo pedagógico del curso: estructura semántica y on-page SEO básico.

## Goals / Non-Goals

**Goals:**
- Codificar reglas §9–10 como validadores componibles.
- Reutilizar Paso 1 dentro de Paso 2 con excepciones explícitas (title/meta).

**Non-Goals:**
- axe-core, JSON-LD, scoring final, hosting.

## Decisions

### D1 — Pipeline por etapa
`runValidation(stage, html, meta)` selecciona el conjunto de reglas. Paso 2 = `general + stage1(without pedagogical title/meta bans) + stage2`.

### D2 — Nombre de archivo solo si hay File metadata
Si `source === 'paste'`, el nombre esperado es recomendación; si `source === 'file'`, se valida estrictamente.

### D3 — Heurísticas vs certeza
Relación title↔H1 y keyword stuffing siempre `manual-review`. Longitudes de title/description como `warning` fuera de rango.

### D4 — Archivos
```text
src/validators/semanticValidator.ts
src/validators/onPageValidator.ts
src/rules/stage1Rules.ts
src/rules/stage2Rules.ts
```

## Risks / Trade-offs

- “Estructura equivalente a article” es ambigua; mitigación: documentar criterios mínimos en rules (p.ej. landmark + heading hierarchy) y preferir `manual-review` cuando sea dudoso.
- Falsos positivos en CTA genéricos por i18n; lista de frases en español del SPEC.

## Open Questions

- Ninguna bloqueante.
