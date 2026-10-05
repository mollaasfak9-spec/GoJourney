const express = require("express");

const authController = require("../controllers/auth.controller");
const authValidator = require("../validators/auth.validator");

const { authMiddleware, optionalAuthMiddleware } = require("../middleware/auth.middleware");
const { authRateLimiter } = require("../middleware/rateLimit.middleware");
const validate = require("../middleware/validation.middleware");

const router = express.Router();

// POST /api/auth/register
router.post(
    "/register",
    authRateLimiter,
    validate("body", authValidator.register),
    authController.register
);

// POST /api/auth/login
router.post(
    "/login",
    authRateLimiter,
    validate("body", authValidator.login),
    authController.login
);

// GET /api/auth/me  (protected)
router.get("/me", authMiddleware, authController.getCurrentUser);

// POST /api/auth/logout
router.post("/logout", optionalAuthMiddleware, authController.logout);

module.exports = router;