## ADDED Requirements

### Requirement: Identidad de la pantalla principal
La aplicación MUST mostrar el título "Validador de Activos Digitales" y el subtítulo "Valida cada etapa antes de avanzar al siguiente paso."

#### Scenario: Cabecera visible
- **WHEN** el usuario abre la pantalla principal
- **THEN** se muestran el título y el subtítulo definidos

### Requirement: Selector de etapa
El sistema MUST permitir seleccionar una de estas etapas:
1. Paso 1 — Estructura semántica
2. Paso 2 — Optimización On-Page
3. Paso 3 — Accesibilidad y legibilidad
4. Paso 4 — Datos estructurados
5. Paso 5 — Auditoría final

#### Scenario: Cambio de etapa
- **WHEN** el usuario selecciona el Paso 3
- **THEN** la etapa activa queda marcada como Paso 3 para la siguiente validación

### Requirement: Entrada de HTML
El sistema MUST permitir al menos: arrastrar un archivo `.html`, seleccionar un archivo `.html`, pegar código HTML, y cargar un ejemplo interno.

#### Scenario: Pegado de código
- **WHEN** el usuario pega HTML en el área de entrada y pulsa Validar
- **THEN** el motor recibe ese contenido como entrada de validación

#### Scenario: Carga de archivo
- **WHEN** el usuario selecciona un archivo con extensión `.html`
- **THEN** el contenido del archivo se carga en la entrada y el nombre de archivo queda disponible para el reporte

### Requirement: Acción principal de validación
La UI MUST exponer una acción principal "Validar archivo" que dispara la validación de la etapa seleccionada.

#### Scenario: Validar con entrada vacía
- **WHEN** el usuario pulsa Validar sin contenido
- **THEN** el sistema reporta el incumplimiento de contenido vacío sin fallar la aplicación

### Requirement: Cabecera del reporte
Tras validar, el reporte MUST mostrar resultado general, etapa validada, nombre del archivo (si aplica) y fecha/hora local.

#### Scenario: Reporte tras validación exitosa de ejecución
- **WHEN** una validación termina
- **THEN** la cabecera del reporte incluye etapa, marca temporal local y estado general

### Requirement: Filtros de resultados
El usuario MUST poder filtrar resultados por: Todos, Errores, Advertencias, Completados, Revisión humana.

#### Scenario: Filtrar errores
- **WHEN** el usuario elige el filtro Errores
- **THEN** solo se listan resultados con estado `error`

### Requirement: Tarjeta de resultado
Cada tarjeta MUST mostrar icono, estado, título, explicación, evidencia (si existe), recomendación (si existe) y selector/fragmento relacionado (si existe).

#### Scenario: Tarjeta de error con corrección
- **WHEN** un resultado tiene estado `error` y una recomendación
- **THEN** la tarjeta muestra título, explicación y la corrección recomendada

### Requirement: Resumen exportable
El usuario MUST poder copiar o descargar un resumen textual de los resultados.

#### Scenario: Copiar resumen
- **WHEN** el usuario activa la acción de copiar resumen
- **THEN** el portapapeles recibe un resumen con estados y títulos de hallazgos

### Requirement: Tokens visuales LEAD
La UI SHOULD usar fondo principal `#25292C` (o similar), acento `#FF7A1A`, blanco `#FFFFFF` y gris claro `#F2F2F2`. Los estados MUST distinguirse además del color: completado verde, error rojo, advertencia amarillo, revisión humana azul.

#### Scenario: Estado no solo por color
- **WHEN** se renderiza un resultado `error`
- **THEN** el estado se comunica con texto y/o icono además del color

### Requirement: Accesibilidad de la aplicación
La aplicación MUST ser navegable con teclado, usar labels en formularios, contraste adecuado y mensajes de estado accesibles. Los resultados MUST NOT depender solo del color.

#### Scenario: Navegación por teclado al validador
- **WHEN** el usuario navega solo con teclado
- **THEN** puede alcanzar el selector de etapa, la entrada, Validar y los filtros
