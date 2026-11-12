import 'dotenv/config'

const required = ['MONGODB_URI', 'JWT_SECRET']

const missing = required.filter((key) => !process.env[key])
if (missing.length) {
  console.error(`\n[env] Missing required variable(s): ${missing.join(', ')}`)
  console.error('[env] Copy ".env.example" to ".env" and fill the values.')
  if (missing.includes('JWT_SECRET')) {
    console.error('[env] Create a JWT_SECRET with:')
    console.error('      node -e "console.log(require(\'crypto\').randomBytes(48).toString(\'hex\'))"')
  }
  console.error('')
  process.exit(1)
}

if (process.env.JWT_SECRET.length < 32) {
  console.error('\n[env] JWT_SECRET is too short (use at least 32 characters).\n')
  process.exit(1)
}

const positive = (value, fallback) => (Number(value) > 0 ? Number(value) : fallback)

// CLIENT_URL can hold more than one address, separated by commas (e.g. your Vercel domain + a preview domain).
const clientOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((u) => u.trim().replace(/\/+$/, ''))
  .filter(Boolean)

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI,
  clientUrl: clientOrigins[0], // where login sends the browser back to
  clientOrigins, // all addresses allowed to call this API (CORS)
  // how many proxies sit in front of the server (Render = 1; Vercel rewrite + Render = 2). Needed for correct IPs.
  trustProxy: positive(process.env.TRUST_PROXY, 1),
  // 'lax' works when the browser talks to ONE domain (Vercel rewrite). Use 'none' only for client + server on different domains.
  cookieSameSite: ['lax', 'strict', 'none'].includes(process.env.COOKIE_SAMESITE) ? process.env.COOKIE_SAMESITE : 'lax',
  serverUrl: process.env.SERVER_URL || `http://localhost:${Number(process.env.PORT) || 5000}`,
  jwtSecret: process.env.JWT_SECRET,
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  },
  // optional: raises the GitHub API limit when AI reads repos / profiles (60 -> 5000 requests per hour)
  githubToken: process.env.GITHUB_TOKEN || '',
  ai: {
    provider: (process.env.AI_PROVIDER || 'gemini').toLowerCase(),
    geminiKey: process.env.GEMINI_API_KEY || '',
    // optional second key (from a different Google project = its own quota) used only by the magic wand
    geminiWandKey: process.env.GEMINI_WAND_API_KEY || '',
    geminiModel: process.env.GEMINI_MODEL || 'gemini-flash-latest',
    // optional: used for the 3rd try when the main model is busy (503)
    geminiFallbackModel: process.env.GEMINI_FALLBACK_MODEL || '',
    timeoutMs: Number(process.env.AI_TIMEOUT_MS) || 45000,
    retryDelayMs: Number(process.env.AI_RETRY_DELAY_MS) || 1500, // wait before retry 1, 2 x this before retry 2
  },
  // AI usage limits (see services/usage.js)
  limits: {
    windowHours: positive(process.env.LIMIT_WINDOW_HOURS, 5),
    generate: positive(process.env.LIMIT_GENERATE, 6), // per user per window: AI prompt box
    wand: positive(process.env.LIMIT_WAND, 15), // per user per window: magic wand
    siteGenerate: positive(process.env.SITE_DAILY_GENERATE, 1100), // whole site per day
    siteWand: positive(process.env.SITE_DAILY_WAND, 1100),
  },
}

export const isProd = env.nodeEnv === 'production'

// Warnings for production only (they never stop the server)
if (isProd) {
  if (env.clientOrigins.some((u) => u.includes('localhost'))) console.warn('[env] CLIENT_URL still points to localhost. Set your real frontend URL.')
  if (env.serverUrl.includes('localhost')) console.warn('[env] SERVER_URL still points to localhost. OAuth callbacks will fail.')
  if (!env.clientOrigins.every((u) => u.startsWith('https://'))) console.warn('[env] CLIENT_URL should start with https:// in production.')
}
