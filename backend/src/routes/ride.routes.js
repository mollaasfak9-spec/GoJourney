const express = require("express");

const rideController = require("../controllers/ride.controller");
const rideValidator = require("../validators/ride.validator");

const { authMiddleware } = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");
const validate = require("../middleware/validation.middleware");
const { ROLES } = require("../utils/constants");

const router = express.Router();

router.use(authMiddleware);

// ==========================================
// Fare estimate
// BACKEND_PLAN.md section 18
// ==========================================
router.post(
    "/fare-estimate",
    validate("body", rideValidator.fareEstimate),
    rideController.getFareEstimate
);

// ==========================================
// Ride booking, passenger only
// BACKEND_PLAN.md section 19
// ==========================================
router.post(
    "/",
    requireRole(ROLES.PASSENGER),
    validate("body", rideValidator.createRide),
    rideController.createRide
);

// ==========================================
// History and active ride
// BACKEND_PLAN.md sections 21
// ==========================================
router.get(
    "/history",
    requireRole(ROLES.PASSENGER),
    validate("query", rideValidator.historyQuery),
    rideController.getRideHistory
);

router.get(
    "/active",
    requireRole(ROLES.PASSENGER),
    rideController.getActiveRide
);

// ==========================================
// Ride details
// BACKEND_PLAN.md section 20
// ==========================================
router.get(
    "/:rideId",
    validate("params", rideValidator.rideIdParam),
    rideController.getRide
);

// ==========================================
// Ride lifecycle
// BACKEND_PLAN.md sections 22-29
// ==========================================

// PATCH /api/rides/:rideId/cancel
router.patch(
    "/:rideId/cancel",
    validate("params", rideValidator.rideIdParam),
    validate("body", rideValidator.cancelRide),
    rideController.cancelRide
);

// PATCH /api/rides/:rideId/accept
router.patch(
    "/:rideId/accept",
    requireRole(ROLES.DRIVER),
    validate("params", rideValidator.rideIdParam),
    rideController.acceptRide
);

// PATCH /api/rides/:rideId/reject
router.patch(
    "/:rideId/reject",
    requireRole(ROLES.DRIVER),
    validate("params", rideValidator.rideIdParam),
    validate("body", rideValidator.rejectRide),
    rideController.rejectRide
);

// PATCH /api/rides/:rideId/arriving
router.patch(
    "/:rideId/arriving",
    requireRole(ROLES.DRIVER),
    validate("params", rideValidator.rideIdParam),
    rideController.markArriving
);

// PATCH /api/rides/:rideId/arrived
router.patch(
    "/:rideId/arrived",
    requireRole(ROLES.DRIVER),
    validate("params", rideValidator.rideIdParam),
    rideController.markArrived
);

// PATCH /api/rides/:rideId/start
router.patch(
    "/:rideId/start",
    requireRole(ROLES.DRIVER),
    validate("params", rideValidator.rideIdParam),
    rideController.startRide
);

// PATCH /api/rides/:rideId/complete
router.patch(
    "/:rideId/complete",
    requireRole(ROLES.DRIVER),
    validate("params", rideValidator.rideIdParam),
    rideController.completeRide
);

// ==========================================
// Rating
// BACKEND_PLAN.md section 33
// ==========================================
router.post(
    "/:rideId/rating",
    requireRole(ROLES.PASSENGER),
    validate("params", rideValidator.rideIdParam),
    validate("body", rideValidator.createRating),
    rideController.rateRide
);

router.get(
    "/:rideId/rating",
    validate("params", rideValidator.rideIdParam),
    rideController.getRideRating
);

module.exports = router;