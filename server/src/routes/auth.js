import crypto from 'crypto'
import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { env, isProd } from '../config/env.js'
import { providers } from '../services/oauth.js'
import { findOrCreateUser } from '../services/users.js'
import { optionalAuth } from '../middleware/auth.js'
import { COOKIE_NAME, cookieOptions, signToken } from '../utils/token.js'

const router = Router()

router.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: true, legacyHeaders: false }))

const STATE_COOKIE = 'oauth_state'
// the login-state cookie always goes provider -> our callback in the top window, so 'lax' is right
const stateCookieOptions = { httpOnly: true, sameSite: 'lax', secure: isProd, path: '/api/auth' }

// after login the browser is sent back to the frontend with ?login=success or ?login=error&reason=...
function redirectToClient(res, params) {
  const url = new URL(env.clientUrl)
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value))
  res.redirect(url.toString())
}

const safeEqual = (a, b) => {
  const x = Buffer.from(String(a))
  const y = Buffer.from(String(b))
  return x.length === y.length && crypto.timingSafeEqual(x, y)
}

// GET /api/auth/me -> { user } (user is null when not logged in)
router.get('/me', optionalAuth, (req, res) => {
  res.json({ user: req.user ? req.user.toPublic() : null })
})

// POST /api/auth/logout
router.post('/logout', (_req, res) => {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: undefined })
  res.json({ ok: true })
})

// GET /api/auth/google  or  /api/auth/github  -> sends the browser to the provider
router.get('/:provider', (req, res) => {
  const provider = providers[req.params.provider]
  if (!provider) return res.status(404).json({ error: 'Unknown login provider' })
  if (!provider.enabled()) return redirectToClient(res, { login: 'error', reason: 'not_configured' })

  const state = crypto.randomBytes(24).toString('hex') // protects against forged callbacks (CSRF)
  res.cookie(STATE_COOKIE, state, { ...stateCookieOptions, maxAge: 5 * 60 * 1000 })
  res.redirect(provider.authUrl(state))
})

// GET /api/auth/:provider/callback -> provider sends the user back here
router.get('/:provider/callback', async (req, res) => {
  const name = req.params.provider
  const provider = providers[name]
  if (!provider) return res.status(404).json({ error: 'Unknown login provider' })

  const { code, state, error } = req.query
  const savedState = req.cookies?.[STATE_COOKIE]
  res.clearCookie(STATE_COOKIE, stateCookieOptions)

  if (error) return redirectToClient(res, { login: 'error', reason: 'denied' })
  if (!code || !state || !savedState || !safeEqual(state, savedState)) {
    return redirectToClient(res, { login: 'error', reason: 'invalid_state' })
  }

  try {
    const profile = await provider.profile(String(code))
    const user = await findOrCreateUser(name, profile)
    res.cookie(COOKIE_NAME, signToken(user.id), cookieOptions)
    redirectToClient(res, { login: 'success' })
  } catch (err) {
    console.error(`[auth] ${name} login failed:`, err.message)
    redirectToClient(res, { login: 'error', reason: err.code === 'NO_VERIFIED_EMAIL' ? 'no_verified_email' : 'failed' })
  }
})

export default router
