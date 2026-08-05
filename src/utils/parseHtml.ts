export interface ParsedHtml {
  raw: string
  document: Document
  parseError: string | null
  hasDoctype: boolean
}

/**
 * Parse student HTML without executing scripts.
 * Uses DOMParser; scripts in the string are not run by the parser.
 */
export function parseHtml(html: string): ParsedHtml {
  const trimmed = html.trim()
  const hasDoctype = /<!doctype\s+html/i.test(trimmed)
  const parser = new DOMParser()
  const document = parser.parseFromString(trimmed || ' ', 'text/html')
  const parserError = document.querySelector('parsererror')
  return {
    raw: html,
    document,
    parseError: parserError ? parserError.textContent?.trim() || 'HTML parse error' : null,
    hasDoctype,
  }
}

export function getVisibleText(doc: Document): string {
  return (doc.body?.textContent ?? '').replace(/\s+/g, ' ').trim()
}

export function countTags(doc: Document, tag: string): number {
  return doc.getElementsByTagName(tag).length
}
