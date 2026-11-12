import User from '../models/User.js'

const FIELD = { google: 'googleId', github: 'githubId' }

// Find the user for this provider login, link it by email if the user already exists, else create.
export async function findOrCreateUser(provider, profile) {
  const field = FIELD[provider]
  const email = profile.email.toLowerCase()

  let user = await User.findOne({ [field]: profile.providerId })
  if (user) return user

  user = await User.findOne({ email })
  if (user) {
    user[field] = profile.providerId
    if (!user.name) user.name = profile.name
    if (!user.avatar) user.avatar = profile.avatar
    await user.save()
    return user
  }

  return User.create({ email, name: profile.name, avatar: profile.avatar, [field]: profile.providerId })
}
