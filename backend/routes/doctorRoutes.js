const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protected route
router.get('/dashboard', authMiddleware, (req, res) => {
    res.json({ message: 'Welcome to the doctor dashboard', user: req.user });
});

module.exports = router;
