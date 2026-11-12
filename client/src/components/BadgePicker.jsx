import { useEffect, useMemo, useState } from 'react'
import { Check, Search, X } from 'lucide-react'
import { ICONS, ICON_CATEGORIES } from '../data/icons.js'
import { BADGES, BADGE_CATEGORIES, BADGE_STYLES } from '../data/badges.js'

const chip = (on) =>
  `shrink-0 rounded-full border px-3 py-1 text-xs ${
    on ? 'border-accent bg-accent/15 text-[#7cc4ff]' : 'border-line text-muted hover:text-white'
  }`

const previewUrl = (md) => md.match(/https:\/\/(?:img\.shields\.io|komarev\.com)[^)\s]*/)?.[0]

export default function BadgePicker({ onInsert, onClose }) {
  const [tab, setTab] = useState('icons') // 'icons' | 'badges'
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('All')
  const [theme, setTheme] = useState('dark') // skillicons.dev supports: dark (default) | light
  const [perline, setPerline] = useState(10)
  const [style, setStyle] = useState('for-the-badge')
  const [picked, setPicked] = useState([]) // ids (icons) or names (badges), in click order

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const isIcons = tab === 'icons'
  const cats = isIcons ? ICON_CATEGORIES : BADGE_CATEGORIES

  const switchTab = (t) => {
    setTab(t)
    setCat('All')
    setQuery('')
    setPicked([])
  }

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = isIcons ? ICONS : BADGES
    return list.filter(
      (i) => (cat === 'All' || i.cat === cat) && (!q || i.name.toLowerCase().includes(q) || (i.id && i.id.includes(q)))
    )
  }, [isIcons, query, cat])

  const keyOf = (i) => (isIcons ? i.id : `${i.cat}:${i.name}`)
  const toggle = (i) =>
    setPicked((p) => (p.includes(keyOf(i)) ? p.filter((x) => x !== keyOf(i)) : [...p, keyOf(i)]))

  const insert = () => {
    if (!picked.length) return
    if (isIcons) {
      const ids = picked.join(',')
      const url = `https://skillicons.dev/icons?i=${ids}${theme === 'light' ? '&theme=light' : ''}&perline=${perline}`
      onInsert(`<p>\n  <img src="${url}" alt="Skills" />\n</p>`)
    } else {
      const byKey = new Map(BADGES.map((b) => [`${b.cat}:${b.name}`, b]))
      onInsert(picked.map((k) => byKey.get(k).md(style)).join('\n'))
    }
    setPicked([])
  }

  const iconUrl = (id) => `https://skillicons.dev/icons?i=${id}${theme === 'light' ? '&theme=light' : ''}`
  const field = 'rounded-md border border-line bg-panel px-2 py-1 text-xs outline-none focus:border-accent'

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 p-2 sm:items-center"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
    <div
      className="flex max-h-[80dvh] w-full flex-col rounded-2xl border border-[#2b3646] bg-panel2 shadow-2xl sm:w-[520px]"
      role="dialog"
      aria-label="Add icons and badges"
    >
      <div className="flex items-center gap-1 border-b border-line p-2">
        {[
          ['icons', 'Icons'],
          ['badges', 'Badges'],
        ].map(([v, label]) => (
          <button
            key={v}
            className={`rounded-lg px-3 py-1.5 text-[13px] ${tab === v ? 'bg-white/10 text-white' : 'text-muted hover:text-white'}`}
            onClick={() => switchTab(v)}
          >
            {label}
          </button>
        ))}
        <button className="ml-auto rounded-md p-1.5 text-muted hover:bg-white/10 hover:text-white" onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>
      </div>

      <div className="flex flex-col gap-2 p-2.5">
        <div className="flex items-center gap-2 rounded-lg border border-line bg-panel px-2.5">
          <Search size={14} className="text-muted" />
          <input
            className="min-w-0 flex-1 bg-transparent py-1.5 text-[13px] outline-none"
            placeholder={isIcons ? 'Search icons… (python, react)' : 'Search badges… (linkedin, mit)'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="scrollbar-hide flex gap-1.5 overflow-x-auto">
          {cats.map((c) => (
            <button key={c} className={chip(cat === c)} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
          {isIcons ? (
            <>
              Theme
              <div className="inline-flex rounded-md border border-line p-0.5" role="group" aria-label="Icon theme">
                {['dark', 'light'].map((t) => (
                  <button
                    key={t}
                    className={`rounded px-2.5 py-0.5 capitalize ${theme === t ? 'bg-white/10 text-white' : ''}`}
                    onClick={() => setTheme(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
              Per line
              <select className={field} value={perline} onChange={(e) => setPerline(Number(e.target.value))}>
                {[5, 6, 8, 10, 12, 15, 20].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </>
          ) : (
            <>
              Style
              <select className={field} value={style} onChange={(e) => setStyle(e.target.value)}>
                {BADGE_STYLES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2.5 pb-2.5">
        {items.length === 0 ? (
          <p className="py-6 text-center text-xs text-muted">Nothing found.</p>
        ) : isIcons ? (
          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6">
            {items.map((i) => {
              const on = picked.includes(i.id)
              return (
                <button
                  key={i.id}
                  className={`relative flex flex-col items-center gap-1 rounded-lg border p-1.5 ${
                    on ? 'border-accent bg-accent/10' : 'border-line hover:bg-white/5'
                  }`}
                  onClick={() => toggle(i)}
                  title={i.name}
                >
                  <img src={iconUrl(i.id)} alt="" loading="lazy" width="36" height="36" className="size-9" />
                  <span className="w-full truncate text-center text-[10px] text-muted">{i.name}</span>
                  {on && <Check size={12} className="absolute right-1 top-1 text-accent" />}
                </button>
              )
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {items.map((b) => {
              const on = picked.includes(keyOf(b))
              return (
                <button
                  key={keyOf(b)}
                  className={`flex min-h-11 items-center justify-center overflow-hidden rounded-lg border p-1.5 ${
                    on ? 'border-accent bg-accent/10' : 'border-line hover:bg-white/5'
                  }`}
                  onClick={() => toggle(b)}
                  title={b.name}
                >
                  <img src={previewUrl(b.md(style))} alt={b.name} loading="lazy" className="max-h-7 max-w-full" />
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-line p-2.5">
        <span className="min-w-0 flex-1 truncate text-xs text-muted">
          {picked.length ? `${picked.length} selected` : 'Click to select, then Insert'}
        </span>
        {picked.length > 0 && (
          <button className="text-xs text-muted hover:text-white" onClick={() => setPicked([])}>
            Clear
          </button>
        )}
        <button
          className="rounded-lg bg-brand px-4 py-1.5 text-[13px] font-medium text-white hover:bg-brand-hover disabled:opacity-40"
          onClick={insert}
          disabled={!picked.length}
        >
          Insert
        </button>
      </div>
    </div>
    </div>
  )
}
