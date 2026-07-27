import type { ConfigData } from 'html-validate/browser'

/**
 * Syntax/nesting-focused rules only.
 * Avoid document-completeness / WCAG rules that conflict with Paso 1–2 pedagogy
 * (e.g. missing lang or title).
 */
export const htmlSyntaxConfig: ConfigData = {
  elements: ['html5'],
  rules: {
    'close-order': 'error',
    'element-permitted-content': 'error',
    'element-permitted-parent': 'error',
    'void-content': 'error',
    'no-dup-attr': 'error',
    'no-dup-id': 'error',
    'unrecognized-char-ref': 'error',
  },
}
