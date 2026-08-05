import { HtmlValidate, StaticConfigLoader } from 'html-validate/browser'
import type { ValidationResult } from '../types/validation'
import { errorResult, warningResult } from '../utils/resultFactory'
import { htmlSyntaxConfig } from './htmlValidateConfig'

let validator: HtmlValidate | null = null

function getValidator(): HtmlValidate {
  if (!validator) {
    const loader = new StaticConfigLoader(htmlSyntaxConfig)
    validator = new HtmlValidate(loader)
  }
  return validator
}

function severityFromHtmlValidate(severity: number): 'critical' | 'high' | 'medium' | 'low' {
  // html-validate: 2 = error, 1 = warning, 0 = disable
  if (severity >= 2) return 'high'
  return 'low'
}

/**
 * Real HTML tag/nesting validation via html-validate (browser bundle).
 * Fail-safe: never throws; returns a warning if the engine cannot run.
 */
export async function validateHtmlSyntax(html: string): Promise<ValidationResult[]> {
  if (!html.trim()) return []

  try {
    const report = await getValidator().validateString(html, 'student.html')
    const messages = report.results.flatMap((r) => r.messages)
    return messages.map((msg) => {
      const title = `HTML: ${msg.ruleId}`
      const description = msg.message
      const extras = {
        evidence: msg.selector ? `selector: ${msg.selector}` : undefined,
        recommendation: msg.ruleUrl ? `Ver regla: ${msg.ruleUrl}` : undefined,
        selector: msg.selector ?? undefined,
        severity: severityFromHtmlValidate(msg.severity),
      }
      if (msg.severity >= 2) {
        return errorResult('Documento y sintaxis', title, description, extras)
      }
      return warningResult('Documento y sintaxis', title, description, extras)
    })
  } catch {
    return [
      warningResult(
        'Documento y sintaxis',
        'Validación de sintaxis no disponible',
        'No se pudo ejecutar html-validate en este entorno. El resto de reglas sigue activo.',
        { severity: 'low' },
      ),
    ]
  }
}

/** Test helper: reset singleton between tests if needed */
export function resetHtmlValidateSingleton(): void {
  validator = null
}
