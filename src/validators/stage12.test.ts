import { describe, expect, it, beforeEach } from 'vitest'
import { validateStage1, validateFileName } from './semanticValidator'
import { validateStage2 } from './onPageValidator'
import { hasStatus, resetResultIds } from '../utils/resultFactory'

const stage1Good = `<!DOCTYPE html>
<html lang="es">
<head></head>
<body>
  <header><p>Cabecera</p></header>
  <main>
    <article>
      <h1>Guía de SEO local en Costa Rica</h1>
      <p>Introducción clara para el usuario. [EVIDENCIA PENDIENTE]</p>
      <section>
        <h2>Contexto</h2>
        <p>Primera sección con contenido útil.</p>
      </section>
      <section>
        <h2>Pasos</h2>
        <p>Segunda sección con más detalle.</p>
      </section>
    </article>
  </main>
  <footer><p>Autor</p></footer>
</body>
</html>`

describe('semanticValidator (Paso 1)', () => {
  beforeEach(() => resetResultIds())

  it('requires main, article, section, h1 and h2', () => {
    const bad = `<!DOCTYPE html><html><head></head><body><div><p>solo divs</p></div></body></html>`
    const results = validateStage1(bad)
    expect(hasStatus(results, 'main', 'error')).toBe(true)
    expect(hasStatus(results, 'article', 'error')).toBe(true)
    expect(hasStatus(results, 'H1', 'error')).toBe(true)
  })

  it('flags pedagogical bans for description, css and js', () => {
    const html = `<!DOCTYPE html><html><head>
      <meta name="description" content="x">
      <style>body{}</style>
      <title>Temp</title>
    </head><body>
      <main><article>
        <h1>Título suficientemente claro</h1>
        <p>Intro</p>
        <section><h2>A</h2><p>a</p></section>
        <section><h2>B</h2><p>b</p></section>
      </article></main>
      <script>alert(1)</script>
    </body></html>`
    const results = validateStage1(html)
    expect(hasStatus(results, 'description', 'error')).toBe(true)
    expect(hasStatus(results, 'CSS', 'error')).toBe(true)
    expect(hasStatus(results, 'JavaScript', 'error')).toBe(true)
    expect(hasStatus(results, 'Title presente', 'warning')).toBe(true)
  })

  it('emits manual-review checklist items', () => {
    const results = validateStage1(stage1Good)
    expect(results.filter((r) => r.status === 'manual-review').length).toBeGreaterThanOrEqual(4)
  })

  it('recommends filename on paste and errors on wrong file name', () => {
    const paste = validateFileName('index-v1.html', 'paste', undefined, 'Estructura semántica')
    expect(paste[0]?.status).toBe('warning')
    const file = validateFileName('index-v1.html', 'file', 'otro.html', 'Estructura semántica')
    expect(file[0]?.status).toBe('error')
  })
})

describe('onPageValidator (Paso 2)', () => {
  beforeEach(() => resetResultIds())

  it('requires title and meta description', () => {
    const results = validateStage2(stage1Good)
    expect(hasStatus(results, 'title', 'error')).toBe(true)
    expect(hasStatus(results, 'meta description', 'error')).toBe(true)
  })

  it('does not apply Paso 1 pedagogical bans for title/description', () => {
    const html = `<!DOCTYPE html>
<html lang="es"><head>
  <title>Guía práctica de SEO local para negocios</title>
  <meta name="description" content="Aprende cómo mejorar el SEO local de tu negocio en Costa Rica con pasos claros, ejemplos y checklist accionable para tu sitio.">
</head><body>
  <main><article>
    <h1>SEO local para negocios</h1>
    <p>Introducción útil al tema principal del artículo.</p>
    <section><h2>Contexto</h2><p>Detalle uno.</p></section>
    <section><h2>Acción</h2><p><a href="/contacto">Solicitar diagnóstico</a></p></section>
  </article></main>
</body></html>`
    const results = validateStage2(html)
    expect(hasStatus(results, 'Meta description no permitida', 'error')).toBe(false)
    expect(hasStatus(results, 'Title presente en Paso 1', 'warning')).toBe(false)
    expect(hasStatus(results, 'Falta title', 'error')).toBe(false)
    expect(hasStatus(results, 'Falta meta description', 'error')).toBe(false)
  })

  it('flags non-functional hash links and missing CTA', () => {
    const noCta = `<!DOCTYPE html><html><head>
      <title>Guía práctica de SEO local para negocios</title>
      <meta name="description" content="Aprende cómo mejorar el SEO local de tu negocio en Costa Rica con pasos claros, ejemplos y checklist accionable para tu sitio.">
    </head><body>
      <main><article>
        <h1>SEO local</h1><p>Intro</p>
        <section><h2>A</h2><p>a</p></section>
        <section><h2>B</h2><p>b</p></section>
      </article></main>
    </body></html>`
    expect(hasStatus(validateStage2(noCta), 'llamada a la acción', 'error')).toBe(true)

    const hash = noCta.replace(
      '</section>\n      </article>',
      '</section><p><a href="#">clic aquí</a></p></article>',
    )
    const results = validateStage2(hash)
    expect(hasStatus(results, 'no funcional', 'error')).toBe(true)
  })
})
