const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feedController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', feedController.getFeeds);
router.post('/save', authMiddleware, feedController.saveFeed);
router.post('/report', authMiddleware, feedController.reportFeed);
router.get('/saved', authMiddleware, feedController.getSavedFeeds);
router.post('/remove-feed', authMiddleware, feedController.removeFeed);

module.exports = router;
