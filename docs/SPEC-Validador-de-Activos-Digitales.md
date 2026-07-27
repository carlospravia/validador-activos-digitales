# SPEC.md — Validador de Activos Digitales

## 1. Nombre del proyecto

**LEAD Digital Asset Validator**

Aplicación web para validar progresivamente archivos HTML creados durante la Clase 3 del Curso Profesional de SEO.

---

## 2. Objetivo

Permitir que los estudiantes:

1. Seleccionen la etapa del ejercicio que están completando.
2. Peguen código HTML o suban un archivo `.html`.
3. Ejecuten una validación inmediata.
4. Identifiquen requisitos cumplidos, errores, advertencias, recomendaciones y elementos que requieren revisión humana.
5. Corrijan el archivo antes de continuar con la siguiente etapa.

La aplicación debe validar el proceso incremental:

```text
index-v1.html → Estructura
index-v2.html → On-Page
index-v3.html → Accesibilidad
index-v4.html → Entidades y Schema
index-final.html → Auditoría integral
```

---

## 3. Alcance del MVP

### Incluido

- Aplicación estática.
- Sin autenticación.
- Sin base de datos.
- Sin envío de archivos a servidores.
- Procesamiento completamente local en el navegador.
- Carga de archivos `.html`.
- Pegado manual de código.
- Validación por etapa.
- Reporte visual de resultados.
- Resumen descargable o copiable.
- Diseño responsive.
- Despliegue en Firebase Hosting.

### Fuera del alcance inicial

- Publicación del HTML del estudiante.
- Validación de URLs remotas.
- Lighthouse completo.
- Integración con Search Console.
- Evaluación editorial profunda con IA.
- Corrección automática del código.
- Almacenamiento de historial.

---

## 4. Stack recomendado

```text
Vite
React
TypeScript
Firebase Hosting
```

Dependencias sugeridas:

```text
html-validate
axe-core
ajv
json5
lucide-react
```

Opcional:

```text
prettier
```

No utilizar Next.js ni backend para este MVP.

---

## 5. Flujo de usuario

### Pantalla principal

**Título:** Validador de Activos Digitales

**Subtítulo:** Valida cada etapa antes de avanzar al siguiente paso.

**Selector de etapa:**

- Paso 1 — Estructura semántica
- Paso 2 — Optimización On-Page
- Paso 3 — Accesibilidad y legibilidad
- Paso 4 — Datos estructurados
- Paso 5 — Auditoría final

**Entrada:**

- arrastrar un archivo `.html`;
- seleccionar un archivo;
- pegar directamente el código;
- cargar un ejemplo.

**Acción principal:** Validar archivo

---

## 6. Estados de validación

```typescript
type ValidationStatus =
  | "passed"
  | "error"
  | "warning"
  | "manual-review"
  | "not-applicable";
```

- `passed`: el requisito se cumple.
- `error`: el requisito obligatorio no se cumple.
- `warning`: no bloquea el ejercicio, pero representa una oportunidad de mejora.
- `manual-review`: la aplicación no puede determinarlo de manera confiable.
- `not-applicable`: el elemento no existe o no corresponde al archivo evaluado.

---

## 7. Modelo de resultado

```typescript
interface ValidationResult {
  id: string;
  category: string;
  title: string;
  description: string;
  status: ValidationStatus;
  severity: "critical" | "high" | "medium" | "low";
  evidence?: string;
  recommendation?: string;
  selector?: string;
}
```

---

## 8. Reglas generales

Estas reglas se ejecutan en todas las etapas.

### Archivo y sintaxis

- El contenido no debe estar vacío.
- El archivo debe poder interpretarse como HTML.
- Debe contener `<!doctype html>`.
- Debe contener `<html>`, `<head>` y `<body>`.
- No debe contener errores graves de anidamiento.
- No debe contener múltiples elementos `<html>`, `<head>` o `<body>`.
- La etiqueta `<meta name="keywords">` no debe aparecer nunca.
- No debe contener textos de plantilla sin completar, excepto `[EVIDENCIA PENDIENTE]`.

