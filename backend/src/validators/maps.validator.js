const {
    Validator,
    requireFields,
    isString,
    isPoint,
    isNumberInRange,
    rejectUnknownFields
} = require("./helpers");

// GET /api/maps/geocode?q=...
const geocodeQuery = (data) => {
    const validator = new Validator("query");

    requireFields(validator, data, ["q"]);

    // Nominatim explicitly asks consumers not to hammer short/partial queries,
    // so a minimum length is enforced here as well as in the UI.
    isString(validator, data.q, "q", { min: 3, max: 200 });

    return validator;
};

// GET /api/maps/reverse?lat=..&lng=..
const reverseQuery = (data) => {
    const validator = new Validator("query");

    requireFields(validator, data, ["lat", "lng"]);

    isNumberInRange(validator, data.lat, "lat", { min: -90, max: 90 });
    isNumberInRange(validator, data.lng, "lng", { min: -180, max: 180 });

    return validator;
};

// POST /api/maps/route
const routeBody = (data) => {
    const validator = new Validator("body");

    rejectUnknownFields(validator, data, ["origin", "destination"]);

    requireFields(validator, data, ["origin", "destination"]);

    isPoint(validator, data.origin, "origin");
    isPoint(validator, data.destination, "destination");

    return validator;
};

module.exports = {
    geocodeQuery,
    reverseQuery,
    routeBody
};
