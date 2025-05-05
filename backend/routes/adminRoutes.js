const express = require('express');
const router = express.Router();
const checkAdmin = require('../middleware/checkAdmin');
const { allUsers, allPosts, updateCredits } = require('../controllers/adminController');

router.get('/', checkAdmin, allUsers);
router.get('/posts', checkAdmin, allPosts);
router.put('/:id/credits', checkAdmin, updateCredits);

module.exports = router;
