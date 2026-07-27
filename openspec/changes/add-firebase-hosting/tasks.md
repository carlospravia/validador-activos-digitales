## 1. Configuración Firebase Hosting

- [ ] 1.1 Añadir `firebase.json` con `public: dist` y rewrite SPA a `index.html`
- [ ] 1.2 Añadir `.firebaserc` con default `validador-activos-digitales`
- [ ] 1.3 Añadir dependencia/tooling Firebase CLI según convención del equipo (`firebase-tools` o npx)

## 2. Variables de entorno

- [ ] 2.1 Crear `.env.example` con placeholders `VITE_FIREBASE_*`
- [ ] 2.2 Confirmar `.gitignore` excluye `.env` y permite `.env.example`
- [ ] 2.3 Si se usa el SDK web, leer config solo desde `import.meta.env`

## 3. Documentación y verificación

- [ ] 3.1 Documentar en README: build, preview, deploy (`firebase deploy --only hosting`)
- [ ] 3.2 Verificar `npm run build` produce `dist/`
- [ ] 3.3 Verificar deploy de smoke a Hosting (manual) y que la raíz carga
