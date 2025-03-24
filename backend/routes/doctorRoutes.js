const express = require("express");
const { protect } = require("../middleware/authMiddleware"); // ✅ Import middleware
const { getDoctorDashboard } = require("../controllers/doctorController"); // ✅ Import controller

const router = express.Router();

router.get("/dashboard", protect, getDoctorDashboard); // ✅ Correct route setup

module.exports = router;
