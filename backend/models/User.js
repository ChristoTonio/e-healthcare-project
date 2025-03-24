const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { 
        type: String, 
        enum: ['patient'],  // ✅ Define allowed roles
        default: 'patient' // ✅ Default role is 'patient'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
