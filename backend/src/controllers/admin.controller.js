const User = require("../models/User");
const Driver = require("../models/Driver");
const Vehicle = require("../models/Vehicle");
const Ride = require("../models/Ride");
const Payment = require("../models/Payment");
const Rating = require("../models/Rating");

const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/response");
const { getPagination, paginateQuery } = require("../utils/pagination");
const { parseBooleanQuery } = require("../validators/helpers");
const {
    ROLES,
    RIDE_STATUS,
    VERIFICATION_STATUS,
    PAYMENT_STATUS
} = require("../utils/constants");

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Aggregates the platform numbers an admin dashboard needs
 * (BACKEND_PLAN.md section 34).
 */
const getDashboard = asyncHandler(async (req, res) => {
    const [
        totalUsers,
        passengers,
        drivers,
        admins,
        newUsers,
        totalDrivers,
        verifiedDrivers,
        onlineDrivers,
        totalRides,
        ridesByStatus,
        totalPayments,
        revenue,
        revenueByMethod,
        averageRating
    ] = await Promise.all([
        User.countDocuments({}),
        User.countDocuments({ role: ROLES.PASSENGER }),
        User.countDocuments({ role: ROLES.DRIVER }),
        User.countDocuments({ role: ROLES.ADMIN }),
        User.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }),
        Driver.countDocuments({}),
        Driver.countDocuments({ verificationStatus: VERIFICATION_STATUS.VERIFIED }),
        Driver.countDocuments({ isOnline: true }),
        Ride.countDocuments({}),
        Ride.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
        Payment.countDocuments({}),
        Payment.aggregate([
            { $match: { status: PAYMENT_STATUS.PAID } },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            }
        ]),
        Payment.aggregate([
            { $match: { status: PAYMENT_STATUS.PAID } },
            { $group: { _id: "$method", total: { $sum: "$amount" }, count: { $sum: 1 } } }
        ]),
        Rating.aggregate([{ $group: { _id: null, average: { $avg: "$rating" }, count: { $sum: 1 } } }])
    ]);

    const statusBreakdown = ridesByStatus.reduce(
        (accumulator, entry) => ({ ...accumulator, [entry._id]: entry.count }),
        {}
    );

    const methodBreakdown = revenueByMethod.reduce(
        (accumulator, entry) => ({
            ...accumulator,
            [entry._id]: { amount: entry.total, count: entry.count }
        }),
        {}
    );

    return success(res, {
        message: "Dashboard fetched successfully",
        data: {
            users: {
                total: totalUsers,
                passengers,
                drivers,
                admins,
                newThisWeek: newUsers
            },
            drivers: {
                total: totalDrivers,
                verified: verifiedDrivers,
                pending: totalDrivers - verifiedDrivers,
                online: onlineDrivers
            },
            rides: {
                total: totalRides,
                active: statusBreakdown[RIDE_STATUS.REQUESTED] || 0,
                completed: statusBreakdown[RIDE_STATUS.COMPLETED] || 0,
                cancelled: statusBreakdown[RIDE_STATUS.CANCELLED] || 0,
                byStatus: statusBreakdown
            },
            payments: {
                total: totalPayments,
                paidCount: revenue.length ? revenue[0].count : 0,
                totalRevenue: revenue.length ? revenue[0].total : 0,
                pendingCount: await Payment.countDocuments({ status: PAYMENT_STATUS.PENDING }),
                byMethod: methodBreakdown
            },
            ratings: {
                average: averageRating.length
                    ? Math.round(averageRating[0].average * 10) / 10
                    : 0,
                total: averageRating.length ? averageRating[0].count : 0
            }
        }
    });
});

