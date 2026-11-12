import { env } from '../../config/env.js'
import { httpError } from '../../utils/httpError.js'

export const geminiConfigured = () => !!env.ai.geminiKey

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const RETRYABLE = new Set([500, 502, 503, 504]) // Gemini busy / temporary problem

// One call to one model. Returns { data } on success or { status, detail } when Gemini says no.
// A network problem / timeout throws right away (no retry).
async function request(model, { system, prompt, json, maxOutputTokens, temperature, purpose }) {
  const apiKey = purpose === 'wand' && env.ai.geminiWandKey ? env.ai.geminiWandKey : env.ai.geminiKey
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`
  let res
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey }, // key in a header, never in the URL
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature, maxOutputTokens, ...(json ? { responseMimeType: 'application/json' } : {}) },
      }),
      signal: AbortSignal.timeout(env.ai.timeoutMs),
    })
  } catch (err) {
    const timedOut = err?.name === 'TimeoutError' || err?.name === 'AbortError'
    console.error('[ai] Gemini request failed:', err.message)
    throw httpError(504, timedOut ? 'AI took too long. Please try again.' : 'Could not reach the AI service. Please try again.', 'ai_unavailable')
  }

  if (!res.ok) {
    const detail = (await res.text().catch(() => '')).slice(0, 300)
    console.error(`[ai] Gemini responded ${res.status} (${model}): ${detail}`)
    return { status: res.status, detail }
  }
  return { data: await res.json().catch(() => null) }
}

function failure(status) {
  if (status === 429) return httpError(429, 'AI limit reached. Please try again in a minute.', 'ai_quota')
  if ([400, 401, 403, 404].includes(status)) {
    return httpError(503, 'AI is not set up correctly on the server (check GEMINI_API_KEY and GEMINI_MODEL).', 'ai_config')
  }
  return httpError(502, 'The AI service is having trouble. Please try again.', 'ai_unavailable')
}

function readAnswer(data) {
  if (data?.promptFeedback?.blockReason) {
    throw httpError(422, 'The AI could not process this content. Try different text.', 'ai_blocked')
  }
  const candidate = data?.candidates?.[0]
  const text = (candidate?.content?.parts ?? [])
    .filter((p) => !p.thought)
    .map((p) => p.text ?? '')
    .join('')
  if (!text.trim()) throw httpError(502, 'The AI returned an empty answer. Please try again.', 'ai_empty')
  return { text, finishReason: candidate?.finishReason }
}

// Calls Gemini and returns { text, finishReason }.
// When Gemini is busy (500/503...) it tries again: 1st try, 2nd try (same model), 3rd try
// (GEMINI_FALLBACK_MODEL if you set one, else the same model). Every failure becomes a friendly httpError.
export async function geminiGenerate({ system, prompt, json = false, maxOutputTokens = 4096, temperature = 0.5, purpose = 'generate' }) {
  const opts = { system, prompt, json, maxOutputTokens, temperature, purpose }
  const main = env.ai.geminiModel
  const fallback = env.ai.geminiFallbackModel
  const models = [main, main, fallback || main]

  for (let i = 0; i < models.length; i++) {
    if (i > 0) await sleep(env.ai.retryDelayMs * i)
    const result = await request(models[i], opts)

    if (result.data !== undefined) return readAnswer(result.data)

    const usingFallback = i === 2 && models[i] !== main
    if (!RETRYABLE.has(result.status)) {
      if (usingFallback) break // a wrong fallback name should not hide the real "busy" problem
      throw failure(result.status)
    }
  }
  throw httpError(503, 'The AI is very busy right now. Please try again in a few seconds.', 'ai_busy')
}
