## ADDED Requirements

### Requirement: Composición con Paso 1
Al validar Paso 2, el sistema MUST ejecutar las validaciones del Paso 1 excepto las restricciones pedagógicas sobre `title` y meta description del Paso 1.

#### Scenario: Title permitido en Paso 2
- **WHEN** el documento en Paso 2 incluye `<title>` y meta description válidos
- **THEN** no se aplican los errores/warnings pedagógicos del Paso 1 que prohibían esos elementos

### Requirement: Nombre esperado index-v2
Cuando el HTML proviene de un archivo cargado, el sistema MUST validar el nombre `index-v2.html`. Si fue pegado, MUST recomendar ese nombre.

#### Scenario: Nombre de archivo Paso 2
- **WHEN** se carga `index-v1.html` en Paso 2
- **THEN** se reporta que el nombre esperado es `index-v2.html`

### Requirement: Title obligatorio
MUST existir exactamente un `<title>` no vacío. La longitud recomendada MUST evaluarse: mínimo 20 y máximo 65 caracteres (fuera de rango => `warning`). El sistema MUST advertir si el title es idéntico al `<h1>` o contiene expresiones genéricas (`Inicio`, `Página`, `Bienvenidos`, `Sin título`, `Home`).

#### Scenario: Sin title
- **WHEN** no existe `<title>`
- **THEN** se emite un resultado `error`

#### Scenario: Title genérico
- **WHEN** el title es "Inicio"
- **THEN** se emite un `warning`

### Requirement: Meta description obligatoria
MUST existir una única `<meta name="description" content="...">` con contenido. Longitud recomendada: mínimo 70 y máximo 165 caracteres. MUST NOT ser idéntica al title ni repetir artificialmente la misma frase.

#### Scenario: Falta meta description
- **WHEN** no hay meta description
- **THEN** se emite un resultado `error`

#### Scenario: Idéntica al title
- **WHEN** la meta description copia exactamente el title
- **THEN** se emite un resultado `error` o `warning` según severidad de regla (al menos no `passed`)

### Requirement: Relación title y H1
MUST mantenerse un único `<h1>`. La relación semántica entre title y H1 MUST marcarse como `manual-review`, no como verdad automática absoluta.

#### Scenario: Revisión de relación title-H1
- **WHEN** existen title y H1
- **THEN** se emite un resultado `manual-review` sobre su relación

### Requirement: Llamada a la acción
MUST existir al menos uno de: `<a>` accionable, `<button>`, `<form>`, enlace a contacto/compra/registro/descarga. El sistema MUST advertir textos genéricos (`clic aquí`, `ver más`, `enviar`, `leer más`, `continuar`).

#### Scenario: Sin CTA
- **WHEN** no hay elementos accionables detectables
- **THEN** se emite un resultado `error`

#### Scenario: CTA genérico
- **WHEN** el único enlace dice "clic aquí"
- **THEN** se emite un `warning`

### Requirement: Enlaces funcionales
Los enlaces internos MUST usar rutas relativas cuando corresponda. El sistema MUST rechazar `href="#"` como enlace funcional y enlaces vacíos. El texto del enlace MUST ser descriptivo. MUST advertir si todos los enlaces son externos o si no hay oportunidad de navegación/acción.

#### Scenario: href hash vacío funcional
- **WHEN** un enlace tiene `href="#"`
- **THEN** se emite un resultado `error` o `warning` indicando que no es enlace funcional

### Requirement: Keyword stuffing como revisión humana
El sistema MUST aplicar una heurística simple de repetición de expresiones (>4 caracteres) y MUST NOT declarar automáticamente keyword stuffing; MUST mostrar el hallazgo como `manual-review`.

#### Scenario: Repetición desproporcionada
- **WHEN** una expresión relevante se repite de forma desproporcionada
- **THEN** se emite `manual-review` sin afirmar stuffing como hecho

### Requirement: Revisión humana Paso 2
El sistema MUST emitir `manual-review` para: claridad del title; fidelidad de la meta description; si la página responde antes de desarrollar; adecuación del CTA al journey; si la acción podría medirse como evento.

#### Scenario: Checklist humana Paso 2
- **WHEN** se valida el Paso 2 con HTML parseable
- **THEN** se incluyen los ítems `manual-review` de la checklist on-page
