const express = require('express');
const { createAppointment, getAllAppointments, getAppointmentsByPatient, getAppointmentsByDoctor, updateAppointmentStatus, deleteAppointment } = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// 📌 Create an appointment
router.post('/book', authMiddleware, createAppointment);

// 📌 Get all appointments (Admin only)
router.get('/all', authMiddleware, getAllAppointments);

// 📌 Get appointments by patient
router.get('/patient/:patientId', authMiddleware, getAppointmentsByPatient);

// 📌 Get appointments by doctor
router.get('/doctor/:doctorId', authMiddleware, getAppointmentsByDoctor);

// 📌 Update appointment status
router.put('/update/:appointmentId', authMiddleware, updateAppointmentStatus);

// 📌 Delete an appointment
router.delete('/delete/:appointmentId', authMiddleware, deleteAppointment);

module.exports = router;
