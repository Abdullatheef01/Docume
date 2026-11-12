import mongoose from 'mongoose'
import User from '../models/User.js'
import { COOKIE_NAME, verifyToken } from '../utils/token.js'

async function loadUser(req) {
  const token = req.cookies?.[COOKIE_NAME]
  if (!token) return null
  const payload = verifyToken(token)
  if (!payload || !mongoose.isValidObjectId(payload.sub)) return null
  return User.findById(payload.sub)
}

// sets req.user (or null), never blocks
export async function optionalAuth(req, _res, next) {
  try {
    req.user = await loadUser(req)
    next()
  } catch (err) {
    next(err)
  }
}

// blocks with 401 unless logged in (used by chats + AI routes in the next phases)
export async function requireAuth(req, res, next) {
  try {
    const user = await loadUser(req)
    if (!user) return res.status(401).json({ error: 'Login required' })
    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}
