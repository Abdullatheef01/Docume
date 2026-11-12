import { env } from './config/env.js'
import { closeDB, connectDB } from './config/db.js'
import app from './app.js'
import { aiConfigured } from './services/ai/index.js'

async function start() {
  try {
    await connectDB()
  } catch (err) {
    console.error('\n[db] Could not connect to MongoDB:', err.message)
    console.error('[db] Check MONGODB_URI in server/.env and that your IP is allowed in Atlas (Network Access).\n')
    process.exit(1)
  }

  const server = app.listen(env.port, () => {
    console.log(`[server] Docume API running on http://localhost:${env.port} (${env.nodeEnv})`)
    console.log(
      aiConfigured()
        ? `[ai] ${env.ai.provider} ready (model: ${env.ai.geminiModel})`
        : `[ai] not configured - add GEMINI_API_KEY to server/.env to enable AI mode`
    )
  })

  const shutdown = async (signal) => {
    console.log(`\n[server] ${signal} received, shutting down...`)
    setTimeout(() => process.exit(1), 10000).unref() // do not hang forever if a request never finishes
    server.close(async () => {
      await closeDB()
      process.exit(0)
    })
  }
  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('unhandledRejection', (err) => console.error('[error] unhandled rejection:', err))
}

start()
