import { useState } from 'react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ChevronDown, ChevronRight, GripVertical, LogOut, PanelLeft, Plus, Search, SquarePen, Trash2, X } from 'lucide-react'
import { btnPrimary, iconBtn, linkBtn } from '../ui.js'

const hint = 'my-1 mb-2 text-[11px] leading-snug text-[#388545] opacity-80'
const groupHead = 'my-3 mb-1.5 flex items-center gap-1.5 py-1 text-[15px] text-[#c9d1d9]'
const libItem = 'flex w-full items-center gap-2 rounded-lg bg-panel2 p-2.5 text-left text-[13px] text-[#c9d1d9] hover:bg-[#172030]'

function SectionRow({ section, active, onSelect, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`sec-row group flex min-h-10 items-center rounded-lg border ${
        active ? 'border-[#2b3646] bg-[#172030]' : 'border-transparent bg-panel2'
      }`}
    >
      <button className="sec-main min-w-0 flex-1 truncate p-2.5 text-left text-[13px]" onClick={onSelect} title={section.title}>
        {section.title}
      </button>
      <button
        className={`${iconBtn} size-6 opacity-0 focus-visible:opacity-100 group-hover:opacity-100`}
        onClick={onRemove}
        aria-label={`Remove ${section.title}`}
      >
        <X size={14} />
      </button>
      <button
        className={`${iconBtn} handle w-7 cursor-grab touch-none`}
        {...attributes}
        {...listeners}
        aria-label={`Drag ${section.title}`}
      >
        <GripVertical size={16} />
      </button>
    </li>
  )
}

function Avatar({ user }) {
  return (
    <span className="avatar inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[#1f6f2d] text-xs font-semibold text-[#d8ffdc]">
      {user ? user.email.charAt(0).toUpperCase() : '?'}
    </span>
  )
}

