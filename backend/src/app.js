const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const env = require("./config/env");

const { success } = require("./utils/response");
const { apiRateLimiter } = require("./middleware/rateLimit.middleware");
const { notFoundHandler, errorMiddleware } = require("./middleware/error.middleware");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const driverRoutes = require("./routes/driver.routes");
const rideRoutes = require("./routes/ride.routes");
const paymentRoutes = require("./routes/payment.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

// ==========================================
// Security Middleware
// BACKEND_PLAN.md section 39
// ==========================================

app.set("trust proxy", 1);

app.use(helmet());

app.use(
    cors({
        origin: env.CLIENT_URL.split(",").map((origin) => origin.trim()),
        credentials: true,
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"]
    })
);

// ==========================================
// Body / Logging Middleware
// ==========================================

app.use(express.json({ limit: "1mb" }));

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// The body parsers leave req.body undefined when a request has no body and no
// matching Content-Type header, which breaks handlers that destructure it.
app.use((req, res, next) => {
    if (req.body === undefined) {
        req.body = {};
    }

    next();
});

if (!env.isProduction) {
    app.use(morgan("dev"));
} else {
    app.use(morgan("combined"));
}

// ==========================================
// Health Endpoint
// BACKEND_PLAN.md section 5
// ==========================================

const healthHandler = (req, res) => {
    const dbStates = ["disconnected", "connected", "connecting", "disconnecting"];
    const dbState = dbStates[mongoose.connection.readyState] || "unknown";

    return success(res, {
        message: "RideX API is running",
        data: {
            status: "ok",
            environment: env.NODE_ENV,
            database: dbState,
            uptime: Math.round(process.uptime())
        }
    });
};

app.get("/api/health", healthHandler);

// Convenience alias so GET / works too
app.get("/", healthHandler);

// Rate limit the whole API surface (BACKEND_PLAN.md section 39)
app.use("/api", apiRateLimiter);

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

app.use(notFoundHandler);

// ==========================================
// Global Error Handler
// ==========================================

app.use(errorMiddleware);

module.exports = app;