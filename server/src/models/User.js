import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, trim: true, default: '' },
    avatar: { type: String, default: '' },
    // one user can sign in with Google and GitHub (linked by the same verified email)
    googleId: { type: String, unique: true, sparse: true },
    githubId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
)

// what the frontend is allowed to see
userSchema.methods.toPublic = function toPublic() {
  return { id: this._id.toString(), email: this.email, name: this.name, avatar: this.avatar }
}

export default mongoose.model('User', userSchema)
