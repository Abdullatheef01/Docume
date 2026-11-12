import { Router } from 'express'
import mongoose from 'mongoose'
import rateLimit from 'express-rate-limit'
import Chat, { LIMITS } from '../models/Chat.js'
import { requireAuth } from '../middleware/auth.js'
import { chatTitle } from '../utils/chatTitle.js'

const router = Router()

router.use(requireAuth) // every chat route needs a logged-in user
router.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 600, standardHeaders: true, legacyHeaders: false }))

const badRequest = (message) => Object.assign(new Error(message), { status: 400 })
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const isStr = (v, max) => typeof v === 'string' && v.length <= max

// Checks the body from the frontend and returns only the fields we store.
function parseSections(body) {
  const { sections, activeId } = body ?? {}
  if (!Array.isArray(sections)) throw badRequest('sections must be an array')
  if (sections.length > LIMITS.maxSections) throw badRequest(`Max ${LIMITS.maxSections} sections`)

  const clean = sections.map((s) => {
    if (!s || !isStr(s.id, 40) || !s.id || !isStr(s.key, 80) || !s.key || !isStr(s.title, 80) || !s.title) {
      throw badRequest('Each section needs id, key and title')
    }
    if (!isStr(s.content ?? '', LIMITS.maxContent)) throw badRequest(`Section content is too long (max ${LIMITS.maxContent} characters)`)
    return { id: s.id, key: s.key, title: s.title, content: s.content ?? '' }
  })

  const active = isStr(activeId, 40) && clean.some((s) => s.id === activeId) ? activeId : clean[0]?.id ?? null
  return { sections: clean, activeId: active, title: chatTitle(clean) }
}

// :id must be a real id, otherwise 404 (same answer as "not yours")
function checkId(req, _res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) return next(Object.assign(new Error('Chat not found'), { status: 404 }))
  next()
}

// GET /api/chats?q=text&mode=repome&limit=30  -> Recent list (without sections)
router.get('/', async (req, res, next) => {
  try {
    const filter = { user: req.user._id }
    const q = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 60) : ''
    if (q) filter.title = new RegExp(escapeRegex(q), 'i')
    if (req.query.mode === 'repome' || req.query.mode === 'imme') filter.mode = req.query.mode
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 30, 1), 100)

    const chats = await Chat.find(filter).sort({ updatedAt: -1 }).limit(limit).select('title mode updatedAt').lean()
    res.json({
      chats: chats.map((c) => ({ id: c._id.toString(), title: c.title, mode: c.mode, updatedAt: c.updatedAt })),
    })
  } catch (err) {
    next(err)
  }
})

// POST /api/chats  { mode, sections, activeId }  -> create
router.post('/', async (req, res, next) => {
  try {
    const mode = req.body?.mode
    if (mode !== 'repome' && mode !== 'imme') throw badRequest('mode must be "repome" or "imme"')
    const chat = await Chat.create({ user: req.user._id, mode, ...parseSections(req.body) })

    // keep only the newest chats per user
    const old = await Chat.find({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .skip(LIMITS.maxChatsPerUser)
      .select('_id')
      .lean()
    if (old.length) await Chat.deleteMany({ _id: { $in: old.map((c) => c._id) }, user: req.user._id })

    res.status(201).json({ chat: chat.toPublic() })
  } catch (err) {
    next(err)
  }
})

// GET /api/chats/:id  -> open one chat
router.get('/:id', checkId, async (req, res, next) => {
  try {
    const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id })
    if (!chat) return res.status(404).json({ error: 'Chat not found' })
    res.json({ chat: chat.toPublic() })
  } catch (err) {
    next(err)
  }
})

// PUT /api/chats/:id  { sections, activeId }  -> save (autosave)
router.put('/:id', checkId, async (req, res, next) => {
  try {
    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: parseSections(req.body) },
      { new: true, runValidators: true }
    )
    if (!chat) return res.status(404).json({ error: 'Chat not found' })
    res.json({ chat: chat.toPublic() })
  } catch (err) {
    next(err)
  }
})

// DELETE /api/chats/:id
router.delete('/:id', checkId, async (req, res, next) => {
  try {
    const result = await Chat.deleteOne({ _id: req.params.id, user: req.user._id })
    if (!result.deletedCount) return res.status(404).json({ error: 'Chat not found' })
    res.json({ ok: true })
  } catch (err) {
    next(err)
  }
})

export default router
