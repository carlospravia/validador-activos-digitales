export type ValidationStatus =
  | 'passed'
  | 'error'
  | 'warning'
  | 'manual-review'
  | 'not-applicable'

export type Severity = 'critical' | 'high' | 'medium' | 'low'

export type StageId = 1 | 2 | 3 | 4 | 5

export type InputSource = 'file' | 'paste' | 'sample'

export interface ValidationResult {
  id: string
  category: string
  title: string
  description: string
  status: ValidationStatus
  severity: Severity
  evidence?: string
  recommendation?: string
  selector?: string
}

export interface ValidationInput {
  html: string
  stage: StageId
  source: InputSource
  fileName?: string
}

export interface ValidationRun {
  results: ValidationResult[]
  stage: StageId
  fileName?: string
  validatedAt: string
  score?: number
  scoreDisclaimer?: string
  measurementSuggestions?: MeasurementSuggestion[]
  schemaDisclaimer?: string
}

export interface MeasurementSuggestion {
  event: string
  element: string
  action: string
  parameter: string
}

export const STAGES: { id: StageId; label: string; expectedFile: string }[] = [
  { id: 1, label: 'Paso 1 — Estructura semántica', expectedFile: 'index-v1.html' },
  { id: 2, label: 'Paso 2 — Optimización On-Page', expectedFile: 'index-v2.html' },
  { id: 3, label: 'Paso 3 — Accesibilidad y legibilidad', expectedFile: 'index-v3.html' },
  { id: 4, label: 'Paso 4 — Datos estructurados', expectedFile: 'index-v4.html' },
  { id: 5, label: 'Paso 5 — Auditoría final', expectedFile: 'index-final.html' },
]
