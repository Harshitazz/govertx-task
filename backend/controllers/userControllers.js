const User = require('../models/User');

exports.getUser=async(req,res)=>{
    try {
        const userId = req.user.id;
    
        const user = await User.findById(userId)
          .populate('savedFeeds') // optional: populate feed details
          .select('username email role credits lastLoginDate savedFeeds creditHistory activities');
    
        if (!user) return res.status(404).json({ message: 'User not found' });
    
        res.status(200).json({
          username: user.username,
          email: user.email,
          role: user.role,
          credits: user.credits,
          lastLoginDate: user.lastLoginDate,
          savedFeeds: user.savedFeeds,
          creditHistory: user.creditHistory,
          activities: user.activities,
        });
    
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        res.status(500).json({ message: 'Failed to fetch user dashboard data' });
      }
}

// controllers/userController.js
exports.updateProfile = async (req, res) => {
    try {
      const userId = req.user.id;
      const { username, email } = req.body;
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { username, email },
        { new: true, runValidators: true }
      ).select('username email role credits lastLoginDate savedFeeds creditHistory activities');
  
      res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ message: 'Failed to update profile' });
    }
  };
  