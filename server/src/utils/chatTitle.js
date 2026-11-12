// Title shown in "Recent": first heading / first line of the first section that has text.
export function chatTitle(sections) {
  const first = sections.find((s) => s.content.trim())
  if (!first) return 'Untitled README'
  const line = first.content
    .split('\n')
    .map((l) => l.replace(/<[^>]+>/g, '').replace(/^#+\s*/, '').trim())
    .find(Boolean)
  return (line || 'Untitled README').slice(0, 40)
}
