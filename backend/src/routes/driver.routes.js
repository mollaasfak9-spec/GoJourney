const express = require("express");

const driverController = require("../controllers/driver.controller");
const driverValidator = require("../validators/driver.validator");
const rideValidator = require("../validators/ride.validator");

const { authMiddleware } = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");
const validate = require("../middleware/validation.middleware");
const { ROLES } = require("../utils/constants");

const router = express.Router();

// Every route below belongs to the driver role (BACKEND_PLAN.md sections 15-16, 23)
router.use(authMiddleware, requireRole(ROLES.DRIVER));

// ------------------------------------------
// Driver profile
// ------------------------------------------

// GET /api/drivers/me
router.get("/me", driverController.getMe);

// PATCH /api/drivers/me
router.patch("/me", validate("body", driverValidator.updateProfile), driverController.updateMe);

// PATCH /api/drivers/me/status
router.patch("/me/status", validate("body", driverValidator.updateStatus), driverController.updateStatus);

// PATCH /api/drivers/me/location
router.patch("/me/location", validate("body", driverValidator.updateLocation), driverController.updateLocation);

// ------------------------------------------
// Ride requests
// ------------------------------------------

// GET /api/drivers/me/ride-requests
router.get(
    "/me/ride-requests",
    validate("query", driverValidator.rideRequestsQuery),
    validate("query", rideValidator.historyQuery),
    driverController.getRideRequests
);

// GET /api/drivers/me/rides
router.get("/me/rides", validate("query", rideValidator.historyQuery), driverController.getMyRides);

// GET /api/drivers/me/earnings
router.get("/me/earnings", driverController.getEarnings);

// ------------------------------------------
// Vehicles
// ------------------------------------------

// POST /api/drivers/me/vehicles
router.post(
    "/me/vehicles",
    validate("body", driverValidator.createVehicle),
    driverController.addVehicle
);

// GET /api/drivers/me/vehicles
router.get("/me/vehicles", driverController.getVehicles);

// PATCH /api/drivers/me/vehicles/:vehicleId
router.patch(
    "/me/vehicles/:vehicleId",
    validate("params", driverValidator.vehicleIdParam),
    validate("body", driverValidator.updateVehicle),
    driverController.updateVehicle
);

// DELETE /api/drivers/me/vehicles/:vehicleId
router.delete(
    "/me/vehicles/:vehicleId",
    validate("params", driverValidator.vehicleIdParam),
    driverController.removeVehicle
);

module.exports = router;