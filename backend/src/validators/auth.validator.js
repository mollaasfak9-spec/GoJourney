const {
    Validator,
    requireFields,
    isEmail,
    isPhone,
    isPassword,
    isEnum,
    rejectUnknownFields
} = require("./helpers");

const { ROLES, ROLES_LIST } = require("../utils/constants");

// POST /api/auth/register (BACKEND_PLAN.md section 11)
const register = (data) => {
    const validator = new Validator("body");

    rejectUnknownFields(validator, data, ["name", "email", "phone", "password", "role"]);

    requireFields(validator, data, ["name", "email", "password"]);

    if (!data.name || typeof data.name !== "string" || data.name.trim().length < 2) {
        validator.add("name", "name must be at least 2 characters long");
    }

    isEmail(validator, data.email);
    isPhone(validator, data.phone);
    isPassword(validator, data.password);

    // The role enum is validated here, but whether the role may be self
    // assigned is a controller decision so it can answer with a clear 403
    isEnum(validator, data.role, ROLES_LIST, "role");

    return validator;
};

// POST /api/auth/login (BACKEND_PLAN.md section 11)
const login = (data) => {
    const validator = new Validator("body");

    rejectUnknownFields(validator, data, ["email", "password"]);

    requireFields(validator, data, ["email", "password"]);

    isEmail(validator, data.email);

    if (!data.password || typeof data.password !== "string") {
        validator.add("password", "password must be a string");
    }

    return validator;
};

// Self signup role whitelist, exported for the controller
const SELF_SERVICE_ROLES = [ROLES.PASSENGER, ROLES.DRIVER];

module.exports = {
    register,
    login,
    SELF_SERVICE_ROLES
};