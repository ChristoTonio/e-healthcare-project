const express = require('express');
const { registerUser, registerDoctor, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');  // ✅ Middleware for protected routes

const router = express.Router();

// Patient Registration & Login
router.post('/register-user', registerUser);
router.post('/register-doctor', registerDoctor);
router.post('/login', login);

// Protected Route (User/Doctor Profile)
router.get('/profile', protect, getProfile);

module.exports = router;
