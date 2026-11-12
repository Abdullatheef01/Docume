import { Router } from 'express'
import { dbState } from '../config/db.js'

const router = Router()

// GET /api/health -> quick check that the server and database are alive
router.get('/', (_req, res) => {
  const db = dbState()
  res.status(db === 'connected' ? 200 : 503).json({
    ok: db === 'connected',
    service: 'docume-server',
    db,
    uptime: Math.round(process.uptime()),
    time: new Date().toISOString(),
  })
})

export default router
