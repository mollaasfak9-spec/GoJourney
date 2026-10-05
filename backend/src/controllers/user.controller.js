const User = require("../models/User");
const Driver = require("../models/Driver");
const Vehicle = require("../models/Vehicle");
const Ride = require("../models/Ride");

const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/response");
const { ROLES, RIDE_STATUS } = require("../utils/constants");

const ACTIVE_RIDE_STATUSES = [
    RIDE_STATUS.REQUESTED,
    RIDE_STATUS.ACCEPTED,
    RIDE_STATUS.DRIVER_ARRIVING,
    RIDE_STATUS.DRIVER_ARRIVED,
    RIDE_STATUS.STARTED
];

const findDriverForUser = async (userId) => Driver.findOne({ userId });

// ==========================================
// GET /api/users/me
// BACKEND_PLAN.md section 14
// ==========================================
const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        throw ApiError.notFound("User not found", "USER_NOT_FOUND");
    }

    return success(res, {
        message: "Profile fetched successfully",
        data: { user }
    });
});

// ==========================================
// PATCH /api/users/me
// BACKEND_PLAN.md section 14
// ==========================================
const updateMe = asyncHandler(async (req, res) => {
    const { name, phone, profileImage, role } = req.body;

    const updates = {};

    if (name !== undefined) {
        updates.name = name;
    }

    if (phone !== undefined) {
        updates.phone = phone === "" ? null : phone;
    }

    if (profileImage !== undefined) {
        updates.profileImage = profileImage === "" ? null : profileImage;
    }

    // Role escalation is admin only, never allowed on a self update
    if (role !== undefined && role !== req.user.role) {
        if (req.user.role !== ROLES.ADMIN) {
            throw ApiError.forbidden("Only an admin can change your role", "ROLE_CHANGE_FORBIDDEN");
        }

        updates.role = role;
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updates },
        { returnDocument: "after", runValidators: true }
    );

    if (!user) {
        throw ApiError.notFound("User not found", "USER_NOT_FOUND");
    }

    return success(res, {
        message: "Profile updated successfully",
        data: { user }
    });
});

// ==========================================
// PATCH /api/users/me/password
// BACKEND_PLAN.md section 14
// ==========================================
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+passwordHash");

    if (!user) {
        throw ApiError.notFound("User not found", "USER_NOT_FOUND");
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
        throw ApiError.unauthorized("Current password is incorrect", "INVALID_CURRENT_PASSWORD");
    }

    if (currentPassword === newPassword) {
        throw ApiError.badRequest(
            "New password must be different from the current password",
            "PASSWORD_UNCHANGED"
        );
    }

    user.passwordHash = newPassword;

    // Triggers the bcrypt pre-save hook
    await user.save();

    return success(res, {
        message: "Password updated successfully",
        data: null
    });
});

// ==========================================
// DELETE /api/users/me
// BACKEND_PLAN.md section 14
//
// The account is deactivated and anonymised instead of removed, so ride and
// payment history stays consistent for passengers and drivers.
// ==========================================
const deactivateMe = asyncHandler(async (req, res) => {
    const user = req.user;
    const driver = await findDriverForUser(user._id);

    const rideScope = [{ passengerId: user._id }];

    if (driver) {
        rideScope.push({ driverId: driver._id });
    }

    const activeRide = await Ride.findOne({
        $or: rideScope,
        status: { $in: ACTIVE_RIDE_STATUSES }
    });

    if (activeRide) {
        throw ApiError.conflict(
            "You have a ride in progress. Complete or cancel it before deleting your account.",
            "ACTIVE_RIDE_EXISTS"
        );
    }

    user.isActive = false;
    user.profileImage = null;

    // Strip identifying details but keep the row for financial history
    user.name = `Deleted user ${user._id.toString().slice(-6)}`;
    user.email = `deleted_${user._id}@ridex.invalid`;
    user.phone = null;

    await user.save();

    if (driver) {
        driver.isOnline = false;
        driver.licenseNumber = `REVOKED-${driver._id.toString().slice(-8).toUpperCase()}`;

        await driver.save();

        await Vehicle.updateMany({ driverId: driver._id }, { isActive: false });
    }

    return success(res, {
        message: "Account deleted successfully",
        data: null
    });
});

module.exports = {
    getMe,
    updateMe,
    changePassword,
    deactivateMe
};