import { useId, useMemo, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  CircleHelp,
  Copy,
  Download,
  Eye,
  Filter,
  ShieldAlert,
  XCircle,
} from 'lucide-react'
import { SAMPLE_FILES } from './data/sampleFiles'
import type {
  InputSource,
  StageId,
  ValidationResult,
  ValidationRun,
  ValidationStatus,
} from './types/validation'
import { STAGES } from './types/validation'
import { runValidation } from './validators/runValidation'

type FilterId = 'all' | 'error' | 'warning' | 'passed' | 'manual-review'

const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'error', label: 'Errores' },
  { id: 'warning', label: 'Advertencias' },
  { id: 'passed', label: 'Completados' },
  { id: 'manual-review', label: 'Revisión humana' },
]

function statusIcon(status: ValidationStatus) {
  switch (status) {
    case 'passed':
      return <CheckCircle2 size={18} aria-hidden />
    case 'error':
      return <XCircle size={18} aria-hidden />
    case 'warning':
      return <AlertTriangle size={18} aria-hidden />
    case 'manual-review':
      return <Eye size={18} aria-hidden />
    case 'not-applicable':
      return <CircleHelp size={18} aria-hidden />
    default: {
      const _exhaustive: never = status
      return _exhaustive
    }
  }
}

function statusLabel(status: ValidationStatus): string {
  switch (status) {
    case 'passed':
      return 'Completado'
    case 'error':
      return 'Error'
    case 'warning':
      return 'Advertencia'
    case 'manual-review':
      return 'Revisión humana'
    case 'not-applicable':
      return 'No aplica'
    default: {
      const _exhaustive: never = status
      return _exhaustive
    }
  }
}

function countBy(results: ValidationResult[], status: ValidationStatus): number {
  return results.filter((r) => r.status === status).length
}

function buildExportText(run: ValidationRun): string {
  const lines = [
    `Validador de Activos Digitales`,
    `Etapa: ${run.stage}`,
    `Archivo: ${run.fileName ?? '(pegado)'}`,
    `Fecha: ${run.validatedAt}`,
    run.score != null ? `Puntaje técnico: ${run.score}` : '',
    '',
    ...run.results.map(
      (r) =>
        `[${r.status.toUpperCase()}] ${r.title}\n${r.description}${r.recommendation ? `\nRecomendación: ${r.recommendation}` : ''}`,
    ),
  ]
  return lines.filter(Boolean).join('\n\n')
}

