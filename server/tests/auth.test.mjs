import { test } from 'node:test'
import assert from 'node:assert/strict'
import './helpers.js'
import { makeUserSession, startApp } from './helpers.js'

const { default: authRoutes } = await import('../src/routes/auth.js')
const { default: chatRoutes } = await import('../src/routes/chats.js')
const { default: aiRoutes } = await import('../src/routes/ai.js')
const { signToken, verifyToken } = await import('../src/utils/token.js')

const app = await startApp((a) => {
  a.use('/api/auth', authRoutes)
  a.use('/api/chats', chatRoutes)
  a.use('/api/ai', aiRoutes)
})
test.after(() => app.close())

test('token: valid, tampered and garbage tokens', () => {
  const token = signToken('abc123')
  assert.equal(verifyToken(token).sub, 'abc123')
  assert.equal(verifyToken(token.slice(0, -2) + 'xx'), null)
  assert.equal(verifyToken('not-a-token'), null)
})

test('/me: null without cookie, user with cookie, null with a bad cookie', async () => {
  assert.deepEqual((await app.call('/api/auth/me')).json, { user: null })
  const { cookie, user } = await makeUserSession()
  assert.equal((await app.call('/api/auth/me', { cookie })).json.user.id, user.id)
  assert.deepEqual((await app.call('/api/auth/me', { cookie: 'docume_token=garbage' })).json, { user: null })
})

test('logout clears the cookie', async () => {
  const res = await app.call('/api/auth/logout', { method: 'POST' })
  assert.equal(res.json.ok, true)
  assert.match(res.headers.get('set-cookie'), /docume_token=;/)
})

test('login start: unknown provider = 404, missing keys = redirect with reason', async () => {
  assert.equal((await app.call('/api/auth/facebook')).status, 404)
  const res = await fetch(`${app.base}/api/auth/google`, { redirect: 'manual' })
  assert.equal(res.status, 302)
  assert.match(res.headers.get('location'), /login=error&reason=not_configured/)
})

test('chats and AI need login (401)', async () => {
  for (const [method, path] of [['GET', '/api/chats'], ['POST', '/api/chats'], ['GET', '/api/ai/usage'], ['POST', '/api/ai/generate'], ['POST', '/api/ai/enhance']]) {
    const res = await app.call(path, { method, body: method === 'POST' ? {} : undefined })
    assert.equal(res.status, 401, `${method} ${path}`)
  }
})

test('callback with a wrong or missing state is refused', async () => {
  const bad = await fetch(`${app.base}/api/auth/google/callback?code=abc&state=zzz`, { redirect: 'manual', headers: { Cookie: 'oauth_state=other' } })
  assert.match(bad.headers.get('location'), /reason=invalid_state/)
  const none = await fetch(`${app.base}/api/auth/github/callback?code=abc&state=zzz`, { redirect: 'manual' })
  assert.match(none.headers.get('location'), /reason=invalid_state/)
  const denied = await fetch(`${app.base}/api/auth/google/callback?error=access_denied`, { redirect: 'manual' })
  assert.match(denied.headers.get('location'), /reason=denied/)
})
