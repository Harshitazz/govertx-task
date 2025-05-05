const express = require('express');
const router = express.Router();
const User = require('../models/User');
const checkAdmin = require('../middleware/checkAdmin');
const Feed = require('../models/Feed');

// GET /api/users/roles - only admin can access
exports.allUsers = async (req, res) => {
  try {
    // Find only users with role 'user'
    const users = await User.find({ role: 'user' });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};




exports.allPosts=async (req, res) => {
  try {
    const feeds = await Feed.find()
      .sort({ createdAt: -1 }) // newest first
      .populate('savedBy', 'username') // optional: populate savedBy with usernames
      .populate('reports.user', 'username'); // optional: populate report users

    res.status(200).json(feeds);
  } catch (error) {
    console.error('Error fetching feeds:', error);
    res.status(500).json({ error: 'Internal server error' });
  }}


// Update user credits (admin functionality)
exports.updateCredits = async (req, res) => {
  const { credits } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { credits },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
