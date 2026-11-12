import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import Sidebar from './components/Sidebar.jsx'
import PromptBox from './components/PromptBox.jsx'
import Workspace from './components/Workspace.jsx'
import TemplateCards from './components/TemplateCards.jsx'
import { CustomSectionModal, LoginModal } from './components/Modals.jsx'
import Toast from './components/Toast.jsx'
import { api, friendly } from './api.js'
import { quotaState } from './utils/usage.js'
import { LIBRARY, customSection, findLib, makeSection } from './data/library.js'
import { TEMPLATES } from './data/templates.js'
import { getGreeting } from './utils/greeting.js'
import { composeMarkdown, uid } from './utils/markdown.js'
import { store } from './utils/storage.js'
import { pillBtn, pillWrap } from './ui.js'
import TemplateSheet from './components/TemplateSheet.jsx'

const USER_KEY = 'docume:user'

const makeWs = (mode, sections) => ({
  id: uid(),
  mode,
  sections,
  activeId: sections[0]?.id ?? null,
  serverId: null, // id of the saved chat on the server (null until first save)
  dirty: false,
})
const defaultRepome = () => makeWs('repome', [makeSection(findLib('repome', 'title-description'))])

export default function App() {
  const [user, setUser] = useState(() => store.get(USER_KEY, null))
  const [mode, setMode] = useState('repome') // 'repome' | 'imme'
  const [spaces, setSpaces] = useState(() => ({ repome: defaultRepome(), imme: null }))
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 640) // Repome: open, Imme: closed by default
  const [chats, setChats] = useState([])
  const [chatsLoading, setChatsLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(true) // true until the server says who is logged in
  const [retry, setRetry] = useState(0) // bumped to try saving again after a network problem
  const netWarned = useRef(false)
  const [busy, setBusy] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [customOpen, setCustomOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [usage, setUsage] = useState(null) // { generate, wand } from the server
  const [siteFull, setSiteFull] = useState({}) // { generate|wand: time until which the site-wide limit blocks }
  const [now, setNow] = useState(() => Date.now())
  const saving = useRef(new Set())
  const closeToast = useCallback(() => setToast(null), [])
  const showError = useCallback((err) => {
    if (err?.status === 401) {
      setUser(null)
      store.remove(USER_KEY)
      setLoginOpen(true)
    }
    if (err?.usage) setUsage((u) => ({ ...u, ...err.usage }))
    if (err?.code === 'limit_site' && err.type) setSiteFull((f) => ({ ...f, [err.type]: Date.now() + 10 * 60 * 1000 }))
    setToast({ type: 'error', text: friendly(err) })
  }, [])

  const mergeUsage = useCallback((u) => u && setUsage((old) => ({ ...old, ...u })), [])

  // tick every 30s so "Renews in ..." counts down and the box wakes up by itself
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(id)
  }, [])
  const current = spaces[mode]

