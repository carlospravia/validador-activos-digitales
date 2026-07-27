## ADDED Requirements

### Requirement: Nombre esperado index-v4
Cuando la fuente es archivo, el sistema MUST validar `index-v4.html`; si es pegado, MUST recomendarlo.

#### Scenario: Nombre Paso 4
- **WHEN** se carga un archivo con otro nombre en Paso 4
- **THEN** se reporta que el esperado es `index-v4.html`

### Requirement: Presencia de JSON-LD
MUST existir al menos un bloque `<script type="application/ld+json">`.

#### Scenario: Sin JSON-LD
- **WHEN** no hay bloques JSON-LD
- **THEN** se emite un resultado `error`

### Requirement: Sintaxis JSON-LD
El contenido MUST ser JSON válido, incluir `@context` apuntando a `https://schema.org`, e incluir `@type` no vacío. MUST NOT aceptar comentarios en el JSON ni `[EVIDENCIA PENDIENTE]` dentro del JSON-LD. JSON-LD inválido MUST manejarse de forma segura sin tumbar la app.

#### Scenario: JSON inválido
- **WHEN** el bloque JSON-LD no parsea
- **THEN** se emite un `error` de sintaxis y la UI permanece operativa

#### Scenario: Context incorrecto
- **WHEN** `@context` no es Schema.org
- **THEN** se emite un resultado `error`

### Requirement: Tipos frecuentes reconocidos
El sistema MUST reconocer al menos: Article, BlogPosting, WebPage, Product, LocalBusiness, Event, FAQPage, HowTo, Organization, Person, BreadcrumbList.

#### Scenario: Tipo Article reconocido
- **WHEN** `@type` es `Article`
- **THEN** se aplican las reglas específicas de Article/BlogPosting

### Requirement: Validación por tipo
Para Article/BlogPosting: MUST advertir si faltan `headline`, `author` o `datePublished` (sin obligar si no hay evidencia visible). Para Product: MUST advertir si faltan `name`, `description` u `offers`; MUST marcar `error` si hay `aggregateRating`/`review` sin contenido visible de reseñas. FAQPage MUST requerir `mainEntity` con preguntas/respuestas presentes también en texto visible. LocalBusiness MUST advertir falta de `name`, `address` o `telephone`. Event MUST advertir falta de `name`, `startDate` o `location`.

#### Scenario: Product con aggregateRating sin reseñas visibles
- **WHEN** Product incluye `aggregateRating` y no hay reseñas visibles
- **THEN** se emite un resultado `error`

#### Scenario: FAQ sin mainEntity
- **WHEN** FAQPage no define `mainEntity`
- **THEN** se emite un resultado `error`

### Requirement: Coherencia con contenido visible
El sistema MUST comparar propiedades simples (`headline`, `name`, `description`, `datePublished`, `author.name`) con contenido visible y clasificar: encontrado, no encontrado, requiere revisión. MUST NOT afirmar falsedad solo por mismatch literal.

#### Scenario: headline no encontrado
- **WHEN** `headline` no aparece en el texto visible
- **THEN** se reporta como no encontrado o `manual-review`, no como mentira automática

### Requirement: Disclaimer de rich results
El sistema MUST mostrar claramente que usar Schema.org no garantiza un resultado enriquecido, y MUST separar validez Schema.org, elegibilidad documentada por Google, presencia real del contenido y decisión del motor de búsqueda.

#### Scenario: Mensaje de no garantía
- **WHEN** se muestra el reporte de Paso 4
- **THEN** aparece el disclaimer de no garantía de rich results

### Requirement: Revisión humana Paso 4
El sistema MUST emitir `manual-review` sobre adecuación del tipo, respaldo de propiedades, representación correcta de la entidad y riesgo de markup solo para rich results.

#### Scenario: Checklist humana Schema
- **WHEN** se valida Paso 4 con JSON-LD parseable
- **THEN** se incluyen ítems `manual-review` de coherencia editorial Schema