export default function Sidebar({
  open,
  onToggle,
  user,
  chats,
  chatsLoading,
  authLoading,
  currentChatId,
  sections,
  activeId,
  library,
  onNew,
  onOpenChat,
  onDeleteChat,
  onSelect,
  onAdd,
  onRemove,
  onReorder,
  onOpenCustom,
  onLogin,
  onLogout,
}) {
  const [recentOpen, setRecentOpen] = useState(true)
  const [sectionOpen, setSectionOpen] = useState(true)
  const [chatSearchOpen, setChatSearchOpen] = useState(false)
  const [chatQuery, setChatQuery] = useState('')
  const [libQuery, setLibQuery] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  /* ---------- collapsed rail ---------- */
  if (!open) {
    return (
      <aside className="sidebar rail flex w-14 shrink-0 flex-col items-center gap-2 border-r border-line bg-sidebar py-3.5 max-sm:absolute max-sm:left-2 max-sm:top-2 max-sm:z-20 max-sm:w-auto max-sm:border-0 max-sm:bg-transparent max-sm:p-0">
        <button className={iconBtn} onClick={onToggle} aria-label="Open sidebar">
          <PanelLeft size={18} />
        </button>
        <div className="mt-4 flex flex-col gap-1 max-sm:hidden">
          <button className={iconBtn} onClick={onNew} aria-label="New chat" title="New">
            <SquarePen size={18} />
          </button>
          <button
            className={iconBtn}
            onClick={() => {
              setChatSearchOpen(true)
              onToggle()
            }}
            aria-label="Search chats"
            title="Search"
          >
            <Search size={18} />
          </button>
        </div>
        <div className="mt-auto max-sm:hidden">
          <button className="rounded-full" onClick={user ? onToggle : onLogin} aria-label={user ? 'Account' : 'Login'} title={user ? undefined : 'Login'}>
            <Avatar user={user} />
          </button>
        </div>
      </aside>
    )
  }

  /* ---------- expanded ---------- */
  const query = chatQuery.trim().toLowerCase()
  const shownChats = query ? chats.filter((c) => c.title.toLowerCase().includes(query)) : chats
  const shownLib = library.filter((l) => l.title.toLowerCase().includes(libQuery.trim().toLowerCase()))

  return (
    <aside className="sidebar flex w-[248px] shrink-0 flex-col border-r border-line bg-sidebar max-sm:fixed max-sm:inset-y-0 max-sm:left-0 max-sm:z-30 max-sm:w-[min(300px,86vw)] code-editor-wrap">
      <div className="flex items-center gap-2.5 px-3.5 pb-1.5 pt-3.5">
        <button className={iconBtn} onClick={onToggle} aria-label="Close sidebar">
          <PanelLeft size={18} />
        </button>
        <span className="text-[22px] font-medium tracking-tight">Docume</span>
      </div>

      <nav className="flex flex-col gap-0.5 px-2.5 pb-1 pt-2.5">
        <button className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[#c9d1d9] hover:bg-panel2" onClick={onNew}>
          <SquarePen size={16} /> New
        </button>
        <button
          className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[#c9d1d9] hover:bg-panel2"
          onClick={() => setChatSearchOpen((o) => !o)}
        >
          <Search size={18} /> Search
        </button>
        {chatSearchOpen && (
          <input
            className="mt-1 w-full rounded-lg border border-line bg-panel2 px-2.5 py-2 outline-none focus:border-accent"
            placeholder="Search chats…"
            value={chatQuery}
            onChange={(e) => setChatQuery(e.target.value)}
            autoFocus
          />
        )}
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3 pt-1.5 scrollbar-hide">
        {/* Recent */}
        <button className={groupHead} onClick={() => setRecentOpen((o) => !o)} aria-expanded={recentOpen}>
          Recent {recentOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {recentOpen &&
          (user ? (
            shownChats.length ? (
              <ul className="flex flex-col gap-0.5">
                {shownChats.map((c) => (
                  <li key={c.id} className="group relative">
                    <button
                      className={`chat-item flex w-full items-center justify-between gap-2 truncate rounded-lg px-2.5 py-2 text-left text-[#c9d1d9] hover:bg-panel2 ${
                        c.id === currentChatId ? 'bg-panel2' : ''
                      }`}
                      onClick={() => onOpenChat(c)}
                    >
                      <span className="truncate">{c.title}</span>
                      <small className="shrink-0 text-[11px] text-muted group-hover:invisible max-sm:invisible">
                        {c.mode === 'repome' ? 'Repo' : 'Profile'}
                      </small>
                    </button>
                    <button
                      className={`${iconBtn} absolute right-1 top-1/2 size-7 -translate-y-1/2 opacity-0 focus-visible:opacity-100 group-hover:opacity-100 max-sm:opacity-100`}
                      onClick={() => onDeleteChat(c)}
                      aria-label={`Delete ${c.title}`}
                      title="Delete chat"
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={hint}>
                {chatsLoading ? 'Loading chats…' : query ? 'No chats found.' : 'Your saved chats will appear here.'}
              </p>
            )
          ) : authLoading ? null : (
            <p className={hint}>
              Login to save your chats.{' '}
              <button className={linkBtn} onClick={onLogin}>
                Login
              </button>
            </p>
          ))}

        {/* Sections */}
        <button className={groupHead} onClick={() => setSectionOpen((o) => !o)} aria-expanded={sectionOpen}>
          Section {sectionOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        {sectionOpen && (
          <>
            <p className={hint}>Click on a section below to edit the contents</p>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(e) => e.over && e.active.id !== e.over.id && onReorder(e.active.id, e.over.id)}
            >
              <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                <ul className="flex flex-col gap-2">
                  {sections.map((s) => (
                    <SectionRow
                      key={s.id}
                      section={s}
                      active={s.id === activeId}
                      onSelect={() => onSelect(s.id)}
                      onRemove={() => onRemove(s.id)}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>

            <p className={`${hint} mt-3`}>Click on a section below to add it to your readme</p>
            <div className="mb-2 flex items-center gap-2 rounded-lg border border-line bg-panel2 pl-2.5 text-muted">
              <Search size={16} />
              <input
                className="w-full bg-transparent px-0 py-2 text-[#e6edf3] outline-none"
                placeholder="Search Section..."
                value={libQuery}
                onChange={(e) => setLibQuery(e.target.value)}
              />
            </div>
            <button className={`${libItem} mb-2 text-muted`} onClick={onOpenCustom}>
              <Plus size={16} /> Custom Section
            </button>
            <ul className="flex flex-col gap-2">
              {shownLib.map((l) => (
                <li key={l.key}>
                  <button className={libItem} onClick={() => onAdd(l)}>
                    {l.title}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="flex items-center gap-2.5 border-t border-line px-3.5 py-3">
        {user ? (
          <>
            <Avatar user={user} />
            <span className="min-w-0 flex-1 truncate text-xs tracking-wide" title={user.email}>
              {user.email}
            </span>
            <button className={iconBtn} onClick={onLogout} aria-label="Logout" title="Logout">
              <LogOut size={16} />
            </button>
          </>
        ) : authLoading ? null : (
          <button className={`${btnPrimary} w-full`} onClick={onLogin}>
            Login
          </button>
        )}
      </div>
    </aside>
  )
}
