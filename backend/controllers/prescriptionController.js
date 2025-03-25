const Prescription = require("../models/Prescription");
const path = require("path");
const fs = require("fs");

// Upload prescription (Doctor only)
exports.uploadPrescription = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const { doctorId, patientId } = req.body;

        const newPrescription = new Prescription({
            doctor: doctorId,
            patient: patientId,
            prescriptionFile: req.file.path, // Store file path
        });

        await newPrescription.save();

        res.status(201).json({ message: "Prescription uploaded successfully", prescription: newPrescription });
    } catch (error) {
        res.status(500).json({ message: "Error uploading prescription", error: error.message });
    }
};

// Get prescriptions for a specific patient
exports.getPrescriptionsByPatient = async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ patient: req.params.patientId }).populate("doctor", "name");
        res.status(200).json(prescriptions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching prescriptions", error: error.message });
    }
};

// Download prescription
exports.downloadPrescription = async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id);
        if (!prescription) {
            return res.status(404).json({ message: "Prescription not found" });
        }

        const filePath = path.join(__dirname, "..", prescription.prescriptionFile);
        res.download(filePath);
    } catch (error) {
        res.status(500).json({ message: "Error downloading prescription", error: error.message });
    }
};
