import { isProd } from '../config/env.js'

export function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` })
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  const status = err.status || err.statusCode || 500
  if (status >= 500 && !err.expose) console.error('[error]', err)
  // err.expose = a message we wrote on purpose for the user (AI / GitHub errors), safe to show
  const showMessage = status < 500 || err.expose || !isProd
  res.status(status).json({
    error: showMessage ? err.message || 'Something went wrong' : 'Something went wrong',
    ...(err.publicCode ? { code: err.publicCode } : {}),
  })
}
