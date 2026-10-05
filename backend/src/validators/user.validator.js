const {
    Validator,
    requireFields,
    isString,
    isPhone,
    isPassword,
    isObjectId
} = require("./helpers");

const { ROLES_LIST } = require("../utils/constants");

const UPDATABLE_FIELDS = ["name", "phone", "profileImage", "role"];

// PATCH /api/users/me (BACKEND_PLAN.md section 14)
const updateProfile = (data) => {
    const validator = new Validator("body");

    if (Object.keys(data || {}).length === 0) {
        validator.add("body", "at least one field is required to update");
    }

    if (data.name !== undefined) {
        isString(validator, data.name, "name", { min: 2, max: 80 });
    }

    if (data.phone !== undefined && data.phone !== null && data.phone !== "") {
        isPhone(validator, data.phone, "phone");
    }

    if (data.profileImage !== undefined && data.profileImage !== null) {
        if (typeof data.profileImage !== "string" || !/^https?:\/\//.test(data.profileImage)) {
            validator.add("profileImage", "profileImage must be a valid http(s) URL");
        }
    }

    // Role changes are admin only, the controller decides who may send it
    if (data.role !== undefined) {
        if (!ROLES_LIST.includes(data.role)) {
            validator.add("role", `role must be one of: ${ROLES_LIST.join(", ")}`);
        }
    }

    Object.keys(data || {}).forEach((field) => {
        if (!UPDATABLE_FIELDS.includes(field)) {
            validator.add(field, `${field} is not an accepted field`);
        }
    });

    return validator;
};

// PATCH /api/users/me/password (BACKEND_PLAN.md section 14)
const changePassword = (data) => {
    const validator = new Validator("body");

    requireFields(validator, data, ["currentPassword", "newPassword"]);

    if (typeof data.currentPassword !== "string") {
        validator.add("currentPassword", "currentPassword must be a string");
    }

    isPassword(validator, data.newPassword, "newPassword");

    Object.keys(data || {}).forEach((field) => {
        if (!["currentPassword", "newPassword"].includes(field)) {
            validator.add(field, `${field} is not an accepted field`);
        }
    });

    return validator;
};

// PATCH /api/admin/users/:id/status (BACKEND_PLAN.md section 34)
const updateStatus = (data) => {
    const validator = new Validator("body");

    requireFields(validator, data, ["isActive"]);

    if (data.isActive !== undefined && typeof data.isActive !== "boolean") {
        validator.add("isActive", "isActive must be true or false");
    }

    Object.keys(data || {}).forEach((field) => {
        if (!["isActive", "reason"].includes(field)) {
            validator.add(field, `${field} is not an accepted field`);
        }
    });

    return validator;
};

const idParam = (data) => {
    const validator = new Validator("params");

    requireFields(validator, data, ["id"]);
    isObjectId(validator, data.id, "id");

    return validator;
};

module.exports = {
    UPDATABLE_FIELDS,
    updateProfile,
    changePassword,
    updateStatus,
    idParam
};