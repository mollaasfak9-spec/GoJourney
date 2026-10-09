const mongoose = require("mongoose");

const Driver = require("../models/Driver");
const Vehicle = require("../models/Vehicle");
const Ride = require("../models/Ride");
const Rating = require("../models/Rating");
const env = require("../config/env");

const ApiError = require("../utils/ApiError");
const { distanceInKm } = require("../utils/geo");
const { RIDE_STATUS, VERIFICATION_STATUS } = require("../utils/constants");

/**
 * Driver helpers and MVP matching (BACKEND_PLAN.md sections 12, 15, 23 and 43).
 *
 * MVP matching:
 *   find online drivers
 *     -> filter by vehicle type
 *     -> choose nearest available driver
 *
 * Geospatial dispatch is explicitly out of scope for the college MVP.
 */

/**
 * Every user with the driver role needs a Driver document, so the driver APIs
 * are reachable right after registration.
 */
const getOrCreateDriverProfile = async (userId) => {
    const existing = await Driver.findOne({ userId });

    if (existing) {
        return existing;
    }

    try {
        return await Driver.create({
            userId,
            // Placeholder keeps the unique index happy until the driver submits
            // a real licence through PATCH /api/drivers/me
            licenseNumber: `PENDING-${userId.toString().slice(-8).toUpperCase()}`,
            verificationStatus: VERIFICATION_STATUS.UNVERIFIED
        });
    } catch (error) {
        // Lost a race against a concurrent request
        const raced = await Driver.findOne({ userId });

        if (!raced) {
            throw error;
        }

        return raced;
    }
};

const requireDriverProfile = async (userId) => {
    const driver = await Driver.findOne({ userId });

    if (!driver) {
        throw ApiError.notFound("Driver profile not found", "DRIVER_PROFILE_NOT_FOUND");
    }

    return driver;
};

/**
 * A driver must be verified, online and own an active vehicle before taking
 * rides (BACKEND_PLAN.md sections 15 and 43).
 */
const assertDriverCanAcceptRides = async (driver) => {
    if (driver.verificationStatus !== VERIFICATION_STATUS.VERIFIED) {
        throw ApiError.forbidden(
            "Your account must be verified by an admin before you can take rides",
            "DRIVER_NOT_VERIFIED"
        );
    }

    if (!driver.isOnline) {
        throw ApiError.forbidden("Go online to receive ride requests", "DRIVER_OFFLINE");
    }

    const vehicleCount = await Vehicle.countDocuments({
        driverId: driver._id,
        isActive: true
    });

    if (vehicleCount === 0) {
        throw ApiError.forbidden(
            "Add an active vehicle before you can take rides",
            "DRIVER_WITHOUT_VEHICLE"
        );
    }
};

/**
 * Vehicle types this driver can serve. Several vehicles may be registered.
 */
const getDriverVehicleTypes = async (driverId) => {
    const vehicles = await Vehicle.find({ driverId, isActive: true }).select("type").lean();

    return [...new Set(vehicles.map((vehicle) => vehicle.type))];
};

/**
 * Available requests for GET /api/drivers/me/ride-requests
 * (BACKEND_PLAN.md section 23).
 *
 * status = requested, driver not assigned yet, vehicle type matches a vehicle
 * the driver owns, and this driver has not already rejected it
 * (section 25: a rejected request stays available for other eligible drivers).
 */
const findAvailableRideRequests = async ({ driver, vehicleTypes, radiusKm }) => {
    const rides = await Ride.find({
        status: RIDE_STATUS.REQUESTED,
        driverId: null,
        vehicleType: { $in: vehicleTypes },
        rejectedBy: { $ne: driver._id }
    })
        .populate({ path: "passengerId", select: "name phone profileImage" })
        .sort({ createdAt: 1 })
        .lean();

    // lean documents skip the schema toJSON transform, so add the id the rest
    // of the API returns
    const withDistance = rides.map((ride) => ({
        ...ride,
        id: ride._id.toString(),
        pickupDistance: getPickupDistance(driver, ride.pickup)
    }));

    const filtered =
        radiusKm && driver.currentLocation && driver.currentLocation.lat
            ? withDistance.filter(
                  (ride) => ride.pickupDistance !== null && ride.pickupDistance <= radiusKm
              )
            : withDistance;

    return sortByPickupDistance(filtered);
};

/**
 * Distance in km between the driver and a point. Null when the driver has not
 * shared a location yet.
 */
const getPickupDistance = (driver, point) => {
    if (!driver.currentLocation || driver.currentLocation.lat === undefined) {
        return null;
    }

    return Math.round(
        distanceInKm(
            { lat: driver.currentLocation.lat, lng: driver.currentLocation.lng },
            point
        ) * 100
    ) / 100;
};

/**
 * Nearest pickup first, requests without a known distance stay at the end.
 */
const sortByPickupDistance = (rides) =>
    [...rides].sort((a, b) => {
        const distanceA = a.pickupDistance;
        const distanceB = b.pickupDistance;

        if (distanceA === null || distanceA === undefined) {
            return distanceB === null || distanceB === undefined ? 0 : 1;
        }

        if (distanceB === null || distanceB === undefined) {
            return -1;
        }

        return distanceA - distanceB;
    });

/**
 * MVP dispatch helper (BACKEND_PLAN.md section 43): find online drivers, filter
 * by vehicle type, choose the nearest available one.
 */
const findNearestAvailableDriver = async ({ pickup, vehicleType }) => {
    const driverIds = await Vehicle.distinct("driverId", { type: vehicleType, isActive: true });

    if (driverIds.length === 0) {
        return null;
    }

    const drivers = await Driver.find({
        _id: { $in: driverIds },
        isOnline: true,
        verificationStatus: VERIFICATION_STATUS.VERIFIED,
        "currentLocation.lat": { $exists: true }
    }).lean();

    if (drivers.length === 0) {
        return null;
    }

    const radiusKm = env.SEARCH_RADIUS_KM;

    const candidates = drivers
        .map((driver) => ({
            driver,
            distance: distanceInKm(
                { lat: driver.currentLocation.lat, lng: driver.currentLocation.lng },
                pickup
            )
        }))
        .filter((candidate) => candidate.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance);

    return candidates.length ? candidates[0].driver : null;
};

/**
 * Recomputes the driver average rating after a rating is stored.
 */
const recalculateDriverRating = async (driverId) => {
    const [summary] = await Rating.aggregate([
        { $match: { driverId: new mongoose.Types.ObjectId(driverId.toString()) } },
        { $group: { _id: "$driverId", average: { $avg: "$rating" }, count: { $sum: 1 } } }
    ]);

    if (!summary) {
        return null;
    }

    return Driver.findByIdAndUpdate(driverId, {
        rating: Math.round(summary.average * 10) / 10,
        ratingCount: summary.count
    });
};

module.exports = {
    getOrCreateDriverProfile,
    requireDriverProfile,
    assertDriverCanAcceptRides,
    getDriverVehicleTypes,
    findAvailableRideRequests,
    getPickupDistance,
    sortByPickupDistance,
    findNearestAvailableDriver,
    recalculateDriverRating
};