// ==========================================
// GET /api/admin/users
// BACKEND_PLAN.md sections 34, 40 and 41
// ==========================================
const getUsers = asyncHandler(async (req, res) => {
    const pagination = getPagination(req.query);

    const filter = {};

    if (req.query.role) {
        filter.role = req.query.role;
    }

    if (req.query.isActive !== undefined) {
        filter.isActive = parseBooleanQuery(req.query.isActive);
    }

    if (req.query.search) {
        const pattern = new RegExp(escapeRegExp(req.query.search.trim()), "i");

        filter.$or = [{ name: pattern }, { email: pattern }, { phone: pattern }];
    }

    const { items, pagination: meta } = await paginateQuery(
        User.find(filter).sort({ createdAt: -1 }),
        pagination
    );

    return success(res, {
        message: "Users fetched successfully",
        data: items,
        pagination: meta
    });
});

// ==========================================
// GET /api/admin/users/:id
// BACKEND_PLAN.md section 34
// ==========================================
const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
        throw ApiError.notFound("User not found", "USER_NOT_FOUND");
    }

    const driver = await Driver.findOne({ userId: user._id });

    const [vehicles, rideCount, paymentCount] = await Promise.all([
        driver ? Vehicle.find({ driverId: driver._id }) : [],
        Ride.countDocuments({ passengerId: user._id }),
        Payment.countDocuments({ passengerId: user._id })
    ]);

    return success(res, {
        message: "User fetched successfully",
        data: {
            user,
            driver: driver || null,
            vehicles,
            stats: { rideCount, paymentCount }
        }
    });
});

// ==========================================
// PATCH /api/admin/users/:id/status
// BACKEND_PLAN.md section 34
// ==========================================
const updateUserStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { isActive, reason } = req.body;

    // ObjectId and string are never ===, compare as strings
    if (id === req.user._id.toString()) {
        throw ApiError.badRequest("You cannot change your own account status", "SELF_STATUS_CHANGE");
    }

    const user = await User.findById(id);

    if (!user) {
        throw ApiError.notFound("User not found", "USER_NOT_FOUND");
    }

    user.isActive = isActive;

    await user.save();

    // Deactivating a driver must also take them offline
    if (!isActive) {
        await Driver.updateMany({ userId: user._id }, { $set: { isOnline: false } });
    }

    return success(res, {
        message: isActive
            ? "User activated successfully"
            : `User deactivated successfully${reason ? `: ${reason}` : ""}`,
        data: { user }
    });
});

// ==========================================
// GET /api/admin/drivers
// ==========================================
const getDrivers = asyncHandler(async (req, res) => {
    const pagination = getPagination(req.query);

    const filter = {};

    // verified=true maps to the verified status, verified=false to everything else
    if (req.query.verified !== undefined) {
        const verified = parseBooleanQuery(req.query.verified);

        filter.verificationStatus = verified
            ? VERIFICATION_STATUS.VERIFIED
            : { $ne: VERIFICATION_STATUS.VERIFIED };
    }

    if (req.query.isOnline !== undefined) {
        filter.isOnline = parseBooleanQuery(req.query.isOnline);
    }

    if (req.query.search) {
        const pattern = new RegExp(escapeRegExp(req.query.search.trim()), "i");

        filter.$or = [{ licenseNumber: pattern }, { "user.name": pattern }, { "user.email": pattern }];
    }

    const query = Driver.find(filter)
        .populate("userId", "name email phone profileImage role isActive")
        .sort({ createdAt: -1 });

    const { items, pagination: meta } = await paginateQuery(query, pagination);

    return success(res, {
        message: "Drivers fetched successfully",
        data: items,
        pagination: meta
    });
});

// ==========================================
// GET /api/admin/drivers/:id
// ==========================================
const getDriverById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const driver = await Driver.findById(id).populate(
        "userId",
        "name email phone profileImage role isActive createdAt"
    );

    if (!driver) {
        throw ApiError.notFound("Driver not found", "DRIVER_NOT_FOUND");
    }

    const [vehicles, rideCount, paymentSummary, ratings] = await Promise.all([
        Vehicle.find({ driverId: driver._id }),
        Ride.countDocuments({ driverId: driver._id }),
        Payment.aggregate([
            { $match: { driverId: driver._id, status: PAYMENT_STATUS.PAID } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]),
        Rating.find({ driverId: driver._id }).sort({ createdAt: -1 }).limit(10)
    ]);

    return success(res, {
        message: "Driver fetched successfully",
        data: {
            driver,
            vehicles,
            ratings,
            stats: {
                totalRides: rideCount,
                totalEarnings: paymentSummary.length ? paymentSummary[0].total : 0
            }
        }
    });
});

