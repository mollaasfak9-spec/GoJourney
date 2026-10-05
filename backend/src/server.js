const app = require("./app");
const connectDB = require("./config/db");
const env = require("./config/env");

// =========================
// Connect MongoDB
// BACKEND_PLAN.md section 6
// =========================
connectDB();

// =========================
// Start Server
// BACKEND_PLAN.md section 3
// =========================
const server = app.listen(env.PORT, () => {
    console.log(`🚀 RideX Server running on port ${env.PORT}`);
    console.log(`🌐 http://localhost:${env.PORT}`);
    console.log(`📡 Health check: http://localhost:${env.PORT}/api/health`);
});

// =========================
// Graceful Shutdown
// =========================
const shutdown = (signal) => {
    console.log(`\n${signal} received, shutting down gracefully`);

    server.close(() => {
        console.log("HTTP server closed");

        require("mongoose")
            .connection.close()
            .then(() => process.exit(0))
            .catch(() => process.exit(1));
    });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// Unhandled rejections must not leave the process in a broken state
process.on("unhandledRejection", (reason) => {
    console.error("❌ Unhandled rejection:", reason);
    shutdown("unhandledRejection");
});

module.exports = server;