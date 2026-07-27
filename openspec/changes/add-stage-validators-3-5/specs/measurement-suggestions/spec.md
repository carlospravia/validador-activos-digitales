## ADDED Requirements

### Requirement: Identificar elementos medibles
En Paso 5, el sistema MUST identificar elementos potencialmente medibles: enlaces, botones, formularios, descargas, correos, teléfonos, navegación y CTA.

#### Scenario: Botón CTA detectado
- **WHEN** existe un botón principal accionable
- **THEN** se sugiere al menos un evento relacionado (p.ej. `cta_click`)

### Requirement: Tabla de eventos sugeridos
El sistema MUST generar una tabla con columnas: Evento sugerido, Elemento, Acción, Parámetro recomendado. Ejemplos MUST incluir al menos: `cta_click`, `form_start`, `form_submit`, `file_download`, `contact_click` cuando existan elementos correspondientes.

#### Scenario: Formulario presente
- **WHEN** hay un formulario
- **THEN** la tabla incluye sugerencias `form_start` y `form_submit` con parámetro `form_name`

### Requirement: Sin implementación de GA4
La aplicación MUST NOT implementar Google Analytics 4 ni enviar eventos. Solo MUST proponer eventos sugeridos.

#### Scenario: Sin envío de analytics
- **WHEN** el usuario ve sugerencias de medición
- **THEN** no se cargan ni disparan trackers de analytics como parte de esta capability
