import { Plus } from 'lucide-react'

const card =
  'flex h-40 w-[150px] flex-col items-center justify-center gap-2.5 rounded-2xl border border-line bg-panel p-3 text-[#c9d1d9] hover:border-[#33425a] hover:bg-panel2'

// small skeleton thumbnail so the card looks like a README layout
function Thumb({ lines }) {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-[5px] overflow-hidden rounded-lg border border-line bg-[#090d13] p-2.5">
      <span className="block h-2 w-[55%] shrink-0 rounded-sm bg-[#33425a]" />
      {Array.from({ length: lines }).map((_, i) => (
        <span key={i} className="block h-[5px] shrink-0 rounded-sm bg-[#1f2937]" style={{ width: `${90 - ((i * 17) % 40)}%` }} />
      ))}
    </div>
  )
}

export default function TemplateCards({ templates, onPick, onBlank }) {
  return (
    <div className="hidden sm:flex flex-wrap justify-center gap-[18px] pt-2.5">
      {templates.map((t) => (
        <button key={t.id} className={card} onClick={() => onPick(t)}>
          <Thumb lines={t.keys.length} />
          <span className="text-center text-xs">{t.name}</span>
        </button>
      ))}
      <button className={`${card} text-muted`} onClick={onBlank} aria-label="Create your own template">
        <Plus size={28} />
        <span className="text-center text-xs">Create your own</span>
      </button>
    </div>
  )
}