// ==========================================
// PATCH /api/admin/drivers/:id/verify
// ==========================================
const verifyDriver = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { verificationStatus, remarks } = req.body;

    const driver = await Driver.findById(id);

    if (!driver) {
        throw ApiError.notFound("Driver not found", "DRIVER_NOT_FOUND");
    }

    driver.verificationStatus = verificationStatus;
    driver.verificationRemarks = remarks || null;

    // A rejected driver cannot stay online
    if (verificationStatus === VERIFICATION_STATUS.REJECTED) {
        driver.isOnline = false;
    }

    await driver.save();

    return success(res, {
        message: `Driver verification updated to ${verificationStatus}`,
        data: { driver }
    });
});

// ==========================================
// PATCH /api/admin/drivers/:id/status
// ==========================================
const updateDriverStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { isOnline, reason } = req.body;

    const driver = await Driver.findById(id);

    if (!driver) {
        throw ApiError.notFound("Driver not found", "DRIVER_NOT_FOUND");
    }

    driver.isOnline = isOnline;

    await driver.save();

    return success(res, {
        message: isOnline
            ? `Driver forced online${reason ? `: ${reason}` : ""}`
            : `Driver forced offline${reason ? `: ${reason}` : ""}`,
        data: { driver }
    });
});

// ==========================================
// GET /api/admin/rides
// ==========================================
const getRides = asyncHandler(async (req, res) => {
    const pagination = getPagination(req.query);

    const filter = {};

    if (req.query.status) {
        filter.status = req.query.status;
    }

    if (req.query.vehicleType) {
        filter.vehicleType = req.query.vehicleType;
    }

    if (req.query.driverId) {
        filter.driverId = req.query.driverId;
    }

    if (req.query.passengerId) {
        filter.passengerId = req.query.passengerId;
    }

    const query = Ride.find(filter)
        .populate("passengerId", "name email phone")
        .populate({
            path: "driverId",
            populate: { path: "userId", select: "name phone" }
        })
        .sort({ createdAt: -1 });

    const { items, pagination: meta } = await paginateQuery(query, pagination);

    return success(res, {
        message: "Rides fetched successfully",
        data: items,
        pagination: meta
    });
});

// ==========================================
// GET /api/admin/rides/:id
// ==========================================
const getRideById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const ride = await Ride.findById(id)
        .populate("passengerId", "name email phone")
        .populate({
            path: "driverId",
            populate: { path: "userId", select: "name phone" }
        })
        .populate("vehicleId")
        .populate("paymentId");

    if (!ride) {
        throw ApiError.notFound("Ride not found", "RIDE_NOT_FOUND");
    }

    const rating = await Rating.findOne({ rideId: ride._id });

    return success(res, {
        message: "Ride fetched successfully",
        data: { ride, rating: rating || null }
    });
});

// ==========================================
// GET /api/admin/payments
// ==========================================
const getPayments = asyncHandler(async (req, res) => {
    const pagination = getPagination(req.query);

    const filter = {};

    if (req.query.status) {
        filter.status = req.query.status;
    }

    if (req.query.method) {
        filter.method = req.query.method;
    }

    const query = Payment.find(filter)
        .populate("passengerId", "name email phone")
        .populate("rideId", "status finalFare estimatedFare")
        .sort({ createdAt: -1 });

    const { items, pagination: meta } = await paginateQuery(query, pagination);

    return success(res, {
        message: "Payments fetched successfully",
        data: items,
        pagination: meta
    });
});

module.exports = {
    getDashboard,
    getUsers,
    getUserById,
    updateUserStatus,
    getDrivers,
    getDriverById,
    verifyDriver,
    updateDriverStatus,
    getRides,
    getRideById,
    getPayments
};