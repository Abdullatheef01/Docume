import mongoose from 'mongoose'

// How many AI calls one user made in the current window (one row per user + type).
// type: 'generate' (AI prompt box) or 'wand' (magic wand)
const usageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['generate', 'wand'], required: true },
    windowStart: { type: Date, required: true },
    count: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
)

usageSchema.index({ user: 1, type: 1 }, { unique: true })

export default mongoose.model('Usage', usageSchema)
