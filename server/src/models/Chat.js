import mongoose from 'mongoose'

export const LIMITS = {
  maxSections: 60,
  maxContent: 50000, // characters per section
  maxChatsPerUser: 100, // oldest chats are removed after this
}

const sectionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, maxlength: 40 },
    key: { type: String, required: true, maxlength: 80 },
    title: { type: String, required: true, maxlength: 80 },
    content: { type: String, default: '', maxlength: LIMITS.maxContent },
  },
  { _id: false }
)

const chatSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    mode: { type: String, enum: ['repome', 'imme'], required: true },
    title: { type: String, default: 'Untitled README', maxlength: 80 },
    sections: { type: [sectionSchema], default: [] },
    activeId: { type: String, default: null },
  },
  { timestamps: true }
)

chatSchema.index({ user: 1, updatedAt: -1 })

// full chat (open)
chatSchema.methods.toPublic = function toPublic() {
  return {
    id: this._id.toString(),
    mode: this.mode,
    title: this.title,
    sections: this.sections,
    activeId: this.activeId,
    updatedAt: this.updatedAt,
  }
}

export default mongoose.model('Chat', chatSchema)
