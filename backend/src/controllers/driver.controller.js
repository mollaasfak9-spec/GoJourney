const Driver = require("../models/Driver");

// =========================
// Get Driver Profile
// =========================
const getDriverProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const driver = await Driver.findOne({ user: userId });

        if (!driver) {
            return res.status(404).json({
                success: false,
                message: "Driver profile not found"
            });
        }

        res.status(200).json({
            success: true,
            driver
        });
    } catch (error) {
        next(error);
    }
};

// =========================
// Update Driver Profile
// =========================
const updateDriverProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const {
            licenseNumber,
            vehicleNumber,
            vehicleType
        } = req.body;

        const driver = await Driver.findOneAndUpdate(
            { user: userId },
            {
                licenseNumber,
                vehicleNumber,
                vehicleType
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!driver) {
            return res.status(404).json({
                success: false,
                message: "Driver profile not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Driver profile updated successfully",
            driver
        });
    } catch (error) {
        next(error);
    }
};

// =========================
// Update Driver Status
// =========================
const updateDriverStatus = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const { isOnline } = req.body;

        if (typeof isOnline !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isOnline must be true or false"
            });
        }

        const driver = await Driver.findOneAndUpdate(
            { user: userId },
            {
                isOnline
            },
            {
                new: true
            }
        );

        if (!driver) {
            return res.status(404).json({
                success: false,
                message: "Driver profile not found"
            });
        }

        res.status(200).json({
            success: true,
            message: isOnline
                ? "Driver is now online"
                : "Driver is now offline",
            driver
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDriverProfile,
    updateDriverProfile,
    updateDriverStatus
};