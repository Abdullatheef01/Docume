import { timeLeft } from './utils/usage.js'

// All calls to the Docume server. The Vite proxy forwards "/api" to http://localhost:5000,
// so the login cookie is same-origin and no CORS setup is needed.

async function request(path, { method = 'GET', body } = {}) {
  let res
  try {
    res = await fetch(`/api${path}`, {
      method,
      credentials: 'include',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw Object.assign(new Error('Cannot reach the server'), { code: 'network', status: 0 })
  }
  let data = null
  try {
    data = await res.json()
  } catch {
    /* empty or non-JSON body */
  }
  if (!res.ok) {
    throw Object.assign(new Error(data?.error || `Request failed (${res.status})`), {
      code: data?.code || (res.status === 401 ? 'auth' : 'error'),
      status: res.status,
      usage: data?.usage, // sent with limit errors: { generate|wand: { limit, used, remaining, resetAt } }
      type: data?.type,
    })
  }
  return data
}

export const api = {
  me: () => request('/auth/me').then((d) => d.user ?? null),
  logout: () => request('/auth/logout', { method: 'POST' }),
  listChats: () => request('/chats?limit=50').then((d) => d.chats),
  getChat: (id) => request(`/chats/${id}`).then((d) => d.chat),
  createChat: (chat) => request('/chats', { method: 'POST', body: chat }).then((d) => d.chat),
  saveChat: (id, chat) => request(`/chats/${id}`, { method: 'PUT', body: chat }).then((d) => d.chat),
  deleteChat: (id) => request(`/chats/${id}`, { method: 'DELETE' }),
  usage: () => request('/ai/usage').then((d) => d.usage),
  generate: (mode, text) => request('/ai/generate', { method: 'POST', body: { mode, text } }), // -> { sections, source, usage }
  enhance: (text, title) => request('/ai/enhance', { method: 'POST', body: { text, title } }), // -> { text, usage }
}

// Short, friendly message for any error (shown in the toast)
export function friendly(err) {
  switch (err?.code) {
    case 'limit_user': {
      const left = timeLeft(err.usage?.[err.type]?.resetAt)
      return left ? `AI limit reached. Renews in ${left}.` : 'AI limit reached. Please try again later.'
    }
    case 'limit_site':
      return 'AI has reached its daily limit. Please try again tomorrow.'
    case 'network':
      return 'Cannot reach the server. Is it running?'
    case 'auth':
      return 'Please login first.'
    case 'ai_busy':
    case 'ai_unavailable':
      return 'AI is busy right now. Please try again in a moment.'
    case 'ai_quota':
    case 'rate_limited':
      return 'Limit reached. Please wait a few minutes and try again.'
    case 'ai_not_configured':
    case 'ai_config':
      return 'AI is not set up on the server yet.'
    case 'ai_bad_output':
    case 'ai_empty':
      return 'AI could not write that. Try again with a few more details.'
    case 'ai_blocked':
      return 'AI could not answer that request.'
    case 'github_not_found':
      return 'That GitHub repo or user was not found (is it public?).'
    case 'github_rate_limited':
      return 'GitHub limit reached. Try again later or add details by hand.'
    case 'need_repo_link':
      return 'Add a github.com/owner/repo link or describe your project.'
    case 'too_short':
      return 'Please write a bit more.'
    default:
      return err?.message || 'Something went wrong. Please try again.'
  }
}
