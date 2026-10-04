const express = require("express");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const driverRoutes = require("./routes/driver.routes");
const rideRoutes = require("./routes/ride.routes");
const paymentRoutes = require("./routes/payment.routes");
const adminRoutes = require("./routes/admin.routes");

const errorMiddleware = require("./middleware/error.middleware");

const app = express();

// ==========================================
// Built-in Middleware
// ==========================================

// Parse JSON request body
app.use(express.json());

// Parse URL-encoded request body
app.use(express.urlencoded({ extended: true }));


// ==========================================
// Health / Test Route
// ==========================================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "RideX API is running"
    });
});


// ==========================================
// API Routes
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/drivers", driverRoutes);

app.use("/api/rides", rideRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/admin", adminRoutes);


// ==========================================
// 404 Handler
// ==========================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});


// ==========================================
// Global Error Handler
// ==========================================

app.use(errorMiddleware);


// ==========================================
// Export App
// ==========================================

module.exports = app;