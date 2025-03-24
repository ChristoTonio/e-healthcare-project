const User = require('../models/User');  
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create new user
        const newUser = new User({ name, email, password: hashedPassword, phone });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
};

// Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log("🔍 Checking email:", email);

        // Find user
        const user = await User.findOne({ email });

        console.log("✅ User found:", user);

        if (!user) {
            return res.status(404).json({ message: "User not found in database" });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("🔐 Password match:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        });
    } catch (error) {
        console.error("🚨 Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get User Profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// ✅ Export Functions
module.exports = { registerUser, loginUser, getUserProfile };
