const {
    Validator,
    requireFields,
    isString,
    isBoolean,
    isEnum,
    isObjectId,
    isNumberInRange,
    parseBooleanQuery,
    rejectUnknownFields,
    isLatitude,
    isLongitude,
    isEmpty
} = require("./helpers");

const { VEHICLE_TYPES, VERIFICATION_STATUS_LIST } = require("../utils/constants");

// PATCH /api/drivers/me (BACKEND_PLAN.md section 15)
const updateProfile = (data) => {
    const validator = new Validator("body");

    rejectUnknownFields(validator, data, ["licenseNumber"]);

    if (Object.keys(data || {}).length === 0) {
        validator.add("body", "at least one field is required to update");
    }

    if (data.licenseNumber !== undefined) {
        isString(validator, data.licenseNumber, "licenseNumber", { min: 4, max: 30 });
    }

    return validator;
};

// PATCH /api/drivers/me/status (BACKEND_PLAN.md section 15)
const updateStatus = (data) => {
    const validator = new Validator("body");

    requireFields(validator, data, ["isOnline"]);

    isBoolean(validator, data.isOnline, "isOnline");

    return validator;
};

// PATCH /api/drivers/me/location (BACKEND_PLAN.md section 15)
const updateLocation = (data) => {
    const validator = new Validator("body");

    rejectUnknownFields(validator, data, ["lat", "lng", "address"]);

    requireFields(validator, data, ["lat", "lng"]);

    isLatitude(validator, data.lat, "lat");
    isLongitude(validator, data.lng, "lng");

    if (data.address !== undefined && data.address !== null) {
        isString(validator, data.address, "address", { max: 200 });
    }

    return validator;
};

// POST /api/drivers/me/vehicles (BACKEND_PLAN.md section 16)
const createVehicle = (data) => {
    const validator = new Validator("body");

    rejectUnknownFields(validator, data, [
        "type",
        "brand",
        "model",
        "color",
        "year",
        "registrationNumber"
    ]);

    requireFields(validator, data, ["type", "registrationNumber"]);

    isEnum(validator, data.type, VEHICLE_TYPES, "type");

    if (!isEmpty(data.registrationNumber)) {
        isString(validator, data.registrationNumber, "registrationNumber", { min: 3, max: 20 });
    }

    validateOptionalVehicleFields(validator, data);

    return validator;
};

// PATCH /api/drivers/me/vehicles/:vehicleId (BACKEND_PLAN.md section 16)
const updateVehicle = (data) => {
    const validator = new Validator("body");

    rejectUnknownFields(validator, data, [
        "type",
        "brand",
        "model",
        "color",
        "year",
        "registrationNumber",
        "isActive"
    ]);

    if (Object.keys(data || {}).length === 0) {
        validator.add("body", "at least one field is required to update");
    }

    if (!isEmpty(data.type)) {
        isEnum(validator, data.type, VEHICLE_TYPES, "type");
    }

    if (!isEmpty(data.registrationNumber)) {
        isString(validator, data.registrationNumber, "registrationNumber", { min: 3, max: 20 });
    }

    if (data.isActive !== undefined) {
        isBoolean(validator, data.isActive, "isActive");
    }

    validateOptionalVehicleFields(validator, data);

    return validator;
};

const validateOptionalVehicleFields = (validator, data) => {
    ["brand", "model", "color"].forEach((field) => {
        if (data[field] !== undefined && data[field] !== null) {
            isString(validator, data[field], field, { min: 1, max: 60 });
        }
    });

    if (data.year !== undefined && data.year !== null) {
        isNumberInRange(validator, data.year, "year", {
            min: 1990,
            max: new Date().getFullYear() + 1,
            integer: true
        });
    }
};

// PATCH /api/admin/drivers/:id/verify (BACKEND_PLAN.md section 34)
const verifyDriver = (data) => {
    const validator = new Validator("body");

    rejectUnknownFields(validator, data, ["verificationStatus", "remarks"]);

    requireFields(validator, data, ["verificationStatus"]);

    isEnum(validator, data.verificationStatus, VERIFICATION_STATUS_LIST, "verificationStatus");

    if (data.remarks !== undefined && data.remarks !== null) {
        isString(validator, data.remarks, "remarks", { max: 300 });
    }

    return validator;
};

// PATCH /api/admin/drivers/:id/status (BACKEND_PLAN.md section 34)
const updateAdminDriverStatus = (data) => {
    const validator = new Validator("body");

    rejectUnknownFields(validator, data, ["isOnline", "reason"]);

    requireFields(validator, data, ["isOnline"]);

    isBoolean(validator, data.isOnline, "isOnline");

    if (data.reason !== undefined && data.reason !== null) {
        isString(validator, data.reason, "reason", { max: 300 });
    }

    return validator;
};

const idParam = (data) => {
    const validator = new Validator("params");

    requireFields(validator, data, ["id"]);
    isObjectId(validator, data.id, "id");

    return validator;
};

const vehicleIdParam = (data) => {
    const validator = new Validator("params");

    requireFields(validator, data, ["vehicleId"]);
    isObjectId(validator, data.vehicleId, "vehicleId");

    return validator;
};

// GET /api/drivers/me/ride-requests (BACKEND_PLAN.md section 23)
const rideRequestsQuery = (data) => {
    const validator = new Validator("query");

    if (!isEmpty(data.radius)) {
        isNumberInRange(validator, data.radius, "radius", { min: 1, max: 50 });
    }

    if (!isEmpty(data.vehicleType)) {
        isEnum(validator, data.vehicleType, VEHICLE_TYPES, "vehicleType");
    }

    return validator;
};

// GET /api/admin/drivers filters (BACKEND_PLAN.md section 41)
const adminDriversQuery = (data) => {
    const validator = new Validator("query");

    ["verified", "isOnline"].forEach((field) => {
        if (data[field] !== undefined && typeof parseBooleanQuery(data[field]) !== "boolean") {
            validator.add(field, `${field} must be true or false`);
        }
    });

    if (data.search !== undefined) {
        isString(validator, data.search, "search", { min: 1, max: 80 });
    }

    return validator;
};

module.exports = {
    updateProfile,
    updateStatus,
    updateLocation,
    createVehicle,
    updateVehicle,
    verifyDriver,
    updateAdminDriverStatus,
    idParam,
    vehicleIdParam,
    rideRequestsQuery,
    adminDriversQuery
};