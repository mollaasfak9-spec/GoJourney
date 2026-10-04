const User = require("../models/User");
const Driver = require("../models/Driver");
const Ride = require("../models/Ride");
const Payment = require("../models/Payment");

// =========================
// Get All Users
// =========================
const getUsers = async (req, res, next) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        next(error);
    }
};

// =========================
// Get All Drivers
// =========================
const getDrivers = async (req, res, next) => {
    try {
        const drivers = await Driver.find()
            .populate("user", "-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: drivers.length,
            drivers
        });
    } catch (error) {
        next(error);
    }
};

// =========================
// Get All Rides
// =========================
const getRides = async (req, res, next) => {
    try {
        const rides = await Ride.find()
            .populate("user", "-password")
            .populate("driver")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: rides.length,
            rides
        });
    } catch (error) {
        next(error);
    }
};

// =========================
// Get All Payments
// =========================
const getPayments = async (req, res, next) => {
    try {
        const payments = await Payment.find()
            .populate("user", "-password")
            .populate("ride")
            .sort({ createdAt: -1 });

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
    getUsers,
    getDrivers,
    getRides,
    getPayments
};