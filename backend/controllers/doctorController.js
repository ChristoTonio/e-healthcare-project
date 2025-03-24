// doctorController.js

exports.getDoctorDashboard = (req, res) => {
    try {
        res.status(200).json({
            message: "Doctor dashboard accessed",
            doctor: req.user,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
