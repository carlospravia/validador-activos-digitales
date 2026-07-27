## ADDED Requirements

### Requirement: Nombre esperado index-final
Cuando la fuente es archivo, el sistema MUST validar `index-final.html`; si es pegado, MUST recomendarlo.

#### Scenario: Nombre auditoría final
- **WHEN** se carga otro nombre en Paso 5
- **THEN** se reporta que el esperado es `index-final.html`

### Requirement: Ejecutar reglas previas
El Paso 5 MUST ejecutar todas las reglas de las etapas anteriores aplicables.

#### Scenario: Auditoría acumulativa
- **WHEN** el usuario valida Paso 5
- **THEN** el reporte incluye hallazgos de documento, estructura, on-page, accesibilidad y schema según reglas activas

### Requirement: Categorías del reporte
El reporte MUST organizar hallazgos en categorías: Documento y sintaxis; Estructura semántica; Encabezados; SEO On-Page; Intención y claridad; Enlaces y CTA; Accesibilidad; Legibilidad; Datos estructurados; Coherencia; Medición.

#### Scenario: Categorías visibles
- **WHEN** hay resultados en múltiples dominios
- **THEN** cada resultado está asociado a una categoría del listado

### Requirement: Resumen de auditoría
El sistema MUST mostrar: puntaje técnico, errores críticos, errores altos, advertencias y revisiones humanas pendientes.

#### Scenario: Contadores en resumen
- **WHEN** existen 2 errores high y 3 warnings
- **THEN** el resumen refleja esos conteos

### Requirement: Puntaje técnico con disclaimer
El puntaje MUST usar la escala 0–100 con penalizaciones: critical error = -15, high error = -10, medium error = -5, low warning = -2, manual review = 0. El sistema MUST mostrar el texto obligatorio de que el puntaje solo refleja reglas verificables del ejercicio y no garantiza posicionamiento, accesibilidad completa ni elegibilidad de rich results.

#### Scenario: Cálculo con error critical
- **WHEN** hay un único error `critical` y el resto passed
- **THEN** el puntaje es 85 y el disclaimer es visible

#### Scenario: Piso en cero
- **WHEN** las penalizaciones superarían 100
- **THEN** el puntaje mostrado es 0
