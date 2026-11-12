import { test } from 'node:test'
import assert from 'node:assert/strict'
import './helpers.js'

const { default: app } = await import('../src/app.js')
const server = await new Promise((r) => {
  const s = app.listen(0, () => r(s))
})
const base = `http://localhost:${server.address().port}`
test.after(() => server.close())

test('CORS: our frontend addresses are allowed, others are not', async () => {
  for (const origin of ['http://localhost:5173', 'https://docume.example.com']) {
    const res = await fetch(`${base}/api/auth/me`, { headers: { Origin: origin } })
    assert.equal(res.headers.get('access-control-allow-origin'), origin)
    assert.equal(res.headers.get('access-control-allow-credentials'), 'true')
  }
  const evil = await fetch(`${base}/api/auth/me`, { headers: { Origin: 'https://evil.example.com' } })
  assert.equal(evil.headers.get('access-control-allow-origin'), null)
})

test('unknown route gives a JSON 404, security headers are on, x-powered-by is off', async () => {
  const res = await fetch(`${base}/api/nothing-here`)
  assert.equal(res.status, 404)
  assert.ok((await res.json()).error)
  assert.ok(res.headers.get('x-content-type-options'))
  assert.equal(res.headers.get('x-powered-by'), null)
})

test('health answers 503 when the database is not connected', async () => {
  const res = await fetch(`${base}/api/health`)
  assert.equal(res.status, 503)
  assert.equal((await res.json()).ok, false)
})

test('a body over 1 MB is refused', async () => {
  const res = await fetch(`${base}/api/chats`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ x: 'a'.repeat(1100000) }) })
  assert.equal(res.status, 413)
})
