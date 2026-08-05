import type { ValidationResult } from '../types/validation'
import { parseHtml } from '../utils/parseHtml'
import { errorResult, warningResult } from '../utils/resultFactory'

const PLACEHOLDER_PATTERNS = [
  /\bTODO\b/i,
  /\bFIXME\b/i,
  /lorem ipsum/i,
  /\[completar\]/i,
  /tu texto aqu[ií]/i,
  /insertar (texto|contenido)/i,
]

export function validateGeneralRules(html: string): ValidationResult[] {
  const results: ValidationResult[] = []
  if (!html.trim()) {
    results.push(
      errorResult(
        'Documento y sintaxis',
        'Contenido vacío',
        'El contenido no debe estar vacío.',
        { severity: 'critical', recommendation: 'Pega o carga un archivo HTML válido.' },
      ),
    )
    return results
  }

  const parsed = parseHtml(html)
  const { document: doc, hasDoctype } = parsed
  const raw = html

  if (!hasDoctype) {
    results.push(
      errorResult(
        'Documento y sintaxis',
        'Falta doctype',
        'Debe contener <!doctype html>.',
        { severity: 'critical', recommendation: 'Agrega <!DOCTYPE html> al inicio del documento.' },
      ),
    )
  }

  // Check raw markup — DOMParser invents missing html/head/body.
  const rawHtmlCount = (raw.match(/<html\b/gi) ?? []).length
  const rawHeadCount = (raw.match(/<head\b/gi) ?? []).length
  const rawBodyCount = (raw.match(/<body\b/gi) ?? []).length

  if (rawHtmlCount === 0) {
    results.push(
      errorResult('Documento y sintaxis', 'Falta html', 'Debe contener un elemento <html>.', {
        severity: 'critical',
        selector: 'html',
      }),
    )
  }
  if (rawHeadCount === 0) {
    results.push(
      errorResult('Documento y sintaxis', 'Falta head', 'Debe contener un elemento <head>.', {
        severity: 'critical',
        selector: 'head',
      }),
    )
  }
  if (rawBodyCount === 0) {
    results.push(
      errorResult('Documento y sintaxis', 'Falta body', 'Debe contener un elemento <body>.', {
        severity: 'critical',
        selector: 'body',
      }),
    )
  }

  if (rawHtmlCount > 1 || rawHeadCount > 1 || rawBodyCount > 1) {
    results.push(
      errorResult(
        'Documento y sintaxis',
        'Estructura duplicada',
        'No debe contener múltiples elementos <html>, <head> o <body>.',
        { severity: 'high' },
      ),
    )
  }

  const keywords = Array.from(doc.querySelectorAll('meta[name]')).find(
    (el) => el.getAttribute('name')?.toLowerCase() === 'keywords',
  )
  if (keywords) {
    results.push(
      errorResult(
        'Documento y sintaxis',
        'Meta keywords prohibida',
        'La etiqueta <meta name="keywords"> no debe aparecer nunca.',
        { severity: 'high', selector: 'meta[name=keywords]', recommendation: 'Elimina la meta keywords.' },
      ),
    )
  }

  const text = doc.body?.textContent ?? ''
  const hasAllowedPending = /\[EVIDENCIA PENDIENTE\]/.test(text)
  const hasBadPlaceholder = PLACEHOLDER_PATTERNS.some((re) => re.test(html))
  if (hasBadPlaceholder && !hasAllowedPending) {
    results.push(
      errorResult(
        'Documento y sintaxis',
        'Texto de plantilla incompleto',
        'No debe contener textos de plantilla sin completar (excepto [EVIDENCIA PENDIENTE]).',
        { severity: 'medium', recommendation: 'Reemplaza placeholders como TODO o Lorem ipsum.' },
      ),
    )
  } else if (hasBadPlaceholder && hasAllowedPending) {
    // Still flag other placeholders even if pending evidence exists
    results.push(
      errorResult(
        'Documento y sintaxis',
        'Texto de plantilla incompleto',
        'Se detectaron textos de plantilla además de [EVIDENCIA PENDIENTE].',
        { severity: 'medium' },
      ),
    )
  }

  // Security warnings — never auto-block
  for (const script of Array.from(doc.querySelectorAll('script[src]'))) {
    const src = script.getAttribute('src') ?? ''
    if (/^https?:\/\//i.test(src) || src.startsWith('//')) {
      results.push(
        warningResult(
          'Documento y sintaxis',
          'Script externo detectado',
          `Se encontró un script externo: ${src}`,
          { selector: 'script[src]', evidence: src },
        ),
      )
    }
  }

  if (doc.querySelector('iframe')) {
    results.push(
      warningResult('Documento y sintaxis', 'Iframe detectado', 'Se encontró al menos un iframe.', {
        selector: 'iframe',
      }),
    )
  }

  for (const form of Array.from(doc.querySelectorAll('form[action]'))) {
    const action = form.getAttribute('action') ?? ''
    if (/^https?:\/\//i.test(action)) {
      results.push(
        warningResult(
          'Documento y sintaxis',
          'Formulario con acción externa',
          `El formulario apunta a una URL externa: ${action}`,
          { selector: 'form', evidence: action },
        ),
      )
    }
  }

  if (doc.querySelector('[onclick],[onload],[onerror],[onmouseover],[onfocus],[onsubmit]')) {
    results.push(
      warningResult(
        'Documento y sintaxis',
        'Atributos on* detectados',
        'Se encontraron manejadores inline (onclick, onload u otros on*).',
        { recommendation: 'Prefiere JavaScript externo no ejecutable en este ejercicio o elimínalos.' },
      ),
    )
  }

  return results
}
