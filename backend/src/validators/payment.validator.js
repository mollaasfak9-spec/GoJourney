const {
    Validator,
    requireFields,
    isEnum,
    isObjectId,
    isString,
    isNumberInRange,
    rejectUnknownFields,
    isEmpty
} = require("./helpers");

const { PAYMENT_METHOD_LIST, PAYMENT_STATUS_LIST } = require("../utils/constants");

// POST /api/payments/:rideId (BACKEND_PLAN.md section 32)
const createPayment = (data) => {
    const validator = new Validator("body");

    rejectUnknownFields(validator, data, ["method", "amount", "transactionId"]);

    requireFields(validator, data, ["method"]);

    isEnum(validator, data.method, PAYMENT_METHOD_LIST, "method");

    if (data.amount !== undefined) {
        isNumberInRange(validator, data.amount, "amount", { min: 0 });
    }

    if (!isEmpty(data.transactionId)) {
        isString(validator, data.transactionId, "transactionId", { min: 4, max: 100 });
    }

    return validator;
};

// GET /api/payments/history (BACKEND_PLAN.md section 32)
const historyQuery = (data) => {
    const validator = new Validator("query");

    if (!isEmpty(data.status)) {
        isEnum(validator, data.status, PAYMENT_STATUS_LIST, "status");
    }

    if (!isEmpty(data.method)) {
        isEnum(validator, data.method, PAYMENT_METHOD_LIST, "method");
    }

    if (!isEmpty(data.page)) {
        isNumberInRange(validator, data.page, "page", { min: 1, integer: true });
    }

    if (!isEmpty(data.limit)) {
        isNumberInRange(validator, data.limit, "limit", { min: 1, max: 100, integer: true });
    }

    return validator;
};

const paymentIdParam = (data) => {
    const validator = new Validator("params");

    requireFields(validator, data, ["paymentId"]);
    isObjectId(validator, data.paymentId, "paymentId");

    return validator;
};

module.exports = {
    createPayment,
    historyQuery,
    paymentIdParam
};