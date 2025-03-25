const User = require('../models/User');
const Doctor = require('../models/Doctor');  // ✅ Import Doctor Model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// 📌 Register a User (Patient)
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new User (Patient)
        const newUser = new User({ name, email, password: hashedPassword, phone });
        await newUser.save();

        res.status(201).json({ message: "Patient registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
};

// 📌 Register a Doctor
const registerDoctor = async (req, res) => {
    try {
        const { name, email, password, phone, specialization, experience } = req.body;

        // Check if email already exists
        const existingDoctor = await Doctor.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({ message: "Doctor email already in use" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new Doctor
        const newDoctor = new Doctor({
            name, email, password: hashedPassword, phone, specialization, experience
        });
        await newDoctor.save();

        res.status(201).json({ message: "Doctor registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error registering doctor", error });
    }
};

// 📌 Login for both User and Doctor
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login Attempt:", { email }); // Debugging

        // Try to find user in both collections
        let user = await User.findOne({ email });
        let role = "patient"; // Default role

        if (!user) {
            user = await Doctor.findOne({ email });
            role = "doctor";
        }

        if (!user) {
            console.log("User/Doctor not found in DB"); // Debugging
            return res.status(404).json({ message: "User/Doctor not found" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate token with the actual role from DB
        const token = jwt.sign(
            { id: user._id, role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role,
            token
        });
    } catch (error) {
        console.error("Login Error:", error); // Debugging
        res.status(500).json({ message: "Server error", error });
    }
};



// 📌 Get Profile (for both patients and doctors)
const getProfile = async (req, res) => {
    try {
        const { role } = req.user;

        let user;
        if (role === "doctor") {
            user = await Doctor.findById(req.user.id).select('-password');
        } else {
            user = await User.findById(req.user.id).select('-password');
        }

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { registerUser, registerDoctor, login, getProfile };
