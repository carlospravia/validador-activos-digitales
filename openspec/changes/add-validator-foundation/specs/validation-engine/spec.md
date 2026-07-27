## ADDED Requirements

### Requirement: Estados de validación
El motor MUST usar exactamente estos estados:
`passed`, `error`, `warning`, `manual-review`, `not-applicable`.

#### Scenario: Mapeo semántico de estados
- **WHEN** un requisito obligatorio no se cumple
- **THEN** el resultado usa estado `error`
- **WHEN** un hallazgo no bloquea pero sugiere mejora
- **THEN** el resultado usa estado `warning`
- **WHEN** la app no puede determinarlo de forma confiable
- **THEN** el resultado usa estado `manual-review`

### Requirement: Modelo ValidationResult
Cada hallazgo MUST incluir: `id`, `category`, `title`, `description`, `status`, `severity` (`critical` | `high` | `medium` | `low`), y MAY incluir `evidence`, `recommendation`, `selector`.

#### Scenario: Resultado mínimo válido
- **WHEN** el motor emite un hallazgo
- **THEN** el objeto incluye id, category, title, description, status y severity

### Requirement: Ejecución fail-safe
Los errores de parseo o reglas MUST NOT provocar que la aplicación falle. HTML inválido o JSON-LD inválido MUST manejarse de forma segura y producir resultados comprensibles.

#### Scenario: HTML malformado
- **WHEN** la entrada no puede interpretarse como HTML usable
- **THEN** el motor reporta errores de sintaxis/archivo y la UI permanece operativa

### Requirement: No ejecutar JavaScript del estudiante
El sistema MUST NOT ejecutar scripts ni manejadores incluidos en el HTML del estudiante durante la validación.

#### Scenario: Script en el documento
- **WHEN** el HTML contiene `<script>` o atributos `on*`
- **THEN** esos scripts no se ejecutan como parte del análisis

### Requirement: Acumulación por etapa (contrato)
El motor MUST permitir que etapas posteriores agreguen reglas sobre un conjunto base. En este change, solo las reglas generales están activas; las etapas específicas se añaden en changes posteriores.

#### Scenario: Etapa seleccionada sin reglas de etapa aún
- **WHEN** el usuario valida en Paso 1 antes de implementar reglas de etapa
- **THEN** al menos las reglas generales se ejecutan y el motor no falla
