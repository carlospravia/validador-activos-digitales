import type { ValidationResult } from '../types/validation'
import { parseHtml } from '../utils/parseHtml'
import { errorResult, warningResult, manualReview } from '../utils/resultFactory'
import { validateStage2 } from './onPageValidator'

const GENERIC_LINK = /^(clic aqu[ií]|ver m[aá]s|leer|enviar)$/i
const BAD_ALT_PREFIX = /^(imagen de|foto de|gr[aá]fico de)\b/i

export function validateStage3(html: string): ValidationResult[] {
  const results: ValidationResult[] = [...validateStage2(html)]
  const { document: doc } = parseHtml(html)

  const lang = doc.documentElement.getAttribute('lang')?.trim() ?? ''
  const validLang = ['es', 'es-CR', 'es-MX', 'es-ES']
  if (!lang) {
    results.push(
      errorResult(
        'Accesibilidad',
        'Falta idioma principal',
        'No se encontró el atributo lang en el elemento <html>.',
        { severity: 'high', recommendation: '<html lang="es">', selector: 'html' },
      ),
    )
  } else if (!validLang.includes(lang)) {
    results.push(
      warningResult(
        'Accesibilidad',
        'Idioma no reconocido para el ejercicio',
        `lang="${lang}" no está en la lista esperada (es, es-CR, es-MX, es-ES).`,
        { evidence: lang },
      ),
    )
  }

  if (doc.querySelector('[hreflang]') && doc.querySelectorAll('[hreflang]').length < 2) {
    results.push(
      warningResult(
        'Accesibilidad',
        'hreflang sin alternativas claras',
        'Se usa hreflang sin evidencia clara de versiones alternativas.',
      ),
    )
  }

  for (const img of Array.from(doc.querySelectorAll('img'))) {
    if (!img.hasAttribute('alt')) {
      results.push(
        errorResult('Accesibilidad', 'Imagen sin alt', 'Cada <img> debe tener atributo alt.', {
          selector: 'img',
          severity: 'high',
        }),
      )
      break
    }
    const alt = img.getAttribute('alt') ?? ''
    const src = img.getAttribute('src') ?? ''
    const fileName = src.split('/').pop() ?? ''
    if (alt && BAD_ALT_PREFIX.test(alt)) {
      results.push(
        warningResult('Accesibilidad', 'Alt poco descriptivo', `Alt empieza con patrón débil: "${alt}".`, {
          evidence: alt,
        }),
      )
    }
    if (alt && fileName && alt === fileName) {
      results.push(
        warningResult('Accesibilidad', 'Alt igual al nombre de archivo', 'El alt coincide con el nombre del archivo.', {
          evidence: alt,
        }),
      )
    }
    if (alt.length > 180) {
      results.push(
        warningResult('Accesibilidad', 'Alt demasiado largo', `Alt supera ~180 caracteres (${alt.length}).`),
      )
    }
  }

  for (const input of Array.from(doc.querySelectorAll('input, select, textarea'))) {
    const type = input.getAttribute('type')
    if (type === 'hidden' || type === 'submit' || type === 'button') continue
    const id = input.getAttribute('id')
    const labelled =
      (id ? doc.querySelector(`label[for="${id.replace(/"/g, '\\"')}"]`) : null) ||
      input.closest('label') ||
      input.getAttribute('aria-label') ||
      input.getAttribute('aria-labelledby')
    if (!labelled) {
      results.push(
        errorResult(
          'Accesibilidad',
          'Campo sin etiqueta',
          'Cada campo debe tener label asociado o nombre accesible; placeholder solo no basta.',
          { selector: input.tagName.toLowerCase(), severity: 'high' },
        ),
      )
      break
    }
  }

  for (const el of Array.from(doc.querySelectorAll('a, button'))) {
    const name =
      el.getAttribute('aria-label') ||
      el.getAttribute('aria-labelledby') ||
      (el.textContent ?? '').trim()
    if (!name) {
      results.push(
        errorResult('Accesibilidad', 'Control sin nombre accesible', 'Botones y enlaces no deben estar vacíos.', {
          selector: el.tagName.toLowerCase(),
        }),
      )
      break
    }
    if (GENERIC_LINK.test(name)) {
      results.push(
        warningResult('Accesibilidad', 'Texto de control genérico', `Texto genérico: "${name}".`, {
          evidence: name,
        }),
      )
      break
    }
  }

  const redundant = doc.querySelector(
    'button[role="button"], nav[role="navigation"], main[role="main"], a[role="link"]',
  )
  if (redundant) {
    results.push(
      warningResult(
        'Accesibilidad',
        'Rol ARIA redundante',
        'Se detectó un rol ARIA redundante (p.ej. main role="main").',
        { selector: redundant.tagName.toLowerCase() },
      ),
    )
  }

  const paragraphs = Array.from(doc.querySelectorAll('p'))
  for (const p of paragraphs) {
    const words = (p.textContent ?? '').trim().split(/\s+/).filter(Boolean)
    if (words.length > 120) {
      results.push(
        warningResult(
          'Legibilidad',
          'Párrafo muy largo',
          `Un párrafo supera 120 palabras (${words.length}).`,
        ),
      )
      break
    }
  }

  let consecutive = 0
  for (const child of Array.from(doc.body?.children ?? [])) {
    if (child.tagName === 'P') {
      consecutive += 1
      if (consecutive > 5) {
        results.push(
          warningResult(
            'Legibilidad',
            'Muchos párrafos sin subtítulo',
            'Hay más de cinco párrafos consecutivos sin subtítulo.',
          ),
        )
        break
      }
    } else if (/^H[1-6]$/.test(child.tagName)) {
      consecutive = 0
    }
  }

  results.push(
    manualReview(
      'Accesibilidad',
      '¿El texto se comprende al escanear encabezados y listas?',
      'Revisa escaneabilidad.',
    ),
    manualReview(
      'Legibilidad',
      '¿El lenguaje es claro para una persona no técnica?',
      'Revisa claridad del lenguaje.',
    ),
    manualReview('Enlaces y CTA', '¿Los enlaces revelan qué sucederá?', 'Revisa predicción del enlace.'),
    manualReview(
      'Accesibilidad',
      '¿El orden del contenido corresponde con el orden de lectura?',
      'Revisa orden de lectura.',
    ),
  )

  return results
}

