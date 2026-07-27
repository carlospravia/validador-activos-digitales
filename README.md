# LEAD Digital Asset Validator

Aplicación web estática para validar progresivamente archivos HTML del Curso Profesional de SEO (Clase 3).

## Documentación

- Especificación de producto: [`docs/SPEC-Validador-de-Activos-Digitales.md`](docs/SPEC-Validador-de-Activos-Digitales.md)
- OpenSpec (cambios activos): `openspec/changes/`

## Stack previsto (MVP)

- Vite + React + TypeScript
- Procesamiento 100% local en el navegador
- Despliegue en Firebase Hosting

## OpenSpec

Este repositorio usa [OpenSpec](https://github.com/Fission-AI/OpenSpec) (schema `spec-driven`).

```bash
openspec list
openspec validate <change-name>
```

## Privacidad

El HTML del estudiante se analiza solo en el navegador. No se envía ni almacena en servidores.
