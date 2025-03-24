const axios = require('axios');
require('dotenv').config();  // Load .env variables

const CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;
const ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID;

if (!CLIENT_ID || !CLIENT_SECRET || !ACCOUNT_ID) {
  console.error("❌ Missing Zoom credentials in .env. Check your configuration.");
  process.exit(1);
}

const generateZoomToken = async () => {
  const zoomAuthUrl = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${ACCOUNT_ID}`;

  try {
    console.log("🔄 Requesting Zoom Access Token...");
    
    const response = await axios.post(zoomAuthUrl, null, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log("✅ Zoom Access Token:", response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    console.error("❌ Error getting Zoom access token:", error.response?.data || error.message);

    if (error.response) {
      console.error("📌 Response Status:", error.response.status);
      console.error("📌 Response Data:", error.response.data);
    } else if (error.request) {
      console.error("📌 No response received from Zoom API. Check your internet connection.");
    } else {
      console.error("📌 Request Error:", error.message);
    }

    throw new Error("Failed to get Zoom access token");
  }
};

module.exports = generateZoomToken;
