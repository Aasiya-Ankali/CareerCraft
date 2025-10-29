import mongoose, { Schema, models, model } from 'mongoose'

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String },
    avatarUrl: { type: String },
    skills: { type: [String], default: [] },
    resumePath: { type: String },
    profile: {
      college: String,
      graduationYear: Number,
      bio: String,
      links: { github: String, linkedin: String, portfolio: String },
    },
  },
  { timestamps: true }
)

export default models.User || model('User', UserSchema)


