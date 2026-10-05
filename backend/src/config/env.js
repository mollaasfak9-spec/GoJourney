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
    SEARCH_RADIUS_KM: parseFloat(process.env.SEARCH_RADIUS_KM) || 5
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