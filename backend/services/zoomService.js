const axios = require('axios');
const qs = require('qs');
require('dotenv').config();

const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID;
const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;
const ZOOM_BASE_URL = process.env.ZOOM_BASE_URL;

// Function to get Zoom OAuth Access Token
const getZoomAccessToken = async () => {
    try {
        const tokenResponse = await axios.post(
            `https://zoom.us/oauth/token`,
            qs.stringify({ grant_type: 'account_credentials', account_id: ZOOM_ACCOUNT_ID }),
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        return tokenResponse.data.access_token;
    } catch (error) {
        console.error("Error fetching Zoom access token:", error.response?.data || error.message);
        return null;
    }
};

// Function to create a Zoom meeting
const createZoomMeeting = async (hostName) => {
    try {
        const accessToken = await getZoomAccessToken();
        if (!accessToken) {
            throw new Error("Failed to get Zoom access token");
        }

        const meetingResponse = await axios.post(
            `${ZOOM_BASE_URL}/users/me/meetings`,
            {
                topic: `Consultation with ${hostName}`,
                type: 2, // Scheduled meeting
                start_time: new Date().toISOString(),
                duration: 30, // 30-minute consultation
                timezone: "Asia/Kuala_Lumpur",
                agenda: "Patient Consultation",
                settings: {
                    host_video: true,
                    participant_video: true,
                    join_before_host: false,
                    mute_upon_entry: true,
                    waiting_room: true
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return meetingResponse.data; // Contains meeting link
    } catch (error) {
        console.error("Error creating Zoom meeting:", error.response?.data || error.message);
        return null;
    }
};

module.exports = { createZoomMeeting };
