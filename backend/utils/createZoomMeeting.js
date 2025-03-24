const axios = require('axios');
const generateZoomToken = require('./zoomToken');  // Import the function to generate a Zoom access token

const createZoomMeeting = async (doctorEmail, appointmentDate, appointmentTime) => {
  try {
    // Step 1: Get access token from Zoom
    const accessToken = await generateZoomToken();

    // Step 2: Prepare meeting start time in ISO format
    const startTime = new Date(`${appointmentDate}T${appointmentTime}:00Z`).toISOString();

    // Step 3: Prepare meeting data
    const meetingData = {
      topic: `Appointment with Dr. ${doctorEmail}`,
      type: 2,  // 2 = scheduled meeting
      start_time: startTime,  // Zoom requires ISO 8601 format
      duration: 30,  // Duration in minutes
      timezone: 'Asia/Kuala_Lumpur',  // Set according to your region
      agenda: 'Doctor-Patient Consultation',
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        mute_upon_entry: true,
        approval_type: 0,  // No manual approval required
        waiting_room: true,
      }
    };

    // Step 4: Make API request to Zoom
    const response = await axios.post('https://api.zoom.us/v2/users/me/meetings', meetingData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    });

    // Step 5: Return meeting details
    return {
      meetingId: response.data.id,
      joinUrl: response.data.join_url,
      startUrl: response.data.start_url,
    };

  } catch (error) {
    console.error('❌ Error creating Zoom meeting:', error.response ? error.response.data : error.message);
    throw new Error('Failed to create Zoom meeting.');
  }
};

module.exports = createZoomMeeting;
