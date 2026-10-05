/**
 * Wraps an async route handler so rejected promises reach the centralized
 * error middleware instead of crashing the process
 * (BACKEND_PLAN.md section 38).
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;