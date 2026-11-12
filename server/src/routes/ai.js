import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { requireAuth } from '../middleware/auth.js'
import { enhanceSection, generateReadme } from '../services/readmeAi.js'
import { aiConfigured } from '../services/ai/index.js'
import { httpError } from '../utils/httpError.js'
import { getUsage, reserve } from '../services/usage.js'

const router = Router()

router.use(requireAuth) // AI is only for logged-in users

// limits are per user (not per IP) because every AI call costs quota
const perUser = (limit, message) =>
  rateLimit({
    windowMs: 10 * 60 * 1000,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => `user:${req.user.id}`,
    validate: { keyGeneratorIpFallback: false },
    handler: (_req, res) => res.status(429).json({ error: message, code: 'rate_limited' }),
  })

const MAX_PROMPT = 2000
const MAX_ENHANCE = 20000

// Reserve one call (per user + whole site), run the AI, give the call back if it fails.
// Sends 429 { code: 'limit_user' | 'limit_site', usage } when there is no quota left.
async function withQuota(req, res, type, work) {
  const quota = await reserve(req.user._id, type)
  if (!quota.ok) {
    return res.status(429).json(
      quota.reason === 'user'
        ? { error: 'You have reached your AI limit for now.', code: 'limit_user', type, usage: { [type]: quota.usage } }
        : { error: 'AI has reached its limit for today. Please try again tomorrow.', code: 'limit_site', type, usage: { [type]: quota.usage } }
    )
  }
  try {
    const result = await work()
    res.json({ ...result, usage: { [type]: quota.usage } })
  } catch (err) {
    await quota.refund().catch((e) => console.error('[usage] refund failed:', e.message))
    throw err
  }
}

// GET /api/ai/usage -> { usage: { generate: { limit, used, remaining, resetAt }, wand: {...} } }
router.get('/usage', async (req, res, next) => {
  try {
    res.json({ usage: await getUsage(req.user._id) })
  } catch (err) {
    next(err)
  }
})

// GET /api/ai/status -> lets the frontend know if AI is available
router.get('/status', (_req, res) => res.json({ available: aiConfigured() }))

// POST /api/ai/generate  { mode: 'repome' | 'imme', text }  -> { sections: [{ key, title, content }], source }
router.post('/generate', perUser(15, 'Too many AI requests. Please wait a few minutes.'), async (req, res, next) => {
  try {
    const { mode, text } = req.body ?? {}
    if (mode !== 'repome' && mode !== 'imme') throw httpError(400, 'mode must be "repome" or "imme"', 'bad_request')
    if (typeof text !== 'string' || !text.trim()) throw httpError(400, 'Write something or paste a GitHub link first.', 'bad_request')
    if (text.length > MAX_PROMPT) throw httpError(400, `Please keep it under ${MAX_PROMPT} characters.`, 'bad_request')

    await withQuota(req, res, 'generate', () => generateReadme(mode, text.trim()))
  } catch (err) {
    next(err)
  }
})

// POST /api/ai/enhance  { text, title? }  -> { text }   (the magic wand)
router.post('/enhance', perUser(40, 'Too many AI requests. Please wait a few minutes.'), async (req, res, next) => {
  try {
    const { text, title } = req.body ?? {}
    if (typeof text !== 'string' || !text.trim()) throw httpError(400, 'Write something in the section first.', 'bad_request')
    if (text.length > MAX_ENHANCE) throw httpError(400, `This section is too long to enhance (max ${MAX_ENHANCE} characters).`, 'bad_request')
    const safeTitle = typeof title === 'string' ? title.slice(0, 80) : ''

    await withQuota(req, res, 'wand', async () => ({ text: await enhanceSection({ title: safeTitle, text }) }))
  } catch (err) {
    next(err)
  }
})

export default router
