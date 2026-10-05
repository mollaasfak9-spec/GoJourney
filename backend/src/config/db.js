const mongoose = require("mongoose");
const env = require("./env");

// MONGODB_URI may or may not already contain a database name
// (BACKEND_PLAN.md section 4). When it does not, DB_NAME is appended.
const buildConnectionUri = () => {
    const uri = env.MONGODB_URI;
    const hasDatabaseName = /\/[^/?]+(\?|$)/.test(uri.slice(uri.indexOf("//") + 2));

    return hasDatabaseName ? uri : `${uri.replace(/\/+$/, "")}/${env.DB_NAME}`;
};

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(buildConnectionUri());

        console.log(`MongoDB connected: ${connection.connection.host}/${connection.connection.name}`);

        return connection;
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);

        process.exit(1);
    }
};

module.exports = connectDB;