### Seguridad básica

Advertir si aparecen:

- scripts externos;
- iframes;
- formularios con acciones externas;
- código inline potencialmente peligroso;
- manejadores como `onclick`, `onload` u otros atributos `on*`.

No bloquear automáticamente, pero mostrar advertencia.

---

## 9. Paso 1 — Estructura semántica

### Nombre esperado

```text
index-v1.html
```

El nombre se valida únicamente cuando el archivo fue cargado. Si el estudiante pegó el código, mostrarlo como recomendación.

### Requisitos obligatorios

#### Documento

- Un único `<h1>`.
- Al menos un `<main>`.
- Al menos un `<article>` o una estructura equivalente claramente definida.
- Al menos una etiqueta `<section>`.
- Uso de `<header>` cuando exista encabezado de página o artículo.
- Uso de `<footer>` cuando exista cierre, autoría o llamada final.
- No utilizar únicamente `<div>` para toda la estructura.

#### Encabezados

- Solo un `<h1>`.
- Debe existir al menos un `<h2>`.
- No saltar niveles injustificadamente.
- Los encabezados no deben estar vacíos.
- Los encabezados no deben usarse únicamente para formato visual.

#### Contenido

- Debe existir contenido introductorio después del `<h1>` o dentro del primer bloque principal.
- Deben existir al menos dos secciones de contenido.
- Advertir cuando existan párrafos vacíos.
- Advertir cuando una sección no tenga encabezado.
- Aceptar `[EVIDENCIA PENDIENTE]`.

#### Restricciones pedagógicas de esta etapa

- No debe existir `<meta name="description">`.
- No debe existir `<meta name="keywords">`.
- No debe existir CSS: `<style>`, atributos `style` o enlaces a hojas de estilo.
- No debe existir JavaScript: `<script>` o atributos de eventos.
- Si existe `<title>`, mostrar advertencia: “En esta etapa del ejercicio el title se incorporará en el Paso 2”.

No considerarlo error técnico de HTML, sino incumplimiento del ejercicio.

### Revisión humana

- ¿El H1 refleja la intención principal?
- ¿La introducción responde directamente a la necesidad del usuario?
- ¿Las secciones siguen una secuencia lógica?
- ¿Las afirmaciones relevantes están respaldadas por evidencia?

---

## 10. Paso 2 — Optimización On-Page

### Nombre esperado

```text
index-v2.html
```

Debe ejecutar también todas las validaciones del Paso 1, excepto las restricciones sobre `title` y meta description.

### Requisitos obligatorios

#### Title

- Debe existir exactamente un `<title>`.
- No debe estar vacío.
- Longitud recomendada: mínimo 20 y máximo 65 caracteres.
- Advertir si es idéntico al `<h1>`.
- Advertir si contiene expresiones genéricas como Inicio, Página, Bienvenidos, Sin título o Home.

#### Meta description

- Debe existir una única `<meta name="description" content="...">`.
- Debe tener contenido.
- Longitud recomendada: mínimo 70 y máximo 165 caracteres.
- No debe ser idéntica al title.
- No debe repetir de forma artificial la misma frase.

#### Encabezados

- Mantener un único `<h1>`.
- El title y el H1 deben estar relacionados.
- No deben ser copias mecánicas.

La relación semántica debe marcarse como revisión humana, no validarse automáticamente como verdad absoluta.

#### Llamada a la acción

Debe existir al menos uno de estos elementos:

- `<a>` claramente accionable;
- `<button>`;
- `<form>`;
- enlace a contacto;
- enlace a compra;
- enlace a registro;
- enlace a descarga.

Advertir si el texto es genérico: clic aquí, ver más, enviar, leer más o continuar.

#### Enlaces

- Los enlaces internos deben utilizar rutas relativas cuando corresponda.
- No aceptar `href="#"` como enlace funcional.
- No aceptar enlaces vacíos.
- El texto del enlace debe ser descriptivo.
- Advertir cuando todos los enlaces sean externos.
- Advertir cuando no exista ninguna oportunidad de navegación o acción.

