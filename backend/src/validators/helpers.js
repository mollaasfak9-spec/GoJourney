/**
 * Minimal, dependency-free validation toolkit.
 *
 * The plan lists "Zod/Joi" as optional (section 1) and the project already has
 * a `validation.middleware.js`, so rules are expressed as plain functions that
 * collect issues instead of adding a new dependency.
 *
 * Errors are surfaced as 422 Unprocessable Entity per BACKEND_PLAN.md
 * section 36.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{10}$/;
const OBJECT_ID_REGEX = /^[a-fA-F0-9]{24}$/;
const BOOLEAN_TRUE = ["true", "1", "yes"];
const BOOLEAN_FALSE = ["false", "0", "no"];

const isEmpty = (value) =>
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "");

const isObject = (value) =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const isNumber = (value) =>
    typeof value === "number" && Number.isFinite(value);

/**
 * Collects field level issues while a validator runs.
 */
class Validator {
    constructor(source = "body") {
        this.source = source;
        this.issues = [];
    }

    add(field, message) {
        this.issues.push({ field, message, location: this.source });
        return this;
    }

    get isValid() {
        return this.issues.length === 0;
    }
}

const requireFields = (validator, data, fields) => {
    fields.forEach((field) => {
        if (isEmpty(data[field])) {
            validator.add(field, `${field} is required`);
        }
    });
};

const isEmail = (validator, value, field = "email") => {
    if (!isEmpty(value) && (typeof value !== "string" || !EMAIL_REGEX.test(value.trim()))) {
        validator.add(field, `${field} must be a valid email address`);
    }
};

const isPhone = (validator, value, field = "phone") => {
    if (!isEmpty(value) && (typeof value !== "string" || !PHONE_REGEX.test(value.trim()))) {
        validator.add(field, `${field} must be a 10 digit number`);
    }
};

const isPassword = (validator, value, field = "password") => {
    if (!isEmpty(value)) {
        if (typeof value !== "string" || value.length < 6) {
            validator.add(field, `${field} must be at least 6 characters long`);
        } else if (value.length > 72) {
            validator.add(field, `${field} cannot exceed 72 characters`);
        }
    }
};

const isEnum = (validator, value, allowed, field) => {
    if (!isEmpty(value) && !allowed.includes(value)) {
        validator.add(field, `${field} must be one of: ${allowed.join(", ")}`);
    }
};

const isObjectId = (validator, value, field) => {
    if (!isEmpty(value) && (typeof value !== "string" || !OBJECT_ID_REGEX.test(value))) {
        validator.add(field, `${field} must be a valid id`);
    }
};

const isLatitude = (validator, value, field = "lat") => {
    if (!isEmpty(value) && (!isNumber(value) || value < -90 || value > 90)) {
        validator.add(field, `${field} must be a number between -90 and 90`);
    }
};

const isLongitude = (validator, value, field = "lng") => {
    if (!isEmpty(value) && (!isNumber(value) || value < -180 || value > 180)) {
        validator.add(field, `${field} must be a number between -180 and 180`);
    }
};

const isBoolean = (validator, value, field) => {
    if (!isEmpty(value) && typeof value !== "boolean") {
        validator.add(field, `${field} must be true or false`);
    }
};

/**
 * Validates a coordinate point such as `{ address, lat, lng }`.
 */
const isPoint = (validator, point, field, { requireAddress = false } = {}) => {
    if (!isObject(point)) {
        validator.add(field, `${field} must be an object with lat and lng`);
        return;
    }

    if (isEmpty(point.lat)) {
        validator.add(`${field}.lat`, `${field}.lat is required`);
    } else {
        isLatitude(validator, point.lat, `${field}.lat`);
    }

    if (isEmpty(point.lng)) {
        validator.add(`${field}.lng`, `${field}.lng is required`);
    } else {
        isLongitude(validator, point.lng, `${field}.lng`);
    }

    if (requireAddress && isEmpty(point.address)) {
        validator.add(`${field}.address`, `${field}.address is required`);
    }
};

const isString = (validator, value, field, { max = 500, min = 1 } = {}) => {
    if (!isEmpty(value)) {
        if (typeof value !== "string") {
            validator.add(field, `${field} must be a string`);
        } else {
            const length = value.trim().length;

            if (length < min) {
                validator.add(field, `${field} must be at least ${min} characters long`);
            } else if (length > max) {
                validator.add(field, `${field} cannot exceed ${max} characters`);
            }
        }
    }
};

const isNumberInRange = (validator, value, field, { min = 0, max = Number.MAX_SAFE_INTEGER, integer = false } = {}) => {
    if (isEmpty(value)) {
        return;
    }

    const parsed = typeof value === "string" ? Number(value) : value;

    if (!isNumber(parsed)) {
        validator.add(field, `${field} must be a number`);
        return;
    }

    if (integer && !Number.isInteger(parsed)) {
        validator.add(field, `${field} must be a whole number`);
    }

    if (parsed < min) {
        validator.add(field, `${field} must be at least ${min}`);
    } else if (parsed > max) {
        validator.add(field, `${field} cannot be more than ${max}`);
    }
};

/**
 * Query string booleans arrive as text, so parse them before validating.
 */
const parseBooleanQuery = (value) => {
    if (typeof value === "boolean") {
        return value;
    }

    if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();

        if (BOOLEAN_TRUE.includes(normalized)) {
            return true;
        }

        if (BOOLEAN_FALSE.includes(normalized)) {
            return false;
        }
    }

    return value;
};

const rejectUnknownFields = (validator, data, allowed) => {
    Object.keys(data || {}).forEach((field) => {
        if (!allowed.includes(field)) {
            validator.add(field, `${field} is not an accepted field`);
        }
    });
};

module.exports = {
    EMAIL_REGEX,
    PHONE_REGEX,
    OBJECT_ID_REGEX,
    Validator,
    isEmpty,
    isObject,
    isNumber,
    requireFields,
    isEmail,
    isPhone,
    isPassword,
    isEnum,
    isObjectId,
    isLatitude,
    isLongitude,
    isBoolean,
    isPoint,
    isString,
    isNumberInRange,
    parseBooleanQuery,
    rejectUnknownFields
};