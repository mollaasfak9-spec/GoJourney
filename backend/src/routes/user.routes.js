const express = require("express");

const userController = require("../controllers/user.controller");
const userValidator = require("../validators/user.validator");

const { authMiddleware } = require("../middleware/auth.middleware");
const validate = require("../middleware/validation.middleware");

const router = express.Router();

router.use(authMiddleware);

// GET /api/users/me
router.get("/me", userController.getMe);

// PATCH /api/users/me
router.patch("/me", validate("body", userValidator.updateProfile), userController.updateMe);

// PATCH /api/users/me/password
router.patch(
    "/me/password",
    validate("body", userValidator.changePassword),
    userController.changePassword
);

// DELETE /api/users/me
router.delete("/me", userController.deactivateMe);

module.exports = router;