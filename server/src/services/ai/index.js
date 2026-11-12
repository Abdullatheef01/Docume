import { env } from '../../config/env.js'
import { httpError } from '../../utils/httpError.js'
import { geminiConfigured, geminiGenerate } from './gemini.js'

// All provider specific code lives in this folder. To add another AI (NVIDIA, Claude...),
// write a file like gemini.js with the same function and register it here.
const providers = {
  gemini: { configured: geminiConfigured, generate: geminiGenerate },
}

export const aiConfigured = () => !!providers[env.ai.provider]?.configured()

// generateText({ system, prompt, json, maxOutputTokens, temperature }) -> { text, finishReason }
export function generateText(options) {
  if (!aiConfigured()) throw httpError(503, 'AI is not configured on the server yet.', 'ai_not_configured')
  return providers[env.ai.provider].generate(options)
}
