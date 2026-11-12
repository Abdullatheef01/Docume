import Usage from '../models/Usage.js'
import SiteUsage from '../models/SiteUsage.js'
import { env } from '../config/env.js'

// AI limits.
//  1) per user: LIMIT_GENERATE / LIMIT_WAND calls per window (LIMIT_WINDOW_HOURS, starts at the first use)
//  2) whole site: SITE_DAILY_GENERATE / SITE_DAILY_WAND calls per day (protects the Gemini free quota)
// A call is reserved BEFORE asking the AI and given back if the AI fails, so failures never cost the user.

export const TYPES = ['generate', 'wand']

const windowMs = () => env.limits.windowHours * 60 * 60 * 1000
const userLimit = (type) => (type === 'generate' ? env.limits.generate : env.limits.wand)
const siteLimit = (type) => (type === 'generate' ? env.limits.siteGenerate : env.limits.siteWand)
const isDuplicate = (err) => err?.code === 11000

// Google resets the daily quota at midnight Pacific time
const pacificDay = (date = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles' }).format(date)

// What the frontend gets: { limit, used, remaining, resetAt }
export function shape(type, doc, now = Date.now()) {
  const limit = userLimit(type)
  const start = doc?.windowStart ? new Date(doc.windowStart).getTime() : 0
  const active = !!doc && start + windowMs() > now
  const used = active ? Math.min(doc.count, limit) : 0
  return {
    limit,
    used,
    remaining: limit - used,
    resetAt: used > 0 ? new Date(start + windowMs()).toISOString() : null,
  }
}

async function reserveUser(userId, type, retry = true) {
  const now = new Date()
  // 1) the old window is over -> start fresh
  await Usage.updateOne(
    { user: userId, type, windowStart: { $lte: new Date(now.getTime() - windowMs()) } },
    { $set: { windowStart: now, count: 0 } }
  )
  // 2) take one slot (only works while count < limit)
  let doc = await Usage.findOneAndUpdate({ user: userId, type, count: { $lt: userLimit(type) } }, { $inc: { count: 1 } }, { new: true })
  if (doc) return { ok: true, usage: shape(type, doc) }

  const existing = await Usage.findOne({ user: userId, type })
  if (existing) return { ok: false, usage: shape(type, existing) } // limit reached

  // first use ever
  try {
    doc = await Usage.create({ user: userId, type, windowStart: now, count: 1 })
    return { ok: true, usage: shape(type, doc) }
  } catch (err) {
    if (isDuplicate(err) && retry) return reserveUser(userId, type, false) // two requests at the same moment
    throw err
  }
}

async function reserveSite(type, day) {
  try {
    await SiteUsage.findOneAndUpdate({ type, day, count: { $lt: siteLimit(type) } }, { $inc: { count: 1 } }, { upsert: true, new: true })
    return true
  } catch (err) {
    if (isDuplicate(err)) return false // today's row exists and is full
    throw err
  }
}

// -> { ok: true, usage, refund() }  or  { ok: false, reason: 'user' | 'site', usage }
export async function reserve(userId, type) {
  const user = await reserveUser(userId, type)
  if (!user.ok) return { ok: false, reason: 'user', usage: user.usage }

  const day = pacificDay()
  if (!(await reserveSite(type, day))) {
    await Usage.updateOne({ user: userId, type, count: { $gt: 0 } }, { $inc: { count: -1 } })
    return { ok: false, reason: 'site', usage: await getUsageOne(userId, type) }
  }

  return {
    ok: true,
    usage: user.usage,
    refund: async () => {
      await Usage.updateOne({ user: userId, type, count: { $gt: 0 } }, { $inc: { count: -1 } })
      await SiteUsage.updateOne({ type, day, count: { $gt: 0 } }, { $inc: { count: -1 } })
    },
  }
}

export async function getUsageOne(userId, type) {
  return shape(type, await Usage.findOne({ user: userId, type }))
}

export async function getUsage(userId) {
  const [generate, wand] = await Promise.all(TYPES.map((t) => getUsageOne(userId, t)))
  return { generate, wand }
}
