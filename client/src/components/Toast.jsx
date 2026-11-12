import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(onClose, 5000)
    return () => clearTimeout(t)
  }, [toast, onClose])

  if (!toast) return null
  return (
    <div
      className={`fixed bottom-5 left-1/2 z-[60] flex max-w-[92vw] -translate-x-1/2 items-center gap-3 rounded-xl border px-4 py-2.5 text-[13px] shadow-2xl ${
        toast.type === 'error' ? 'border-[#5c2b2b] bg-[#2a1515] text-[#ffb4b4]' : 'border-[#2b4a33] bg-[#13211a] text-[#b8f0c4]'
      }`}
      role="status"
    >
      <span>{toast.text}</span>
      <button className="shrink-0 opacity-70 hover:opacity-100" onClick={onClose} aria-label="Dismiss">
        <X size={14} />
      </button>
    </div>
  )
}
