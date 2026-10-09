const Ride = require("../models/Ride");
const Driver = require("../models/Driver");
const Vehicle = require("../models/Vehicle");
const Payment = require("../models/Payment");
const Rating = require("../models/Rating");

const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { success, created } = require("../utils/response");
const { getPagination, paginateQuery } = require("../utils/pagination");
const { ROLES, RIDE_STATUS, PAYMENT_METHOD, PAYMENT_STATUS } = require("../utils/constants");

const fareService = require("../services/fare.service");
const rideService = require("../services/ride.service");
const driverService = require("../services/driver.service");
const mapsService = require("../services/maps.service");

/**
 * Loads a ride and makes sure the caller is allowed to see it
 * (BACKEND_PLAN.md section 20: passenger or assigned driver).
 */
const loadRideForActor = async (rideId, user) => {
    const ride = await Ride.findById(rideId);

    if (!ride) {
        throw ApiError.notFound("Ride not found", "RIDE_NOT_FOUND");
    }

    if (user.role === ROLES.ADMIN) {
        return ride;
    }

    if (user.role === ROLES.PASSENGER && ride.passengerId.equals(user._id)) {
        return ride;
    }

    if (user.role === ROLES.DRIVER) {
        const driver = await Driver.findOne({ userId: user._id }).select("_id").lean();

        if (driver && ride.driverId && ride.driverId.equals(driver._id)) {
            return ride;
        }
    }

    throw ApiError.forbidden("You do not have access to this ride", "RIDE_ACCESS_DENIED");
};

const loadAssignedRideForDriver = async (rideId, user) => {
    const ride = await Ride.findById(rideId);

    if (!ride) {
        throw ApiError.notFound("Ride not found", "RIDE_NOT_FOUND");
    }

    const driver = await driverService.requireDriverProfile(user._id);

    if (!ride.driverId || !ride.driverId.equals(driver._id)) {
        throw ApiError.forbidden(
            "Only the driver assigned to this ride can update it",
            "DRIVER_NOT_ASSIGNED"
        );
    }

    return { ride, driver };
};

// ==========================================
// POST /api/rides/fare-estimate
// BACKEND_PLAN.md section 18
// ==========================================
const getFareEstimate = asyncHandler(async (req, res) => {
    const { pickup, destination, vehicleType } = req.body;

    mapsService.assertDistinctPoints(pickup, destination);

    // Distance, duration and route geometry all come from the maps service so
    // the price is derived from a real road route whenever one is available.
    const estimate = await fareService.estimateFareWithRoute({ pickup, destination, vehicleType });

    return success(res, {
        message: estimate.route.approximate
            ? "Estimated fare (approximate distance, live routing unavailable)"
            : "Fare estimated successfully",
        data: estimate
    });
});

// ==========================================
// POST /api/rides
// Passenger only, BACKEND_PLAN.md section 19
// ==========================================
const createRide = asyncHandler(async (req, res) => {
    const { pickup, destination, vehicleType } = req.body;

    // Reject identical / effectively identical points before doing any work.
    mapsService.assertDistinctPoints(pickup, destination);

    // One ride per passenger at a time keeps the dispatch state predictable
    const existingRide = await Ride.findOne({
        passengerId: req.user._id,
        status: {
            $in: [
                RIDE_STATUS.REQUESTED,
                RIDE_STATUS.ACCEPTED,
                RIDE_STATUS.DRIVER_ARRIVING,
                RIDE_STATUS.DRIVER_ARRIVED,
                RIDE_STATUS.STARTED
            ]
        }
    });

    if (existingRide) {
        throw ApiError.conflict(
            "You already have a ride in progress",
            "RIDE_ALREADY_IN_PROGRESS"
        );
    }

    // The server prices the ride itself; a fare sent by the client is ignored.
    const estimate = await fareService.estimateFareWithRoute({ pickup, destination, vehicleType });

    // MVP matching (section 43): nearest verified online driver with that vehicle
    const nearestDriver = await driverService.findNearestAvailableDriver({
        pickup: { lat: pickup.lat, lng: pickup.lng },
        vehicleType
    });

    const ride = await Ride.create({
        passengerId: req.user._id,
        vehicleType,
        pickup: { address: pickup.address || null, lat: pickup.lat, lng: pickup.lng },
        destination: {
            address: destination.address || null,
            lat: destination.lat,
            lng: destination.lng
        },
        distance: estimate.estimatedDistance,
        estimatedDuration: estimate.estimatedDuration,
        estimatedFare: estimate.estimatedFare,
        routeGeometry: estimate.route.geometry || [],
        routeSource: estimate.route.source || null,
        status: RIDE_STATUS.REQUESTED
    });

    return created(res, {
        message: "Ride created successfully",
        data: {
            ride,
            // Lets the frontend show "searching for a driver" without guessing
            hasNearbyDriver: Boolean(nearestDriver),
            nearestDriverId: nearestDriver ? nearestDriver._id : null
        }
    });
});

