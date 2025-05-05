const mongoose = require('mongoose');
const activitySchema = new mongoose.Schema({
  action: { type: String, required: true }, // 'feed_saved', 'feed_reported', 'login', 'credit_earned', 'feed_read'
  detail: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed }, // Additional data we might want to store
  timestamp: { type: Date, default: Date.now }
});
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  credits: { type: Number, default: 0 },
  lastLoginDate: { type: Date },
  activities: [activitySchema], // User activities tracking
  creditHistory: [{
    amount: { type: Number, required: true }, // Amount changed
    balance: { type: Number, required: true }, // Balance after change
    reason: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  savedFeeds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feed' }],
});

module.exports = mongoose.model('User', userSchema);
