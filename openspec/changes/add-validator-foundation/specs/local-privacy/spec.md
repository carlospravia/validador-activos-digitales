## ADDED Requirements

### Requirement: Análisis exclusivamente local
El sistema MUST analizar el HTML del estudiante únicamente en el navegador del usuario. El contenido MUST NOT enviarse ni almacenarse en ningún servidor remoto como parte del flujo de validación del MVP.

#### Scenario: Validación sin red de aplicación
- **WHEN** el usuario ejecuta una validación con HTML pegado o cargado
- **THEN** el análisis se completa sin enviar el contenido HTML a un backend de la aplicación

### Requirement: Aviso permanente de privacidad
La interfaz MUST mostrar de forma permanente el mensaje: "El archivo se analiza localmente en tu navegador. No se carga ni se almacena en ningún servidor."

#### Scenario: Aviso visible en pantalla principal
- **WHEN** el usuario abre la aplicación
- **THEN** el aviso de privacidad es visible sin requerir interacción adicional

### Requirement: Sin analytics en el MVP
El MVP MUST NOT integrar analytics de terceros salvo autorización posterior explícita.

#### Scenario: Sin telemetría por defecto
- **WHEN** se despliega el MVP
- **THEN** no se cargan scripts de analytics ni se envían eventos de uso del contenido validado
