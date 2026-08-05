import type { MeasurementSuggestion } from '../types/validation'
import { parseHtml } from './parseHtml'

export function suggestMeasurements(html: string): MeasurementSuggestion[] {
  const { document: doc } = parseHtml(html)
  const suggestions: MeasurementSuggestion[] = []

  const cta = doc.querySelector('button, a.button, a[href*="contacto"], a[href*="registro"], .cta')
  if (cta || doc.querySelector('a[href]')) {
    const el = cta ?? doc.querySelector('a[href]')
    suggestions.push({
      event: 'cta_click',
      element: (el?.textContent ?? 'CTA').trim().slice(0, 60) || 'CTA',
      action: 'Clic',
      parameter: 'cta_text',
    })
  }

  for (const form of Array.from(doc.querySelectorAll('form'))) {
    const name = form.getAttribute('name') || form.getAttribute('id') || 'form'
    suggestions.push(
      { event: 'form_start', element: name, action: 'Primer ingreso', parameter: 'form_name' },
      { event: 'form_submit', element: name, action: 'Envío', parameter: 'form_name' },
    )
  }

  for (const a of Array.from(doc.querySelectorAll('a[download], a[href$=".pdf"], a[href$=".zip"]'))) {
    const href = a.getAttribute('href') ?? 'archivo'
    suggestions.push({
      event: 'file_download',
      element: href.split('/').pop() || href,
      action: 'Clic',
      parameter: 'file_name',
    })
  }

  for (const a of Array.from(doc.querySelectorAll('a[href^="mailto:"], a[href^="tel:"]'))) {
    const href = a.getAttribute('href') ?? ''
    suggestions.push({
      event: 'contact_click',
      element: href,
      action: 'Clic',
      parameter: 'contact_type',
    })
  }

  return suggestions
}