#### Keyword stuffing

Aplicar una heurística simple:

- obtener palabras relevantes de más de cuatro caracteres;
- advertir cuando una misma expresión aparezca con frecuencia desproporcionada;
- no declarar automáticamente que existe keyword stuffing;
- mostrar siempre como revisión humana.

### Revisión humana

- ¿El title describe claramente la página?
- ¿La meta description representa fielmente el contenido?
- ¿La página responde antes de desarrollar?
- ¿La llamada a la acción corresponde con el journey?
- ¿La acción podría medirse como evento?

---

## 11. Paso 3 — Accesibilidad y legibilidad

### Nombre esperado

```text
index-v3.html
```

Ejecutar las reglas anteriores y agregar validación con `axe-core`.

### Requisitos obligatorios

#### Idioma

El elemento `<html>` debe incluir `<html lang="es">`.

También son válidos `es-CR`, `es-MX` y `es-ES`.

Advertir si se utiliza `hreflang` sin existir versiones alternativas.

#### Imágenes

Para cada `<img>`:

- debe existir atributo `alt`;
- si la imagen es decorativa, `alt=""` es válido;
- si tiene contenido o función, el alt no debe estar vacío;
- advertir si el alt contiene “imagen de”, “foto de” o “gráfico de”;
- advertir si el alt es igual al nombre del archivo;
- advertir si supera aproximadamente 180 caracteres.

#### Formularios

Cada campo debe tener:

- un `<label>` asociado mediante `for` e `id`; o
- una etiqueta envolvente válida; o
- un nombre accesible equivalente.

No aceptar únicamente `placeholder` como etiqueta.

#### Botones y enlaces

- No deben estar vacíos.
- Deben tener un nombre accesible.
- Evitar textos como clic aquí, ver más, leer o enviar.

#### HTML semántico

- No añadir roles ARIA redundantes como `<button role="button">`, `<nav role="navigation">` o `<main role="main">`.
- Advertir por `aria-label` cuando ya existe texto visible suficiente.
- No declarar que ARIA es incorrecto automáticamente; clasificar como warning.

#### Legibilidad

- Advertir si un párrafo supera 120 palabras.
- Advertir si existe un bloque de texto muy largo sin encabezados.
- Advertir si una lista aparente está escrita con guiones dentro de párrafos.
- Advertir si hay más de cinco párrafos consecutivos sin subtítulo.

#### Axe

Ejecutar `axe-core` sobre una representación renderizada del HTML.

Mostrar violaciones, impacto, selector y recomendación.

No ejecutar scripts incluidos por el estudiante.

### Revisión humana

- ¿El texto puede comprenderse al escanear encabezados y listas?
- ¿El lenguaje es claro para una persona no técnica?
- ¿Los enlaces revelan qué sucederá?
- ¿El orden del contenido corresponde con el orden de lectura?

---

## 12. Paso 4 — Datos estructurados

### Nombre esperado

```text
index-v4.html
```

### Requisitos obligatorios

#### JSON-LD

Debe existir al menos un bloque `<script type="application/ld+json">`.

#### Sintaxis

- El contenido debe ser JSON válido.
- Debe existir `@context`.
- `@context` debe apuntar a `https://schema.org`.
- Debe existir `@type`.
- `@type` no debe estar vacío.
- No aceptar comentarios dentro del JSON.
- No aceptar `[EVIDENCIA PENDIENTE]` dentro del JSON-LD.

#### Tipos frecuentes reconocidos

- Article
- BlogPosting
- WebPage
- Product
- LocalBusiness
- Event
- FAQPage
- HowTo
- Organization
- Person
- BreadcrumbList

#### Validación por tipo

##### Article o BlogPosting

Advertir si faltan `headline`, `author` o `datePublished`. No obligar propiedades si no existe evidencia visible.

##### Product

Advertir si faltan `name`, `description` u `offers`.

