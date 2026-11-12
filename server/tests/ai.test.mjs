import { beforeEach, test } from 'node:test'
import assert from 'node:assert/strict'
process.env.LIMIT_GENERATE = '3'
process.env.LIMIT_WAND = '2'
process.env.SITE_DAILY_GENERATE = '5'
process.env.SITE_DAILY_WAND = '100'
process.env.LIMIT_WINDOW_HOURS = '5'
process.env.AI_RETRY_DELAY_MS = '1'
import { fakeGemini, fakeModel, geminiReply, makeUserSession, startApp } from './helpers.js'

const { default: Usage } = await import('../src/models/Usage.js')
const { default: SiteUsage } = await import('../src/models/SiteUsage.js')
const usageRows = fakeModel(Usage, ['user', 'type'])
const siteRows = fakeModel(SiteUsage, ['type', 'day'])
const { default: aiRoutes } = await import('../src/routes/ai.js')
const { getUsage, reserve } = await import('../src/services/usage.js')
const { scrub, cleanSections } = await import('../src/services/readmeAi.js')

const goodJson = JSON.stringify({ sections: [{ key: 'title-description', content: '# Hi\n\nA todo app' }, { key: 'features', content: '- tasks' }] })
let mode = 'ok'
let busyLeft = 0 // for 'busy-once': how many 503 answers are still to give
const calls = fakeGemini(() => {
  if (mode === 'ok') return geminiReply(goodJson)
  if (mode === 'enhance') return geminiReply('# Better\n\nImproved text')
  if (mode === 'bad-key') return new Response('no', { status: 403 })
  if (mode === 'busy') return new Response('busy', { status: 503 })
  if (mode === 'busy-once') return busyLeft-- > 0 ? new Response('busy', { status: 503 }) : geminiReply(goodJson)
  if (mode === 'junk') return geminiReply('this is not json at all')
})

// every test starts with an empty whole-site counter
beforeEach(() => {
  siteRows.length = 0
})

const app = await startApp((a) => a.use('/api/ai', aiRoutes))
test.after(() => app.close())
const gen = (u, text = 'a todo app built with react and node') => app.call('/api/ai/generate', { method: 'POST', cookie: u.cookie, body: { mode: 'repome', text } })

test('generate: returns cleaned sections and usage', async () => {
  mode = 'ok'
  const u = await makeUserSession()
  const r = await gen(u)
  assert.equal(r.status, 200)
  assert.deepEqual(r.json.sections.map((s) => s.key), ['title-description', 'features'])
  assert.equal(r.json.sections[0].title, 'Title and Description')
  assert.equal(r.json.usage.generate.used, 1)
  assert.equal(r.json.usage.generate.remaining, 2)
  assert.ok(r.json.usage.generate.resetAt)
})

test('per-user limit: 3 ok, 4th is 429 limit_user with reset time; other users unaffected', async () => {
  mode = 'ok'
  const a = await makeUserSession()
  const b = await makeUserSession()
  for (let i = 0; i < 3; i++) assert.equal((await gen(a)).status, 200)
  const blocked = await gen(a)
  assert.equal(blocked.status, 429)
  assert.equal(blocked.json.code, 'limit_user')
  assert.ok(blocked.json.usage.generate.resetAt)
  assert.equal((await gen(b)).status, 200)
  const usage = (await app.call('/api/ai/usage', { cookie: a.cookie })).json.usage
  assert.equal(usage.generate.remaining, 0)
  assert.equal(usage.wand.used, 0)
})

test('a failed AI call does not cost the user a use', async () => {
  const u = await makeUserSession()
  for (const m of ['bad-key', 'busy', 'junk']) {
    mode = m
    assert.ok((await gen(u)).status >= 400, m)
  }
  assert.equal((await getUsage(u.user._id)).generate.used, 0)
})

