const express = require("express");

const {
    getProfile,
    updateProfile
} = require("../controllers/user.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Get logged-in user profile
router.get("/profile", authMiddleware, getProfile);

// Update logged-in user profile
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;