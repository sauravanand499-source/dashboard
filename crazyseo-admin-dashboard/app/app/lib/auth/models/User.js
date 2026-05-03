import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  image: String,
  role: {
    type: String,
    enum: ['admin', 'editor', 'viewer'],
    default: 'viewer',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: Date,
  seoToolUsage: {
    daily: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
