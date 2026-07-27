import Editor from 'react-simple-code-editor'
import { highlight, languages } from 'prismjs'
import 'prismjs/components/prism-markup'
import 'prismjs/themes/prism-tomorrow.css'

type HtmlCodeEditorProps = {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function HtmlCodeEditor({ id, value, onChange, placeholder }: HtmlCodeEditorProps) {
  return (
    <div className="code-editor" data-placeholder={value ? undefined : placeholder}>
      <Editor
        value={value}
        onValueChange={onChange}
        highlight={(code) => highlight(code, languages.markup, 'markup')}
        padding={12}
        textareaId={id}
        textareaClassName="code-editor-textarea"
        preClassName="code-editor-pre"
        ignoreTabKey
        placeholder={placeholder}
        style={{
          fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", Menlo, Consolas, monospace',
          fontSize: 13,
          lineHeight: 1.5,
          minHeight: 240,
        }}
      />
    </div>
  )
}
