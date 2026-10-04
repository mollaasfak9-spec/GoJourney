const express = require("express");

const {
    getUsers,
    getDrivers,
    getRides,
    getPayments
} = require("../controllers/admin.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

// Admin only routes

router.get(
    "/users",
    authMiddleware,
    roleMiddleware("admin"),
    getUsers
);

router.get(
    "/drivers",
    authMiddleware,
    roleMiddleware("admin"),
    getDrivers
);

router.get(
    "/rides",
    authMiddleware,
    roleMiddleware("admin"),
    getRides
);

router.get(
    "/payments",
    authMiddleware,
    roleMiddleware("admin"),
    getPayments
);

module.exports = router;