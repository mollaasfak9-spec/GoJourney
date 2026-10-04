const app = require("./app");
const connectDB = require("./config/db");
const env = require("./config/env");

// =========================
// Connect MongoDB
// =========================
connectDB();

// =========================
// Start Server
// =========================
app.listen(env.PORT, () => {
    console.log(`🚀 RideX Server running on port ${env.PORT}`);
    console.log(`🌐 http://localhost:${env.PORT}`);
});