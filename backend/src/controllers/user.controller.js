const User = require("../models/User");

// =========================
// Get User Profile
// =========================
const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};

// =========================
// Update User Profile
// =========================
const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const { name, phone } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            {
                name,
                phone
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProfile,
    updateProfile
};