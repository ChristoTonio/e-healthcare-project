const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { uploadPrescription, getPrescriptionsByPatient, downloadPrescription } = require("../controllers/prescriptionController");

// Route to upload prescription (Doctor only)
router.post("/upload", upload.single("prescriptionFile"), uploadPrescription);

// Route to get prescriptions for a patient
router.get("/patient/:patientId", getPrescriptionsByPatient);

// Route to download prescription
router.get("/download/:id", downloadPrescription);

module.exports = router;
