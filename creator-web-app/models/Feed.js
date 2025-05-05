const mongoose = require('mongoose');

const feedSchema = new mongoose.Schema({
  source: { 
    type: String, 
    enum: ['twitter', 'reddit', 'linkedin'], 
    required: true 
  },
  title: { 
    type: String,
    required: true
  },
  content: { 
    type: String 
  },
  link: { 
    type: String, 
    required: true 
  },
  thumbnail: {
    type: String
  },
  author: {
    type: String
  },
  savedBy: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  reports: [{ 
    user: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User'
    },
    reasons: [{ 
      type: String,
      enum: ['spam', 'inappropriate', 'offensive', 'misleading', 'illegal', 'other']
    }],
    otherReason: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  reportCount: {
    type: Number,
    default: 0
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Feed', feedSchema);