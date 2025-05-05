const axios = require('axios');
const Feed = require('../models/Feed');
require('dotenv').config();
const User = require('../models/User');

const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
// Reddit API fetch function
const fetchRedditFeeds = async () => {
  try {
    const response = await axios.get('https://www.reddit.com/r/news/top.json?t=month&limit=10', {
      headers: { 'User-Agent': process.env.REDDIT_USER_AGENT || 'MyApp/1.0.0' }
    });
    
    return response.data.data.children.map(post => ({
      source: 'reddit',
      title: post.data.title,
      content: post.data.selftext || post.data.url,
      link: `https://www.reddit.com${post.data.permalink}`,
      thumbnail: post.data.thumbnail !== 'self' ? post.data.thumbnail : null,
      author: post.data.author,
      createdAt: new Date(post.data.created_utc * 1000),
      upvotes: post.data.ups
    }));
  } catch (error) {
    console.error('Error fetching Reddit feeds:', error);
    return [];
  }
};

// LinkedIn API fetch function (using RSS feed via RapidAPI as example)
const fetchTwitterFeeds = async () => {
  try {
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}` // Replace with your actual Bearer token
      }
    };
    const response = await axios.get('https://api.twitter.com/2/tweets/search/recent ', {
      headers: options.headers,
      params: { limit: '10' ,query: 'news',}
    });
    
    return response.data.map(post => ({
      source: 'Twitter',
      title: post.title || 'Twitter Post',
      content: post.text || '',
      link: `https://twitter.com/i/web/status/${tweet.id}`,
      createdAt: new Date(post.date) || new Date(),
      
    }));
  } catch (error) {
    console.error('Error fetching Twitter feeds:', error);
    return [];
  }
};

// Route to fetch posts and save them to the database
exports.getFeeds = async (req, res) => {
  try {
    const redditFeeds = await fetchRedditFeeds();
    let TwitterFeeds = [];
    
    try {
      TwitterFeeds = await fetchTwitterFeeds();
    } catch (TwitterError) {
      console.error('LinkedIn API error:', linkedInError);
    }
    
    // Combine all feeds
    const allFeeds = [...redditFeeds, ...TwitterFeeds];
    
    for (const feed of allFeeds) {
      const existingFeed = await Feed.findOne({ link: feed.link });
      if (!existingFeed) {
        const newFeed = new Feed({
          source: feed.source,
          title: feed.title,
          content: feed.content,
          link: feed.link,
          thumbnail: feed.thumbnail,
          author: feed.author,
          createdAt: feed.createdAt
        });
        await newFeed.save();
      }
    }

    // ✅ Now respond with the saved feeds from MongoDB (with _id)
    const savedFeeds = await Feed.find().sort({ createdAt: -1 }); // optional sorting
    res.status(200).json(savedFeeds);

  } catch (error) {
    console.error('Failed to fetch feeds:', error);
    res.status(500).json({ error: 'Failed to fetch feeds' });
  }
};


exports.saveFeed = async (req, res) => {
  try {
    const { feedId } = req.body;
    const userId = req.user.id;

    const feed = await Feed.findById(feedId);
    if (!feed) {
      return res.status(404).json({ error: 'Feed not found' });
    }

    const user = await User.findById(userId);

    const alreadySaved = user.savedFeeds.includes(feedId);

    if (!alreadySaved) {
      // Save to feed.savedBy
      if (!feed.savedBy.includes(userId)) {
        feed.savedBy.push(userId);
        await feed.save();
      }

      // Save to user.savedFeeds and add credits
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: { savedFeeds: feedId },
          $inc: { credits: 5 },
          $push: { 
            activities: {
              action: 'feed_saved',
              detail: `Saved "${feed.title}" feed`,
              metadata: { feedId },
              timestamp: new Date()
            }
          }
        },
        { new: true }
      );
      await User.findByIdAndUpdate(
        userId,
        {
          $push:{
            creditHistory: {
              amount: 5,
              balance: updatedUser.credits , // Increased by 5
              reason: 'save feed bonus',
              timestamp: new Date()
            }
          }
        }
      )
      return res.status(200).json({
        message: 'Feed saved successfully',
        credits: updatedUser.credits
      });
    } else {
      return res.status(200).json({
        message: 'Feed already saved',
        credits: user.credits
      });
    }
  } catch (error) {
    console.error('Error saving feed:', error);
    res.status(500).json({ error: 'Failed to save feed' });
  }
};


