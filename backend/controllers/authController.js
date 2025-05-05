const jwt = require('jwt-simple');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();
const secretKey = process.env.JWT_SECRET_KEY;

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password,role } = req.body;

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
// Create new user
const now = new Date();

const newUser = new User({
  username,
  email,
  password: hashedPassword,
  credits: 10,
  role,
  lastLoginDate: now,
  activities: [{
    action: 'account_created',
    detail: 'User account created',
    timestamp: now
  }],
  creditHistory: [{
    amount: 10,
    balance: 10,
    reason: 'Signup bonus',
    timestamp: now
  }]
});
    // Generate JWT token
    const token = jwt.encode({ userId: newUser._id , role: newUser.role}, secretKey);
    
    await newUser.save();
    res.status(201).json({ token , credits: newUser.credits, role: newUser.role});
  } catch (error) {
    console.error("Registration error:", error);
    res.status(400).json({ error: 'User registration failed' });
  }
};

// Inside your login function
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // DAILY LOGIN CREDIT LOGIC
    const today = new Date().toDateString();
    const lastLogin = user.lastLoginDate ? user.lastLoginDate.toDateString() : null;

    let credits = user.credits || 0;
    if (lastLogin !== today) {
      credits += 10; // 🪙 Reward 10 credits
      user.credits = credits;
      user.lastLoginDate = new Date();
      user.activities.push({
        action: 'daily_login',
        detail: 'User logged in and received 10 daily credits',
        timestamp: new Date()
      });

      user.creditHistory.push({
        amount: 10,
        balance: user.credits,
        reason: 'Daily login bonus',
        timestamp: new Date()
      });
      await user.save();
    }

    const token = jwt.encode({ userId: user._id , role: user.role}, secretKey);

    res.status(200).json({
      token,
      role: user.role,
      credits: user.credits,
      username: user.username,
      lastLoginDate: user.lastLoginDate,
    });
  } catch (error) {
    res.status(400).json({ message: 'Login failed' });
  }
};


