const jwt = require("jsonwebtoken");

const User = require("../models/User");
const env = require("../config/env");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const TOKEN_COOKIE = "ridex_token";

const generateToken = (user) =>
    jwt.sign(
        {
            sub: user._id.toString(),
            role: user.role,
            email: user.email
        },
        env.JWT_SECRET,
        { expiresIn: env.JWT_EXPIRES_IN }
    );

/**
 * BACKEND_PLAN.md section 1 mentions "JWT / secure cookie authentication",
 * so the token is accepted from either the Authorization header or the cookie.
 */
const extractToken = (req) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const [scheme, token] = authHeader.split(" ");

        if (!/^Bearer$/i.test(scheme) || !token) {
            throw ApiError.unauthorized("Invalid authorization header format", "INVALID_AUTH_HEADER");
        }

        return token;
    }

    if (req.cookies && req.cookies[TOKEN_COOKIE]) {
        return req.cookies[TOKEN_COOKIE];
    }

    throw ApiError.unauthorized("Authentication token is required", "TOKEN_REQUIRED");
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, env.JWT_SECRET);
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw ApiError.unauthorized("Token has expired", "TOKEN_EXPIRED");
        }

        throw ApiError.unauthorized("Invalid token", "INVALID_TOKEN");
    }
};

const setAuthCookie = (res, token) => {
    res.cookie(TOKEN_COOKIE, token, {
        httpOnly: true,
        secure: env.isProduction,
        sameSite: env.isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
};

const clearAuthCookie = (res) => {
    res.clearCookie(TOKEN_COOKIE);
};

/**
 * Request -> read token -> verify -> load user -> req.user -> next()
 * (BACKEND_PLAN.md section 12)
 */
const authMiddleware = asyncHandler(async (req, res, next) => {
    const token = extractToken(req);
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.sub);

    if (!user) {
        throw ApiError.unauthorized("User no longer exists", "USER_NOT_FOUND");
    }

    if (!user.isActive) {
        throw ApiError.forbidden("Your account has been deactivated", "ACCOUNT_DEACTIVATED");
    }

    req.user = user;
    req.token = token;

    next();
});

/**
 * Same as authMiddleware but never rejects. Useful for endpoints that behave
 * differently for guests, such as logout.
 */
const optionalAuthMiddleware = asyncHandler(async (req, res, next) => {
    try {
        const token = extractToken(req);
        const decoded = verifyToken(token);

        req.user = await User.findById(decoded.sub);
        req.token = token;
    } catch (error) {
        req.user = undefined;
    }

    next();
});

module.exports = authMiddleware;
module.exports.authMiddleware = authMiddleware;
module.exports.optionalAuthMiddleware = optionalAuthMiddleware;
module.exports.generateToken = generateToken;
module.exports.setAuthCookie = setAuthCookie;
module.exports.clearAuthCookie = clearAuthCookie;
module.exports.TOKEN_COOKIE = TOKEN_COOKIE;