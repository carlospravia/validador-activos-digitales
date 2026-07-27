## Context

Greenfield del LEAD Digital Asset Validator. Existe solo la especificación de producto en `docs/SPEC-Validador-de-Activos-Digitales.md`. Este change define la base compartida antes de las reglas por etapa y el hosting.

## Goals / Non-Goals

**Goals:**
- Contratos de privacidad local, UI, motor de resultados, reglas generales y fixtures.
- Diseño listo para implementar con Vite + React + TypeScript sin backend.
- Parseo HTML seguro que no ejecute JavaScript del estudiante.

**Non-Goals:**
- Implementar Pasos 1–5, scoring final, medición GA4 o Firebase Hosting.
- Autenticación, almacenamiento o analytics.

## Decisions

### D1 — SPA estática con Vite/React/TS
Una sola aplicación cliente. Sin Next.js ni API. Justificación: alineado al MVP (§4) y al requisito de procesamiento local.

### D2 — Parseo con DOMParser + html-validate
Usar el parser del navegador para inspección estructural y `html-validate` para sintaxis/anidamiento. No montar el HTML del estudiante en un iframe con scripts habilitados.

### D3 — Modelo de resultados uniforme
Todos los validadores emiten `ValidationResult[]` con `ValidationStatus` fijo. Las etapas posteriores solo agregan reglas al pipeline.

### D4 — Organización de código (§19)
```text
src/
├── components/
├── validators/
│   └── generalValidator.ts
├── rules/
│   └── generalRules.ts
├── types/
├── utils/
│   └── parseHtml.ts
├── data/
│   └── sampleFiles.ts
└── App.tsx
```

### D5 — Tokens LEAD
CSS variables para `#25292C`, `#FF7A1A`, `#FFFFFF`, `#F2F2F2` y colores de estado. Iconografía vía `lucide-react`.

## Risks / Trade-offs

- **html-validate en browser**: puede requerir bundling cuidadoso; mitigación: validar early en spike de implementación.
- **UI sin reglas de etapa**: la validación foundation solo cubre reglas generales; las etapas aparecerán en changes siguientes.
- **Falsos positivos de “plantilla incompleta”**: definir lista explícita de patrones en `generalRules.ts`.

## Migration Plan

No aplica (greenfield). Changes posteriores dependen de estos contratos sin modificar requisitos salvo deltas explícitos.

## Open Questions

- Ninguna bloqueante para specs; la integración concreta de `html-validate` se confirma en apply.
