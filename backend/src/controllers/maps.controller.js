const asyncHandler = require("../utils/asyncHandler");
const { success } = require("../utils/response");
const mapsService = require("../services/maps.service");

// ==========================================
// GET /api/maps/geocode?q=india+gate
// Proxies Nominatim so the public provider sees a single, rate limited client.
// ==========================================
const searchAddress = asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit) || 6;

    const results = await mapsService.geocode(req.query.q, { limit });

    return success(res, {
        message: results.length ? "Addresses found" : "No matching addresses found",
        data: results
    });
});

// ==========================================
// GET /api/maps/reverse?lat=..&lng=..
// Resolves a dropped pin to a readable address (best effort).
// ==========================================
const reverseAddress = asyncHandler(async (req, res) => {
    const result = await mapsService.reverseGeocode(req.query.lat, req.query.lng);

    return success(res, {
        message: result ? "Address resolved" : "No address found for this location",
        data: result
    });
});

// ==========================================
// POST /api/maps/route
// Road route, distance and travel time between two points.
// ==========================================
const getRoute = asyncHandler(async (req, res) => {
    const { origin, destination } = req.body;

    mapsService.assertDistinctPoints(origin, destination);

    const result = await mapsService.route({ origin, destination });

    return success(res, {
        message: result.approximate
            ? "Live routing is unavailable, showing an approximate distance"
            : "Route calculated successfully",
        data: result
    });
});

module.exports = {
    searchAddress,
    reverseAddress,
    getRoute
};