// Report a feed
exports.reportFeed = async (req, res) => {
  try {
    const { feedId, reasons, otherReason } = req.body;
    const userId = req.user.id; // From auth middleware
    
    if (!feedId || !reasons || !Array.isArray(reasons) || reasons.length === 0) {
      return res.status(400).json({ message: 'Feed ID and at least one reason are required' });
    }

    // Find the feed
    const feed = await Feed.findById(feedId);
    if (!feed) {
      return res.status(404).json({ message: 'Feed not found' });
    }

    // Check if user has already reported this feed
    const hasReported = feed.reports.some(report => 
      report.user && report.user.toString() === userId.toString()
    );

    if (hasReported) {
      return res.status(400).json({ message: 'You have already reported this feed' });
    }

    // Valid reasons
    const validReasons = ['spam', 'inappropriate', 'offensive', 'misleading', 'illegal', 'other'];
    const filteredReasons = reasons.filter(reason => validReasons.includes(reason));

    if (filteredReasons.length === 0) {
      return res.status(400).json({ message: 'At least one valid reason is required' });
    }

    // Add report
    feed.reports.push({
      user: userId,
      reasons: filteredReasons,
      otherReason: otherReason || ''
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        
        $inc: { credits: 5 },
        $push: { 
          activities: {
            action: 'feed_report',
            detail: `reported "${feed.title}" feed`,
            metadata: { feedId },
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );
    
    await User.findByIdAndUpdate(
      userId,
      {
        $push:{
          creditHistory: {
            amount: 5,
            balance: updatedUser.credits , // Increased by 5
            reason: 'report feed bonus',
            timestamp: new Date()
          }
        }
      }
    )
    // Increment report count
    feed.reportCount = (feed.reportCount || 0) + 1;
    
    // Automatically hide posts with high report counts (configurable threshold)
    const REPORT_THRESHOLD = 5; // Can be moved to environment config
    if (feed.reportCount >= REPORT_THRESHOLD) {
      feed.isHidden = true;
    }
    
    await feed.save();

    // Return updated feed with report count
    return res.status(200).json({
      _id: feed._id,
      title: feed.title, 
      reportCount: feed.reportCount,
      isHidden: feed.isHidden
    });
  } catch (error) {
    console.error('Error reporting feed:', error);
    return res.status(500).json({ message: 'Server error reporting feed' });
  }
};


// Get saved feeds for a user
exports.getSavedFeeds = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const User = require('../models/User');
    const user = await User.findById(userId).populate('savedFeeds');
    
    res.status(200).json(user.savedFeeds);
  } catch (error) {
    console.error('Error fetching saved feeds:', error);
    res.status(500).json({ error: 'Failed to fetch saved feeds' });
  }
};



exports.getReportedFeeds = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const reportedFeeds = await Feed.find({ 'reports.0': { $exists: true } })
      .sort({ reportCount: -1 })
      .populate('reports.user', 'username email');

    return res.status(200).json(reportedFeeds);
  } catch (error) {
    console.error('Error fetching reported feeds:', error);
    return res.status(500).json({ message: 'Server error fetching reported feeds' });
  }
};


// Remove saved feed
exports.removeFeed = async (req, res) => {
  try {
    const { feedId } = req.body;
    const userId = req.user.id;

    const feed = await Feed.findById(feedId);
    if (!feed) {
      return res.status(404).json({ error: 'Feed not found' });
    }

    // Remove feed from user's savedFeeds
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { savedFeeds: feedId },
        $push: {
          activities: {
            action: 'feed_removed',
            detail: `Removed "${feed.title}" feed`,
            metadata: { feedId },
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );

    // Remove user from feed.savedBy
    await Feed.findByIdAndUpdate(feedId, {
      $pull: { savedBy: userId }
    });

    res.status(200).json({ message: 'Feed removed successfully', savedFeeds: updatedUser.savedFeeds });
  } catch (error) {
    console.error('Error removing feed:', error);
    res.status(500).json({ error: 'Failed to remove feed' });
  }
};
