import type { StageId, ValidationInput, ValidationRun } from '../types/validation'
import { STAGES } from '../types/validation'
import { resetResultIds } from '../utils/resultFactory'
import { computeScore, SCORE_DISCLAIMER } from '../utils/scoring'
import { suggestMeasurements } from '../utils/measurement'
import { validateGeneralRules } from './generalValidator'
import { validateStage1, validateFileName } from './semanticValidator'
import { validateStage2 } from './onPageValidator'
import { validateStage3 } from './accessibilityValidator'
import { validateStage4 } from './schemaValidator'

function expectedFile(stage: StageId): string {
  return STAGES.find((s) => s.id === stage)?.expectedFile ?? 'index.html'
}

function categoryForStage(stage: StageId): string {
  switch (stage) {
    case 1:
      return 'Estructura semántica'
    case 2:
      return 'SEO On-Page'
    case 3:
      return 'Accesibilidad'
    case 4:
      return 'Datos estructurados'
    case 5:
      return 'Documento y sintaxis'
    default: {
      const _exhaustive: never = stage
      return _exhaustive
    }
  }
}

/**
 * Fail-safe orchestrator: never throws to the UI.
 */
export function runValidation(input: ValidationInput): ValidationRun {
  resetResultIds()
  const validatedAt = new Date().toLocaleString()
  try {
    const general = validateGeneralRules(input.html)
    // If empty, stop early
    if (!input.html.trim()) {
      return { results: general, stage: input.stage, fileName: input.fileName, validatedAt }
    }

    const fileResults = validateFileName(
      expectedFile(input.stage),
      input.source,
      input.fileName,
      categoryForStage(input.stage),
    )

    let stageResults: ReturnType<typeof validateStage1> = []
    switch (input.stage) {
      case 1:
        stageResults = validateStage1(input.html)
        break
      case 2:
        stageResults = validateStage2(input.html)
        break
      case 3:
        stageResults = validateStage3(input.html)
        break
      case 4:
        stageResults = validateStage4(input.html)
        break
      case 5: {
        stageResults = validateStage4(input.html)
        break
      }
      default: {
        const _exhaustive: never = input.stage
        return _exhaustive
      }
    }

    const results = [...general, ...fileResults, ...stageResults]
    const run: ValidationRun = {
      results,
      stage: input.stage,
      fileName: input.fileName,
      validatedAt,
    }

    if (input.stage === 4 || input.stage === 5) {
      run.schemaDisclaimer =
        'Usar Schema.org no garantiza un resultado enriquecido.'
    }

    if (input.stage === 5) {
      run.score = computeScore(results)
      run.scoreDisclaimer = SCORE_DISCLAIMER
      run.measurementSuggestions = suggestMeasurements(input.html)
    }

    return run
  } catch (error) {
    return {
      stage: input.stage,
      fileName: input.fileName,
      validatedAt,
      results: [
        {
          id: 'fatal',
          category: 'Documento y sintaxis',
          title: 'Error interno de validación',
          description:
            error instanceof Error
              ? error.message
              : 'Ocurrió un error inesperado al validar. La aplicación sigue operativa.',
          status: 'error',
          severity: 'critical',
        },
      ],
    }
  }
}
