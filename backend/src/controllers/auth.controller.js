const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { success, created } = require("../utils/response");
const { ROLES } = require("../utils/constants");
const { getOrCreateDriverProfile } = require("../services/driver.service");

const {
    generateToken,
    setAuthCookie,
    clearAuthCookie
} = require("../middleware/auth.middleware");

const { SELF_SERVICE_ROLES } = require("../validators/auth.validator");

// ==========================================
// POST /api/auth/register
// BACKEND_PLAN.md section 11
// ==========================================
const register = asyncHandler(async (req, res) => {
    const { name, email, phone, password, role } = req.body;

    // Admin accounts can never be created through self signup
    if (role && !SELF_SERVICE_ROLES.includes(role)) {
        throw ApiError.forbidden(
            "This role cannot be self assigned. Ask an admin to create the account.",
            "ROLE_NOT_SELF_ASSIGNABLE"
        );
    }

    const requestedRole = role || ROLES.PASSENGER;

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
        throw ApiError.conflict("An account with this email already exists", "EMAIL_ALREADY_REGISTERED");
    }

    const user = await User.create({
        name,
        email,
        phone,
        // The pre-save hook hashes this into passwordHash (section 39)
        passwordHash: password,
        role: requestedRole
    });

    // Drivers get their profile immediately so /api/drivers/me works right away
    if (requestedRole === ROLES.DRIVER) {
        await getOrCreateDriverProfile(user._id);
    }

    const token = generateToken(user);

    setAuthCookie(res, token);

    return created(res, {
        message: "Account registered successfully",
        data: { user, token }
    });
});

// ==========================================
// POST /api/auth/login
// BACKEND_PLAN.md section 11
// ==========================================
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");

    // Same message for unknown email and wrong password, no user enumeration
    if (!user) {
        throw ApiError.unauthorized("Invalid email or password", "INVALID_CREDENTIALS");
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw ApiError.unauthorized("Invalid email or password", "INVALID_CREDENTIALS");
    }

    if (!user.isActive) {
        throw ApiError.forbidden("Your account has been deactivated", "ACCOUNT_DEACTIVATED");
    }

    const token = generateToken(user);

    setAuthCookie(res, token);

    return success(res, {
        message: "Login successful",
        data: { user, token }
    });
});

// ==========================================
// GET /api/auth/me
// BACKEND_PLAN.md section 11 (protected)
// ==========================================
const getCurrentUser = asyncHandler(async (req, res) =>
    success(res, {
        message: "Current user fetched successfully",
        data: { user: req.user }
    })
);

// ==========================================
// POST /api/auth/logout
// BACKEND_PLAN.md section 11
// ==========================================
const logout = asyncHandler(async (req, res) => {
    clearAuthCookie(res);

    return success(res, {
        message: "Logout successful",
        data: null
    });
});

module.exports = {
    register,
    login,
    logout,
    getCurrentUser
};