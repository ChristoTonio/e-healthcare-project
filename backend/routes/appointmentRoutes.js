const express = require('express');
const { createAppointment, getAllAppointments, getAppointmentsByPatient, getAppointmentsByDoctor, updateAppointmentStatus, deleteAppointment } = require('../controllers/appointmentController');
const { protect } = require("../middleware/authMiddleware"); // ✅ Correct import
const router = express.Router();

// 📌 Create an appointment
router.post('/book', protect, createAppointment);

// 📌 Get all appointments (Admin only)
router.get("/all", protect, getAllAppointments); // ✅ Use "protect" instead of authMiddleware

// 📌 Get appointments by patient
router.get('/patient/:patientId', protect, getAppointmentsByPatient);

// 📌 Get appointments by doctor
router.get('/doctor/:doctorId', protect, getAppointmentsByDoctor);

// 📌 Update appointment status
router.put('/update/:appointmentId', protect, updateAppointmentStatus);

// 📌 Delete an appointment
router.delete('/delete/:appointmentId', protect, deleteAppointment);

module.exports = router;
