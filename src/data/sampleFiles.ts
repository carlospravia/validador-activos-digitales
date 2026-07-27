export const SAMPLE_FILES: Record<string, { label: string; fileName: string; html: string }> = {
  v1: {
    label: 'Ejemplo Paso 1',
    fileName: 'sample-v1.html',
    html: `<!DOCTYPE html>
<html lang="es">
<head></head>
<body>
  <header><p>LEAD SEO</p></header>
  <main>
    <article>
      <h1>Cómo mejorar la estructura semántica de una página</h1>
      <p>Esta introducción orienta al lector sobre la necesidad de una estructura clara. [EVIDENCIA PENDIENTE]</p>
      <section>
        <h2>Por qué importa la semántica</h2>
        <p>Los landmarks ayudan a personas y herramientas a entender el contenido.</p>
      </section>
      <section>
        <h2>Elementos mínimos</h2>
        <p>Usa main, article, section y encabezados en orden.</p>
      </section>
    </article>
  </main>
  <footer><p>Autor del ejercicio</p></footer>
</body>
</html>`,
  },
  v2: {
    label: 'Ejemplo Paso 2',
    fileName: 'sample-v2.html',
    html: `<!DOCTYPE html>
<html lang="es">
<head>
  <title>Guía práctica de SEO on-page para principiantes</title>
  <meta name="description" content="Aprende a optimizar title, meta description, encabezados y llamadas a la acción con ejemplos claros para tu proyecto del curso profesional de SEO.">
</head>
<body>
  <main>
    <article>
      <h1>SEO on-page para principiantes</h1>
      <p>Respuesta temprana: mejora title, description y CTAs antes de escalar contenido.</p>
      <section>
        <h2>Title y description</h2>
        <p>Deben describir la página sin copiarse entre sí.</p>
      </section>
      <section>
        <h2>Siguiente paso</h2>
        <p><a href="/contacto">Solicitar revisión on-page</a></p>
      </section>
    </article>
  </main>
</body>
</html>`,
  },
  v3: {
    label: 'Ejemplo Paso 3',
    fileName: 'sample-v3.html',
    html: `<!DOCTYPE html>
<html lang="es">
<head>
  <title>Guía práctica de accesibilidad web para contenidos SEO</title>
  <meta name="description" content="Mejora la accesibilidad y legibilidad de tu HTML con lang, textos alternativos, etiquetas de formulario y estructura escaneable para tu audiencia.">
</head>
<body>
  <main>
    <article>
      <h1>Accesibilidad para contenidos SEO</h1>
      <p>Una página accesible se entiende mejor y reduce fricción.</p>
      <section>
        <h2>Imágenes</h2>
        <p><img src="diagrama.png" alt="Diagrama de jerarquía de encabezados"></p>
      </section>
      <section>
        <h2>Contacto</h2>
        <form>
          <label for="email">Correo</label>
          <input id="email" name="email" type="email">
          <button type="submit">Enviar consulta</button>
        </form>
      </section>
    </article>
  </main>
</body>
</html>`,
  },
  v4: {
    label: 'Ejemplo Paso 4',
    fileName: 'sample-v4.html',
    html: `<!DOCTYPE html>
<html lang="es">
<head>
  <title>Artículo sobre datos estructurados Schema.org en SEO</title>
  <meta name="description" content="Aprende a marcar JSON-LD con Schema.org de forma coherente con el contenido visible, sin inventar propiedades solo para obtener rich results.">
</head>
<body>
  <main>
    <article>
      <h1>Datos estructurados Schema.org en SEO</h1>
      <p>El marcado debe reflejar el contenido real de la página.</p>
      <section>
        <h2>JSON-LD básico</h2>
        <p>Incluye context, type y propiedades respaldadas.</p>
      </section>
      <section>
        <h2>Acción</h2>
        <p><a href="/guia-schema">Ver guía Schema</a></p>
      </section>
    </article>
  </main>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Datos estructurados Schema.org en SEO",
    "author": { "@type": "Person", "name": "Estudiante LEAD" },
    "datePublished": "2026-07-01"
  }
  </script>
</body>
</html>`,
  },
  final: {
    label: 'Ejemplo final',
    fileName: 'sample-final.html',
    html: `<!DOCTYPE html>
<html lang="es">
<head>
  <title>Auditoría integral de un activo digital SEO</title>
  <meta name="description" content="Revisa estructura, on-page, accesibilidad y datos estructurados en una sola pasada para entregar tu activo digital del curso con mayor confianza técnica.">
</head>
<body>
  <main>
    <article>
      <h1>Auditoría integral de un activo digital</h1>
      <p>Esta página resume buenas prácticas verificables del ejercicio.</p>
      <section>
        <h2>Hallazgos</h2>
        <p>Prioriza errores críticos y deja la revisión humana para lo semántico.</p>
      </section>
      <section>
        <h2>Continuar</h2>
        <p><a href="/contacto">Agendar revisión</a> · <a href="mailto:hola@example.com">Escribir correo</a></p>
      </section>
    </article>
  </main>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Auditoría integral de un activo digital",
    "description": "Resumen de buenas prácticas verificables del ejercicio."
  }
  </script>
</body>
</html>`,
  },
  bad: {
    label: 'Ejemplo con errores',
    fileName: 'sample-bad.html',
    html: `<html><body><div><p>TODO: completar</p><img src="x.png"><a href="#">clic aquí</a></div></body></html>`,
  },
}
