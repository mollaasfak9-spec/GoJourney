/**
 * Boots an isolated in-memory MongoDB and runs the smoke suite against it.
 *
 *   npm test
 *
 * Set MONGODB_URI to reuse a real MongoDB instance instead.
 */
const start = async () => {
    let memoryServer;

    if (!process.env.MONGODB_URI) {
        const { MongoMemoryServer } = require("mongodb-memory-server");

        memoryServer = await MongoMemoryServer.create();

        process.env.MONGODB_URI = memoryServer.getUri();
    }

    process.env.NODE_ENV = "test";

    const mongoose = require("mongoose");

    await mongoose.connect(process.env.MONGODB_URI);

    require("./smoke.test");

    process.on("exit", () => {
        if (memoryServer) {
            memoryServer.stop();
        }
    });
};

start().catch((error) => {
    console.error("Failed to start the test harness:", error);
    process.exit(1);
});