// ==========================================
// GET /api/rides/:rideId
// BACKEND_PLAN.md section 20
// ==========================================
const getRide = asyncHandler(async (req, res) => {
    const ride = await loadRideForActor(req.params.rideId, req.user);

    const [payment, driver] = await Promise.all([
        Payment.findOne({ rideId: ride._id }).lean(),
        ride.driverId ? Driver.findById(ride.driverId).populate("userId", "name phone profileImage").lean() : null
    ]);

    return success(res, {
        message: "Ride fetched successfully",
        data: {
            ride,
            driver,
            payment: payment || null
        }
    });
});

// ==========================================
// GET /api/rides/history
// BACKEND_PLAN.md section 21
// ==========================================
const getRideHistory = asyncHandler(async (req, res) => {
    const pagination = getPagination(req.query);

    const filter = { passengerId: req.user._id };

    if (req.query.status) {
        filter.status = req.query.status;
    }

    const { items, pagination: meta } = await paginateQuery(
        Ride.find(filter).sort({ createdAt: -1 }),
        pagination
    );

    return success(res, {
        message: "Ride history fetched successfully",
        data: items,
        pagination: meta
    });
});

// ==========================================
// GET /api/rides/active
// Current ride for the passenger dashboard
// ==========================================
const getActiveRide = asyncHandler(async (req, res) => {
    const ride = await Ride.findOne({
        passengerId: req.user._id,
        status: {
            $in: [
                RIDE_STATUS.REQUESTED,
                RIDE_STATUS.ACCEPTED,
                RIDE_STATUS.DRIVER_ARRIVING,
                RIDE_STATUS.DRIVER_ARRIVED,
                RIDE_STATUS.STARTED
            ]
        }
    }).sort({ createdAt: -1 });

    return success(res, {
        message: ride ? "Active ride fetched successfully" : "No active ride found",
        data: { ride: ride || null }
    });
});

// ==========================================
// PATCH /api/rides/:rideId/cancel
// BACKEND_PLAN.md section 22
// ==========================================
const cancelRide = asyncHandler(async (req, res) => {
    const ride = await Ride.findById(req.params.rideId);

    if (!ride) {
        throw ApiError.notFound("Ride not found", "RIDE_NOT_FOUND");
    }

    const { reason } = req.body || {};

    let cancelledBy = "passenger";

    if (req.user.role === ROLES.ADMIN) {
        cancelledBy = "admin";
    } else if (req.user.role === ROLES.DRIVER) {
        const driver = await driverService.requireDriverProfile(req.user._id);

        if (!ride.driverId || !ride.driverId.equals(driver._id)) {
            throw ApiError.forbidden(
                "Only the passenger, the assigned driver or an admin can cancel this ride",
                "RIDE_CANCEL_FORBIDDEN"
            );
        }

        cancelledBy = "driver";
    } else if (!ride.passengerId.equals(req.user._id)) {
        throw ApiError.forbidden(
            "Only the passenger, the assigned driver or an admin can cancel this ride",
            "RIDE_CANCEL_FORBIDDEN"
        );
    }

    // Business rule: once the trip has started it can no longer be cancelled
    rideService.assertCancellable(ride);

    rideService.applyTransition(ride, RIDE_STATUS.CANCELLED, { cancelledBy }, reason || null);

    await ride.save();

    // Accepting a ride takes the driver offline, so a cancellation always has to
// hand them back to the pool, whoever cancelled
    if (ride.driverId) {
        await Driver.updateOne({ _id: ride.driverId }, { $set: { isOnline: true } });
    }

    return success(res, {
        message: "Ride cancelled successfully",
        data: { ride }
    });
});

