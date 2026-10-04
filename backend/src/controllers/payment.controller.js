const Payment = require("../models/Payment");

// =========================
// Create Payment
// =========================
const createPayment = async (req, res, next) => {
    try {
        const {
            ride,
            amount,
            method
        } = req.body;

        if (!ride || !amount || !method) {
            return res.status(400).json({
                success: false,
                message: "Ride, amount and payment method are required"
            });
        }

        const payment = await Payment.create({
            user: req.user.id,
            ride,
            amount,
            method,
            status: "pending"
        });

        res.status(201).json({
            success: true,
            message: "Payment created successfully",
            payment
        });
    } catch (error) {
        next(error);
    }
};

// =========================
// Get Single Payment
// =========================
const getPayment = async (req, res, next) => {
    try {
        const { id } = req.params;

        const payment = await Payment.findOne({
            _id: id,
            user: req.user.id
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        res.status(200).json({
            success: true,
            payment
        });
    } catch (error) {
        next(error);
    }
};

// =========================
// Get My Payments
// =========================
const getMyPayments = async (req, res, next) => {
    try {
        const payments = await Payment.find({
            user: req.user.id
        }).sort({
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            count: payments.length,
            payments
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPayment,
    getPayment,
    getMyPayments
};