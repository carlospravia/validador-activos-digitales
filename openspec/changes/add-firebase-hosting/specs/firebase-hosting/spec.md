## ADDED Requirements

### Requirement: Build estático producible
El proyecto MUST generar la aplicación con `npm run build` como sitio estático servible por Firebase Hosting.

#### Scenario: Build de producción
- **WHEN** se ejecuta `npm run build` en un checkout con dependencias instaladas
- **THEN** se produce un directorio de salida estático (p.ej. `dist/`) listo para Hosting

### Requirement: Proyecto Firebase explícito
La configuración de Hosting MUST apuntar al proyecto `validador-activos-digitales` (vía `.firebaserc` o equivalente), sin requerir backend.

#### Scenario: Project id
- **WHEN** un operador inspecciona la config de Firebase del repo
- **THEN** el `projectId` efectivo es `validador-activos-digitales`

### Requirement: SPA rewrite sin errores de ruta
Firebase Hosting MUST reescribir rutas de cliente al `index.html` de forma que la navegación/recarga de rutas de la SPA no produzca error 404 de Hosting.

#### Scenario: Recarga en ruta cliente
- **WHEN** un usuario recarga una ruta manejada por el router cliente (si existe) o la raíz
- **THEN** Hosting sirve la app estática sin 404 de infraestructura

### Requirement: Config web vía variables de entorno
La configuración web de Firebase (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`) MUST cargarse desde variables de entorno (`VITE_FIREBASE_*` o equivalente documentado). El repositorio MUST incluir `.env.example` con placeholders y MUST NOT commitear un `.env` con valores reales.

#### Scenario: Sin secretos en fuente
- **WHEN** se revisa el código fuente versionado
- **THEN** no aparecen apiKeys/config reales hardcodeadas en archivos tracked

#### Scenario: Ejemplo de entorno
- **WHEN** un desarrollador clona el repo
- **THEN** encuentra `.env.example` documentando las claves `VITE_FIREBASE_*` requeridas

### Requirement: Deploy documentado
El README o runbook MUST documentar los pasos para `firebase deploy` (o script equivalente) hacia Hosting.

#### Scenario: Instrucciones de deploy
- **WHEN** un operador sigue la documentación del repo
- **THEN** puede desplegar el build estático a Firebase Hosting del proyecto indicado