// ==========================================
// PATCH /api/rides/:rideId/accept
// Driver only, BACKEND_PLAN.md section 24
// ==========================================
const acceptRide = asyncHandler(async (req, res) => {
    const ride = await Ride.findById(req.params.rideId);

    if (!ride) {
        throw ApiError.notFound("Ride not found", "RIDE_NOT_FOUND");
    }

    const driver = await driverService.requireDriverProfile(req.user._id);

    // Check the status first so an already accepted ride reports the state
    // conflict instead of an eligibility error
    rideService.assertTransition(ride, RIDE_STATUS.ACCEPTED);

    // ride.driverId holds a Driver id, not a User id
    if (ride.driverId && !ride.driverId.equals(driver._id)) {
        throw ApiError.conflict("This ride has already been accepted", "RIDE_ALREADY_ACCEPTED");
    }

    await driverService.assertDriverCanAcceptRides(driver);

    const vehicleTypes = await driverService.getDriverVehicleTypes(driver._id);

    if (!vehicleTypes.includes(ride.vehicleType)) {
        throw ApiError.forbidden(
            `This ride needs a ${ride.vehicleType} vehicle`,
            "VEHICLE_TYPE_MISMATCH"
        );
    }

    // A driver can only hold one ride at a time
    const driverBusy = await Ride.findOne({
        driverId: driver._id,
        status: {
            $in: [
                RIDE_STATUS.ACCEPTED,
                RIDE_STATUS.DRIVER_ARRIVING,
                RIDE_STATUS.DRIVER_ARRIVED,
                RIDE_STATUS.STARTED
            ]
        }
    });

    if (driverBusy) {
        throw ApiError.conflict(
            "Finish your current ride before accepting a new one",
            "DRIVER_BUSY"
        );
    }

    const vehicle = await Vehicle.findOne({
        driverId: driver._id,
        type: ride.vehicleType,
        isActive: true
    });

    ride.driverId = driver._id;
    ride.vehicleId = vehicle ? vehicle._id : null;

    rideService.applyTransition(ride, RIDE_STATUS.ACCEPTED);

    // Stop taking new requests while on a trip
    driver.isOnline = false;

    await Promise.all([ride.save(), driver.save()]);

    return success(res, {
        message: "Ride accepted successfully",
        data: { ride }
    });
});

// ==========================================
// PATCH /api/rides/:rideId/reject
// Driver only, BACKEND_PLAN.md section 25
//
// The ride stays requested so other eligible drivers still see it.
// ==========================================
const rejectRide = asyncHandler(async (req, res) => {
    const ride = await Ride.findById(req.params.rideId);

    if (!ride) {
        throw ApiError.notFound("Ride not found", "RIDE_NOT_FOUND");
    }

    const driver = await driverService.requireDriverProfile(req.user._id);

    if (ride.driverId) {
        throw ApiError.conflict(
            "This ride has already been accepted by another driver",
            "RIDE_ALREADY_ACCEPTED"
        );
    }

    if (ride.status !== RIDE_STATUS.REQUESTED) {
        throw ApiError.conflict(
            `A ride that is ${ride.status} cannot be rejected`,
            "INVALID_RIDE_TRANSITION"
        );
    }

    if (ride.rejectedBy.some((id) => id.equals(driver._id))) {
        throw ApiError.conflict("You already rejected this ride", "RIDE_ALREADY_REJECTED");
    }

    ride.rejectedBy.push(driver._id);

    await ride.save();

    return success(res, {
        message: "Ride rejected successfully",
        data: { ride }
    });
});

/**
 * Shared handler for the linear driver side transitions:
 * arriving -> arrived -> start -> complete
 * (BACKEND_PLAN.md sections 26-29)
 */
