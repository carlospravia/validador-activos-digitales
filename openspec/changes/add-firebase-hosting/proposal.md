## Why

El MVP debe desplegarse como sitio estático en Firebase Hosting (`projectId: validador-activos-digitales`) sin backend. Hace falta un contrato explícito de build, rewrites SPA y configuración vía variables de entorno para no hardcodear secretos/config en el repositorio.

## What Changes

- Definir despliegue estático con `npm run build` y Firebase Hosting.
- Configurar rewrite SPA para que cambios de ruta no generen errores 404 de Hosting.
- Exigir configuración Firebase vía `VITE_FIREBASE_*` / `.env` + `.env.example` (sin hardcode de apiKey en el código fuente versionado).

## Non-goals

- Cloud Functions, Auth, Firestore, Storage de archivos de estudiantes.
- CI/CD completo (puede añadirse después).
- Implementar la aplicación más allá de la configuración de hosting.

## Capabilities

### New Capabilities

- `firebase-hosting`: Build estático, Hosting, SPA rewrite, env-based Firebase web config.

### Modified Capabilities

- (ninguna)

## Impact

- Archivos futuros: `firebase.json`, `.firebaserc`, `.env.example`, scripts de deploy en README.
- Proyecto Firebase: `validador-activos-digitales`.
- Fuente: SPEC §§3, 4, 20 (despliegue).
