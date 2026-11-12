import { generateText } from './ai/index.js'
import { getProfileFacts, getRepoFacts, parseGithubTarget } from './github.js'
import { enhancePrompt, ENHANCE_SYSTEM, generatePrompt, generateSystem } from './prompts.js'
import { sectionKeys, sectionTitle } from '../data/sections.js'
import { httpError } from '../utils/httpError.js'

const MAX_SECTION_CHARS = 12000
const MAX_SECTIONS = 14
const badOutput = () => httpError(502, 'The AI gave an unusable answer. Please try again.', 'ai_bad_output')

// The AI is not trusted either: strip anything that can run code before the text goes to the user.
export function scrub(text) {
  return String(text)
    .replace(/<\s*(script|iframe|object|embed|style)\b[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    .replace(/<\s*\/?\s*(script|iframe|object|embed|style)\b[^>]*>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/javascript\s*:/gi, '')
}

function stripFence(text) {
  const t = text.trim()
  const m = t.match(/^```[a-zA-Z]*\n([\s\S]*?)\n```$/)
  return m ? m[1] : t
}

function parseJson(text) {
  const t = stripFence(text)
  try {
    return JSON.parse(t)
  } catch {
    const a = t.indexOf('{')
    const b = t.lastIndexOf('}')
    if (a >= 0 && b > a) {
      try {
        return JSON.parse(t.slice(a, b + 1))
      } catch {
        /* fall through */
      }
    }
    throw badOutput()
  }
}

// Keeps only allowed keys, drops duplicates, fixes titles, scrubs, puts the title section first.
export function cleanSections(mode, raw) {
  const allowed = new Set(sectionKeys(mode))
  const seen = new Set()
  const out = []
  for (const item of Array.isArray(raw?.sections) ? raw.sections : []) {
    if (!item || typeof item.key !== 'string' || typeof item.content !== 'string') continue
    if (!allowed.has(item.key) || seen.has(item.key)) continue
    const content = scrub(item.content).trim().slice(0, MAX_SECTION_CHARS)
    if (!content) continue
    seen.add(item.key)
    out.push({ key: item.key, title: sectionTitle(mode, item.key), content })
    if (out.length >= MAX_SECTIONS) break
  }
  if (!out.length) throw badOutput()
  const first = mode === 'repome' ? 'title-description' : 'title'
  out.sort((a, b) => (a.key === first ? -1 : b.key === first ? 1 : 0))
  return out
}

// text = what the user typed (details and/or a GitHub link)
export async function generateReadme(mode, text) {
  const { owner, repo, rest } = parseGithubTarget(text)

  let facts = null
  if (mode === 'repome') {
    if (owner && !repo) throw httpError(400, 'Paste a repo link like github.com/owner/repo (a profile link works in Imme mode).', 'need_repo_link')
    if (owner && repo) facts = await getRepoFacts(owner, repo)
  } else if (owner) {
    facts = await getProfileFacts(owner)
  }

  const notes = facts ? rest : text.trim()
  if (!facts && notes.length < 10) throw httpError(400, 'Tell me a little more (or paste a GitHub link).', 'too_short')

  const { text: answer } = await generateText({
    system: generateSystem(mode),
    prompt: generatePrompt({ facts: facts?.text, notes }),
    json: true,
    purpose: 'generate',
    maxOutputTokens: 8192,
    temperature: 0.4,
  })

  return {
    sections: cleanSections(mode, parseJson(answer)),
    source: facts ? { type: facts.type, name: facts.name } : { type: 'text', name: null },
  }
}

// magic wand
export async function enhanceSection({ title, text }) {
  const { text: answer } = await generateText({
    system: ENHANCE_SYSTEM,
    prompt: enhancePrompt({ title, text }),
    purpose: 'wand',
    maxOutputTokens: 4096,
    temperature: 0.3,
  })
  const improved = scrub(stripFence(answer)).trim()
  if (!improved) throw badOutput()
  return improved.slice(0, 50000)
}
