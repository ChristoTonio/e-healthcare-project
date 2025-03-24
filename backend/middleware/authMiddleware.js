const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor'); // Import Doctor model

// Middleware to protect routes (Authentication)
const protect = async (req, res, next) => {
    let token;

    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Extract token from header
        token = req.headers.authorization.split(' ')[1];
        console.log("📌 Token received:", token);

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Decoded token:", decoded);

        // Check if user is a Patient or a Doctor
        let user = await User.findById(decoded.id).select('-password');
        if (!user) {
            user = await Doctor.findById(decoded.id).select('-password'); // Check in Doctor model
        }

        if (!user) {
            return res.status(401).json({ message: 'User not found. Authentication failed.' });
        }

        req.user = user; // Attach user data to request object
        console.log("👤 Authenticated User:", req.user);

        next(); // Proceed to the next middleware/controller
    } catch (error) {
        console.error("🚨 Authentication error:", error);
        return res.status(401).json({ message: 'Invalid or expired token. Please login again.' });
    }
};

// Middleware for Role-Based Access Control (Authorization)
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required.' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: `Access denied. Role '${req.user.role}' is not authorized.` });
        }

        console.log(`🔐 Role authorization granted: ${req.user.role}`);
        next(); // Proceed to the next middleware/controller
    };
};

module.exports = { protect, authorizeRoles };
