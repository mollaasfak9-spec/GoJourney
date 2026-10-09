const express = require("express");

const mapsController = require("../controllers/maps.controller");
const mapsValidator = require("../validators/maps.validator");

const { authMiddleware } = require("../middleware/auth.middleware");
const validate = require("../middleware/validation.middleware");
const { externalRateLimiter } = require("../middleware/rateLimit.middleware");

const router = express.Router();

// Geocoding and routing are proxied to free public providers, so they sit
// behind authentication and a stricter rate limit than the rest of the API.
router.use(authMiddleware, externalRateLimiter);

// GET /api/maps/geocode?q=...
router.get(
    "/geocode",
    validate("query", mapsValidator.geocodeQuery),
    mapsController.searchAddress
);

// GET /api/maps/reverse?lat=..&lng=..
router.get(
    "/reverse",
    validate("query", mapsValidator.reverseQuery),
    mapsController.reverseAddress
);

// POST /api/maps/route
router.post("/route", validate("body", mapsValidator.routeBody), mapsController.getRoute);

module.exports = router;