useEffect(() => {
  const vv = window.visualViewport 
  if (!vv) return
  const update = () => {
    if (vv.scale > 1) return
    document.documentElement.style.setProperty('--app-h', `${vv.height}px`)
    window.scrollTo(0, 0)
  }
  update()
  vv.addEventListener('resize', update)
  return () => vv.removeEventListener('resize', update)
}, [])
  /* ---------- login state (from the server cookie) ---------- */
  useEffect(() => {
    api
      .me()
      .then((u) => {
        setUser(u)
        if (u) store.set(USER_KEY, u)
        else store.remove(USER_KEY)
      })
      .catch(() => {})
      .finally(() => setAuthLoading(false))

    // the server sends the browser back with ?login=success or ?login=error&reason=...
    const params = new URLSearchParams(window.location.search)
    const result = params.get('login')
    if (result) {
      const reasons = {
        denied: 'Login was cancelled.',
        invalid_state: 'Login expired. Please try again.',
        no_verified_email: 'Your account has no verified email.',
        not_configured: 'That login is not set up on the server.',
      }
      setToast(
        result === 'success'
          ? { type: 'ok', text: 'Logged in successfully.' }
          : { type: 'error', text: reasons[params.get('reason')] || 'Login failed. Please try again.' }
      )
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  /* ---------- chats (saved on the server, only for logged-in users) ---------- */
  const loadChats = useCallback(async () => {
    try {
      setChats(await api.listChats())
    } catch {
      /* list is optional – ignore */
    } finally {
      setChatsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user) {
      setChatsLoading(true)
      loadChats()
      api.usage().then(setUsage).catch(() => {})
    } else {
      setChats([])
      setUsage(null)
    }
  }, [user, loadChats])

  // autosave: 0.8s after the last change
  useEffect(() => {
    if (!user) return
    const dirty = Object.values(spaces).filter((w) => w && w.dirty)
    if (!dirty.length) return
    const timer = setTimeout(() => dirty.forEach(saveWs), 800)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spaces, user, retry])

  // work that is not saved yet (guest edits, or a save that is still waiting): warn before closing the tab
  useEffect(() => {
    if (!Object.values(spaces).some((w) => w?.dirty)) return
    const warn = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [spaces])

  // internet goes away / comes back
  useEffect(() => {
    const off = () => setToast({ type: 'error', text: 'You are offline. Changes will save when you are back online.' })
    const on = () => {
      netWarned.current = false
      setToast({ type: 'ok', text: 'Back online.' })
      setRetry((n) => n + 1)
    }
    window.addEventListener('offline', off)
    window.addEventListener('online', on)
    return () => {
      window.removeEventListener('offline', off)
      window.removeEventListener('online', on)
    }
  }, [])

  const saveWs = async (w) => {
    if (saving.current.has(w.id)) return // finished save re-triggers this effect if there are newer edits
    saving.current.add(w.id)
    const body = {
      mode: w.mode,
      activeId: w.activeId,
      sections: w.sections.map((s) => ({ ...s, title: s.title.slice(0, 80) })),
    }
    try {
      const saved = w.serverId ? await api.saveChat(w.serverId, body) : await api.createChat(body)
      setSpaces((s) => {
        const slot = s[w.mode]
        if (!slot || slot.id !== w.id) return s
        // keep dirty=true if the user typed more while this was saving
        return { ...s, [w.mode]: { ...slot, serverId: saved.id, dirty: slot.sections !== w.sections || slot.activeId !== w.activeId } }
      })
      netWarned.current = false
      loadChats()
    } catch (err) {
      if (err?.code === 'network') {
        // no connection: keep the work marked as unsaved and try again in 10 seconds (or when the internet is back)
        if (!netWarned.current) showError(err)
        netWarned.current = true
        setTimeout(() => setRetry((n) => n + 1), 10000)
      } else {
        setSpaces((s) => (s[w.mode]?.id === w.id ? { ...s, [w.mode]: { ...s[w.mode], dirty: false } } : s))
        showError(err)
      }
    } finally {
      saving.current.delete(w.id)
    }
  }

  /* ---------- workspace helpers ---------- */
  const patch = (fn) =>
    setSpaces((s) => (s[mode] ? { ...s, [mode]: { ...fn(s[mode]), dirty: true } } : s))

  const selectSection = (id) =>
    setSpaces((s) => (s[mode] ? { ...s, [mode]: { ...s[mode], activeId: id } } : s))

  const addSection = (lib) =>
    patch((w) => {
      const sec = makeSection(lib)
      return { ...w, sections: [...w.sections, sec], activeId: sec.id }
    })

  const addCustom = (name) => {
    patch((w) => {
      const sec = customSection(name)
      return { ...w, sections: [...w.sections, sec], activeId: sec.id }
    })
    setCustomOpen(false)
  }

  const removeSection = (id) =>
    patch((w) => {
      const sections = w.sections.filter((s) => s.id !== id)
      return { ...w, sections, activeId: w.activeId === id ? sections[0]?.id ?? null : w.activeId }
    })

  const reorder = (activeId, overId) =>
    patch((w) => {
      const from = w.sections.findIndex((s) => s.id === activeId)
      const to = w.sections.findIndex((s) => s.id === overId)
      return from < 0 || to < 0 ? w : { ...w, sections: arrayMove(w.sections, from, to) }
    })

  const changeContent = (id, content) =>
    patch((w) => ({ ...w, sections: w.sections.map((s) => (s.id === id ? { ...s, content } : s)) }))

  /* ---------- sidebar actions ---------- */
  const newChat = () => {
  setSpaces((s) => ({ ...s, [mode]: mode === 'repome' ? defaultRepome() : null }))
  if (window.innerWidth < 640) setSidebarOpen(false)
}

  const openChat = async (chat) => {
    try {
      const full = await api.getChat(chat.id)
      setMode(full.mode)
      setSpaces((s) => ({
        ...s,
        [full.mode]: {
          id: uid(),
          mode: full.mode,
          sections: full.sections,
          activeId: full.activeId ?? full.sections[0]?.id ?? null,
          serverId: full.id,
          dirty: false,
        },
      }))
      if (window.innerWidth < 640) setSidebarOpen(false)
    } catch (err) {
      showError(err)
      loadChats()
    }
  }

  const deleteChat = async (chat) => {
    if (!window.confirm(`Delete "${chat.title}"?`)) return
    try {
      await api.deleteChat(chat.id)
      setChats((list) => list.filter((c) => c.id !== chat.id))
      // if it is open right now, clear the workspace so autosave does not bring it back
      setSpaces((s) => {
        const slot = s[chat.mode]
        if (!slot || slot.serverId !== chat.id) return s
        return { ...s, [chat.mode]: chat.mode === 'repome' ? defaultRepome() : null }
      })
    } catch (err) {
      showError(err)
      loadChats()
    }
  }

  const switchMode = (next) => {
    if (next === mode) return
    setMode(next)
    setSidebarOpen(next === 'repome' && window.innerWidth >= 640)
  }

  /* ---------- Imme templates ---------- */
  const pickTemplate = (t) =>
    setSpaces((s) => ({
      ...s,
      imme: makeWs('imme', t.sections.map((sec) => ({ id: uid(), ...sec }))),
    }))

  const blankProfile = () =>
    setSpaces((s) => ({ ...s, imme: makeWs('imme', [makeSection(findLib('imme', 'title'))]) }))

  /* ---------- AI ---------- */
  const submitPrompt = async (text) => {
    const target = mode
    setBusy(true)
    try {
      const { sections, usage: used } = await api.generate(target, text)
      mergeUsage(used)
      const withIds = sections.map((s) => ({ id: uid(), key: s.key, title: s.title, content: s.content }))
      if (!withIds.length) throw Object.assign(new Error('empty'), { code: 'ai_empty' })
      setSpaces((s) => ({ ...s, [target]: { ...makeWs(target, withIds), dirty: true } }))
    } catch (err) {
      showError(err)
    } finally {
      setBusy(false)
    }
  }

  /* ---------- auth ---------- */
  const logout = async () => {
    try {
      await api.logout()
    } catch {
      /* cookie may already be gone */
    }
    store.remove(USER_KEY)
    setUser(null)
    setChats([])
  }

  /* ---------- derived ---------- */
  const markdown = useMemo(() => (current ? composeMarkdown(current.sections) : ''), [current])
  const activeSection = current?.sections.find((s) => s.id === current.activeId) ?? null
  const library = useMemo(
    () => LIBRARY[mode].filter((l) => !current?.sections.some((s) => s.key === l.key)),
    [mode, current]
  )
  const greeting = useMemo(() => getGreeting(user), [user])
  const immeHome = mode === 'imme' && !current
  const genQuota = quotaState(usage?.generate, (siteFull.generate ?? 0) > now, now)
  const wandQuota = quotaState(usage?.wand, (siteFull.wand ?? 0) > now, now)
  const wandLock = !wandQuota.locked
    ? null
    : wandQuota.site
      ? 'AI has reached its daily limit. Try again tomorrow.'
      : `Wand limit reached${wandQuota.resetText ? `. Renews in ${wandQuota.resetText}` : ''}`
  return (
    <div className="app relative flex h-[var(--app-h,100dvh)] overflow-hidden">
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
        user={user}
        chats={chats}
        chatsLoading={chatsLoading}
        authLoading={authLoading}
        currentChatId={current?.serverId}
        sections={current?.sections ?? []}
        activeId={current?.activeId ?? null}
        library={library}
        onNew={newChat}
        onOpenChat={openChat}
        onDeleteChat={deleteChat}
        onSelect={selectSection}
        onAdd={addSection}
        onRemove={removeSection}
        onReorder={reorder}
        onOpenCustom={() => (current ? setCustomOpen(true) : null)}
        onLogin={() => setLoginOpen(true)}
        onLogout={logout}
      />

      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto px-4 pb-5 lg:px-7 lg:pb-6 code-editor-wrap">
        <div className="flex justify-end pt-[18px]">
          <div className={`mode-toggle ${pillWrap}`} role="tablist" aria-label="Mode">
            <button role="tab" aria-selected={mode === 'imme'} className={pillBtn(mode === 'imme', 'px-2')} onClick={() => switchMode('imme')}>
              Imme
            </button>
            <button role="tab" aria-selected={mode === 'repome'} className={pillBtn(mode === 'repome', 'px-2')} onClick={() => switchMode('repome')}>
              Repome
            </button>
          </div>
        </div>

        <section className={`flex flex-col items-center gap-[22px] pb-5 pt-1.5 ${immeHome ? 'max-sm:flex-1 max-sm:justify-center' : ''}`}>
          <h1 className="greeting m-0 text-center text-[28px] font-medium tracking-tight lg:text-[38px]">{greeting}</h1>
          <PromptBox mode={mode} user={user} busy={busy} quota={genQuota} authLoading={authLoading} onSubmit={submitPrompt} onLogin={() => setLoginOpen(true)} onPlus={() => setSheetOpen(true)}/>
        </section>

        {mode === 'imme' && !current ? (
          <TemplateCards templates={TEMPLATES} onPick={pickTemplate} onBlank={blankProfile} />
        ) : (
          <Workspace
            markdown={markdown}
            section={activeSection}
            user={user}
            onChange={changeContent}
            onLogin={() => setLoginOpen(true)}
            onError={showError}
            wandLock={wandLock}
            onUsage={mergeUsage}
          />
        )}
      </main>

      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
      {customOpen && <CustomSectionModal onClose={() => setCustomOpen(false)} onAdd={addCustom} />}
      {sheetOpen && mode === 'imme' && (
  <TemplateSheet templates={TEMPLATES} onPick={pickTemplate} onBlank={blankProfile} onClose={() => setSheetOpen(false)} />
)}
      <Toast toast={toast} onClose={closeToast} />
    </div>
  )
}
