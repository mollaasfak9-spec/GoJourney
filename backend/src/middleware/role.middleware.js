const ApiError = require("../utils/ApiError");
const { ROLES_LIST } = require("../utils/constants");

/**
 * requireRole("admin") / requireRole("driver") / requireRole("passenger")
 * (BACKEND_PLAN.md section 13)
 *
 * The backend is the security boundary, frontend route protection is not.
 */
const requireRole = (...allowedRoles) => {
    const roles = allowedRoles.flat();

    roles.forEach((role) => {
        if (!ROLES_LIST.includes(role)) {
            throw new Error(`Unknown role passed to requireRole: ${role}`);
        }
    });

    return (req, res, next) => {
        if (!req.user) {
            return next(ApiError.unauthorized("Authentication required", "TOKEN_REQUIRED"));
        }

        if (!roles.includes(req.user.role)) {
            return next(
                ApiError.forbidden(
                    `This action is restricted to: ${roles.join(", ")}`,
                    "INSUFFICIENT_ROLE"
                )
            );
        }

        next();
    };
};

module.exports = requireRole;
module.exports.requireRole = requireRole;