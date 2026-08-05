# LEAD Digital Asset Validator

Aplicación web estática para validar progresivamente archivos HTML del Curso Profesional de SEO (Clase 3).

## Documentación

- Especificación de producto: [`docs/SPEC-Validador-de-Activos-Digitales.md`](docs/SPEC-Validador-de-Activos-Digitales.md)
- Ejemplo oficial incremental: [`docs/examples/activo-digital-blog/`](docs/examples/activo-digital-blog/)
- Índice de ejemplos: [`docs/examples/README.md`](docs/examples/README.md)
- OpenSpec (cambios activos): `openspec/changes/`

## Stack

- Vite + React + TypeScript
- Procesamiento 100% local en el navegador
- Despliegue en Firebase Hosting (`validador-activos-digitales`)

## Desarrollo

```bash
cp .env.example .env   # opcional; config Firebase vía VITE_FIREBASE_*
npm install
npm run dev
```

## Calidad

```bash
npm run typecheck
npm test
npm run build
```

## Despliegue (Firebase Hosting)

```bash
npm run build
npx firebase-tools deploy --only hosting
```

El build genera `dist/`. `firebase.json` publica ese directorio y reescribe rutas SPA a `index.html`.

## Privacidad

El HTML del estudiante se analiza solo en el navegador. No se envía ni almacena en servidores. El MVP no incluye analytics.

## OpenSpec

```bash
openspec list
openspec validate --all
```
