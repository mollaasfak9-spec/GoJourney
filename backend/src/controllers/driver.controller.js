const Driver = require("../models/Driver");
const Vehicle = require("../models/Vehicle");
const Ride = require("../models/Ride");
const Payment = require("../models/Payment");
const Rating = require("../models/Rating");

const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { success, created } = require("../utils/response");
const { getPagination, paginateQuery } = require("../utils/pagination");
const { RIDE_STATUS, VERIFICATION_STATUS } = require("../utils/constants");

const driverService = require("../services/driver.service");

const VEHICLE_FIELDS = ["type", "brand", "model", "color", "year", "registrationNumber"];
const VEHICLE_UPDATABLE_FIELDS = [...VEHICLE_FIELDS, "isActive"];

// ==========================================
// GET /api/drivers/me
// BACKEND_PLAN.md section 15
// ==========================================
const getMe = asyncHandler(async (req, res) => {
    const driver = await driverService.requireDriverProfile(req.user._id);

    const vehicles = await Vehicle.find({ driverId: driver._id }).sort({ createdAt: -1 });

    return success(res, {
        message: "Driver profile fetched successfully",
        data: {
            driver,
            vehicles,
            user: req.user
        }
    });
});

// ==========================================
// PATCH /api/drivers/me
// BACKEND_PLAN.md section 15
// ==========================================
const updateMe = asyncHandler(async (req, res) => {
    const { licenseNumber } = req.body;

    const updates = {};

    if (licenseNumber !== undefined) {
        updates.licenseNumber = licenseNumber;

        // A new licence number has to be reviewed again
        updates.verificationStatus = VERIFICATION_STATUS.PENDING;
        updates.verificationRemarks = null;
    }

    const driver = await Driver.findOneAndUpdate(
        { userId: req.user._id },
        { $set: updates },
        { returnDocument: "after", runValidators: true }
    );

    if (!driver) {
        throw ApiError.notFound("Driver profile not found", "DRIVER_PROFILE_NOT_FOUND");
    }

    return success(res, {
        message: "Driver profile updated successfully",
        data: { driver }
    });
});

// ==========================================
// PATCH /api/drivers/me/status
// BACKEND_PLAN.md section 15
// ==========================================
const updateStatus = asyncHandler(async (req, res) => {
    const { isOnline } = req.body;

    const driver = await driverService.requireDriverProfile(req.user._id);

    // Going online has real prerequisites, going offline is always allowed
    if (isOnline && driver.verificationStatus !== VERIFICATION_STATUS.VERIFIED) {
        throw ApiError.forbidden(
            "Your account must be verified by an admin before you can go online",
            "DRIVER_NOT_VERIFIED"
        );
    }

    const vehicleCount = await Vehicle.countDocuments({ driverId: driver._id, isActive: true });

    if (isOnline && vehicleCount === 0) {
        throw ApiError.forbidden(
            "Add an active vehicle before you can go online",
            "DRIVER_WITHOUT_VEHICLE"
        );
    }

    driver.isOnline = isOnline;

    await driver.save();

    return success(res, {
        message: isOnline ? "You are now online" : "You are now offline",
        data: { driver }
    });
});

// ==========================================
// PATCH /api/drivers/me/location
// BACKEND_PLAN.md section 15
// ==========================================
const updateLocation = asyncHandler(async (req, res) => {
    const { lat, lng, address } = req.body;

    const driver = await Driver.findOneAndUpdate(
        { userId: req.user._id },
        {
            $set: {
                currentLocation: {
                    lat,
                    lng,
                    address: address === undefined ? null : address,
                    updatedAt: new Date()
                }
            }
        },
        { returnDocument: "after", runValidators: true }
    );

    if (!driver) {
        throw ApiError.notFound("Driver profile not found", "DRIVER_PROFILE_NOT_FOUND");
    }

    return success(res, {
        message: "Location updated successfully",
        data: { currentLocation: driver.currentLocation }
    });
});

// ==========================================
// GET /api/drivers/me/ride-requests
// BACKEND_PLAN.md section 23
// ==========================================
const getRideRequests = asyncHandler(async (req, res) => {
    const driver = await driverService.requireDriverProfile(req.user._id);

    const pagination = getPagination(req.query);

    const vehicleTypes = await driverService.getDriverVehicleTypes(driver._id);

    // Without an active vehicle there is nothing this driver can be offered
    if (vehicleTypes.length === 0) {
        return success(res, {
            message: "Add an active vehicle to receive ride requests",
            data: [],
            pagination: { page: pagination.page, limit: pagination.limit, total: 0, totalPages: 0 }
        });
    }

    const eligibleTypes = req.query.vehicleType
        ? vehicleTypes.filter((type) => type === req.query.vehicleType)
        : vehicleTypes;

    if (eligibleTypes.length === 0) {
        return success(res, {
            message: "You do not own a vehicle of the requested type",
            data: [],
            pagination: { page: pagination.page, limit: pagination.limit, total: 0, totalPages: 0 }
        });
    }

    const radiusKm = req.query.radius ? Number(req.query.radius) : null;

    const requests = await driverService.findAvailableRideRequests({
        driver,
        vehicleTypes: eligibleTypes,
        radiusKm
    });

    const page = requests.slice(pagination.skip, pagination.skip + pagination.limit);

    return success(res, {
        message: "Ride requests fetched successfully",
        data: page,
        pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total: requests.length,
            totalPages: Math.ceil(requests.length / pagination.limit)
        }
    });
});

