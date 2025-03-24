const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        token = req.headers.authorization.split(' ')[1];
        console.log("📌 Token received:", token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Decoded token:", decoded);

        req.user = await User.findById(decoded.id).select('-password');
        console.log("👤 User found:", req.user);

        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        next();
    } catch (error) {
        console.error("🚨 Token error:", error);
        return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
};

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Access denied for ${req.user.role}` });
        }

        next();
    };
};

module.exports = { protect, authorizeRoles };
