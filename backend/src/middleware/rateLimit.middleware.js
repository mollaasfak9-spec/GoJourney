const { rateLimit } = require("express-rate-limit");

const env = require("../config/env");
const ApiError = require("../utils/ApiError");

/**
 * Rate limiting (BACKEND_PLAN.md sections 1 and 39).
 *
 * Limiters must be created while the app is being initialised, never inside a
 * request handler.
 */
const createRateLimiter = ({ windowMs, max, message, code }) =>
    rateLimit({
        windowMs,
        max,
        standardHeaders: "draft-7",
        legacyHeaders: false,
        skip: () => env.NODE_ENV === "test",
        handler: (req, res, next) =>
            next(
                ApiError.tooManyRequests(
                    message || "Too many requests, please try again later",
                    code || "RATE_LIMIT_EXCEEDED"
                )
            )
    });

// Applied to the whole /api surface
const apiRateLimiter = createRateLimiter({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
    message: "Too many requests, please try again later"
});

// Stricter limit for credential endpoints to slow down brute force
const authRateLimiter = createRateLimiter({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.AUTH_RATE_LIMIT_MAX,
    message: "Too many authentication attempts, please try again later",
    code: "AUTH_RATE_LIMIT_EXCEEDED"
});

module.exports = {
    apiRateLimiter,
    authRateLimiter,
    createRateLimiter
};