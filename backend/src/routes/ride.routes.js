const express = require("express");

const {
    createRide,
    getRide,
    getMyRides,
    cancelRide,
    updateRideStatus
} = require("../controllers/ride.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Create a new ride
router.post("/", authMiddleware, createRide);

// Get single ride
router.get("/:id", authMiddleware, getRide);

// Get logged-in user's rides
router.get("/", authMiddleware, getMyRides);

// Cancel ride
router.put("/:id/cancel", authMiddleware, cancelRide);

// Update ride status
router.put("/:id/status", authMiddleware, updateRideStatus);

module.exports = router;