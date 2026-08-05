import type { ValidationResult } from '../types/validation'
import { parseHtml, getVisibleText } from '../utils/parseHtml'
import { errorResult, warningResult, manualReview } from '../utils/resultFactory'
import { validateStage1 } from './semanticValidator'

const GENERIC_TITLE = /^(inicio|página|bienvenidos|sin título|home)$/i
const GENERIC_CTA = /^(clic aqu[ií]|ver m[aá]s|enviar|leer m[aá]s|continuar)$/i

export function validateStage2(html: string): ValidationResult[] {
  const results: ValidationResult[] = []
  results.push(...validateStage1(html, { enforcePedagogicalBans: false }))

  const { document: doc } = parseHtml(html)
  const titles = Array.from(doc.querySelectorAll('title'))
  if (titles.length === 0) {
    results.push(
      errorResult('SEO On-Page', 'Falta title', 'Debe existir exactamente un <title>.', {
        selector: 'title',
        severity: 'high',
      }),
    )
  } else if (titles.length > 1) {
    results.push(
      errorResult('SEO On-Page', 'Múltiples title', 'Debe existir exactamente un <title>.', {
        severity: 'high',
      }),
    )
  } else {
    const titleText = (titles[0].textContent ?? '').trim()
    if (!titleText) {
      results.push(
        errorResult('SEO On-Page', 'Title vacío', 'El <title> no debe estar vacío.', {
          selector: 'title',
        }),
      )
    } else {
      if (titleText.length < 20 || titleText.length > 65) {
        results.push(
          warningResult(
            'SEO On-Page',
            'Longitud de title fuera de rango',
            `Longitud recomendada: 20–65 caracteres (actual: ${titleText.length}).`,
            { evidence: titleText },
          ),
        )
      }
      if (GENERIC_TITLE.test(titleText)) {
        results.push(
          warningResult('SEO On-Page', 'Title genérico', `El title parece genérico: "${titleText}".`, {
            evidence: titleText,
          }),
        )
      }
      const h1 = doc.querySelector('h1')
      if (h1 && (h1.textContent ?? '').trim() === titleText) {
        results.push(
          warningResult(
            'SEO On-Page',
            'Title idéntico al H1',
            'El title es idéntico al H1; conviene diferenciarlos ligeramente.',
          ),
        )
      }
    }
  }

  const descriptions = Array.from(doc.querySelectorAll('meta[name]')).filter(
    (el) => el.getAttribute('name')?.toLowerCase() === 'description',
  )
  if (descriptions.length === 0) {
    results.push(
      errorResult(
        'SEO On-Page',
        'Falta meta description',
        'Debe existir una única meta description.',
        { severity: 'high', selector: 'meta[name=description]' },
      ),
    )
  } else if (descriptions.length > 1) {
    results.push(
      errorResult('SEO On-Page', 'Múltiples meta description', 'Debe existir una única meta description.', {
        severity: 'high',
      }),
    )
  } else {
    const content = (descriptions[0].getAttribute('content') ?? '').trim()
    const titleText = (doc.querySelector('title')?.textContent ?? '').trim()
    if (!content) {
      results.push(
        errorResult('SEO On-Page', 'Meta description vacía', 'La meta description debe tener contenido.', {
          selector: 'meta[name=description]',
        }),
      )
    } else {
      if (content.length < 70 || content.length > 165) {
        results.push(
          warningResult(
            'SEO On-Page',
            'Longitud de meta description fuera de rango',
            `Longitud recomendada: 70–165 caracteres (actual: ${content.length}).`,
            { evidence: content },
          ),
        )
      }
      if (titleText && content === titleText) {
        results.push(
          errorResult(
            'SEO On-Page',
            'Meta description idéntica al title',
            'La meta description no debe ser idéntica al title.',
            { severity: 'medium' },
          ),
        )
      }
    }
  }

  const actionable = doc.querySelector(
    'a[href], button, form, a[href^="mailto:"], a[href^="tel:"], a[href*="contacto"], a[href*="compra"], a[href*="registro"], a[download]',
  )
  if (!actionable) {
    results.push(
      errorResult(
        'Enlaces y CTA',
        'Falta llamada a la acción',
        'Debe existir al menos un enlace accionable, botón o formulario.',
        { severity: 'high' },
      ),
    )
  }

  for (const el of Array.from(doc.querySelectorAll('a, button'))) {
    const text = (el.textContent ?? '').trim()
    if (GENERIC_CTA.test(text)) {
      results.push(
        warningResult('Enlaces y CTA', 'CTA genérico', `Texto genérico detectado: "${text}".`, {
          evidence: text,
        }),
      )
      break
    }
  }

  const links = Array.from(doc.querySelectorAll('a[href]'))
  let externalCount = 0
  for (const a of links) {
    const href = a.getAttribute('href') ?? ''
    if (!href.trim() || href === '#') {
      results.push(
        errorResult(
          'Enlaces y CTA',
          'Enlace no funcional',
          'No se aceptan enlaces vacíos ni href="#".',
          { severity: 'medium', evidence: href || '(vacío)', selector: 'a' },
        ),
      )
      break
    }
    if (/^https?:\/\//i.test(href)) externalCount += 1
  }
  if (links.length > 0 && externalCount === links.length) {
    results.push(
      warningResult(
        'Enlaces y CTA',
        'Solo enlaces externos',
        'Todos los enlaces son externos; considera navegación interna.',
      ),
    )
  }

  // Keyword stuffing heuristic → manual-review only
  const visible = getVisibleText(doc).toLowerCase()
  const words = visible.match(/[a-záéíóúñü]{5,}/gi) ?? []
  const freq = new Map<string, number>()
  for (const w of words) {
    const key = w.toLowerCase()
    freq.set(key, (freq.get(key) ?? 0) + 1)
  }
  const suspicious = [...freq.entries()].filter(([, n]) => n >= 8 && words.length > 40)
  if (suspicious.length > 0) {
    results.push(
      manualReview(
        'SEO On-Page',
        'Posible repetición excesiva de términos',
        `Se repiten términos con frecuencia alta (p.ej. "${suspicious[0][0]}"). No se afirma keyword stuffing automáticamente.`,
        { evidence: suspicious.slice(0, 3).map(([w, n]) => `${w}:${n}`).join(', ') },
      ),
    )
  }

  results.push(
    manualReview('SEO On-Page', '¿El title describe claramente la página?', 'Revisa claridad del title.'),
    manualReview(
      'SEO On-Page',
      '¿La meta description representa el contenido?',
      'Revisa fidelidad de la meta description.',
    ),
    manualReview(
      'Intención y claridad',
      '¿La página responde antes de desarrollar?',
      'Revisa si la respuesta aparece temprano.',
    ),
    manualReview('Enlaces y CTA', '¿El CTA corresponde con el journey?', 'Revisa adecuación del CTA.'),
    manualReview(
      'Medición',
      '¿La acción podría medirse como evento?',
      'Revisa si el CTA es medible.',
    ),
    manualReview(
      'SEO On-Page',
      'Relación entre title y H1',
      'La relación semántica title↔H1 requiere revisión humana; no se valida como verdad absoluta.',
    ),
  )

  return results
}
