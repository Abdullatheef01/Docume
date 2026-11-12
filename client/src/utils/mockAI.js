import { LIBRARY, findLib, makeSection } from '../data/library.js'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const titleCase = (s) =>
  s
    .replace(/[-_]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

function withContent(mode, key, content) {
  const sec = makeSection(findLib(mode, key))
  return content ? { ...sec, content } : sec
}

// MOCK AI generation for the preview build.
// The real version: backend fetches the repo (or uses the typed details) and calls the Claude API.
export async function generateFromPrompt(mode, text) {
  await wait(900)

  if (mode === 'repome') {
    const m = text.match(/github\.com\/([\w.-]+)\/([\w.-]+)/i)
    const name = m ? titleCase(m[2].replace(/\.git$/, '')) : titleCase(text.split(/\s+/).slice(0, 3).join(' '))
    const about = m
      ? `${name} is hosted at github.com/${m[1]}/${m[2].replace(/\.git$/, '')}. (Preview build: the real AI will analyse the repository and write this part.)`
      : text
    return [
      withContent('repome', 'title-description', `# ${name}\n\n${about}`),
      withContent('repome', 'features'),
      withContent('repome', 'tech-stack'),
      withContent('repome', 'installation'),
      withContent('repome', 'usage'),
      withContent('repome', 'license'),
    ]
  }

  const g = text.match(/github\.com\/([\w.-]+)/i)
  const username = g ? g[1] : 'YOUR_USERNAME'
  const name = g ? titleCase(g[1]) : 'Your Name'
  const swap = (sec) => ({ ...sec, content: sec.content.split('YOUR_USERNAME').join(username) })
  const keys = ['title', 'text-animation', 'summary', 'social-media', 'quick-facts', 'tech-stack', 'github-stats']
  return keys.map((k) => {
    const sec = swap(makeSection(findLib('imme', k)))
    if (k === 'title') sec.content = sec.content.replace('Your Name', name)
    if (k === 'summary' && !g) sec.content = `## 👨‍💻 About Me\n\n${text}`
    return sec
  })
}

export { LIBRARY }
