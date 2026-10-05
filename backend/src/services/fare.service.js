const ApiError = require("../utils/ApiError");
const { estimateRoute } = require("../utils/geo");
const { FARE_TABLE } = require("../utils/constants");

/**
 * Fare calculation (BACKEND_PLAN.md section 17).
 *
 * The backend is the only source of truth for pricing, the frontend must never
 * compute the official fare.
 *
 * fare = baseFare + distance * perKmRate + durationMinutes * perMinuteRate
 *
 * Example for a car: 50 + (5 * 12) + (20 * 2) = 150
 */

const getRateFor = (vehicleType) => {
    const rates = FARE_TABLE[vehicleType];

    if (!rates) {
        throw ApiError.badRequest(
            `Fare is not available for vehicle type: ${vehicleType}`,
            "UNSUPPORTED_VEHICLE_TYPE"
        );
    }

    return rates;
};

/**
 * Backend calculated fare for a given distance and duration.
 * Rounded to the nearest rupee.
 */
const calculateFare = ({ vehicleType, distance, duration }) => {
    const { baseFare, perKmRate, perMinuteRate } = getRateFor(vehicleType);

    const safeDistance = Math.max(Number(distance) || 0, 0);
    const safeDuration = Math.max(Number(duration) || 0, 0);

    const rawFare = baseFare + safeDistance * perKmRate + safeDuration * perMinuteRate;

    return Math.round(rawFare);
};

/**
 * Full estimate for POST /api/rides/fare-estimate.
 * Returns exactly the shape documented in BACKEND_PLAN.md section 18.
 */
const estimateFare = ({ pickup, destination, vehicleType }) => {
    const { distance, duration } = estimateRoute(pickup, destination);

    const rates = getRateFor(vehicleType);

    return {
        vehicleType,
        estimatedFare: calculateFare({ vehicleType, distance, duration }),
        estimatedDistance: distance,
        estimatedDuration: duration,
        breakdown: {
            baseFare: rates.baseFare,
            distanceCharge: Math.round(distance * rates.perKmRate),
            timeCharge: Math.round(duration * rates.perMinuteRate)
        }
    };
};

/**
 * Final fare on completion. Distance can differ from the estimate because of
 * detours, so the recalculated fare is not allowed to drop below the estimate.
 */
const calculateFinalFare = ({ vehicleType, distance, duration, estimatedFare }) => {
    const fare = calculateFare({ vehicleType, distance, duration });

    return Math.max(fare, estimatedFare || 0);
};

module.exports = {
    getRateFor,
    calculateFare,
    estimateFare,
    calculateFinalFare,
    FARE_TABLE
};