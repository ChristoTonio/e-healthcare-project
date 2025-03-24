const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const { createZoomMeeting } = require('../services/zoomService'); // Import Zoom function


// 📌 Create a new appointment
exports.createAppointment = async (req, res) => {
    try {
        const { patientId, doctorId, date, reason } = req.body;

        // Check if user and doctor exist
        const patient = await User.findById(patientId);
        const doctor = await Doctor.findById(doctorId);

        if (!patient || !doctor) {
            return res.status(404).json({ message: "Patient or Doctor not found" });
        }

        const newAppointment = new Appointment({
            patient: patientId,
            doctor: doctorId,
            date,
            reason
        });

        await newAppointment.save();
        res.status(201).json({ message: "Appointment booked successfully", newAppointment });

    } catch (error) {
        res.status(500).json({ message: "Error booking appointment", error: error.message });
    }
};

// 📌 Get all appointments (Admin or Doctor)
exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find().populate('patient doctor', 'name email');
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointments", error: error.message });
    }
};

// 📌 Get appointments for a specific patient
exports.getAppointmentsByPatient = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.params.patientId }).populate('doctor', 'name specialization');
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointments", error: error.message });
    }
};

// 📌 Get appointments for a specific doctor
exports.getAppointmentsByDoctor = async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor: req.params.doctorId }).populate('patient', 'name age');
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointments", error: error.message });
    }
};

// 📌 Update an appointment status (Generate Zoom Meeting if accepted)
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const appointment = await Appointment.findById(req.params.appointmentId).populate('doctor', 'name email');

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        appointment.status = status;

        // If appointment is accepted, create a Zoom meeting
        if (status === 'Accepted') {
            const doctorName = appointment.doctor.name;
            const meetingResponse = await createZoomMeeting(doctorName);

            if (meetingResponse.join_url) {
                appointment.zoomLink = meetingResponse.join_url; // Store Zoom link in database
            } else {
                return res.status(500).json({ message: "Failed to create Zoom meeting" });
            }
        }

        await appointment.save();
        res.status(200).json({ message: "Appointment status updated", appointment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating status", error: error.message });
    }
};

// 📌 Delete an appointment
exports.deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.appointmentId);

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        res.status(200).json({ message: "Appointment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting appointment", error: error.message });
    }
};
