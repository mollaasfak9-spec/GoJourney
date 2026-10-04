const dotenv = require("dotenv");

// Load .env file
dotenv.config();

const env = {
    PORT: process.env.PORT || 8000,

    NODE_ENV: process.env.NODE_ENV || "development",

    MONGODB_URI: process.env.MONGODB_URI,

    JWT_SECRET: process.env.JWT_SECRET,

    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d"
};

// Required environment variables
if (!env.MONGODB_URI) {
    console.error("❌ MONGODB_URI is missing in .env file");
    process.exit(1);
}

if (!env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is missing in .env file");
    process.exit(1);
}

module.exports = env;