## ADDED Requirements

### Requirement: Contenido no vacío
El contenido de entrada MUST NOT estar vacío.

#### Scenario: Entrada vacía
- **WHEN** el usuario valida una cadena vacía o solo espacios
- **THEN** se emite un resultado `error` indicando contenido vacío

### Requirement: Interpretabilidad HTML
El archivo MUST poder interpretarse como HTML y MUST contener `<!doctype html>`, `<html>`, `<head>` y `<body>`.

#### Scenario: Falta doctype
- **WHEN** el documento no incluye `<!doctype html>`
- **THEN** se emite un resultado `error` al respecto

#### Scenario: Falta body
- **WHEN** el documento no incluye `<body>`
- **THEN** se emite un resultado `error` al respecto

### Requirement: Estructura única de documento
El documento MUST NOT contener múltiples elementos `<html>`, `<head>` o `<body>`, ni errores graves de anidamiento.

#### Scenario: Múltiples html
- **WHEN** existen dos o más etiquetas `<html>`
- **THEN** se emite un resultado `error`

### Requirement: Meta keywords prohibida
La etiqueta `<meta name="keywords">` MUST NOT aparecer nunca.

#### Scenario: Keywords presente
- **WHEN** el documento incluye meta keywords
- **THEN** se emite un resultado `error`

### Requirement: Textos de plantilla incompletos
El documento MUST NOT contener textos de plantilla sin completar, excepto el marcador permitido `[EVIDENCIA PENDIENTE]`.

#### Scenario: Placeholder no permitido
- **WHEN** el HTML contiene un placeholder de plantilla distinto de `[EVIDENCIA PENDIENTE]`
- **THEN** se emite un resultado `error` o `warning` según la severidad definida en reglas

#### Scenario: Evidencia pendiente permitida
- **WHEN** el único marcador incompleto es `[EVIDENCIA PENDIENTE]`
- **THEN** ese marcador no se trata como plantilla inválida por esta regla

### Requirement: Advertencias de seguridad básica
El sistema MUST emitir `warning` (y MUST NOT bloquear automáticamente por estos hallazgos) si aparecen: scripts externos, iframes, formularios con acciones externas, código inline potencialmente peligroso, o atributos `on*` (`onclick`, `onload`, etc.).

#### Scenario: Script externo
- **WHEN** existe un `<script src="https://...">`
- **THEN** se emite un `warning` de seguridad básica

#### Scenario: Atributo onclick
- **WHEN** un elemento tiene `onclick`
- **THEN** se emite un `warning` y la validación continúa
