import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { env, isProd } from './config/env.js'
import healthRoutes from './routes/health.js'
import authRoutes from './routes/auth.js'
import chatRoutes from './routes/chats.js'
import aiRoutes from './routes/ai.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

const app = express()

if (isProd) app.set('trust proxy', env.trustProxy) // behind host proxies (Render, Vercel...) so rate limits see the real IP
app.disable('x-powered-by')
app.use(helmet())
app.use(
  cors({
    // allowed: our frontend address(es), and tools without an Origin header (curl, health checks)
    origin: (origin, cb) => cb(null, !origin || env.clientOrigins.includes(origin)),
    credentials: true, // login cookie
  })
)

// one line per request (no query string, because OAuth codes travel there). Dev: only errors.
app.use((req, res, next) => {
  if (req.path === '/api/health') return next()
  const start = Date.now()
  res.on('finish', () => {
    if (isProd || res.statusCode >= 400) {
      console.log(`[req] ${req.method} ${req.originalUrl.split('?')[0]} ${res.statusCode} ${Date.now() - start}ms`)
    }
  })
  next()
})
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())

app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/chats', chatRoutes)
app.use('/api/ai', aiRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
