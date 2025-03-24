const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: Date, required: true },
    reason: { type: String },
    status: { type: String, enum: ['Pending', 'Accepted', 'Cancelled'], default: 'Pending' },
    zoomLink: { type: String } // New field to store Zoom meeting link
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
