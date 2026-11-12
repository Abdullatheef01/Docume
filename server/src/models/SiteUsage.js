import mongoose from 'mongoose'

// How many AI calls the whole site made today (one row per day + type), so we never pass the Gemini daily quota.
// "day" is the date in Pacific time because that is when Google resets its daily quota.
const siteUsageSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['generate', 'wand'], required: true },
    day: { type: String, required: true }, // 2026-11-07
    count: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
)

siteUsageSchema.index({ type: 1, day: 1 }, { unique: true })
siteUsageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3 * 24 * 60 * 60 }) // old days clean themselves

export default mongoose.model('SiteUsage', siteUsageSchema)
