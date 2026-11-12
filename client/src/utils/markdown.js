export const uid = () => Math.random().toString(36).slice(2, 10)

// Join every section (in sidebar order) into one README.
export function composeMarkdown(sections) {
  const body = sections
    .map((s) => s.content.trim())
    .filter(Boolean)
    .join('\n\n')
  return body ? body + '\n' : ''
}

// Title shown in Recent: first heading / first line of the first section.
export function chatTitle(sections) {
  const first = sections.find((s) => s.content.trim())
  if (!first) return 'Untitled README'
  const line = first.content
    .split('\n')
    .map((l) => l.replace(/<[^>]+>/g, '').replace(/^#+\s*/, '').trim())
    .find(Boolean)
  return (line || 'Untitled README').slice(0, 40)
}

// ---- alignment helpers (wrap the section in <div align="..."> like GitHub READMEs do) ----
const ALIGN_RE = /^\s*<div align="(left|center|right)">\s*([\s\S]*?)\s*<\/div>\s*$/

export function getAlign(content) {
  const m = content.match(ALIGN_RE)
  return m ? m[1] : 'left'
}

export function setAlign(content, align) {
  const m = content.match(ALIGN_RE)
  const inner = (m ? m[2] : content).trim()
  if (align === 'left') return inner
  return `<div align="${align}">\n\n${inner}\n\n</div>`
}

// ---- badges ----
export const BADGES = [
  {
    label: 'MIT License',
    md: '![MIT License](https://img.shields.io/badge/License-MIT-green.svg)',
  },
  {
    label: 'PRs Welcome',
    md: '![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)',
  },
  {
    label: 'Built with React',
    md: '![React](https://img.shields.io/badge/Built%20with-React-61DAFB?logo=react&logoColor=white)',
  },
  {
    label: 'Node.js',
    md: '![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)',
  },
  {
    label: 'MongoDB',
    md: '![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)',
  },
  {
    label: 'Maintained',
    md: '![Maintained](https://img.shields.io/badge/Maintained%3F-yes-green.svg)',
  },
]

// ---- MOCK "magic wand" enhance ----
// Placeholder logic for the preview build. The backend + Claude API will replace this.
export function enhanceText(text) {
  return text
    .split('\n')
    .map((line) => {
      const t = line.trim()
      if (!t) return line
      // leave markdown / html / code lines alone
      if (/^([#>|`<\-*+]|\d+\.|!\[|\[)/.test(t)) return line
      let out = t.replace(/\s+/g, ' ')
      out = out.charAt(0).toUpperCase() + out.slice(1)
      if (!/[.!?:]$/.test(out)) out += '.'
      return out
    })
    .join('\n')
}
