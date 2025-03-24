const axios = require("axios");
const { getZoomAccessToken } = require("../config/zoomService");

async function createZoomMeeting(req, res) {
  try {
    const accessToken = await getZoomAccessToken();

    const response = await axios.post(
      `${process.env.ZOOM_BASE_URL}/users/me/meetings`,
      {
        topic: "Doctor Consultation",
        type: 2, // Scheduled Meeting
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

    res.json({ join_url: response.data.join_url, start_url: response.data.start_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { createZoomMeeting };
