const express = require("express");
const axios = require("axios");
const getZoomAccessToken = require("../utils/zoomToken");

const router = express.Router(); // ✅ Ensure correct Router instance

// Create a Zoom Meeting
router.post("/create-meeting", async (req, res) => {
  try {
    const accessToken = await getZoomAccessToken();

    const response = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic: "Doctor Consultation",
        type: 2,
        start_time: new Date().toISOString(),
        duration: 30,
        timezone: "Asia/Kuala_Lumpur",
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      meetingID: response.data.id,
      start_url: response.data.start_url,
      join_url: response.data.join_url,
    });

  } catch (error) {
    console.error("Zoom API Error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

module.exports = router; // ✅ Ensure proper export
