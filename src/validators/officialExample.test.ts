import { describe, expect, it } from 'vitest'
import { SAMPLE_FILES } from '../data/sampleFiles'
import { runValidation } from './runValidation'
import type { StageId } from '../types/validation'

const CASES: { key: keyof typeof SAMPLE_FILES; stage: StageId; fileName: string }[] = [
  { key: 'v1', stage: 1, fileName: 'index-v1.html' },
  { key: 'v2', stage: 2, fileName: 'index-v2.html' },
  { key: 'v3', stage: 3, fileName: 'index-v3.html' },
  { key: 'v4', stage: 4, fileName: 'index-v4.html' },
  { key: 'final', stage: 5, fileName: 'index-final.html' },
]

describe('official example activo-digital-blog', () => {
  it.each(CASES)(
    '$fileName validates on stage $stage without critical structural errors',
    ({ key, stage, fileName }) => {
      const sample = SAMPLE_FILES[key]
      expect(sample.fileName).toBe(fileName)

      const run = runValidation({
        html: sample.html,
        stage,
        source: 'file',
        fileName,
      })

      const critical = run.results.filter(
        (r) => r.status === 'error' && r.severity === 'critical',
      )
      expect(critical, critical.map((c) => c.title).join('; ')).toEqual([])

      // Pedagogical / content errors should also be clean for the happy-path example
      const blocking = run.results.filter((r) => r.status === 'error')
      expect(
        blocking,
        blocking.map((b) => `${b.title}: ${b.description}`).join('\n'),
      ).toEqual([])
    },
  )

  it('Paso 1 example has no title, meta description or lang (pedagogical bans)', () => {
    const html = SAMPLE_FILES.v1.html
    expect(html).not.toMatch(/<title[\s>]/i)
    expect(html).not.toMatch(/meta\s+name=["']description["']/i)
    expect(html).not.toMatch(/<html[^>]*\slang=/i)
    expect(html).toMatch(/\[EVIDENCIA PENDIENTE\]/)
  })

  it('bad sample produces at least one error', () => {
    const run = runValidation({
      html: SAMPLE_FILES.bad.html,
      stage: 1,
      source: 'sample',
      fileName: SAMPLE_FILES.bad.fileName,
    })
    expect(run.results.some((r) => r.status === 'error')).toBe(true)
  })
})
