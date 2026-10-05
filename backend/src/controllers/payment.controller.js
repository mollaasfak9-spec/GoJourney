const Payment = require("../models/Payment");
const Ride = require("../models/Ride");

const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { success, created } = require("../utils/response");
const { getPagination, paginateQuery } = require("../utils/pagination");
const { ROLES, RIDE_STATUS, PAYMENT_STATUS } = require("../utils/constants");

/**
 * Loads a payment and checks the caller is the passenger who paid for it
 * (BACKEND_PLAN.md section 32).
 */
const loadPaymentForActor = async (paymentId, user) => {
    const payment = await Payment.findById(paymentId);

    if (!payment) {
        throw ApiError.notFound("Payment not found", "PAYMENT_NOT_FOUND");
    }

    if (user.role === ROLES.ADMIN || payment.passengerId.equals(user._id)) {
        return payment;
    }

    throw ApiError.forbidden("You do not have access to this payment", "PAYMENT_ACCESS_DENIED");
};

// ==========================================
// POST /api/payments/:rideId
// BACKEND_PLAN.md section 32
//
// Real gateway integration is intentionally out of scope until the core ride
// flow works, so cash settles immediately and online records a transaction id.
// ==========================================

/**
 * Completing a ride opens a pending payment, so POST /payments/:rideId settles
 * that record rather than inserting a second one.
 */
const settlePayment = async (payment, { method, transactionId, isCash }) => {
    payment.method = method;

    if (isCash) {
        payment.status = PAYMENT_STATUS.PAID;
        payment.paidAt = new Date();
        payment.transactionId = null;
    } else {
        payment.transactionId = transactionId || payment.transactionId || null;
    }

    return payment.save();
};

const createPayment = asyncHandler(async (req, res) => {
    const { rideId } = req.params;
    const { method, transactionId } = req.body;

    const ride = await Ride.findById(rideId);

    if (!ride) {
        throw ApiError.notFound("Ride not found", "RIDE_NOT_FOUND");
    }

    if (!ride.passengerId.equals(req.user._id)) {
        throw ApiError.forbidden(
            "Only the passenger of this ride can pay for it",
            "PAYMENT_ACCESS_DENIED"
        );
    }

    if (ride.status !== RIDE_STATUS.COMPLETED) {
        throw ApiError.conflict(
            "You can only pay for a completed ride",
            "RIDE_NOT_COMPLETED"
        );
    }

    const amountToPay = ride.finalFare || ride.estimatedFare;

    // The backend owns the fare, a client supplied amount is only advisory
    if (req.body.amount !== undefined && req.body.amount !== amountToPay) {
        throw ApiError.badRequest(
            `Payment amount must match the ride fare of ${amountToPay}`,
            "AMOUNT_MISMATCH"
        );
    }

    const existing = await Payment.findOne({ rideId: ride._id });

    if (existing && existing.status === PAYMENT_STATUS.PAID) {
        throw ApiError.conflict("This ride has already been paid", "PAYMENT_ALREADY_COMPLETED");
    }

const isCash = method === "cash";

// Completing a ride already opens a pending record, so this endpoint settles
// that record instead of trying to insert a second one
    const payment = existing
        ? await settlePayment(existing, { method, transactionId, isCash })
        : await Payment.create({
              rideId: ride._id,
              passengerId: ride.passengerId,
              driverId: ride.driverId,
              amount: amountToPay,
              method,
              // Cash collected in person counts as paid straight away
              status: isCash ? PAYMENT_STATUS.PAID : PAYMENT_STATUS.PENDING,
              transactionId: isCash ? null : transactionId || null,
              paidAt: isCash ? new Date() : null
          });

    ride.paymentId = payment._id;

    await ride.save();

    return created(res, {
        message: isCash ? "Cash payment recorded successfully" : "Payment initiated successfully",
        data: { payment }
    });
});

// ==========================================
// GET /api/payments/:paymentId
// BACKEND_PLAN.md section 32
// ==========================================
const getPayment = asyncHandler(async (req, res) => {
    const payment = await loadPaymentForActor(req.params.paymentId, req.user);

    return success(res, {
        message: "Payment fetched successfully",
        data: { payment }
    });
});

// ==========================================
// GET /api/payments/history
// BACKEND_PLAN.md section 32
// ==========================================
const getPaymentHistory = asyncHandler(async (req, res) => {
    const pagination = getPagination(req.query);

    const filter = { passengerId: req.user._id };

    if (req.query.status) {
        filter.status = req.query.status;
    }

    if (req.query.method) {
        filter.method = req.query.method;
    }

    const { items, pagination: meta } = await paginateQuery(
        Payment.find(filter).sort({ createdAt: -1 }),
        pagination
    );

    return success(res, {
        message: "Payment history fetched successfully",
        data: items,
        pagination: meta
    });
});

// ==========================================
// GET /api/payments/ride/:rideId
// Payment record for one ride
// ==========================================
const getPaymentByRide = asyncHandler(async (req, res) => {
    const { rideId } = req.params;

    const ride = await Ride.findById(rideId);

    if (!ride) {
        throw ApiError.notFound("Ride not found", "RIDE_NOT_FOUND");
    }

    if (req.user.role !== ROLES.ADMIN && !ride.passengerId.equals(req.user._id)) {
        throw ApiError.forbidden("You do not have access to this ride", "RIDE_ACCESS_DENIED");
    }

    const payment = await Payment.findOne({ rideId: ride._id });

    return success(res, {
        message: payment ? "Payment fetched successfully" : "This ride has no payment record yet",
        data: { payment: payment || null }
    });
});

module.exports = {
    createPayment,
    getPayment,
    getPaymentHistory,
    getPaymentByRide
};