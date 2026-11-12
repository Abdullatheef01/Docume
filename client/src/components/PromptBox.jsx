import { useState } from 'react'
import { ArrowUp, Loader2, Plus } from 'lucide-react'
import { linkBtn } from '../ui.js'

const PLACEHOLDERS = {
  repome: 'Describe your project or paste a GitHub repo link…',
  imme: 'Tell me about yourself...',
}

export default function PromptBox({ mode, user, busy, quota, authLoading, onSubmit, onLogin, onPlus }) {
  const [text, setText] = useState('')
  const locked = !!user && !!quota?.locked
  const canSend = !!user && !!text.trim() && !busy && !locked
  const notice = !user
    ? null
    : locked
      ? quota.site
        ? 'AI has reached its daily limit. Please try again tomorrow.'
        : `AI limit reached.${quota.resetText ? ` Renews in ${quota.resetText}.` : ''}`
      : quota?.low
        ? `${quota.remaining === 1 ? 'Only 1 AI use' : `Only ${quota.remaining} AI uses`} left${quota.resetText ? `. Renews in ${quota.resetText}` : ''}.`
        : null

  const submit = () => {
    if (!canSend) return
    onSubmit(text.trim())
    setText('')
  }

  return (
    <div className="w-full max-w-[720px]">
      <div className={`flex items-center gap-2.5 rounded-full border border-line bg-panel py-2 pl-6 pr-2 focus-within:border-[#2f3b4d] max-sm:pl-2 ${locked ? 'opacity-50' : ''}`}>
        {mode === 'imme' && (
          <button
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-panel2 sm:hidden"
            onClick={onPlus}
            aria-label="Choose template"
          >
            <Plus size={20} />
          </button>
        )}
        <input
          className="min-w-0 flex-1 bg-transparent py-2 outline-none placeholder:text-[#566070] disabled:cursor-not-allowed"
          value={text}
          placeholder={locked ? 'AI limit reached' : PLACEHOLDERS[mode]}
          disabled={locked}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          aria-label="AI prompt"
        />
        <button
          className="inline-flex size-10 items-center justify-center rounded-full bg-[#e6edf3] text-[#0b0f16] disabled:bg-[#1a212c] disabled:text-[#4a5463]"
          onClick={submit}
          disabled={!canSend}
          aria-label="Generate with AI"
        >
          {busy ? <Loader2 size={18} className="animate-spin" /> : <ArrowUp size={18} />}
        </button>
      </div>
      {notice && (
        <p className={`mx-1 mt-2 text-center text-[11px] ${locked ? 'text-[#e0a458]' : 'text-muted'}`} role="status">
          {notice}
        </p>
      )}
      {!user && !authLoading && (
        <p className="mx-1 mt-2 text-center text-[11px] whitespace-nowrap text-muted">
          AI mode works after login.{' '}
          <button className={`${linkBtn} login-link`} onClick={onLogin}>
            Please login
          </button>{' '}
          to generate with AI.
        </p>
      )}
    </div>
  )
}