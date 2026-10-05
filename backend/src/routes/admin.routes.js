const express = require("express");

const adminController = require("../controllers/admin.controller");
const adminValidator = require("../validators/admin.validator");
const userValidator = require("../validators/user.validator");
const driverValidator = require("../validators/driver.validator");
const rideValidator = require("../validators/ride.validator");

const { authMiddleware } = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");
const validate = require("../middleware/validation.middleware");
const { ROLES } = require("../utils/constants");

const router = express.Router();

// Every admin route requires a valid token and the admin role
// (BACKEND_PLAN.md sections 13 and 34)
router.use(authMiddleware, requireRole(ROLES.ADMIN));

// ------------------------------------------
// Dashboard
// ------------------------------------------
router.get("/dashboard", adminController.getDashboard);

// ------------------------------------------
// Users
// ------------------------------------------
router.get("/users", validate("query", adminValidator.usersQuery), adminController.getUsers);

router.get(
    "/users/:id",
    validate("params", adminValidator.idParam),
    adminController.getUserById
);

router.patch(
    "/users/:id/status",
    validate("params", adminValidator.idParam),
    validate("body", userValidator.updateStatus),
    adminController.updateUserStatus
);

// ------------------------------------------
// Drivers
// ------------------------------------------
router.get(
    "/drivers",
    validate("query", driverValidator.adminDriversQuery),
    adminController.getDrivers
);

router.get(
    "/drivers/:id",
    validate("params", driverValidator.idParam),
    adminController.getDriverById
);

router.patch(
    "/drivers/:id/verify",
    validate("params", driverValidator.idParam),
    validate("body", driverValidator.verifyDriver),
    adminController.verifyDriver
);

router.patch(
    "/drivers/:id/status",
    validate("params", driverValidator.idParam),
    validate("body", driverValidator.updateAdminDriverStatus),
    adminController.updateDriverStatus
);

// ------------------------------------------
// Rides
// ------------------------------------------
router.get(
    "/rides",
    validate("query", rideValidator.adminRidesQuery),
    adminController.getRides
);

router.get(
    "/rides/:id",
    validate("params", adminValidator.idParam),
    adminController.getRideById
);

// ------------------------------------------
// Payments
// ------------------------------------------
router.get(
    "/payments",
    validate("query", adminValidator.paymentsQuery),
    adminController.getPayments
);

module.exports = router;