test('busy once: server retries by itself and succeeds', async () => {
  mode = 'busy-once'
  busyLeft = 1
  const before = calls.length
  const r = await gen(await makeUserSession())
  assert.equal(r.status, 200)
  assert.equal(calls.length - before, 2)
})

test('whole-site daily cap: nobody can pass it and the user is not charged', async () => {
  mode = 'ok'
  siteRows.length = 0
  const users = await Promise.all(Array.from({ length: 3 }, makeUserSession))
  let ok = 0
  let site = 0
  for (const u of users) {
    for (let i = 0; i < 3; i++) {
      const r = await gen(u)
      if (r.status === 200) ok++
      else if (r.json.code === 'limit_site') site++
    }
  }
  assert.equal(ok, 5) // SITE_DAILY_GENERATE
  assert.equal(site, 4)
  const last = users[2]
  const u = (await getUsage(last.user._id)).generate
  assert.ok(u.used <= 3)
})

test('parallel requests never go over the user limit', async () => {
  const u = await makeUserSession()
  siteRows.length = 0
  const results = await Promise.all(Array.from({ length: 10 }, () => reserve(u.user._id, 'generate')))
  assert.equal(results.filter((r) => r.ok).length, 3)
})

test('window over -> counter starts again', async () => {
  mode = 'ok'
  siteRows.length = 0
  const u = await makeUserSession()
  for (let i = 0; i < 3; i++) await gen(u)
  usageRows.find((r) => String(r.user) === u.user.id && r.type === 'generate').windowStart = new Date(Date.now() - 6 * 3600e3)
  assert.equal((await getUsage(u.user._id)).generate.used, 0)
  assert.equal((await gen(u)).status, 200)
})

test('wand: separate counter, limit 2, uses wand key when set', async () => {
  mode = 'enhance'
  siteRows.length = 0
  const u = await makeUserSession()
  const wand = () => app.call('/api/ai/enhance', { method: 'POST', cookie: u.cookie, body: { text: '# hi', title: 'T' } })
  const r = await wand()
  assert.equal(r.status, 200)
  assert.match(r.json.text, /Better/)
  assert.equal(r.json.usage.wand.used, 1)
  await wand()
  assert.equal((await wand()).json.code, 'limit_user')
  assert.equal((await getUsage(u.user._id)).generate.used, 0)
})

test('input checks: 400 for bad mode, empty text, too long text', async () => {
  const u = await makeUserSession()
  const post = (path, body) => app.call(path, { method: 'POST', cookie: u.cookie, body })
  assert.equal((await post('/api/ai/generate', { mode: 'x', text: 'hello there friend' })).status, 400)
  assert.equal((await post('/api/ai/generate', { mode: 'repome', text: '   ' })).status, 400)
  assert.equal((await post('/api/ai/generate', { mode: 'repome', text: 'x'.repeat(2001) })).status, 400)
  assert.equal((await post('/api/ai/enhance', { text: '' })).status, 400)
  assert.equal((await post('/api/ai/generate', { mode: 'repome', text: 'hi' })).json.code, 'too_short')
})

test('scrub removes script, iframe, on* handlers and javascript: links', () => {
  const dirty = '<script>alert(1)</script>ok <iframe src="x"></iframe><img src=x onerror="alert(1)"> <a href="javascript:alert(1)">x</a><style>a{}</style>'
  const clean = scrub(dirty)
  assert.doesNotMatch(clean, /<script|<iframe|onerror|javascript:|<style/i)
  assert.match(clean, /ok/)
})

test('cleanSections keeps only known keys, drops duplicates, puts the title first', () => {
  const out = cleanSections('repome', {
    sections: [
      { key: 'features', content: '- a' },
      { key: 'made-up-key', content: 'x' },
      { key: 'title-description', content: '# T' },
      { key: 'features', content: '- dup' },
      { key: 'usage', content: '' },
    ],
  })
  assert.deepEqual(out.map((s) => s.key), ['title-description', 'features'])
  assert.throws(() => cleanSections('repome', { sections: [] }))
})
