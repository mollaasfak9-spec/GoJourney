const express = require("express");

const {
    getDriverProfile,
    updateDriverProfile,
    updateDriverStatus
} = require("../controllers/driver.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Driver profile
router.get("/profile", authMiddleware, getDriverProfile);

// Update driver profile
router.put("/profile", authMiddleware, updateDriverProfile);

// Online / Offline status
router.put("/status", authMiddleware, updateDriverStatus);

module.exports = router;