// Shared test helpers. No real MongoDB, Google, GitHub or Gemini is used: the database calls are replaced by
// a tiny in-memory stand-in, and fetch() to Gemini is faked. Run everything with:  npm test
process.env.MONGODB_URI = 'mongodb://fake/test'
process.env.JWT_SECRET = 'test-secret-'.padEnd(40, 'x')
process.env.GEMINI_API_KEY = 'fake-key'
process.env.CLIENT_URL = 'http://localhost:5173,https://docume.example.com'
process.env.NODE_ENV = 'test'
// The real server/.env is also read by the server code (dotenv). Blank these so the tests never depend on YOUR keys
// (dotenv does not override a variable that is already set, even to an empty value).
for (const key of ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET', 'GITHUB_TOKEN', 'GEMINI_WAND_API_KEY', 'GEMINI_FALLBACK_MODEL', 'GEMINI_MODEL', 'TRUST_PROXY', 'COOKIE_SAMESITE', 'AI_TIMEOUT_MS']) {
  process.env[key] = ''
}
process.env.SERVER_URL = 'http://localhost:5000'
for (const key of ['LIMIT_WINDOW_HOURS', 'LIMIT_GENERATE', 'LIMIT_WAND', 'SITE_DAILY_GENERATE', 'SITE_DAILY_WAND']) delete process.env[key]

import mongoose from 'mongoose'

const same = (a, b) => String(a) === String(b)

// does a row match a filter like { user, count: { $lt: 3 } } ?
export const matches = (row, filter) =>
  Object.entries(filter).every(([key, want]) => {
    if (key === '$or') return want.some((f) => matches(row, f))
    const have = row[key]
    if (want instanceof RegExp) return want.test(have)
    if (want && typeof want === 'object' && !(want instanceof Date) && !(want instanceof mongoose.Types.ObjectId)) {
      if ('$lte' in want) return have <= want.$lte
      if ('$lt' in want) return have < want.$lt
      if ('$gt' in want) return have > want.$gt
      if ('$in' in want) return want.$in.some((v) => same(v, have))
    }
    return same(have, want)
  })

const dup = () => Object.assign(new Error('E11000 duplicate key'), { code: 11000 })
const apply = (row, update) => {
  if (update.$set) Object.assign(row, update.$set)
  if (update.$inc) for (const [k, n] of Object.entries(update.$inc)) row[k] = (row[k] ?? 0) + n
}

// Replaces the used Model functions with in-memory ones. keyFields = the unique index (for duplicate errors).
export function fakeModel(Model, keyFields = []) {
  const rows = []
  Model.updateOne = async (f, u) => {
    const r = rows.find((x) => matches(x, f))
    if (r) apply(r, u)
    return { matchedCount: r ? 1 : 0 }
  }
  Model.findOne = async (f) => rows.find((x) => matches(x, f)) ?? null
  Model.findOneAndUpdate = async (f, u, o) => {
    const r = rows.find((x) => matches(x, f))
    if (r) {
      apply(r, u)
      return r
    }
    if (o?.upsert) {
      const key = Object.fromEntries(keyFields.map((k) => [k, f[k]]))
      if (rows.find((x) => matches(x, key))) throw dup()
      const row = { ...key, count: 0 }
      apply(row, u)
      rows.push(row)
      return row
    }
    return null
  }
  Model.create = async (d) => {
    const key = Object.fromEntries(keyFields.map((k) => [k, d[k]]))
    if (keyFields.length && rows.find((x) => matches(x, key))) throw dup()
    rows.push({ ...d })
    return rows[rows.length - 1]
  }
  return rows
}

export const newId = () => new mongoose.Types.ObjectId()

// logged-in fake user: returns { user, cookie } (cookie goes into the request headers)
export async function makeUserSession() {
  const User = (await import('../src/models/User.js')).default
  const { signToken } = await import('../src/utils/token.js')
  const _id = newId()
  const user = { _id, id: String(_id), email: `${_id}@test.dev`, toPublic: () => ({ id: String(_id), email: `${_id}@test.dev`, name: '', avatar: '' }) }
  User.__users = User.__users ?? {}
  User.__users[String(_id)] = user
  User.findById = async (id) => User.__users[String(id)] ?? null
  return { user, cookie: `docume_token=${signToken(_id)}` }
}

// small test server around an express router
export async function startApp(mount) {
  const express = (await import('express')).default
  const cookieParser = (await import('cookie-parser')).default
  const { errorHandler, notFound } = await import('../src/middleware/errorHandler.js')
  const app = express()
  app.use(express.json())
  app.use(cookieParser())
  mount(app)
  app.use(notFound)
  app.use(errorHandler)
  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s))
  })
  const base = `http://localhost:${server.address().port}`
  const call = async (path, { method = 'GET', body, cookie, headers = {} } = {}) => {
    const res = await fetch(base + path, {
      method,
      headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(cookie ? { Cookie: cookie } : {}), ...headers },
      body: body ? JSON.stringify(body) : undefined,
    })
    let json = null
    try {
      json = await res.json()
    } catch {
      /* no body */
    }
    return { status: res.status, json, headers: res.headers }
  }
  return { call, base, close: () => new Promise((r) => server.close(r)) }
}

// fake Gemini: every call to generativelanguage.googleapis.com is answered here
export function fakeGemini(handler) {
  const realFetch = globalThis.fetch
  const calls = []
  globalThis.fetch = async (url, opts) => {
    if (!String(url).includes('generativelanguage.googleapis.com')) return realFetch(url, opts)
    calls.push({ url: String(url), key: opts?.headers?.['x-goog-api-key'] })
    return handler(calls.length)
  }
  return calls
}

export const geminiReply = (text) =>
  new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text }] }, finishReason: 'STOP' }] }), { status: 200 })
