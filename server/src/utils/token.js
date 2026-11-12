import jwt from 'jsonwebtoken'
import { env, isProd } from '../config/env.js'

export const COOKIE_NAME = 'docume_token'
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

export const cookieOptions = {
  httpOnly: true, // JavaScript in the page can't read it
  sameSite: env.cookieSameSite,
  secure: isProd || env.cookieSameSite === 'none', // browsers require Secure for SameSite=None
  maxAge: SEVEN_DAYS_MS,
  path: '/',
}

export const signToken = (userId) => jwt.sign({ sub: String(userId) }, env.jwtSecret, { expiresIn: '7d' })

export function verifyToken(token) {
  try {
    return jwt.verify(token, env.jwtSecret)
  } catch {
    return null
  }
}