Marcar como error cuando se use `aggregateRating` o `review` y no exista contenido visible relacionado con reseñas.

##### FAQPage

Requiere `mainEntity`, preguntas y respuestas. Verificar que las preguntas y respuestas aparezcan también en el texto visible.

##### LocalBusiness

Advertir si faltan `name`, `address` o `telephone`.

##### Event

Advertir si faltan `name`, `startDate` o `location`.

#### Coherencia visible

Comparar propiedades sencillas con el contenido visible:

- headline;
- name;
- description;
- datePublished;
- author.name.

Estados:

- encontrado en contenido visible;
- no encontrado;
- requiere revisión.

No afirmar que una propiedad es falsa solamente porque el texto no coincida literalmente.

#### Resultado enriquecido

Mostrar claramente:

> Usar Schema.org no garantiza un resultado enriquecido.

Separar:

- validez de Schema.org;
- elegibilidad documentada por Google;
- presencia real del contenido;
- decisión final del motor de búsqueda.

### Revisión humana

- ¿El tipo describe el contenido principal?
- ¿Cada propiedad tiene respaldo?
- ¿El marcado representa la página o está describiendo otra entidad?
- ¿Se agregó información solo para intentar obtener un rich result?

---

## 13. Paso 5 — Auditoría final

### Nombre esperado

```text
index-final.html
```

Ejecutar todas las reglas de las etapas anteriores.

### Categorías del reporte

- Documento y sintaxis.
- Estructura semántica.
- Encabezados.
- SEO On-Page.
- Intención y claridad.
- Enlaces y CTA.
- Accesibilidad.
- Legibilidad.
- Datos estructurados.
- Coherencia.
- Medición.

### Resumen

Mostrar:

```text
Puntaje técnico
Errores críticos
Errores altos
Advertencias
Revisiones humanas pendientes
```

### Puntaje

Texto obligatorio:

> Este puntaje refleja únicamente las reglas verificables incluidas en este ejercicio. No representa una garantía de posicionamiento, accesibilidad completa ni elegibilidad para resultados enriquecidos.

Propuesta:

```typescript
critical error = -15
high error = -10
medium error = -5
low warning = -2
manual review = 0
```

Puntaje mínimo: 0. Puntaje máximo: 100.

---

## 14. Medición

En el Paso 5, identificar elementos potencialmente medibles:

- enlaces;
- botones;
- formularios;
- descargas;
- correos;
- teléfonos;
- elementos de navegación;
- CTA.

Generar una tabla:

| Evento sugerido | Elemento | Acción | Parámetro recomendado |
|---|---|---|---|
| `cta_click` | Botón principal | Clic | `cta_text` |
| `form_start` | Formulario | Primer ingreso | `form_name` |
| `form_submit` | Formulario | Envío | `form_name` |
| `file_download` | Enlace descargable | Clic | `file_name` |
| `contact_click` | Email o teléfono | Clic | `contact_type` |

La aplicación no implementa GA4. Solo propone eventos.

---

## 15. Interfaz del reporte

### Cabecera

```text
Resultado general
Etapa validada
Nombre del archivo
Fecha y hora local
```

### Filtros

- Todos.
- Errores.
- Advertencias.
- Completados.
- Revisión humana.

### Tarjeta de resultado

Cada tarjeta debe mostrar:

- icono;
- estado;
- título;
- explicación;
- evidencia;
- recomendación;
- selector o fragmento relacionado.

Ejemplo:

```text
ERROR — Falta idioma principal

No se encontró el atributo lang en el elemento <html>.

Corrección recomendada:
<html lang="es">
```

---

## 16. Privacidad

Mostrar permanentemente:

> El archivo se analiza localmente en tu navegador. No se carga ni se almacena en ningún servidor.

No utilizar analytics en el MVP, salvo autorización posterior.

---

## 17. Requisitos visuales

```text
Fondo principal: #25292C o similar
Naranja de énfasis: #FF7A1A
Blanco: #FFFFFF
Gris claro: #F2F2F2
```

