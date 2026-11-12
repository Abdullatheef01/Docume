export function displayName(email) {
  if (!email) return ''
  const local = email.split('@')[0] || ''
  const first = local.split(/[^a-zA-Z]+/).filter(Boolean)[0] || local
  return first.charAt(0).toUpperCase() + first.slice(1)
}

// Greeting changes with the time of day (and uses the name when logged in).
export function getGreeting(user) {
  const h = new Date().getHours()
  const who = user ? displayName(user.email) : 'everyone'
  if (h >= 5 && h < 12) return `Good morning, ${who}!`
  if (h >= 12 && h < 17) return `Good afternoon, ${who}!`
  if (h >= 17 && h < 21) return `Good evening, ${who}!`
  return `Hello, ${user ? who : 'night owl'}!`
}
