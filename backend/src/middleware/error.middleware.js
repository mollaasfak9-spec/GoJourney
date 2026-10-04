const errorMiddleware = (err, req, res, next) => {

    console.error("❌ Error:", err);

    // Default values
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Mongoose validation error
    if (err.name === "ValidationError") {
        statusCode = 400;

        const messages = Object.values(err.errors).map(
            error => error.message
        );

        message = messages.join(", ");
    }

    // Mongoose CastError
    if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // MongoDB duplicate key error
    if (err.code === 11000) {
        statusCode = 409;

        const field = Object.keys(err.keyValue)[0];

        message = `${field} already exists`;
    }

    // JWT error
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid authentication token";
    }

    // JWT expired
    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Authentication token has expired";
    }

    res.status(statusCode).json({
        success: false,
        message
    });
};

module.exports = errorMiddleware;