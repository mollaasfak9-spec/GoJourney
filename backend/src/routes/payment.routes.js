const express = require("express");

const {
    createPayment,
    getPayment,
    getMyPayments
} = require("../controllers/payment.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Create payment
router.post("/", authMiddleware, createPayment);

// Get single payment
router.get("/:id", authMiddleware, getPayment);

// Get user's payments
router.get("/", authMiddleware, getMyPayments);

module.exports = router;