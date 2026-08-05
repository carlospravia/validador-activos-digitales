import type { Severity, ValidationResult } from '../types/validation'

export const SCORE_DISCLAIMER =
  'Este puntaje refleja únicamente las reglas verificables incluidas en este ejercicio. No representa una garantía de posicionamiento, accesibilidad completa ni elegibilidad para resultados enriquecidos.'

const PENALTY: Record<string, number> = {
  'critical:error': 15,
  'high:error': 10,
  'medium:error': 5,
  'low:error': 2,
  'critical:warning': 2,
  'high:warning': 2,
  'medium:warning': 2,
  'low:warning': 2,
}

function penaltyFor(severity: Severity, status: string): number {
  if (status === 'manual-review' || status === 'passed' || status === 'not-applicable') return 0
  if (status === 'warning') return PENALTY[`${severity}:warning`] ?? 2
  if (status === 'error') {
    if (severity === 'critical') return 15
    if (severity === 'high') return 10
    if (severity === 'medium') return 5
    return 2
  }
  return 0
}

export function computeScore(results: ValidationResult[]): number {
  let score = 100
  for (const r of results) {
    score -= penaltyFor(r.severity, r.status)
  }
  return Math.max(0, Math.min(100, score))
}
