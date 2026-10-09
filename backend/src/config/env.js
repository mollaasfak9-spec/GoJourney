const dotenv = require("dotenv");

// Load .env file
dotenv.config();

const env = {
    PORT: process.env.PORT || 5000,

    NODE_ENV: process.env.NODE_ENV || "development",

    MONGODB_URI: process.env.MONGODB_URI,

    DB_NAME: process.env.DB_NAME || "ridex",

    JWT_SECRET: process.env.JWT_SECRET,

    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

    // Used by CORS (BACKEND_PLAN.md section 4)
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",

    // bcrypt
    BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,

    // Rate limiting (BACKEND_PLAN.md section 39)
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX, 10) || 300,
    AUTH_RATE_LIMIT_MAX: parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10) || 20,

    // How far a driver may be from the pickup to be dispatched (section 43)
    SEARCH_RADIUS_KM: parseFloat(process.env.SEARCH_RADIUS_KM) || 5,

    // ==========================================
    // Maps / geocoding / routing (OpenStreetMap stack)
    // ==========================================
    // Public Nominatim and OSRM demo servers are free but have usage policies,
    // so they are fronted by the backend proxy in services/maps.service.js and
    // are rate limited. Point these at a self-hosted instance in production.
    NOMINATIM_BASE_URL: process.env.NOMINATIM_BASE_URL || "https://nominatim.openstreetmap.org",
    OSRM_BASE_URL: process.env.OSRM_BASE_URL || "https://router.project-osrm.org",

    // Nominatim's usage policy requires a descriptive User-Agent / Referer.
    GEOCODER_USER_AGENT:
        process.env.GEOCODER_USER_AGENT || "RideX-AXION/1.0 (educational ride-booking project)",

    // Hard timeout for every external maps call so a slow provider cannot hang
    // a request. Falls back to the offline approximation when it trips.
    EXTERNAL_API_TIMEOUT_MS: parseInt(process.env.EXTERNAL_API_TIMEOUT_MS, 10) || 7000,

    // Escape hatches: disable when working offline. Routing falls back to a
    // clearly-labelled straight-line approximation instead of failing.
    GEOCODING_ENABLED: process.env.GEOCODING_ENABLED !== "false",
    ROUTING_ENABLED: process.env.ROUTING_ENABLED !== "false",

    // Minutes between two distinct pickup/destination points. Anything closer
    // is treated as "the same place" and rejected.
    MIN_TRIP_DISTANCE_KM: parseFloat(process.env.MIN_TRIP_DISTANCE_KM) || 0.05
};

// Required environment variables
const required = ["MONGODB_URI", "JWT_SECRET"];

const missing = required.filter((key) => !env[key]);

if (missing.length > 0) {
    console.error(`❌ Missing environment variables in .env: ${missing.join(", ")}`);
    process.exit(1);
}

if (env.NODE_ENV === "production" && env.JWT_SECRET === "change_me") {
    console.error("❌ JWT_SECRET must be changed before running in production");
    process.exit(1);
}

env.isProduction = env.NODE_ENV === "production";

module.exports = env;