// ==========================================
// POST /api/drivers/me/vehicles
// BACKEND_PLAN.md section 16
// ==========================================
const addVehicle = asyncHandler(async (req, res) => {
    const driver = await driverService.requireDriverProfile(req.user._id);

    const payload = VEHICLE_FIELDS.reduce(
        (accumulator, field) => {
            if (req.body[field] !== undefined) {
                accumulator[field] = req.body[field];
            }

            return accumulator;
        },
        { driverId: driver._id }
    );

    const vehicle = await Vehicle.create(payload);

    return created(res, {
        message: "Vehicle added successfully",
        data: { vehicle }
    });
});

// ==========================================
// GET /api/drivers/me/vehicles
// BACKEND_PLAN.md section 16
// ==========================================
const getVehicles = asyncHandler(async (req, res) => {
    const driver = await driverService.requireDriverProfile(req.user._id);

    const vehicles = await Vehicle.find({ driverId: driver._id }).sort({ createdAt: -1 });

    return success(res, {
        message: "Vehicles fetched successfully",
        data: vehicles
    });
});

// ==========================================
// PATCH /api/drivers/me/vehicles/:vehicleId
// BACKEND_PLAN.md section 16
// ==========================================
const updateVehicle = asyncHandler(async (req, res) => {
    const { vehicleId } = req.params;

    const driver = await driverService.requireDriverProfile(req.user._id);

    const updates = {};

    VEHICLE_UPDATABLE_FIELDS.forEach((field) => {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    });

    // Scoped by driverId so one driver can never edit another driver's vehicle
    const vehicle = await Vehicle.findOneAndUpdate(
        { _id: vehicleId, driverId: driver._id },
        { $set: updates },
        { returnDocument: "after", runValidators: true }
    );

    if (!vehicle) {
        throw ApiError.notFound("Vehicle not found", "VEHICLE_NOT_FOUND");
    }

    return success(res, {
        message: "Vehicle updated successfully",
        data: { vehicle }
    });
});

// ==========================================
// DELETE /api/drivers/me/vehicles/:vehicleId
// BACKEND_PLAN.md section 16
// ==========================================
const removeVehicle = asyncHandler(async (req, res) => {
    const { vehicleId } = req.params;

    const driver = await driverService.requireDriverProfile(req.user._id);

    const vehicle = await Vehicle.findOneAndDelete({ _id: vehicleId, driverId: driver._id });

    if (!vehicle) {
        throw ApiError.notFound("Vehicle not found", "VEHICLE_NOT_FOUND");
    }

    return success(res, {
        message: "Vehicle removed successfully",
        data: null
    });
});

// ==========================================
// GET /api/drivers/me/rides
// Ride history for the logged-in driver
// ==========================================
const getMyRides = asyncHandler(async (req, res) => {
    const driver = await driverService.requireDriverProfile(req.user._id);

    const { page, limit, skip } = getPagination(req.query);

    const filter = { driverId: driver._id };

    if (req.query.status) {
        filter.status = req.query.status;
    }

    const { items, pagination } = await paginateQuery(
        Ride.find(filter).sort({ createdAt: -1 }),
        { page, limit, skip }
    );

    return success(res, {
        message: "Ride history fetched successfully",
        data: items,
        pagination
    });
});

// ==========================================
// GET /api/drivers/me/earnings
// Driver earnings summary
// ==========================================
const getEarnings = asyncHandler(async (req, res) => {
    const driver = await driverService.requireDriverProfile(req.user._id);

    const [summary] = await Payment.aggregate([
        {
            $match: {
                driverId: driver._id,
                status: "paid"
            }
        },
        {
            $group: {
                _id: null,
                totalEarnings: { $sum: "$amount" },
                totalRides: { $sum: 1 }
            }
        }
    ]);

    const [ratingSummary] = await Rating.aggregate([
        { $match: { driverId: driver._id } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: "$rating" },
                totalRatings: { $sum: 1 }
            }
        }
    ]);

    const completedRides = await Ride.countDocuments({
        driverId: driver._id,
        status: RIDE_STATUS.COMPLETED
    });

    const cancelledRides = await Ride.countDocuments({
        driverId: driver._id,
        status: RIDE_STATUS.CANCELLED
    });

    return success(res, {
        message: "Earnings fetched successfully",
        data: {
            totalEarnings: summary ? summary.totalEarnings : 0,
            totalPaidRides: summary ? summary.totalRides : 0,
            completedRides,
            cancelledRides,
            averageRating: ratingSummary
                ? Math.round(ratingSummary.averageRating * 10) / 10
                : 0,
            totalRatings: ratingSummary ? ratingSummary.totalRatings : 0
        }
    });
});

module.exports = {
    getMe,
    updateMe,
    updateStatus,
    updateLocation,
    getRideRequests,
    addVehicle,
    getVehicles,
    updateVehicle,
    removeVehicle,
    getMyRides,
    getEarnings
};