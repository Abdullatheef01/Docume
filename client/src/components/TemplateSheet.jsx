import { Plus } from 'lucide-react'

export default function TemplateSheet({ templates, onPick, onBlank, onClose }) {
  const row = 'flex w-full items-center gap-3 rounded-2xl bg-[#1a1a1a] px-4 py-3.5 text-left'
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/60 sm:hidden" onMouseDown={onClose}>
      <div className="w-full rounded-t-3xl bg-[#111] p-4 pb-8" onMouseDown={(e) => e.stopPropagation()}>
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#333]" />
        <div className="flex flex-col gap-2">
          {templates.map((t) => (
            <button key={t.id} className={row} onClick={() => { onPick(t); onClose() }}>
              {t.name}
            </button>
          ))}
          <button className={`${row} text-muted`} onClick={() => { onBlank(); onClose() }}>
            <Plus size={18} /> Create your own
          </button>
        </div>
      </div>
    </div>
  )
}