require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const axios = require('axios');
const generateZoomToken = require('./zoomToken'); // Import your dynamic token generator function

(async () => {
  try {
    console.log("🔄 Generating Zoom Access Token...");
    const zoomAccessToken = await generateZoomToken(); // Dynamically fetch the token

    if (!zoomAccessToken) {
      throw new Error("Zoom access token is missing.");
    }

    console.log("✅ Token generated successfully! Token:", zoomAccessToken); // DEBUG: Print Token

    console.log("🔍 Testing Zoom API...");
    const response = await axios.get("https://api.zoom.us/v2/users/me", {
      headers: {
        Authorization: `Bearer ${zoomAccessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Zoom API Response:", response.data);
  } catch (error) {
    console.error("❌ Error calling Zoom API:", error.response ? error.response.data : error.message);
  }
})();
