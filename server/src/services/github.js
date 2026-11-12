import { env } from '../config/env.js'
import { httpError } from '../utils/httpError.js'

const API = 'https://api.github.com'
const NAME = /^[A-Za-z0-9_.-]{1,100}$/

// finds the first github.com/owner[/repo] in the text; `rest` = the text without that link
export function parseGithubTarget(text) {
  const m = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([A-Za-z0-9-]{1,39})(?:\/([A-Za-z0-9_.-]{1,100}))?[^\s]*/i)
  if (!m) return { owner: null, repo: null, rest: text.trim() }
  let repo = m[2] ? m[2].replace(/\.git$/i, '') : null
  if (repo === '.' || repo === '..' || !repo) repo = null
  return { owner: m[1], repo, rest: text.replace(m[0], ' ').replace(/\s+/g, ' ').trim() }
}

async function gh(path, { raw = false, optional = false } = {}) {
  const headers = {
    Accept: raw ? 'application/vnd.github.raw+json' : 'application/vnd.github+json',
    'User-Agent': 'docume',
  }
  if (env.githubToken) headers.Authorization = `Bearer ${env.githubToken}`

  let res
  try {
    res = await fetch(API + path, { headers, signal: AbortSignal.timeout(10000) })
  } catch {
    throw httpError(502, 'Could not reach GitHub. Please try again.', 'github_unavailable')
  }

  if (res.ok) return raw ? res.text() : res.json()
  if (res.status === 404) {
    if (optional) return null
    throw httpError(404, 'GitHub repo / profile not found (a private repo cannot be read).', 'github_not_found')
  }
  if (res.status === 403 || res.status === 429) {
    if (optional) return null
    throw httpError(429, 'GitHub rate limit reached. Please try again later (or add GITHUB_TOKEN on the server).', 'github_rate_limited')
  }
  if (optional) return null
  throw httpError(502, 'GitHub is having trouble. Please try again.', 'github_unavailable')
}

const cut = (s, n) => (s && s.length > n ? s.slice(0, n) + '\n...[cut]' : s || '')
const percentages = (bytes) => {
  const total = Object.values(bytes).reduce((a, b) => a + b, 0) || 1
  return Object.entries(bytes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([lang, n]) => `${lang} ${Math.round((n / total) * 100)}%`)
    .join(', ')
}

// Facts about one repository, as plain text for the AI prompt.
export async function getRepoFacts(owner, repo) {
  if (!NAME.test(repo)) throw httpError(400, 'That repo name does not look right.', 'bad_repo')
  const base = `/repos/${owner}/${repo}`
  const meta = await gh(base)

  const [readme, languages, files, pkg] = await Promise.all([
    gh(`${base}/readme`, { raw: true, optional: true }),
    gh(`${base}/languages`, { optional: true }),
    gh(`${base}/contents`, { optional: true }),
    gh(`${base}/contents/package.json`, { raw: true, optional: true }),
  ])

  const lines = [
    `repository: ${meta.full_name}`,
    `description: ${meta.description || '(none)'}`,
    `main language: ${meta.language || '(unknown)'}`,
    languages ? `languages: ${percentages(languages)}` : '',
    meta.topics?.length ? `topics: ${meta.topics.join(', ')}` : '',
    meta.license?.spdx_id && meta.license.spdx_id !== 'NOASSERTION' ? `license: ${meta.license.spdx_id}` : 'license: (not detected)',
    meta.homepage ? `homepage: ${meta.homepage}` : '',
    `stars: ${meta.stargazers_count}`,
    `default branch: ${meta.default_branch}`,
    Array.isArray(files) ? `files in root folder: ${files.slice(0, 60).map((f) => (f.type === 'dir' ? f.name + '/' : f.name)).join(', ')}` : '',
    pkg ? `package.json (excerpt):\n${cut(pkg, 2500)}` : '',
    readme ? `existing README (excerpt):\n${cut(readme, 6000)}` : 'existing README: (none)',
  ].filter(Boolean)

  return { type: 'repo', name: meta.full_name, owner: meta.owner?.login || owner, text: lines.join('\n') }
}

// Facts about a GitHub user, as plain text for the AI prompt.
export async function getProfileFacts(username) {
  if (!NAME.test(username)) throw httpError(400, 'That GitHub username does not look right.', 'bad_user')
  const user = await gh(`/users/${username}`)
  const repos = (await gh(`/users/${username}/repos?per_page=100&sort=updated`, { optional: true })) || []

  const own = repos.filter((r) => !r.fork && !r.archived)
  const top = [...own].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6)
  const langCount = {}
  own.forEach((r) => r.language && (langCount[r.language] = (langCount[r.language] || 0) + 1))
  const langs = Object.entries(langCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([l, n]) => `${l} (${n} repos)`)
    .join(', ')

  const lines = [
    `github username: ${user.login}`,
    user.name ? `name: ${user.name}` : '',
    user.bio ? `bio: ${user.bio}` : '',
    user.location ? `location: ${user.location}` : '',
    user.company ? `company: ${user.company}` : '',
    user.blog ? `website: ${user.blog}` : '',
    user.twitter_username ? `twitter: ${user.twitter_username}` : '',
    `public repos: ${user.public_repos}, followers: ${user.followers}`,
    langs ? `languages used: ${langs}` : '',
    top.length
      ? 'top repositories:\n' +
        top.map((r) => `- ${r.name} (${r.language || 'n/a'}, ${r.stargazers_count} stars): ${r.description || 'no description'} -> ${r.html_url}`).join('\n')
      : '',
  ].filter(Boolean)

  return { type: 'profile', name: user.login, owner: user.login, text: lines.join('\n') }
}
