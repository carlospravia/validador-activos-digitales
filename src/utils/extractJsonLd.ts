import JSON5 from 'json5'
import { parseHtml } from './parseHtml'

export interface JsonLdBlock {
  raw: string
  data: unknown | null
  error: string | null
}

export function extractJsonLd(html: string): JsonLdBlock[] {
  const { document: doc } = parseHtml(html)
  const scripts = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'))
  return scripts.map((script) => {
    const raw = script.textContent ?? ''
    if (/\[EVIDENCIA PENDIENTE\]/.test(raw)) {
      return { raw, data: null, error: 'Contiene [EVIDENCIA PENDIENTE]' }
    }
    try {
      const data = JSON5.parse(raw)
      return { raw, data, error: null }
    } catch (e) {
      return { raw, data: null, error: e instanceof Error ? e.message : 'JSON inválido' }
    }
  })
}
