import { env } from '../config/env.js'

const redirectUri = (provider) => `${env.serverUrl}/api/auth/${provider}/callback`

class OAuthError extends Error {
  constructor(message, code) {
    super(message)
    this.code = code
  }
}

async function request(url, options) {
  const res = await fetch(url, options)
  if (!res.ok) throw new OAuthError(`${url} responded ${res.status}`, 'PROVIDER_ERROR')
  return res.json()
}

/* ------------------------------ Google ------------------------------ */
const google = {
  enabled: () => !!(env.google.clientId && env.google.clientSecret),

  authUrl(state) {
    const query = new URLSearchParams({
      client_id: env.google.clientId,
      redirect_uri: redirectUri('google'),
      response_type: 'code',
      scope: 'openid email profile',
      state,
      prompt: 'select_account',
    })
    return `https://accounts.google.com/o/oauth2/v2/auth?${query}`
  },

  async profile(code) {
    const token = await request('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: env.google.clientId,
        client_secret: env.google.clientSecret,
        redirect_uri: redirectUri('google'),
        grant_type: 'authorization_code',
      }),
    })
    const info = await request('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${token.access_token}` },
    })
    if (!info.email || !info.email_verified) throw new OAuthError('No verified email', 'NO_VERIFIED_EMAIL')
    return { providerId: String(info.sub), email: info.email, name: info.name || '', avatar: info.picture || '' }
  },
}

/* ------------------------------ GitHub ------------------------------ */
const github = {
  enabled: () => !!(env.github.clientId && env.github.clientSecret),

  authUrl(state) {
    const query = new URLSearchParams({
      client_id: env.github.clientId,
      redirect_uri: redirectUri('github'),
      scope: 'read:user user:email',
      state,
    })
    return `https://github.com/login/oauth/authorize?${query}`
  },

  async profile(code) {
    const token = await request('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: env.github.clientId,
        client_secret: env.github.clientSecret,
        code,
        redirect_uri: redirectUri('github'),
      }),
    })
    if (!token.access_token) throw new OAuthError(token.error || 'No access token', 'PROVIDER_ERROR')

    const headers = {
      Authorization: `Bearer ${token.access_token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'docume',
    }
    const user = await request('https://api.github.com/user', { headers })
    // GitHub emails can be private, so ask the emails endpoint for the verified one
    const emails = await request('https://api.github.com/user/emails', { headers })
    const picked = emails.find((e) => e.primary && e.verified) || emails.find((e) => e.verified)
    if (!picked) throw new OAuthError('No verified email', 'NO_VERIFIED_EMAIL')

    return {
      providerId: String(user.id),
      email: picked.email,
      name: user.name || user.login || '',
      avatar: user.avatar_url || '',
    }
  },
}

export const providers = { google, github }
