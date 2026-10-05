const {
    Validator,
    requireFields,
    isEnum,
    isObjectId,
    isPoint,
    isString,
    isNumberInRange,
    rejectUnknownFields,
    isEmpty
} = require("./helpers");

const { VEHICLE_TYPES, RIDE_STATUS_LIST } = require("../utils/constants");

// POST /api/rides/fare-estimate (BACKEND_PLAN.md section 18)
const fareEstimate = (data) => {
    const validator = new Validator("body");

    rejectUnknownFields(validator, data, ["pickup", "destination", "vehicleType"]);

    requireFields(validator, data, ["pickup", "destination", "vehicleType"]);

    isPoint(validator, data.pickup, "pickup");
    isPoint(validator, data.destination, "destination");
    isEnum(validator, data.vehicleType, VEHICLE_TYPES, "vehicleType");

    return validator;
};

// POST /api/rides (BACKEND_PLAN.md section 19)
const createRide = (data) => {
    const validator = new Validator("body");

    rejectUnknownFields(validator, data, ["pickup", "destination", "vehicleType"]);

    requireFields(validator, data, ["pickup", "destination", "vehicleType"]);

    isPoint(validator, data.pickup, "pickup");
    isPoint(validator, data.destination, "destination");
    isEnum(validator, data.vehicleType, VEHICLE_TYPES, "vehicleType");

    return validator;
};

// GET /api/rides/history (BACKEND_PLAN.md section 21)
const historyQuery = (data) => {
    const validator = new Validator("query");

    if (!isEmpty(data.status)) {
        isEnum(validator, data.status, RIDE_STATUS_LIST, "status");
    }

    if (!isEmpty(data.page)) {
        isNumberInRange(validator, data.page, "page", { min: 1, integer: true });
    }

    if (!isEmpty(data.limit)) {
        isNumberInRange(validator, data.limit, "limit", { min: 1, max: 100, integer: true });
    }

    return validator;
};

// GET /api/admin/rides filters (BACKEND_PLAN.md sections 40-41)
const adminRidesQuery = (data) => {
    const validator = new Validator("query");

    if (!isEmpty(data.status)) {
        isEnum(validator, data.status, RIDE_STATUS_LIST, "status");
    }

    if (!isEmpty(data.vehicleType)) {
        isEnum(validator, data.vehicleType, VEHICLE_TYPES, "vehicleType");
    }

    return validator;
};

// PATCH /api/rides/:rideId/cancel (BACKEND_PLAN.md section 22)
const cancelRide = (data) => {
    const validator = new Validator("body");

    rejectUnknownFields(validator, data, ["reason"]);

    if (data.reason !== undefined && data.reason !== null) {
        isString(validator, data.reason, "reason", { max: 300 });
    }

    return validator;
};

// PATCH /api/rides/:rideId/reject (BACKEND_PLAN.md section 25)
const rejectRide = (data) => {
    const validator = new Validator("body");

    rejectUnknownFields(validator, data, ["reason"]);

    if (data.reason !== undefined && data.reason !== null) {
        isString(validator, data.reason, "reason", { max: 300 });
    }

    return validator;
};

// POST /api/rides/:rideId/rating (BACKEND_PLAN.md section 33)
const createRating = (data) => {
    const validator = new Validator("body");

    rejectUnknownFields(validator, data, ["rating", "comment"]);

    requireFields(validator, data, ["rating"]);

    const rating = data.rating;

    if (typeof rating !== "number" || !Number.isInteger(rating)) {
        validator.add("rating", "rating must be a whole number between 1 and 5");
    } else if (rating < 1 || rating > 5) {
        validator.add("rating", "rating must be between 1 and 5");
    }

    if (data.comment !== undefined && data.comment !== null) {
        isString(validator, data.comment, "comment", { min: 1, max: 500 });
    }

    return validator;
};

const rideIdParam = (data) => {
    const validator = new Validator("params");

    requireFields(validator, data, ["rideId"]);
    isObjectId(validator, data.rideId, "rideId");

    return validator;
};

module.exports = {
    fareEstimate,
    createRide,
    historyQuery,
    adminRidesQuery,
    cancelRide,
    rejectRide,
    createRating,
    rideIdParam
};