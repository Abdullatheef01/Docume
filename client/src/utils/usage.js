// Helpers for the AI usage limit shown under the prompt box and on the magic wand.
// usage = { limit, used, remaining, resetAt } for one type ("generate" or "wand"), as sent by the server.

// "3h 20m", "45m", "less than 1m"
export function timeLeft(iso, now = Date.now()) {
  const ms = new Date(iso).getTime() - now
  if (!(ms > 0)) return null
  const mins = Math.ceil(ms / 60000)
  if (mins < 1) return 'less than 1m'
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h ? (m ? `${h}h ${m}m` : `${h}h`) : `${m}m`
}

// -> { remaining, locked, low, resetText }
export function quotaState(usage, siteBlocked = false, now = Date.now()) {
  if (!usage) return { remaining: null, locked: siteBlocked, low: false, resetText: null, site: siteBlocked }
  const resetMs = usage.resetAt ? new Date(usage.resetAt).getTime() : 0
  const fresh = usage.used > 0 && resetMs <= now // the window is over, so the server will start a new one
  const remaining = fresh ? usage.limit : usage.remaining
  const resetText = !fresh && usage.used > 0 ? timeLeft(usage.resetAt, now) : null
  return {
    remaining,
    locked: siteBlocked || remaining <= 0,
    low: remaining > 0 && remaining <= Math.max(1, Math.ceil(usage.limit * 0.1)), // 90% used
    resetText,
    site: siteBlocked,
  }
}
