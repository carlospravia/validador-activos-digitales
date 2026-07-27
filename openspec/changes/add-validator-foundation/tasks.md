## 1. Scaffold base

- [ ] 1.1 Crear proyecto Vite + React + TypeScript
- [ ] 1.2 Añadir dependencias base (`lucide-react`, `html-validate`) y scripts `dev`/`build`/`preview`
- [ ] 1.3 Definir CSS variables LEAD y layout responsive mínimo

## 2. Tipos y motor

- [ ] 2.1 Implementar tipos `ValidationStatus` y `ValidationResult` en `src/types`
- [ ] 2.2 Implementar `parseHtml.ts` sin ejecutar scripts del estudiante
- [ ] 2.3 Implementar orquestador que ejecuta validadores y agrega resultados fail-safe

## 3. Reglas generales

- [ ] 3.1 Implementar `generalRules.ts` / `generalValidator.ts` (vacío, doctype, html/head/body, anidamiento, keywords, plantillas)
- [ ] 3.2 Implementar warnings de seguridad básica (scripts externos, iframes, forms externos, `on*`)
- [ ] 3.3 Añadir pruebas unitarias de reglas críticas generales

## 4. UI foundation

- [ ] 4.1 Header + StageSelector (5 pasos)
- [ ] 4.2 InputTabs: FileUploader, CodeEditor, clear input, cargar ejemplo
- [ ] 4.3 ValidateButton + PrivacyNotice permanente
- [ ] 4.4 ValidationSummary, ResultsFilter, ResultsList/ResultCard, ExportReportButton
- [ ] 4.5 Verificar a11y básica (teclado, labels, contraste, estado no solo por color)

## 5. Fixtures

- [ ] 5.1 Crear `sample-v1.html` … `sample-final.html` embebidos en `src/data/sampleFiles.ts`
- [ ] 5.2 Crear fixture HTML incorrecto para pruebas de error
- [ ] 5.3 Cablear carga de ejemplos desde la UI
