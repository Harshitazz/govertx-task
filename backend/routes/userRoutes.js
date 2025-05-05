const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getUser, updateProfile } = require('../controllers/userControllers');

router.get('/dashboard', authMiddleware, getUser);
router.put('/update-profile', authMiddleware, updateProfile);

module.exports = router;
