import { useEffect, useRef, useState } from 'react'
import { Check, ClipboardCopy, Download } from 'lucide-react'
import Editor from './Editor.jsx'
import Preview from './Preview.jsx'

export default function Workspace({ markdown, section, user, onChange, onLogin, onError, wandLock, onUsage }) {
  const [view, setView] = useState('file') // 'file' | 'raw'
  const [copied, setCopied] = useState(false)
  const contentRef = useRef(null)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const flash = () => {
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1500)
  }

  // File mode -> copies the rendered text (rich html + plain text). Raw mode -> copies the markdown code.
  const copy = async () => {
    try {
      if (view === 'raw') {
        await navigator.clipboard.writeText(markdown)
      } else {
        const el = contentRef.current
        const html = el ? el.innerHTML : ''
        const text = el ? el.innerText : ''
        if (window.ClipboardItem) {
          await navigator.clipboard.write([
            new ClipboardItem({
              'text/html': new Blob([html], { type: 'text/html' }),
              'text/plain': new Blob([text], { type: 'text/plain' }),
            }),
          ])
        } else {
          await navigator.clipboard.writeText(text)
        }
      }
      flash()
    } catch {
      /* clipboard blocked – ignore */
    }
  }

  const download = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'README.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyLabel = view === 'raw' ? 'Copy raw markdown' : 'Copy rendered text'

  return (
    <div className="flex min-h-[460px] flex-1 flex-col gap-2.5 max-lg:min-h-[700px]">
      <div className="flex items-center justify-end gap-2.5">
        <button
          className="inline-flex size-9 items-center justify-center rounded-lg text-muted hover:bg-panel2 hover:text-white"
          onClick={copy}
          aria-label={copyLabel}
          title={copyLabel}
        >
          {copied ? <Check size={18} /> : <ClipboardCopy size={18} />}
        </button>
        <button
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2 font-medium text-white hover:bg-brand-hover disabled:opacity-50"
          onClick={download}
          disabled={!markdown}
        >
          <Download size={16} /> <span className="max-sm:hidden">Download</span>
        </button>
      </div>

      <div className="grid min-h-0 flex-1 gap-3.5 lg:grid-cols-2 max-lg:auto-rows-[minmax(320px,1fr)]">
        <Editor section={section} user={user} onChange={onChange} onLogin={onLogin} onError={onError} wandLock={wandLock} onUsage={onUsage} />
        <Preview markdown={markdown} view={view} onViewChange={setView} contentRef={contentRef} />
      </div>
    </div>
  )
}
