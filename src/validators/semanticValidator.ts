import type { InputSource, ValidationResult } from '../types/validation'
import { parseHtml } from '../utils/parseHtml'
import { errorResult, warningResult, manualReview } from '../utils/resultFactory'

export function validateFileName(
  expected: string,
  source: InputSource,
  fileName: string | undefined,
  category: string,
): ValidationResult[] {
  if (source === 'paste') {
    return [
      warningResult(
        category,
        `Nombre recomendado: ${expected}`,
        `Si guardas el archivo, usa el nombre ${expected}.`,
        { recommendation: `Guarda el archivo como ${expected}.` },
      ),
    ]
  }
  if (fileName && fileName !== expected) {
    return [
      errorResult(
        category,
        'Nombre de archivo incorrecto',
        `Se esperaba ${expected} y se recibió ${fileName}.`,
        { severity: 'medium', evidence: fileName, recommendation: `Renombra el archivo a ${expected}.` },
      ),
    ]
  }
  return []
}

export interface Stage1Options {
  enforcePedagogicalBans?: boolean
}

export function validateStage1(
  html: string,
  options: Stage1Options = { enforcePedagogicalBans: true },
): ValidationResult[] {
  const results: ValidationResult[] = []
  const { document: doc } = parseHtml(html)
  const enforce = options.enforcePedagogicalBans !== false

  const h1s = Array.from(doc.querySelectorAll('h1'))
  if (h1s.length === 0) {
    results.push(
      errorResult('Estructura semántica', 'Falta H1', 'Debe existir un único <h1>.', {
        severity: 'high',
        selector: 'h1',
      }),
    )
  } else if (h1s.length > 1) {
    results.push(
      errorResult('Estructura semántica', 'Múltiples H1', 'Debe existir un único <h1>.', {
        severity: 'high',
        evidence: String(h1s.length),
      }),
    )
  }

  if (!doc.querySelector('main')) {
    results.push(
      errorResult('Estructura semántica', 'Falta main', 'Debe existir al menos un <main>.', {
        selector: 'main',
      }),
    )
  }

  const hasArticle = Boolean(doc.querySelector('article'))
  if (!hasArticle) {
    results.push(
      errorResult(
        'Estructura semántica',
        'Falta article',
        'Debe existir al menos un <article> o estructura equivalente claramente definida.',
        { selector: 'article', severity: 'high' },
      ),
    )
  }

  if (!doc.querySelector('section')) {
    results.push(
      errorResult('Estructura semántica', 'Falta section', 'Debe existir al menos una <section>.', {
        selector: 'section',
      }),
    )
  }

  const onlyDivs =
    !doc.querySelector('main,article,section,header,footer,nav,aside') &&
    doc.querySelectorAll('div').length > 0
  if (onlyDivs) {
    results.push(
      errorResult(
        'Estructura semántica',
        'Solo divs',
        'No utilizar únicamente <div> para toda la estructura.',
        { severity: 'high' },
      ),
    )
  }

  const h2s = doc.querySelectorAll('h2')
  if (h2s.length === 0) {
    results.push(
      errorResult('Encabezados', 'Falta H2', 'Debe existir al menos un <h2>.', { selector: 'h2' }),
    )
  }

  const headings = Array.from(doc.querySelectorAll('h1,h2,h3,h4,h5,h6'))
  for (const h of headings) {
    if (!(h.textContent ?? '').trim()) {
      results.push(
        errorResult('Encabezados', 'Encabezado vacío', 'Los encabezados no deben estar vacíos.', {
          selector: h.tagName.toLowerCase(),
        }),
      )
      break
    }
  }

  let prevLevel = 0
  for (const h of headings) {
    const level = Number(h.tagName.substring(1))
    if (prevLevel > 0 && level > prevLevel + 1) {
      results.push(
        warningResult(
          'Encabezados',
          'Salto de nivel en encabezados',
          `Se detectó un salto de h${prevLevel} a h${level}.`,
          { selector: h.tagName.toLowerCase() },
        ),
      )
      break
    }
    prevLevel = level
  }

  const sections = Array.from(doc.querySelectorAll('section'))
  if (sections.length < 2 && doc.querySelectorAll('article section, main section, section').length < 2) {
    // recount unique section elements
    if (doc.querySelectorAll('section').length < 2) {
      results.push(
        errorResult(
          'Estructura semántica',
          'Secciones insuficientes',
          'Deben existir al menos dos secciones de contenido.',
          { severity: 'medium' },
        ),
      )
    }
  }

  for (const p of Array.from(doc.querySelectorAll('p'))) {
    if (!(p.textContent ?? '').trim()) {
      results.push(
        warningResult('Estructura semántica', 'Párrafo vacío', 'Se encontró un párrafo vacío.', {
          selector: 'p',
        }),
      )
      break
    }
  }

  for (const section of sections) {
    if (!section.querySelector('h1,h2,h3,h4,h5,h6')) {
      results.push(
        warningResult(
          'Estructura semántica',
          'Sección sin encabezado',
          'Una sección no tiene encabezado.',
          { selector: 'section' },
        ),
      )
      break
    }
  }

  if (enforce) {
    const description = Array.from(doc.querySelectorAll('meta[name]')).find(
      (el) => el.getAttribute('name')?.toLowerCase() === 'description',
    )
    if (description) {
      results.push(
        errorResult(
          'Estructura semántica',
          'Meta description no permitida en Paso 1',
          'En esta etapa no debe existir <meta name="description">.',
          { severity: 'high', recommendation: 'Incorpora la meta description en el Paso 2.' },
        ),
      )
    }

    if (doc.querySelector('style, link[rel="stylesheet"], [style]')) {
      results.push(
        errorResult(
          'Estructura semántica',
          'CSS no permitido en Paso 1',
          'No debe existir CSS (<style>, style o hojas de estilo) en esta etapa.',
          { severity: 'high' },
        ),
      )
    }

    if (doc.querySelector('script') || doc.querySelector('[onclick],[onload],[onerror]')) {
      results.push(
        errorResult(
          'Estructura semántica',
          'JavaScript no permitido en Paso 1',
          'No debe existir JavaScript ni atributos de eventos en esta etapa.',
          { severity: 'high' },
        ),
      )
    }

    if (doc.querySelector('title')) {
      results.push(
        warningResult(
          'Estructura semántica',
          'Title presente en Paso 1',
          'En esta etapa del ejercicio el title se incorporará en el Paso 2.',
        ),
      )
    }
  }

  results.push(
    manualReview(
      'Intención y claridad',
      '¿El H1 refleja la intención principal?',
      'Revisa si el H1 expresa la necesidad principal del usuario.',
    ),
    manualReview(
      'Intención y claridad',
      '¿La introducción responde a la necesidad?',
      'Revisa si la introducción responde directamente a la necesidad del usuario.',
    ),
    manualReview(
      'Intención y claridad',
      '¿Las secciones siguen una secuencia lógica?',
      'Revisa el orden lógico de las secciones.',
    ),
    manualReview(
      'Intención y claridad',
      '¿Las afirmaciones tienen respaldo?',
      'Revisa si las afirmaciones relevantes están respaldadas por evidencia.',
    ),
  )

  return results
}
