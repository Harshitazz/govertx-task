const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  feedId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Feed',
    required: true
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  reason: { 
    type: String,
    enum: ['spam', 'inappropriate', 'offensive', 'misleading', 'other'],
    required: true
  },
  details: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'rejected'],
    default: 'pending'
  }
});

// Compound index to prevent duplicate reports from the same user
reportSchema.index({ feedId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Report', reportSchema);