## ADDED Requirements

### Requirement: Nombre esperado index-v1
Cuando el HTML proviene de un archivo cargado, el sistema MUST validar que el nombre sea `index-v1.html`. Si el contenido fue pegado, el sistema MUST mostrar la expectativa de nombre como recomendación, no como error de archivo.

#### Scenario: Archivo con nombre incorrecto
- **WHEN** se carga un archivo llamado `pagina.html` en Paso 1
- **THEN** se reporta incumplimiento del nombre esperado `index-v1.html`

#### Scenario: Código pegado
- **WHEN** el usuario pega HTML en Paso 1 sin nombre de archivo
- **THEN** se recomienda usar `index-v1.html` sin tratarlo como error de carga

### Requirement: Estructura semántica obligatoria
El documento MUST tener un único `<h1>`, al menos un `<main>`, al menos un `<article>` (o estructura equivalente claramente definida), al menos una `<section>`, y MUST NOT basarse únicamente en `<div>` para toda la estructura. MUST usar `<header>` cuando exista encabezado de página o artículo, y `<footer>` cuando exista cierre, autoría o llamada final.

#### Scenario: Falta main
- **WHEN** no existe `<main>`
- **THEN** se emite un resultado `error`

#### Scenario: Solo divs
- **WHEN** la estructura visible se construye solo con `<div>` sin landmarks semánticos requeridos
- **THEN** se emite un resultado `error`

### Requirement: Encabezados del Paso 1
MUST existir un único `<h1>` y al menos un `<h2>`. El sistema MUST detectar saltos injustificados de nivel, encabezados vacíos y encabezados usados solo para formato visual.

#### Scenario: Sin h2
- **WHEN** no existe ningún `<h2>`
- **THEN** se emite un resultado `error`

#### Scenario: Encabezado vacío
- **WHEN** un encabezado no tiene texto
- **THEN** se emite un resultado `error`

### Requirement: Contenido introductorio y secciones
MUST existir contenido introductorio después del `<h1>` o dentro del primer bloque principal, y al menos dos secciones de contenido. El sistema MUST advertir párrafos vacíos y secciones sin encabezado. El marcador `[EVIDENCIA PENDIENTE]` MUST ser aceptado.

#### Scenario: Una sola sección
- **WHEN** solo hay una sección de contenido
- **THEN** se emite un resultado `error`

#### Scenario: Evidencia pendiente
- **WHEN** el texto incluye `[EVIDENCIA PENDIENTE]`
- **THEN** no se marca ese marcador como plantilla inválida por esta regla de etapa

### Requirement: Restricciones pedagógicas del Paso 1
En Paso 1 MUST NOT existir `<meta name="description">`, `<meta name="keywords">`, CSS (`<style>`, `style` attributes, hojas de estilo) ni JavaScript (`<script>` o atributos de eventos). Si existe `<title>`, el sistema MUST emitir `warning` indicando que el title se incorpora en el Paso 2. Estos hallazgos MUST tratarse como incumplimiento del ejercicio, no solo como error técnico HTML genérico.

#### Scenario: Meta description en Paso 1
- **WHEN** existe meta description en Paso 1
- **THEN** se emite un resultado `error` de incumplimiento pedagógico

#### Scenario: Title presente en Paso 1
- **WHEN** existe `<title>` en Paso 1
- **THEN** se emite un `warning` orientando al Paso 2

### Requirement: Revisión humana Paso 1
El sistema MUST emitir resultados `manual-review` para: si el H1 refleja la intención principal; si la introducción responde a la necesidad del usuario; si las secciones siguen secuencia lógica; si las afirmaciones relevantes tienen respaldo.

#### Scenario: Checklist humana emitida
- **WHEN** se valida el Paso 1 con HTML parseable
- **THEN** se incluyen ítems `manual-review` correspondientes a la checklist pedagógica
