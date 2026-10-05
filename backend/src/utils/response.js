/**
 * Standardized response helpers
 * (BACKEND_PLAN.md section 35).
 */

const success = (res, { statusCode = 200, message = "Request successful", data, pagination } = {}) => {
    const body = {
        success: true,
        message,
        data: data === undefined ? null : data
    };

    if (pagination) {
        body.pagination = pagination;
    }

    return res.status(statusCode).json(body);
};

const created = (res, { message = "Created successfully", data } = {}) =>
    success(res, { statusCode: 201, message, data });

const failure = (res, { statusCode = 400, message = "Request failed", code = "BAD_REQUEST", details } = {}) =>
    res.status(statusCode).json({
        success: false,
        message,
        error: {
            code,
            ...(details ? { details } : {})
        }
    });

module.exports = { success, created, failure };