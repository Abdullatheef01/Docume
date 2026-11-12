import { useEffect, useRef, useState } from 'react'
import CodeEditor from 'react-simple-code-editor'
import Prism from 'prismjs'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-http'
import 'prismjs/components/prism-markdown'
import { AlignCenter, AlignLeft, AlignRight, BadgeCheck, Loader2, Wand2 } from 'lucide-react'
import { getAlign, setAlign } from '../utils/markdown.js'
import { api } from '../api.js'
import BadgePicker from './BadgePicker.jsx'

const ALIGNS = [
  { value: 'left', Icon: AlignLeft, label: 'Align left' },
  { value: 'center', Icon: AlignCenter, label: 'Align center' },
  { value: 'right', Icon: AlignRight, label: 'Align right' },
]

const highlight = (code) => Prism.highlight(code, Prism.languages.markdown, 'markdown')

const toolBtn = (on) =>
  `inline-flex size-[30px] items-center justify-center rounded-md hover:bg-white/10 hover:text-white ${
    on ? 'bg-white/10 text-accent' : 'text-[#8b8b8b]'
  }`

export default function Editor({ section, user, onChange, onLogin, onError, wandLock, onUsage }) {
  const [enhancing, setEnhancing] = useState(false)
  const [badgeOpen, setBadgeOpen] = useState(false)
  const badgeRef = useRef(null)

  useEffect(() => {
    if (!badgeOpen) return
    const close = (e) => badgeRef.current && !badgeRef.current.contains(e.target) && setBadgeOpen(false)
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [badgeOpen])

  useEffect(() => setBadgeOpen(false), [section?.id])

  const paneClass =
    'relative flex min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-line bg-editor'

  if (!section) {
    return (
      <section className={`${paneClass} items-center justify-center`} aria-label="Editor">
        <p className="p-5 text-center text-muted">Add a section from the sidebar to start editing.</p>
      </section>
    )
  }

  const hasText = section.content.trim().length > 0
  const wandReady = !!user && hasText && !enhancing && !wandLock
  const align = getAlign(section.content)

  const onWand = async () => {
    if (!user) return onLogin()
    if (wandLock) return onError?.({ message: wandLock })
    if (!hasText || enhancing) return
    const { id, content, title } = section
    setEnhancing(true)
    try {
      const { text, usage } = await api.enhance(content, title)
      onUsage?.(usage)
      if (text) onChange(id, text)
    } catch (err) {
      onUsage?.(err.usage)
      onError?.(err)
    } finally {
      setEnhancing(false)
    }
  }

  const wandTitle = !user ? 'Login to use AI enhance' : wandLock ? wandLock : hasText ? 'Enhance with AI' : 'Write something to enhance'

  return (
    <section className={paneClass} aria-label="Editor">
      <div className="flex items-center justify-end gap-2.5 px-3 pt-2.5">
        <div className="inline-flex gap-0.5" role="group" aria-label="Alignment">
          {ALIGNS.map(({ value, Icon, label }) => (
            <button
              key={value}
              className={toolBtn(align === value)}
              onClick={() => onChange(section.id, setAlign(section.content, value))}
              aria-label={label}
              title={label}
            >
              <Icon size={16} />
            </button>
          ))}
        </div>

        <div className="relative" ref={badgeRef}>
          <button className={toolBtn(false)} onClick={() => setBadgeOpen((o) => !o)} aria-label="Add icons and badges" title="Icons & badges">
            <BadgeCheck size={16} />
          </button>
          {badgeOpen && (
            <BadgePicker
              onClose={() => setBadgeOpen(false)}
              onInsert={(md) => {
                const sep = section.content.trim() ? '\n\n' : ''
                onChange(section.id, section.content.replace(/\s*$/, '') + sep + md + '\n')
                setBadgeOpen(false)
              }}
            />
          )}
        </div>

        <button
          className={`inline-flex size-8 items-center justify-center rounded-lg ${
            wandReady
              ? 'bg-accent/15 text-[#7cc4ff] shadow-[0_0_14px_rgba(88,166,255,0.55)] hover:bg-accent/25'
              : 'cursor-not-allowed text-[#3d3d3d]'
          }`}
          data-state={wandReady ? 'ready' : 'dull'}
          onClick={onWand}
          aria-label="Enhance with AI"
          aria-disabled={!wandReady}
          title={wandTitle}
        >
          {enhancing ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
        </button>
      </div>

      <div className="code-editor-wrap min-h-0 flex-1 overflow-auto">
        <CodeEditor
          className="code-editor min-h-full"
          textareaClassName="focus:outline-none"
          value={section.content}
          onValueChange={(v) => onChange(section.id, v)}
          highlight={highlight}
          padding={20}
          tabSize={2}
          aria-label={`Edit ${section.title}`}
          style={{ minHeight: '100%' }}
        />
      </div>
    </section>
  )
}