Estados:

```text
Completado: verde
Error: rojo
Advertencia: amarillo
Revisión humana: azul
```

Diseño consistente con el material de LEAD.

---

## 18. Componentes sugeridos

```text
App
├── Header
├── StageSelector
├── InputTabs
│   ├── FileUploader
│   └── CodeEditor
├── ValidateButton
├── PrivacyNotice
├── ValidationSummary
├── ResultsFilter
├── ResultsList
│   └── ResultCard
├── MeasurementSuggestions
└── ExportReportButton
```

---

## 19. Organización del código

```text
src/
├── components/
├── validators/
│   ├── generalValidator.ts
│   ├── semanticValidator.ts
│   ├── onPageValidator.ts
│   ├── accessibilityValidator.ts
│   ├── schemaValidator.ts
│   ├── measurementValidator.ts
│   └── finalAuditValidator.ts
├── rules/
│   ├── generalRules.ts
│   ├── stage1Rules.ts
│   ├── stage2Rules.ts
│   ├── stage3Rules.ts
│   └── stage4Rules.ts
├── types/
├── utils/
│   ├── parseHtml.ts
│   ├── extractJsonLd.ts
│   └── scoring.ts
├── data/
│   └── sampleFiles.ts
└── App.tsx
```

---

## 20. Condiciones de aceptación

### Archivo

- Se puede subir un `.html`.
- Se puede pegar código.
- Se puede limpiar la entrada.
- El código nunca se envía al servidor.

### Validación

- Cada etapa ejecuta sus propias reglas.
- Las etapas posteriores incluyen las reglas anteriores.
- Los resultados muestran estado, explicación y recomendación.
- Los errores no provocan que la aplicación falle.
- JSON-LD inválido se maneja de forma segura.
- El HTML del estudiante no ejecuta JavaScript.

### Accesibilidad de la aplicación

- Navegable con teclado.
- Formularios con labels.
- Contraste adecuado.
- Mensajes de estado accesibles.
- Resultados no dependen solo del color.

### Despliegue

- `npm run build` genera la aplicación.
- Funciona como sitio estático.
- Puede desplegarse en Firebase Hosting.
- Los cambios de ruta no generan errores.

---

## 21. Datos de ejemplo

Incluir cinco archivos internos:

```text
sample-v1.html
sample-v2.html
sample-v3.html
sample-v4.html
sample-final.html
```

También incluir un archivo deliberadamente incorrecto para probar errores.

---

## 22. Instrucción inicial para Cursor

```text
Lee completamente SPEC.md.

Construye el MVP descrito usando Vite, React y TypeScript.

Prioridades:
1. Procesamiento completamente local.
2. Validación estable y comprensible.
3. Reglas separadas por etapa.
4. Interfaz simple, profesional y responsive.
5. Despliegue estático en Firebase Hosting.

No implementes backend, autenticación ni almacenamiento.

Primero:
- crea la estructura del proyecto;
- instala las dependencias necesarias;
- implementa los tipos y el motor de reglas;
- implementa la interfaz;
- agrega datos de ejemplo;
- agrega pruebas unitarias para las reglas críticas;
- configura Firebase Hosting.

No ejecutes el HTML del estudiante ni sus scripts.

Al terminar:
- ejecuta typecheck;
- ejecuta tests;
- ejecuta build;
- corrige cualquier error;
- crea un README con las instrucciones para desarrollo y despliegue.
```

---

## 23. Priorización para llegar a tiempo

Priorizar:

1. carga o pegado del HTML;
2. selector de etapa;
3. reglas de los pasos 1–4;
4. reporte con errores y advertencias;
5. despliegue en Firebase.

Dejar para después:

- exportación PDF;
- puntaje sofisticado;
- validación avanzada de coherencia entre Schema y contenido;
- `axe-core`, si genera complicaciones de integración;
- análisis semántico con IA.

El valor principal del MVP está en ofrecer retroalimentación inmediata y consistente antes de avanzar al siguiente archivo.
