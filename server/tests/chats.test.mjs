import { test } from 'node:test'
import assert from 'node:assert/strict'
import { fakeModel, makeUserSession, matches, newId, startApp } from './helpers.js'

const { default: Chat } = await import('../src/models/Chat.js')
const { default: chatRoutes } = await import('../src/routes/chats.js')

// in-memory Chat
const rows = []
const pub = (r) => ({ ...r, toPublic: () => ({ id: String(r._id), mode: r.mode, title: r.title, sections: r.sections, activeId: r.activeId, updatedAt: r.updatedAt }) })
const query = (list) => {
  let out = list
  const q = {
    sort: () => ((out = [...out].sort((a, b) => b.updatedAt - a.updatedAt)), q),
    skip: (n) => ((out = out.slice(n)), q),
    limit: (n) => ((out = out.slice(0, n)), q),
    select: () => q,
    lean: () => q,
    then: (res, rej) => Promise.resolve(out).then(res, rej),
  }
  return q
}
let tick = 1
Chat.create = async (d) => { const r = { _id: newId(), ...d, updatedAt: new Date(tick++) }; rows.push(r); return pub(r) }
Chat.find = (f) => query(rows.filter((r) => matches(r, f)))
Chat.findOne = async (f) => { const r = rows.find((x) => matches(x, f)); return r ? pub(r) : null }
Chat.findOneAndUpdate = async (f, u) => { const r = rows.find((x) => matches(x, f)); if (!r) return null; Object.assign(r, u.$set, { updatedAt: new Date(tick++) }); return pub(r) }
Chat.deleteOne = async (f) => { const i = rows.findIndex((x) => matches(x, f)); if (i >= 0) rows.splice(i, 1); return { deletedCount: i >= 0 ? 1 : 0 } }
Chat.deleteMany = async (f) => { for (let i = rows.length - 1; i >= 0; i--) if (matches(rows[i], f)) rows.splice(i, 1); return {} }
void fakeModel

const app = await startApp((a) => a.use('/api/chats', chatRoutes))
test.after(() => app.close())

const sections = [
  { id: 'a1', key: 'title-description', title: 'Title and Description', content: '# My App\n\nhello' },
  { id: 'b2', key: 'features', title: 'Features', content: '- one' },
]

test('create, list, open, save, delete', async () => {
  const { cookie } = await makeUserSession()
  const created = await app.call('/api/chats', { method: 'POST', cookie, body: { mode: 'repome', sections, activeId: 'b2' } })
  assert.equal(created.status, 201)
  const id = created.json.chat.id
  assert.equal(created.json.chat.title, 'My App') // title comes from the first heading
  assert.equal(created.json.chat.activeId, 'b2')

  const list = await app.call('/api/chats', { cookie })
  assert.equal(list.json.chats.length, 1)
  assert.equal(list.json.chats[0].sections, undefined) // list has no sections

  const opened = await app.call(`/api/chats/${id}`, { cookie })
  assert.equal(opened.json.chat.sections.length, 2)

  const saved = await app.call(`/api/chats/${id}`, { method: 'PUT', cookie, body: { sections: [{ ...sections[0], content: '# Renamed' }], activeId: 'zzz' } })
  assert.equal(saved.json.chat.title, 'Renamed')
  assert.equal(saved.json.chat.activeId, 'a1') // unknown activeId falls back to the first section

  assert.equal((await app.call(`/api/chats/${id}`, { method: 'DELETE', cookie })).json.ok, true)
  assert.equal((await app.call(`/api/chats/${id}`, { cookie })).status, 404)
})

test('a user can never see, change or delete someone else\'s chat', async () => {
  const a = await makeUserSession()
  const b = await makeUserSession()
  const { json } = await app.call('/api/chats', { method: 'POST', cookie: a.cookie, body: { mode: 'imme', sections } })
  const id = json.chat.id
  assert.equal((await app.call(`/api/chats/${id}`, { cookie: b.cookie })).status, 404)
  assert.equal((await app.call(`/api/chats/${id}`, { method: 'PUT', cookie: b.cookie, body: { sections } })).status, 404)
  assert.equal((await app.call(`/api/chats/${id}`, { method: 'DELETE', cookie: b.cookie })).status, 404)
  assert.equal((await app.call('/api/chats', { cookie: b.cookie })).json.chats.length, 0)
  assert.equal((await app.call(`/api/chats/${id}`, { cookie: a.cookie })).status, 200) // still there for the owner
})

test('bad input is refused with 400 / 404', async () => {
  const { cookie } = await makeUserSession()
  const post = (body) => app.call('/api/chats', { method: 'POST', cookie, body })
  assert.equal((await post({ mode: 'nope', sections })).status, 400)
  assert.equal((await post({ mode: 'repome', sections: 'x' })).status, 400)
  assert.equal((await post({ mode: 'repome', sections: [{ id: 'x' }] })).status, 400)
  assert.equal((await post({ mode: 'repome', sections: [{ id: 'a', key: 'k', title: 't', content: 'x'.repeat(50001) }] })).status, 400)
  assert.equal((await post({ mode: 'repome', sections: Array.from({ length: 61 }, (_, i) => ({ id: `i${i}`, key: 'k', title: 't', content: '' })) })).status, 400)
  assert.equal((await app.call('/api/chats/not-an-id', { cookie })).status, 404)
})

test('search by title and mode filter; regex characters are safe', async () => {
  const { cookie } = await makeUserSession()
  const make = (mode, title) => app.call('/api/chats', { method: 'POST', cookie, body: { mode, sections: [{ id: 'a', key: 'k', title: 'T', content: `# ${title}` }] } })
  await make('repome', 'Todo App')
  await make('imme', 'My Profile')
  assert.equal((await app.call('/api/chats?q=todo', { cookie })).json.chats.length, 1)
  assert.equal((await app.call('/api/chats?mode=imme', { cookie })).json.chats[0].title, 'My Profile')
  assert.equal((await app.call('/api/chats?q=' + encodeURIComponent('.*('), { cookie })).status, 200)
})

test('only the newest 100 chats are kept per user', async () => {
  const { cookie, user } = await makeUserSession()
  for (let i = 0; i < 102; i++) await app.call('/api/chats', { method: 'POST', cookie, body: { mode: 'repome', sections: [{ id: 'a', key: 'k', title: 'T', content: `# n${i}` }] } })
  assert.equal(rows.filter((r) => String(r.user) === user.id).length, 100)
})
