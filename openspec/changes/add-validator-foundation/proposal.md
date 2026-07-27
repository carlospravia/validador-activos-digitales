## Why

Los estudiantes del Curso Profesional de SEO necesitan retroalimentación inmediata y local al validar HTML por etapas, sin enviar archivos a un servidor. Este change establece la base del MVP: privacidad local, interfaz de validación, motor de resultados, reglas generales y fixtures de ejemplo — sin reglas por etapa todavía.

## What Changes

- Introducir procesamiento 100% local con aviso permanente de privacidad y sin analytics en el MVP.
- Definir la UI del validador: selector de etapa, entrada HTML (archivo / pegado / ejemplo), reporte filtrable y exportación/copia del resumen.
- Definir el modelo de resultados (`ValidationStatus`, `ValidationResult`) y el motor fail-safe que no ejecuta scripts del estudiante.
- Definir reglas generales de sintaxis HTML y advertencias de seguridad básica (aplican a todas las etapas).
- Incluir archivos HTML de ejemplo (v1–final) y un caso incorrecto para pruebas.

## Non-goals

- Reglas de Pasos 1–5 (van en changes posteriores).
- Autenticación, base de datos, historial o publicación del HTML.
- Validación de URLs remotas, Lighthouse completo, Search Console o IA editorial.
- Corrección automática del código.
- Despliegue Firebase Hosting (change `add-firebase-hosting`).

## Capabilities

### New Capabilities

- `local-privacy`: Análisis local en el navegador; aviso permanente; sin envío ni almacenamiento remoto; sin analytics en el MVP.
- `validation-ui`: Pantalla principal, selector de etapa, input, botón validar, filtros, tarjetas de resultado, tokens visuales LEAD y a11y de la app.
- `validation-engine`: Tipos de resultado, acumulación, manejo seguro de HTML inválido y prohibición de ejecutar JavaScript del estudiante.
- `general-rules`: Reglas de archivo/sintaxis y advertencias de seguridad básica presentes en todas las etapas.
- `sample-fixtures`: Samples internos por etapa y un HTML deliberadamente incorrecto.

### Modified Capabilities

- (ninguna — repositorio greenfield)

## Impact

- Código futuro: scaffold Vite/React/TS, componentes UI, `src/types`, `src/validators/generalValidator.ts`, `src/rules/generalRules.ts`, `src/data/sampleFiles.ts`.
- Dependencias previstas: `html-validate`, `lucide-react` (y utilidades de parseo DOM).
- Sin backend ni Firebase Client SDK requerido en este change.
- Fuente de requisitos: `docs/SPEC-Validador-de-Activos-Digitales.md` §§3–8, 15–18, 20–21.
