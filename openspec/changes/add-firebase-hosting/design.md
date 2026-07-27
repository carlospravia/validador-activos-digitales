## Context

Cierra la cadena OpenSpec del MVP con el despliegue estático. El proyecto Firebase ya existe: `validador-activos-digitales`. La config web se inyecta por env para evitar hardcode en git.

## Goals / Non-Goals

**Goals:**
- Hosting estático del build Vite.
- SPA-friendly rewrites.
- Gobernanza de secretos/config vía `.env` / `.env.example`.

**Non-Goals:**
- Auth, Firestore, Functions, App Check (salvo necesidad futura).
- Pipelines CI complejos en este change.

## Decisions

### D1 — Solo Firebase Hosting
Sin otros productos Firebase en el MVP. Si más adelante se usa el SDK web, sigue leyendo env vars.

### D2 — `firebase.json` public = `dist`
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

### D3 — `.firebaserc`
```json
{ "projects": { "default": "validador-activos-digitales" } }
```

### D4 — Variables de entorno
```text
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=validador-activos-digitales
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Risks / Trade-offs

- Las apiKeys web de Firebase son públicas por diseño; aun así no se hardcodean para facilitar rotación y entornos.
- Rewrite catch-all puede ocultar 404 de assets mal referenciados; mitigación: paths de assets con hash de Vite.

## Open Questions

- Ninguna bloqueante.
