/**
 * Application error carrying an HTTP status code and a machine readable
 * error code (BACKEND_PLAN.md section 35).
 */
class ApiError extends Error {
    constructor(statusCode, message, code = "INTERNAL_ERROR", details = undefined) {
        super(message);

        this.name = "ApiError";
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message = "Bad request", code = "BAD_REQUEST", details) {
        return new ApiError(400, message, code, details);
    }

    static unauthorized(message = "Authentication required", code = "UNAUTHORIZED") {
        return new ApiError(401, message, code);
    }

    static forbidden(message = "Access denied", code = "FORBIDDEN") {
        return new ApiError(403, message, code);
    }

    static notFound(message = "Resource not found", code = "NOT_FOUND") {
        return new ApiError(404, message, code);
    }

    static conflict(message = "Resource already exists", code = "CONFLICT") {
        return new ApiError(409, message, code);
    }

    static unprocessable(message = "Validation failed", code = "VALIDATION_ERROR", details) {
        return new ApiError(422, message, code, details);
    }

    static tooManyRequests(message = "Too many requests", code = "RATE_LIMIT_EXCEEDED") {
        return new ApiError(429, message, code);
    }

    static serviceUnavailable(message = "Service temporarily unavailable", code = "SERVICE_UNAVAILABLE") {
        return new ApiError(503, message, code);
    }

    static internal(message = "Internal server error", code = "INTERNAL_ERROR") {
        return new ApiError(500, message, code);
    }
}

module.exports = ApiError;