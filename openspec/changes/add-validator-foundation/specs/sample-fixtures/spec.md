## ADDED Requirements

### Requirement: Samples por etapa
La aplicación MUST incluir cinco archivos internos de ejemplo: `sample-v1.html`, `sample-v2.html`, `sample-v3.html`, `sample-v4.html`, `sample-final.html`.

#### Scenario: Cargar ejemplo de Paso 1
- **WHEN** el usuario elige cargar el ejemplo de Paso 1
- **THEN** se carga el contenido de `sample-v1.html` en la entrada

### Requirement: Fixture incorrecto
La aplicación MUST incluir al menos un archivo deliberadamente incorrecto para probar errores.

#### Scenario: Cargar fixture incorrecto
- **WHEN** el usuario (o una prueba) carga el fixture incorrecto
- **THEN** la validación produce uno o más resultados con estado `error`

### Requirement: Samples solo locales
Los samples MUST empaquetarse con la aplicación estática y MUST NOT requerir descarga remota en tiempo de validación.

#### Scenario: Uso offline de samples
- **WHEN** la app ya está cargada en el navegador
- **THEN** los samples están disponibles sin una petición de red adicional a un servidor de contenidos de ejemplos
