import type { Severity, ValidationResult, ValidationStatus } from '../types/validation'

let counter = 0

export function resetResultIds(): void {
  counter = 0
}

export function result(
  partial: Omit<ValidationResult, 'id'> & { id?: string },
): ValidationResult {
  counter += 1
  return {
    id: partial.id ?? `r-${counter}`,
    category: partial.category,
    title: partial.title,
    description: partial.description,
    status: partial.status,
    severity: partial.severity,
    evidence: partial.evidence,
    recommendation: partial.recommendation,
    selector: partial.selector,
  }
}

export function errorResult(
  category: string,
  title: string,
  description: string,
  extras?: Partial<ValidationResult> & { severity?: Severity },
): ValidationResult {
  return result({
    category,
    title,
    description,
    status: 'error',
    severity: extras?.severity ?? 'high',
    ...extras,
  })
}

export function warningResult(
  category: string,
  title: string,
  description: string,
  extras?: Partial<ValidationResult>,
): ValidationResult {
  return result({
    category,
    title,
    description,
    status: 'warning',
    severity: extras?.severity ?? 'low',
    ...extras,
  })
}

export function manualReview(
  category: string,
  title: string,
  description: string,
  extras?: Partial<ValidationResult>,
): ValidationResult {
  return result({
    category,
    title,
    description,
    status: 'manual-review',
    severity: extras?.severity ?? 'medium',
    ...extras,
  })
}

export function hasStatus(
  results: ValidationResult[],
  titleIncludes: string,
  status: ValidationStatus,
): boolean {
  return results.some(
    (r) => r.title.toLowerCase().includes(titleIncludes.toLowerCase()) && r.status === status,
  )
}
