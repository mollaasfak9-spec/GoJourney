const env = require("../config/env");
const { failure } = require("../utils/response");

/**
 * Centralized error handler (BACKEND_PLAN.md sections 35 and 38).
 *
 * Controllers throw ApiError, everything else is translated here so responses
 * always look like:
 *   { success: false, message, error: { code } }
 */
const notFoundHandler = (req, res) =>
    failure(res, {
        statusCode: 404,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
        code: "ROUTE_NOT_FOUND"
    });

const errorMiddleware = (err, req, res, next) => {
    // Let Express handle its own cases (headers already sent, etc.)
    if (res.headersSent) {
        return next(err);
    }

    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal server error";
    let code = err.code && typeof err.code === "string" ? err.code : "INTERNAL_ERROR";
    let details = err.details;

    // Mongoose schema validation
    if (err.name === "ValidationError" && err.errors) {
        statusCode = 422;
        code = "VALIDATION_ERROR";
        details = Object.values(err.errors).map((issue) => ({
            field: issue.path,
            message: issue.message,
            location: "body"
        }));
        message = details.map((issue) => issue.message).join(", ");
    }

    // Invalid ObjectId in a path or body
    if (err.name === "CastError") {
        statusCode = 400;
        code = "INVALID_ID";
        message = `Invalid value for ${err.path}`;
    }

    // Duplicate key
    if (err.code === 11000) {
        statusCode = 409;
        code = "DUPLICATE_RESOURCE";

        const field = Object.keys(err.keyValue || {})[0];

        message = field
            ? `A record with this ${field} already exists`
            : "A record with these values already exists";
    }

    // Body parser rejected the payload
    if (err.type === "entity.parse.failed") {
        statusCode = 400;
        code = "INVALID_JSON";
        message = "Request body must be valid JSON";
    }

    if (statusCode >= 500) {
        // Log server side only, never leak internals to the client
        console.error(`❌ [${req.method} ${req.originalUrl}]`, err);

        if (!env.isProduction) {
            details = details || err.stack;
        } else {
            message = "Internal server error";
            details = undefined;
        }
    }

    return failure(res, { statusCode, message, code, details });
};

module.exports = errorMiddleware;
module.exports.errorMiddleware = errorMiddleware;
module.exports.notFoundHandler = notFoundHandler;