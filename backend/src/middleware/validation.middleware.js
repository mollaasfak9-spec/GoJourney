const validationMiddleware = (schema) => {

    return (req, res, next) => {

        try {

            if (!schema || typeof schema !== "function") {
                return next();
            }

            const result = schema(req.body);

            if (result !== true) {
                return res.status(400).json({
                    success: false,
                    message: result || "Validation failed"
                });
            }

            next();

        } catch (error) {
            next(error);
        }
    };
};

module.exports = validationMiddleware;