const driverTransition = (nextStatus, message) =>
    asyncHandler(async (req, res) => {
        const { ride } = await loadAssignedRideForDriver(req.params.rideId, req.user);

        rideService.assertTransition(ride, nextStatus);

        rideService.applyTransition(ride, nextStatus);

        if (nextStatus === RIDE_STATUS.COMPLETED) {
            // Backend calculates the final fare (section 29)
            const finalFare = fareService.calculateFinalFare({
                vehicleType: ride.vehicleType,
                distance: ride.distance,
                duration: ride.estimatedDuration,
                estimatedFare: ride.estimatedFare
            });

            ride.finalFare = finalFare;

            // ... and creates the matching payment record
            const payment = await Payment.findOneAndUpdate(
                { rideId: ride._id },
                {
                    $setOnInsert: {
                        rideId: ride._id,
                        passengerId: ride.passengerId,
                        driverId: ride.driverId,
                        amount: finalFare,
                        method: PAYMENT_METHOD.CASH,
                        status: PAYMENT_STATUS.PENDING
                    }
                },
                { upsert: true, setDefaultsOnInsert: true, returnDocument: "after" }
            );

            ride.paymentId = payment._id;

            // Accepting a ride took the driver offline, so finishing it has to
            // hand them back to the pool
            await Driver.updateOne(
                { _id: ride.driverId },
                { $inc: { totalRides: 1 }, $set: { isOnline: true } }
            );
        }

        await ride.save();

        return success(res, {
            message,
            data: { ride }
        });
    });

// PATCH /api/rides/:rideId/arriving
const markArriving = driverTransition(RIDE_STATUS.DRIVER_ARRIVING, "Driver is on the way");

// PATCH /api/rides/:rideId/arrived
const markArrived = driverTransition(RIDE_STATUS.DRIVER_ARRIVED, "Driver has arrived");

// PATCH /api/rides/:rideId/start
const startRide = driverTransition(RIDE_STATUS.STARTED, "Ride started successfully");

// PATCH /api/rides/:rideId/complete
const completeRide = driverTransition(RIDE_STATUS.COMPLETED, "Ride completed successfully");

// ==========================================
// POST /api/rides/:rideId/rating
// BACKEND_PLAN.md section 33
// ==========================================
const rateRide = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    const ride = await Ride.findById(req.params.rideId);

    if (!ride) {
        throw ApiError.notFound("Ride not found", "RIDE_NOT_FOUND");
    }

    if (req.user.role !== ROLES.PASSENGER || !ride.passengerId.equals(req.user._id)) {
        throw ApiError.forbidden("Only the passenger of this ride can rate it", "RATING_FORBIDDEN");
    }

    if (ride.status !== RIDE_STATUS.COMPLETED) {
        throw ApiError.conflict(
            "You can only rate a completed ride",
            "RIDE_NOT_COMPLETED"
        );
    }

    if (!ride.driverId) {
        throw ApiError.conflict("This ride has no driver to rate", "NO_DRIVER_TO_RATE");
    }

    const alreadyRated = await Rating.findOne({ rideId: ride._id });

    if (alreadyRated) {
        throw ApiError.conflict("This ride has already been rated", "RIDE_ALREADY_RATED");
    }

    const driverRating = await Rating.create({
        rideId: ride._id,
        passengerId: ride.passengerId,
        driverId: ride.driverId,
        rating,
        comment: comment || null
    });

    await driverService.recalculateDriverRating(ride.driverId);

    return created(res, {
        message: "Rating submitted successfully",
        data: { rating: driverRating }
    });
});

// ==========================================
// GET /api/rides/:rideId/rating
// BACKEND_PLAN.md section 33
// ==========================================
const getRideRating = asyncHandler(async (req, res) => {
    const ride = await Ride.findById(req.params.rideId);

    if (!ride) {
        throw ApiError.notFound("Ride not found", "RIDE_NOT_FOUND");
    }

    if (req.user.role === ROLES.PASSENGER && !ride.passengerId.equals(req.user._id)) {
        throw ApiError.forbidden("You do not have access to this ride", "RIDE_ACCESS_DENIED");
    }

    if (req.user.role === ROLES.DRIVER) {
        const driver = await Driver.findOne({ userId: req.user._id }).select("_id").lean();

        if (!driver || !ride.driverId || !ride.driverId.equals(driver._id)) {
            throw ApiError.forbidden("You do not have access to this ride", "RIDE_ACCESS_DENIED");
        }
    }

    const rating = await Rating.findOne({ rideId: ride._id });

    return success(res, {
        message: rating ? "Rating fetched successfully" : "This ride has not been rated yet",
        data: { rating: rating || null }
    });
});

module.exports = {
    getFareEstimate,
    createRide,
    getRide,
    getRideHistory,
    getActiveRide,
    cancelRide,
    acceptRide,
    rejectRide,
    markArriving,
    markArrived,
    startRide,
    completeRide,
    rateRide,
    getRideRating
};