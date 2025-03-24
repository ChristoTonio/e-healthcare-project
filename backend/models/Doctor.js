const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    specialization: { type: String, required: true },  // ✅ Doctors have specialization
    experience: { type: Number, required: true },      // ✅ Optional field for experience
}, { timestamps: true });

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
