## ADDED Requirements

### Requirement: Nombre esperado index-v3
Cuando la fuente es archivo, el sistema MUST validar el nombre `index-v3.html`; si es pegado, MUST recomendarlo.

#### Scenario: Nombre incorrecto Paso 3
- **WHEN** se carga un archivo distinto de `index-v3.html` en Paso 3
- **THEN** se reporta el nombre esperado

### Requirement: Composición con etapas anteriores
El Paso 3 MUST ejecutar las reglas anteriores aplicables además de las de accesibilidad/legibilidad.

#### Scenario: Pipeline acumulativo
- **WHEN** el usuario valida en Paso 3
- **THEN** se ejecutan reglas generales y de etapas previas además de las de Paso 3

### Requirement: Idioma del documento
El elemento `<html>` MUST incluir `lang` con valor `es`, `es-CR`, `es-MX` o `es-ES`. El sistema MUST advertir si se usa `hreflang` sin versiones alternativas.

#### Scenario: Falta lang
- **WHEN** `<html>` no tiene atributo `lang`
- **THEN** se emite un resultado `error` recomendando `<html lang="es">`

#### Scenario: lang válido regional
- **WHEN** `lang="es-CR"`
- **THEN** el requisito de idioma se marca `passed`

### Requirement: Imágenes con alt
Para cada `<img>`, MUST existir atributo `alt`. `alt=""` es válido si es decorativa; si tiene contenido/función, alt MUST NOT estar vacío. El sistema MUST advertir alt con “imagen de”/“foto de”/“gráfico de”, alt igual al nombre de archivo, o alt > ~180 caracteres.

#### Scenario: img sin alt
- **WHEN** una imagen no tiene atributo `alt`
- **THEN** se emite un resultado `error`

### Requirement: Formularios accesibles
Cada campo MUST tener label asociado (`for`/`id`, envolvente válida, o nombre accesible equivalente). Placeholder-only MUST NOT aceptarse como etiqueta.

#### Scenario: Solo placeholder
- **WHEN** un input solo tiene `placeholder` sin label/nombre accesible
- **THEN** se emite un resultado `error`

### Requirement: Botones y enlaces con nombre accesible
Botones y enlaces MUST NOT estar vacíos y MUST tener nombre accesible. El sistema MUST advertir textos genéricos (`clic aquí`, `ver más`, `leer`, `enviar`).

#### Scenario: Botón vacío
- **WHEN** un `<button>` no tiene nombre accesible
- **THEN** se emite un resultado `error`

### Requirement: ARIA redundante
El sistema MUST detectar roles ARIA redundantes (`button role="button"`, `nav role="navigation"`, `main role="main"`) y MUST emitir `warning` (MUST NOT declarar automáticamente que ARIA es incorrecto en todos los casos). MUST advertir `aria-label` cuando ya hay texto visible suficiente.

#### Scenario: role redundante en main
- **WHEN** existe `<main role="main">`
- **THEN** se emite un `warning`

### Requirement: Legibilidad
El sistema MUST advertir párrafos >120 palabras, bloques largos sin encabezados, listas aparentes con guiones en párrafos, y más de cinco párrafos consecutivos sin subtítulo.

#### Scenario: Párrafo muy largo
- **WHEN** un párrafo supera 120 palabras
- **THEN** se emite un `warning` de legibilidad

### Requirement: Integración axe-core (objetivo con deferral)
El sistema MUST definir la ejecución de `axe-core` sobre una representación renderizada sin ejecutar scripts del estudiante, mostrando violaciones con impacto, selector y recomendación. Si la integración bloquea el MVP, la deferral MUST quedar documentada en tasks y el resto de reglas del Paso 3 MUST permanecer implementadas.

#### Scenario: Violación axe cuando está habilitado
- **WHEN** axe-core está integrado y detecta una violación
- **THEN** se emite un resultado con impacto, selector y recomendación

#### Scenario: Deferral documentada
- **WHEN** el equipo difiere axe-core por complejidad de integración
- **THEN** las demás reglas del Paso 3 siguen disponibles y la deferral está explícita en el plan de tareas

### Requirement: Revisión humana Paso 3
El sistema MUST emitir `manual-review` sobre escaneo de encabezados/listas, claridad para no técnicos, revelación de enlaces y orden de lectura.

#### Scenario: Checklist humana Paso 3
- **WHEN** se valida Paso 3 con HTML parseable
- **THEN** se incluyen ítems `manual-review` de accesibilidad/legibilidad editorial
