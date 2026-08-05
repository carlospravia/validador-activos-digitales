import { describe, expect, it, beforeEach } from 'vitest'
import { validateHtmlSyntax, resetHtmlValidateSingleton } from './htmlSyntaxValidator'
import { hasStatus, resetResultIds } from '../utils/resultFactory'
import { runValidation } from './runValidation'
import indexV1 from '../../docs/examples/activo-digital-blog/index-v1.html?raw'

describe('htmlSyntaxValidator', () => {
  beforeEach(() => {
    resetResultIds()
    resetHtmlValidateSingleton()
  })

  it('flags crossed nesting as error', async () => {
    const results = await validateHtmlSyntax('<div><span></div></span>')
    expect(results.some((r) => r.status === 'error')).toBe(true)
    expect(
      results.some(
        (r) =>
          r.title.toLowerCase().includes('close-order') ||
          r.description.toLowerCase().includes('unclosed') ||
          r.description.toLowerCase().includes('end tag'),
      ),
    ).toBe(true)
  })

  it('flags void element with end tag', async () => {
    const html =
      '<!DOCTYPE html><html><head></head><body><img src="a.png">texto</img></body></html>'
    const results = await validateHtmlSyntax(html)
    expect(hasStatus(results, 'void-content', 'error')).toBe(true)
  })

  it('accepts well-formed official v1 example without syntax errors', async () => {
    const results = await validateHtmlSyntax(indexV1)
    expect(results.filter((r) => r.status === 'error')).toEqual([])
  })

  it('does not throw when orchestrator runs with broken markup', async () => {
    const run = await runValidation({
      html: '<div><span></div></span>',
      stage: 1,
      source: 'paste',
    })
    expect(run.results.some((r) => r.status === 'error')).toBe(true)
  })
})
