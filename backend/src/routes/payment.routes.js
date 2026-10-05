const express = require("express");

const paymentController = require("../controllers/payment.controller");
const paymentValidator = require("../validators/payment.validator");
const rideValidator = require("../validators/ride.validator");

const { authMiddleware } = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");
const validate = require("../middleware/validation.middleware");
const { ROLES } = require("../utils/constants");

const router = express.Router();

router.use(authMiddleware);

// ------------------------------------------
// History
// BACKEND_PLAN.md section 32
// ------------------------------------------

// GET /api/payments/history
router.get(
    "/history",
    requireRole(ROLES.PASSENGER),
    validate("query", paymentValidator.historyQuery),
    paymentController.getPaymentHistory
);

// GET /api/payments/ride/:rideId
router.get(
    "/ride/:rideId",
    validate("params", rideValidator.rideIdParam),
    paymentController.getPaymentByRide
);

// ------------------------------------------
// Single payment and creation
// BACKEND_PLAN.md section 32
// ------------------------------------------

// POST /api/payments/:rideId
router.post(
    "/:rideId",
    requireRole(ROLES.PASSENGER),
    validate("params", rideValidator.rideIdParam),
    validate("body", paymentValidator.createPayment),
    paymentController.createPayment
);

// GET /api/payments/:paymentId
router.get(
    "/:paymentId",
    validate("params", paymentValidator.paymentIdParam),
    paymentController.getPayment
);

module.exports = router;