export default function App() {
  const stageId = useId()
  const editorId = useId()
  const sampleId = useId()
  const [stage, setStage] = useState<StageId>(1)
  const [html, setHtml] = useState('')
  const [source, setSource] = useState<InputSource>('paste')
  const [fileName, setFileName] = useState<string | undefined>()
  const [run, setRun] = useState<ValidationRun | null>(null)
  const [filter, setFilter] = useState<FilterId>('all')
  const [copyState, setCopyState] = useState('')

  const filtered = useMemo(() => {
    if (!run) return []
    if (filter === 'all') return run.results
    return run.results.filter((r) => r.status === filter)
  }, [run, filter])

  function handleValidate() {
    const next = runValidation({ html, stage, source, fileName })
    setRun(next)
    setFilter('all')
  }

  async function handleFile(file: File | null) {
    if (!file) return
    const text = await file.text()
    setHtml(text)
    setFileName(file.name)
    setSource('file')
  }

  function loadSample(key: string) {
    const sample = SAMPLE_FILES[key]
    if (!sample) return
    setHtml(sample.html)
    setFileName(sample.fileName)
    setSource('sample')
  }

  async function copySummary() {
    if (!run) return
    await navigator.clipboard.writeText(buildExportText(run))
    setCopyState('Resumen copiado')
    window.setTimeout(() => setCopyState(''), 2000)
  }

  function downloadSummary() {
    if (!run) return
    const blob = new Blob([buildExportText(run)], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `validacion-paso-${run.stage}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Validador de Activos Digitales</h1>
        <p>Valida cada etapa antes de avanzar al siguiente paso.</p>
      </header>

      <p className="privacy" role="note">
        <ShieldAlert size={16} style={{ verticalAlign: 'text-bottom', marginRight: 6 }} aria-hidden />
        El archivo se analiza localmente en tu navegador. No se carga ni se almacena en ningún servidor.
      </p>

      <section className="panel" aria-labelledby={stageId}>
        <label id={stageId} htmlFor="stage-select">
          Etapa del ejercicio
        </label>
        <select
          id="stage-select"
          value={stage}
          onChange={(e) => setStage(Number(e.target.value) as StageId)}
        >
          {STAGES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>

        <div className="row" style={{ marginTop: '1rem' }}>
          <label htmlFor="file-input">Subir archivo .html</label>
        </div>
        <input
          id="file-input"
          type="file"
          accept=".html,text/html"
          onChange={(e) => void handleFile(e.target.files?.[0] ?? null)}
        />

        <div className="row">
          <label htmlFor={sampleId}>Cargar ejemplo</label>
        </div>
        <select
          id={sampleId}
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) loadSample(e.target.value)
          }}
        >
          <option value="" disabled>
            Selecciona un ejemplo…
          </option>
          {Object.entries(SAMPLE_FILES).map(([key, sample]) => (
            <option key={key} value={key}>
              {sample.label}
            </option>
          ))}
        </select>

        <div className="row">
          <label htmlFor={editorId}>Pegar código HTML</label>
        </div>
        <textarea
          id={editorId}
          value={html}
          onChange={(e) => {
            setHtml(e.target.value)
            setSource('paste')
            setFileName(undefined)
          }}
          spellCheck={false}
          placeholder="Pega aquí tu HTML…"
        />

        <div className="row">
          <button type="button" className="btn btn-primary" onClick={handleValidate}>
            Validar archivo
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setHtml('')
              setFileName(undefined)
              setRun(null)
              setSource('paste')
            }}
          >
            Limpiar entrada
          </button>
        </div>
      </section>

      {run && (
        <section className="panel" aria-live="polite" aria-label="Resultados de validación">
          <h2 style={{ marginTop: 0 }}>Resultado general</h2>
          <p className="muted">
            Etapa {run.stage} · {run.fileName ?? 'código pegado'} · {run.validatedAt}
          </p>

          <div className="summary-grid">
            <div className="summary-item">
              <span className="muted">Errores</span>
              <strong>{countBy(run.results, 'error')}</strong>
            </div>
            <div className="summary-item">
              <span className="muted">Advertencias</span>
              <strong>{countBy(run.results, 'warning')}</strong>
            </div>
            <div className="summary-item">
              <span className="muted">Revisión humana</span>
              <strong>{countBy(run.results, 'manual-review')}</strong>
            </div>
            {run.score != null && (
              <div className="summary-item">
                <span className="muted">Puntaje técnico</span>
                <strong>{run.score}</strong>
              </div>
            )}
          </div>

          {run.scoreDisclaimer && (
            <p className="muted" style={{ marginTop: '0.9rem' }}>
              {run.scoreDisclaimer}
            </p>
          )}
          {run.schemaDisclaimer && (
            <p className="muted">{run.schemaDisclaimer}</p>
          )}

          <div className="row">
            <button type="button" className="btn btn-secondary" onClick={() => void copySummary()}>
              <Copy size={16} style={{ verticalAlign: 'text-bottom' }} aria-hidden /> Copiar resumen
            </button>
            <button type="button" className="btn btn-secondary" onClick={downloadSummary}>
              <Download size={16} style={{ verticalAlign: 'text-bottom' }} aria-hidden /> Descargar
              resumen
            </button>
            {copyState && (
              <span className="muted" role="status">
                {copyState}
              </span>
            )}
          </div>

          <div className="filters" role="group" aria-label="Filtrar resultados">
            <Filter size={16} aria-hidden />
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className="chip"
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="results">
            {filtered.length === 0 && <p className="muted">No hay resultados para este filtro.</p>}
            {filtered.map((item) => (
              <article key={item.id} className="card">
                <div className="card-head">
                  <span className={`badge badge-${item.status}`}>
                    {statusIcon(item.status)}
                    {statusLabel(item.status)}
                  </span>
                  <strong>{item.title}</strong>
                </div>
                <p>{item.description}</p>
                {item.evidence && (
                  <p className="muted">
                    <strong>Evidencia:</strong> {item.evidence}
                  </p>
                )}
                {item.recommendation && (
                  <p>
                    <strong>Corrección recomendada:</strong> {item.recommendation}
                  </p>
                )}
                {item.selector && (
                  <p className="muted">
                    <strong>Selector:</strong> {item.selector}
                  </p>
                )}
                <p className="muted">{item.category}</p>
              </article>
            ))}
          </div>

          {run.measurementSuggestions && run.measurementSuggestions.length > 0 && (
            <div className="measure" style={{ marginTop: '1.25rem' }}>
              <h3>Sugerencias de medición (sin GA4)</h3>
              <table>
                <thead>
                  <tr>
                    <th>Evento sugerido</th>
                    <th>Elemento</th>
                    <th>Acción</th>
                    <th>Parámetro</th>
                  </tr>
                </thead>
                <tbody>
                  {run.measurementSuggestions.map((m, idx) => (
                    <tr key={`${m.event}-${idx}`}>
                      <td>
                        <code>{m.event}</code>
                      </td>
                      <td>{m.element}</td>
                      <td>{m.action}</td>
                      <td>
                        <code>{m.parameter}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
