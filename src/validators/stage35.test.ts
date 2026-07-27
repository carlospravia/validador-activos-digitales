import { describe, expect, it, beforeEach } from 'vitest'
import { extractJsonLd } from '../utils/extractJsonLd'
import { computeScore, SCORE_DISCLAIMER } from '../utils/scoring'
import { validateSchemaOnly } from './schemaValidator'
import { validateStage3 } from './accessibilityValidator'
import { runValidation } from './runValidation'
import { hasStatus, resetResultIds, errorResult, warningResult, manualReview } from '../utils/resultFactory'

describe('scoring', () => {
  it('applies critical -15 and floors at 0', () => {
    expect(computeScore([errorResult('x', 'a', 'b', { severity: 'critical' })])).toBe(85)
    const many = Array.from({ length: 20 }, () =>
      errorResult('x', 'a', 'b', { severity: 'critical' }),
    )
    expect(computeScore(many)).toBe(0)
  })

  it('does not penalize manual-review', () => {
    expect(computeScore([manualReview('x', 'a', 'b')])).toBe(100)
  })

  it('exposes required disclaimer text', () => {
    expect(SCORE_DISCLAIMER).toMatch(/reglas verificables/i)
  })
})

describe('extractJsonLd + schema', () => {
  beforeEach(() => resetResultIds())

  it('handles invalid JSON safely', () => {
    const html = `<!DOCTYPE html><html><head></head><body>
      <script type="application/ld+json">{bad</script>
    </body></html>`
    const blocks = extractJsonLd(html)
    expect(blocks[0]?.error).toBeTruthy()
    const results = validateSchemaOnly(html)
    expect(hasStatus(results, 'JSON-LD inválido', 'error')).toBe(true)
  })

  it('errors Product aggregateRating without visible reviews', () => {
    const html = `<!DOCTYPE html><html><head></head><body>
      <p>Producto demo</p>
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Producto demo",
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5" }
      }
      </script>
    </body></html>`
    expect(hasStatus(validateSchemaOnly(html), 'Reseñas Schema', 'error')).toBe(true)
  })

  it('requires FAQPage mainEntity', () => {
    const html = `<!DOCTYPE html><html><head></head><body>
      <script type="application/ld+json">
      { "@context": "https://schema.org", "@type": "FAQPage" }
      </script>
    </body></html>`
    expect(hasStatus(validateSchemaOnly(html), 'mainEntity', 'error')).toBe(true)
  })
})

describe('accessibility Paso 3', () => {
  beforeEach(() => resetResultIds())

  it('errors when lang is missing', () => {
    const html = `<!DOCTYPE html><html><head>
      <title>Guía práctica de SEO local para negocios</title>
      <meta name="description" content="Aprende cómo mejorar el SEO local de tu negocio en Costa Rica con pasos claros, ejemplos y checklist accionable para tu sitio.">
    </head><body>
      <main><article>
        <h1>SEO local</h1><p>Intro</p>
        <section><h2>A</h2><p>a</p></section>
        <section><h2>B</h2><p><a href="/c">Contacto</a></p></section>
      </article></main>
    </body></html>`
    expect(hasStatus(validateStage3(html), 'idioma', 'error')).toBe(true)
  })

  it('errors on img without alt', () => {
    const html = `<!DOCTYPE html><html lang="es"><head>
      <title>Guía práctica de SEO local para negocios</title>
      <meta name="description" content="Aprende cómo mejorar el SEO local de tu negocio en Costa Rica con pasos claros, ejemplos y checklist accionable para tu sitio.">
    </head><body>
      <main><article>
        <h1>SEO local</h1><p>Intro</p>
        <section><h2>A</h2><img src="a.png"></section>
        <section><h2>B</h2><p><a href="/c">Contacto</a></p></section>
      </article></main>
    </body></html>`
    expect(hasStatus(validateStage3(html), 'alt', 'error')).toBe(true)
  })
})

describe('runValidation orchestrator', () => {
  it('never throws on garbage input and returns errors', async () => {
    const run = await runValidation({ html: '', stage: 1, source: 'paste' })
    expect(run.results.some((r) => r.status === 'error')).toBe(true)
  })

  it('includes score and measurements on stage 5', async () => {
    const run = await runValidation({
      html: `<!DOCTYPE html><html lang="es"><head><title>Guía práctica de SEO local para negocios</title>
        <meta name="description" content="Aprende cómo mejorar el SEO local de tu negocio en Costa Rica con pasos claros, ejemplos y checklist accionable para tu sitio.">
        </head><body><main><article>
        <h1>SEO</h1><p>Intro</p>
        <section><h2>A</h2><p>a</p></section>
        <section><h2>B</h2><p><a href="/x">Ir</a> <a href="mailto:a@b.com">mail</a></p></section>
        </article></main>
        <script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage","name":"SEO"}</script>
        </body></html>`,
      stage: 5,
      source: 'file',
      fileName: 'index-final.html',
    })
    expect(typeof run.score).toBe('number')
    expect(run.scoreDisclaimer).toMatch(/reglas verificables/i)
    expect(run.measurementSuggestions?.some((m) => m.event === 'contact_click')).toBe(true)
  })

  it('warns low-severity warnings without treating them as score-breaking alone beyond penalty', () => {
    expect(computeScore([warningResult('x', 'w', 'd', { severity: 'low' })])).toBe(98)
  })
})
