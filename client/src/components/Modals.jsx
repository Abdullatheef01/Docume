import { useEffect, useRef, useState } from 'react'
import { Github, X } from 'lucide-react'
import { btnGhost, btnPrimary, iconBtn } from '../ui.js'

const inputCls =
  'w-full rounded-lg border border-line bg-panel2 px-3 py-2 outline-none focus:border-accent'

function Overlay({ onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onMouseDown={onClose}>
      <div
        className="modal relative w-full max-w-[420px] rounded-2xl border border-[#2b3646] bg-[#0f151d] p-[26px] shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button className={`${iconBtn} absolute right-3 top-3`} onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  )
}

export function LoginModal({ onClose }) {
  // Real OAuth: the browser goes to the server, which redirects to Google / GitHub and then back here.
  const go = (provider) => {
    window.location.href = `/api/auth/${provider}`
  }
  const oauth =
    'mb-2.5 flex w-full items-center justify-center gap-2.5 rounded-[10px] border border-line bg-panel2 p-[11px] font-medium hover:border-[#33425a]'

  return (
    <Overlay onClose={onClose}>
      <h2 className="mb-1.5 text-xl font-semibold">Login to Docume</h2>
      <p className="mb-[18px] leading-normal text-muted">
        Login to use AI mode, the magic wand and to keep your chat history.
      </p>

      <button className={oauth} onClick={() => go('google')}>
        <span className="font-bold text-[#4285f4]">G</span> Continue with Google
      </button>
      <button className={oauth} onClick={() => go('github')}>
        <Github size={18} /> Continue with GitHub
      </button>
    </Overlay>
  )
}

export function CustomSectionModal({ onClose, onAdd }) {
  const [name, setName] = useState('')
  const inputRef = useRef(null)
  useEffect(() => inputRef.current?.focus(), [])

  const submit = () => {
    if (name.trim()) onAdd(name.trim())
  }

  return (
    <Overlay onClose={onClose}>
      <h2 className="mb-1.5 text-xl font-semibold">Custom Section</h2>
      <p className="mb-[18px] leading-normal text-muted">What should this section be called?</p>
      <input
        ref={inputRef}
        className={`${inputCls} modal-input`}
        placeholder="e.g. Certifications"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
      />
      <div className="mt-[18px] flex justify-end gap-2.5">
        <button className={btnGhost} onClick={onClose}>
          Cancel
        </button>
        <button className={btnPrimary} onClick={submit} disabled={!name.trim()}>
          Add section
        </button>
      </div>
    </Overlay>
  )
}
