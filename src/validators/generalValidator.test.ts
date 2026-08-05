import { describe, expect, it, beforeEach } from 'vitest'
import { validateGeneralRules } from '../validators/generalValidator'
import { resetResultIds, hasStatus } from '../utils/resultFactory'

const minimalValid = `<!DOCTYPE html>
<html>
<head><title>x</title></head>
<body><p>Hola</p></body>
</html>`

describe('generalValidator', () => {
  beforeEach(() => {
    resetResultIds()
  })

  it('errors on empty content', () => {
    const results = validateGeneralRules('   ')
    expect(hasStatus(results, 'vacío', 'error')).toBe(true)
  })

  it('errors when doctype is missing', () => {
    const html = `<html><head></head><body>ok</body></html>`
    const results = validateGeneralRules(html)
    expect(hasStatus(results, 'doctype', 'error')).toBe(true)
  })

  it('errors when html, head or body is missing', () => {
    const html = `<!DOCTYPE html><html><head></head></html>`
    const results = validateGeneralRules(html)
    expect(hasStatus(results, 'body', 'error')).toBe(true)
  })

  it('errors on meta keywords', () => {
    const html = `<!DOCTYPE html><html><head>
      <meta name="keywords" content="seo,test">
    </head><body><p>x</p></body></html>`
    const results = validateGeneralRules(html)
    expect(hasStatus(results, 'keywords', 'error')).toBe(true)
  })

  it('allows [EVIDENCIA PENDIENTE] but flags other placeholders', () => {
    const ok = `<!DOCTYPE html><html><head></head><body>
      <p>[EVIDENCIA PENDIENTE]</p>
    </body></html>`
    expect(hasStatus(validateGeneralRules(ok), 'plantilla', 'error')).toBe(false)

    const bad = `<!DOCTYPE html><html><head></head><body>
      <p>TODO: completar esto</p><p>Lorem ipsum dolor</p>
    </body></html>`
    expect(hasStatus(validateGeneralRules(bad), 'plantilla', 'error')).toBe(true)
  })

  it('warns on external scripts, iframes, on* handlers without blocking', () => {
    const html = `<!DOCTYPE html><html><head>
      <script src="https://cdn.example.com/x.js"></script>
    </head><body>
      <iframe src="https://example.com"></iframe>
      <button onclick="alert(1)">Go</button>
      <p>contenido</p>
    </body></html>`
    const results = validateGeneralRules(html)
    expect(hasStatus(results, 'script externo', 'warning')).toBe(true)
    expect(hasStatus(results, 'iframe', 'warning')).toBe(true)
    expect(hasStatus(results, 'on*', 'warning')).toBe(true)
    expect(results.some((r) => r.status === 'error' && r.title.toLowerCase().includes('onclick'))).toBe(
      false,
    )
  })

  it('accepts a minimal valid document without empty/doctype errors', () => {
    const results = validateGeneralRules(minimalValid)
    expect(hasStatus(results, 'vacío', 'error')).toBe(false)
    expect(hasStatus(results, 'doctype', 'error')).toBe(false)
  })
})
