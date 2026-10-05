const ApiError = require("../utils/ApiError");

/**
 * Runs a validator from src/validators against a request location and throws a
 * single 422 error listing every issue (BACKEND_PLAN.md sections 36-37).
 *
 * Usage:
 *   router.post("/", validate("body", authValidator.register), controller)
 */
const validate = (location, validatorFn) => {
    if (typeof validatorFn !== "function") {
        throw new Error("validate() requires a validator function");
    }

    return (req, res, next) => {
        try {
            const result = validatorFn(req[location] || {});

            if (result && result.isValid === false) {
                throw ApiError.unprocessable(
                    "Validation failed",
                    "VALIDATION_ERROR",
                    result.issues
                );
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = validate;
module.exports.validate = validate;