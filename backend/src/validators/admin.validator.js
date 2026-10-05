const { Validator, requireFields, isEnum, isObjectId, isString, parseBooleanQuery, isEmpty } = require("./helpers");

const { ROLES_LIST, PAYMENT_STATUS_LIST } = require("../utils/constants");

// GET /api/admin/users filters (BACKEND_PLAN.md sections 40-41)
const usersQuery = (data) => {
    const validator = new Validator("query");

    if (!isEmpty(data.role)) {
        isEnum(validator, data.role, ROLES_LIST, "role");
    }

    if (data.isActive !== undefined && typeof parseBooleanQuery(data.isActive) !== "boolean") {
        validator.add("isActive", "isActive must be true or false");
    }

    if (data.search !== undefined) {
        isString(validator, data.search, "search", { min: 1, max: 80 });
    }

    return validator;
};

// GET /api/admin/payments filters (BACKEND_PLAN.md sections 40-41)
const paymentsQuery = (data) => {
    const validator = new Validator("query");

    if (!isEmpty(data.status)) {
        isEnum(validator, data.status, PAYMENT_STATUS_LIST, "status");
    }

    return validator;
};

// :id params shared by every admin detail endpoint
const idParam = (data) => {
    const validator = new Validator("params");

    requireFields(validator, data, ["id"]);
    isObjectId(validator, data.id, "id");

    return validator;
};

module.exports = {
    usersQuery,
    paymentsQuery,
    idParam
};