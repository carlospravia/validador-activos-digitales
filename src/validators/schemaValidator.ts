import type { ValidationResult } from '../types/validation'
import { extractJsonLd } from '../utils/extractJsonLd'
import { parseHtml, getVisibleText } from '../utils/parseHtml'
import { errorResult, warningResult, manualReview, result } from '../utils/resultFactory'
import { validateStage3 } from './accessibilityValidator'

function asArray(value: unknown): Record<string, unknown>[] {
  if (!value) return []
  if (Array.isArray(value)) {
    return value.filter((v) => v && typeof v === 'object') as Record<string, unknown>[]
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>
    if (Array.isArray(obj['@graph'])) {
      return obj['@graph'].filter((v) => v && typeof v === 'object') as Record<string, unknown>[]
    }
    return [obj]
  }
  return []
}

function typeOf(node: Record<string, unknown>): string {
  const t = node['@type']
  if (Array.isArray(t)) return String(t[0] ?? '')
  return String(t ?? '')
}

function contextOk(node: Record<string, unknown>): boolean {
  const ctx = node['@context']
  if (typeof ctx === 'string') return /schema\.org/i.test(ctx)
  if (Array.isArray(ctx)) return ctx.some((c) => typeof c === 'string' && /schema\.org/i.test(c))
  return false
}

export function validateSchemaOnly(html: string): ValidationResult[] {
  const results: ValidationResult[] = []
  const blocks = extractJsonLd(html)
  const visible = getVisibleText(parseHtml(html).document)

  results.push(
    result({
      category: 'Datos estructurados',
      title: 'Disclaimer de rich results',
      description:
        'Usar Schema.org no garantiza un resultado enriquecido. Se separan: validez Schema.org, elegibilidad documentada por Google, presencia real del contenido y decisión del motor de búsqueda.',
      status: 'manual-review',
      severity: 'low',
    }),
  )

  if (blocks.length === 0) {
    results.push(
      errorResult(
        'Datos estructurados',
        'Falta JSON-LD',
        'Debe existir al menos un bloque <script type="application/ld+json">.',
        { severity: 'high' },
      ),
    )
    return results
  }

  for (const block of blocks) {
    if (block.error) {
      results.push(
        errorResult('Datos estructurados', 'JSON-LD inválido', block.error, {
          severity: 'high',
          evidence: block.raw.slice(0, 120),
        }),
      )
      continue
    }

    const root = (block.data ?? {}) as Record<string, unknown>
    const nodes = asArray(block.data)
    const rootContextOk = contextOk(root)

    for (const node of nodes) {
      if (!rootContextOk && !contextOk(node)) {
        results.push(
          errorResult(
            'Datos estructurados',
            'Context Schema.org requerido',
            '@context debe apuntar a https://schema.org.',
            { severity: 'high' },
          ),
        )
      }

      const t = typeOf(node)
      if (!t) {
        results.push(
          errorResult('Datos estructurados', 'Falta @type', '@type es obligatorio y no debe estar vacío.', {
            severity: 'high',
          }),
        )
        continue
      }

      if (t === 'Article' || t === 'BlogPosting') {
        for (const prop of ['headline', 'author', 'datePublished']) {
          if (!(prop in node)) {
            results.push(
              warningResult(
                'Datos estructurados',
                `Falta ${prop} en ${t}`,
                `Advertencia: falta la propiedad ${prop}.`,
              ),
            )
          }
        }
      }

      if (t === 'Product') {
        for (const prop of ['name', 'description', 'offers']) {
          if (!(prop in node)) {
            results.push(
              warningResult(
                'Datos estructurados',
                `Falta ${prop} en Product`,
                `Advertencia: falta la propiedad ${prop}.`,
              ),
            )
          }
        }
        if (('aggregateRating' in node || 'review' in node) && !/reseñ|review|opinión/i.test(visible)) {
          results.push(
            errorResult(
              'Datos estructurados',
              'Reseñas Schema sin evidencia visible',
              'Se usa aggregateRating/review sin contenido visible relacionado con reseñas.',
              { severity: 'high' },
            ),
          )
        }
      }

      if (t === 'FAQPage' && !('mainEntity' in node)) {
        results.push(
          errorResult(
            'Datos estructurados',
            'FAQPage sin mainEntity',
            'FAQPage requiere mainEntity con preguntas y respuestas.',
            { severity: 'high' },
          ),
        )
      }

      if (t === 'LocalBusiness') {
        for (const prop of ['name', 'address', 'telephone']) {
          if (!(prop in node)) {
            results.push(
              warningResult(
                'Datos estructurados',
                `Falta ${prop} en LocalBusiness`,
                `Advertencia: falta ${prop}.`,
              ),
            )
          }
        }
      }

      if (t === 'Event') {
        for (const prop of ['name', 'startDate', 'location']) {
          if (!(prop in node)) {
            results.push(
              warningResult('Datos estructurados', `Falta ${prop} en Event`, `Advertencia: falta ${prop}.`),
            )
          }
        }
      }

      for (const prop of ['headline', 'name', 'description']) {
        const value = node[prop]
        if (typeof value === 'string' && value.trim()) {
          if (!visible.toLowerCase().includes(value.toLowerCase().slice(0, 40))) {
            results.push(
              manualReview(
                'Coherencia',
                `${prop} no encontrado literalmente`,
                `La propiedad ${prop} no aparece de forma literal en el contenido visible; no se afirma que sea falsa.`,
                { evidence: value },
              ),
            )
          }
        }
      }
    }
  }

  results.push(
    manualReview(
      'Datos estructurados',
      '¿El tipo describe el contenido principal?',
      'Revisa adecuación del @type.',
    ),
    manualReview(
      'Datos estructurados',
      '¿Cada propiedad tiene respaldo?',
      'Revisa evidencia de cada propiedad.',
    ),
    manualReview(
      'Datos estructurados',
      '¿El marcado representa la página?',
      'Revisa si describe otra entidad.',
    ),
    manualReview(
      'Datos estructurados',
      '¿Se agregó información solo para rich results?',
      'Revisa riesgo de markup artificial.',
    ),
  )

  return results
}

export function validateStage4(html: string): ValidationResult[] {
  return [...validateStage3(html), ...validateSchemaOnly(html)]
}
