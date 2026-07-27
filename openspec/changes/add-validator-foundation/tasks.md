## 1. Scaffold base

- [x] 1.1 Crear proyecto Vite + React + TypeScript
- [x] 1.2 Añadir dependencias base (`lucide-react`, `html-validate`) y scripts `dev`/`build`/`preview`
- [x] 1.3 Definir CSS variables LEAD y layout responsive mínimo

## 2. Tipos y motor

- [x] 2.1 Implementar tipos `ValidationStatus` y `ValidationResult` en `src/types`
- [x] 2.2 Implementar `parseHtml.ts` sin ejecutar scripts del estudiante
- [x] 2.3 Implementar orquestador que ejecuta validadores y agrega resultados fail-safe

## 3. Reglas generales

- [x] 3.1 Implementar `generalRules.ts` / `generalValidator.ts` (vacío, doctype, html/head/body, anidamiento, keywords, plantillas)
- [x] 3.2 Implementar warnings de seguridad básica (scripts externos, iframes, forms externos, `on*`)
- [x] 3.3 Añadir pruebas unitarias de reglas críticas generales

## 4. UI foundation

- [x] 4.1 Header + StageSelector (5 pasos)
- [x] 4.2 InputTabs: FileUploader, CodeEditor, clear input, cargar ejemplo
- [x] 4.3 ValidateButton + PrivacyNotice permanente
- [x] 4.4 ValidationSummary, ResultsFilter, ResultsList/ResultCard, ExportReportButton
- [x] 4.5 Verificar a11y básica (teclado, labels, contraste, estado no solo por color)

## 5. Fixtures

- [x] 5.1 Crear `sample-v1.html` … `sample-final.html` embebidos en `src/data/sampleFiles.ts`
- [x] 5.2 Crear fixture HTML incorrecto para pruebas de error
- [x] 5.3 Cablear carga de ejemplos desde la UI

## Implementation notes

- `html-validate` (browser bundle) integrado en `validateHtmlSyntax` para anidamiento/sintaxis real (`close-order`, `void-content`, etc.).
- Las reglas pedagógicas y de etapa se mantienen; html-validate complementa sin exigir `lang`/`title` en Paso 1.
- Parseo estructural de consulta sigue con `DOMParser` (sin ejecutar scripts del estudiante).
