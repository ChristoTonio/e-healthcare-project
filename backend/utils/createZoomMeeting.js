const axios = require('axios');
const generateZoomToken = require('./zoomToken');  // Import the function to get Zoom token

const createZoomMeeting = async (doctorEmail, meetingTime) => {
  try {
    // Step 1: Get access token from Zoom
    const accessToken = await generateZoomToken();

    // Step 2: Prepare meeting data
    const meetingData = {
      topic: `Appointment with Dr. ${doctorEmail}`,
      type: 2,  // 2 means a scheduled meeting
      start_time: meetingTime,  // ISO 8601 format, e.g., '2025-03-25T10:00:00Z'
      duration: 30,  // Duration in minutes
      timezone: 'Asia/Kuala_Lumpur',  // Your timezone
      agenda: 'Health Consultation'  // Optional agenda, can be customized
    };

    // Step 3: Send API request to Zoom to create the meeting
    const response = await axios.post('https://api.zoom.us/v2/users/me/meetings', meetingData, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,  // Use OAuth token
        'Content-Type': 'application/json',
      }
    });

    // Step 4: Return the meeting link
    return response.data.join_url;
  } catch (error) {
    console.error('Error creating Zoom meeting:', error.message);
    throw new Error('Failed to create Zoom meeting');
  }
};

module.exports = createZoomMeeting;