/**
 * Optional axe-core integration. Safe no-op if axe cannot run.
 * Student scripts are never executed; we only analyze a cloned DOM snapshot.
 */
export async function runAxeIfAvailable(html: string): Promise<ValidationResult[]> {
  try {
    const axe = await import('axe-core')
    const { document: doc } = parseHtml(html)
    // Isolate: append to a detached container, never eval scripts
    const container = doc.createElement('div')
    container.append(...Array.from(doc.body.childNodes).map((n) => n.cloneNode(true)))
    // axe needs a real document root in browser; in jsdom we run against documentElement after inject
    const host = document.implementation.createHTMLDocument('axe-host')
    host.documentElement.innerHTML = doc.documentElement.innerHTML
    // Remove scripts from host before axe
    host.querySelectorAll('script').forEach((s) => s.remove())
    const outcome = await axe.default.run(host, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
    })
    return outcome.violations.map((v) =>
      errorResult('Accesibilidad', `axe: ${v.id}`, v.help, {
        severity: v.impact === 'critical' || v.impact === 'serious' ? 'high' : 'medium',
        evidence: v.nodes[0]?.target?.join(', '),
        recommendation: v.helpUrl,
        selector: String(v.nodes[0]?.target?.[0] ?? ''),
      }),
    )
  } catch {
    // Defer gracefully — custom rules above still apply
    return [
      warningResult(
        'Accesibilidad',
        'axe-core no ejecutado',
        'La integración axe-core no pudo ejecutarse en este entorno; las reglas propias de accesibilidad sí se aplicaron.',
        { severity: 'low' },
      ),
    ]
  }
}
