const Ride = require("../models/Ride");

// =========================
// Create Ride
// =========================
const createRide = async (req, res, next) => {
    try {
        const {
            pickupLocation,
            dropLocation,
            vehicleType
        } = req.body;

        if (!pickupLocation || !dropLocation) {
            return res.status(400).json({
                success: false,
                message: "Pickup and drop location are required"
            });
        }

        const ride = await Ride.create({
            user: req.user.id,
            pickupLocation,
            dropLocation,
            vehicleType,
            status: "requested"
        });

        res.status(201).json({
            success: true,
            message: "Ride created successfully",
            ride
        });
    } catch (error) {
        next(error);
    }
};

// =========================
// Get Single Ride
// =========================
const getRide = async (req, res, next) => {
    try {
        const { id } = req.params;

        const ride = await Ride.findById(id);

        if (!ride) {
            return res.status(404).json({
                success: false,
                message: "Ride not found"
            });
        }

        res.status(200).json({
            success: true,
            ride
        });
    } catch (error) {
        next(error);
    }
};

// =========================
// Get My Rides
// =========================
const getMyRides = async (req, res, next) => {
    try {
        const rides = await Ride.find({
            user: req.user.id
        }).sort({
            createdAt: -1
        });

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
// Cancel Ride
// =========================
const cancelRide = async (req, res, next) => {
    try {
        const { id } = req.params;

        const ride = await Ride.findOne({
            _id: id,
            user: req.user.id
        });

        if (!ride) {
            return res.status(404).json({
                success: false,
                message: "Ride not found"
            });
        }

        ride.status = "cancelled";

        await ride.save();

        res.status(200).json({
            success: true,
            message: "Ride cancelled successfully",
            ride
        });
    } catch (error) {
        next(error);
    }
};

// =========================
// Update Ride Status
// =========================
const updateRideStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "requested",
            "accepted",
            "started",
            "completed",
            "cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ride status"
            });
        }

        const ride = await Ride.findByIdAndUpdate(
            id,
            { status },
            {
                new: true,
                runValidators: true
            }
        );

        if (!ride) {
            return res.status(404).json({
                success: false,
                message: "Ride not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Ride status updated successfully",
            ride
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createRide,
    getRide,
    getMyRides,
    cancelRide,
    updateRideStatus
};