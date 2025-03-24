const generateZoomToken = require('./zoomToken');
require('dotenv').config({ path: '../.env' });  // Ensure it loads the correct .env

console.log("🔍 Checking Zoom credentials...");
console.log("ZOOM_CLIENT_ID:", process.env.ZOOM_CLIENT_ID);
console.log("ZOOM_CLIENT_SECRET:", process.env.ZOOM_CLIENT_SECRET);
console.log("ZOOM_ACCOUNT_ID:", process.env.ZOOM_ACCOUNT_ID);

(async () => {
  try {
    const token = await generateZoomToken();
    console.log("✅ Successfully retrieved Zoom token:", token);
  } catch (error) {
    console.error("❌ Failed to retrieve Zoom token:", error.message);
  }
})();
