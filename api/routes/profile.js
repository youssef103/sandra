const express = require('express');
const router = express.Router();

// @route   GET api/profile
// @desc    get user profile
// @access  Private
router.get('/', (req, res) => {
    res.send('Profile')
});

module.exports = router;