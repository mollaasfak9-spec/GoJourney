// Shared enums and business constants (BACKEND_PLAN.md sections 7-10, 31)

// Roles (BACKEND_PLAN.md section 7)
const ROLES = {
    PASSENGER: "passenger",
    DRIVER: "driver",
    ADMIN: "admin"
};

const ROLES_LIST = Object.values(ROLES);

// Vehicle types (BACKEND_PLAN.md section 9)
const VEHICLE_TYPES = [
    "bike",
    "auto",
    "car",
    "sedan",
    "suv",
    "hatchback"
];

// Ride statuses (BACKEND_PLAN.md section 10)
const RIDE_STATUS = {
    REQUESTED: "requested",
    ACCEPTED: "accepted",
    DRIVER_ARRIVING: "driver_arriving",
    DRIVER_ARRIVED: "driver_arrived",
    STARTED: "started",
    COMPLETED: "completed",
    CANCELLED: "cancelled"
};

const RIDE_STATUS_LIST = Object.values(RIDE_STATUS);

// Driver verification statuses (BACKEND_PLAN.md section 8)
const VERIFICATION_STATUS = {
    UNVERIFIED: "unverified",
    PENDING: "pending",
    VERIFIED: "verified",
    REJECTED: "rejected"
};

const VERIFICATION_STATUS_LIST = Object.values(VERIFICATION_STATUS);

// Payment methods and statuses (BACKEND_PLAN.md section 31)
const PAYMENT_METHOD = {
    CASH: "cash",
    ONLINE: "online"
};

const PAYMENT_METHOD_LIST = Object.values(PAYMENT_METHOD);

const PAYMENT_STATUS = {
    PENDING: "pending",
    PAID: "paid",
    FAILED: "failed",
    REFUNDED: "refunded"
};

const PAYMENT_STATUS_LIST = Object.values(PAYMENT_STATUS);

// Fare table (BACKEND_PLAN.md section 17)
// fare = baseFare + distance * perKmRate + durationMinutes * perMinuteRate
const FARE_TABLE = {
    bike: { baseFare: 20, perKmRate: 6, perMinuteRate: 1 },
    auto: { baseFare: 30, perKmRate: 8, perMinuteRate: 1.2 },
    car: { baseFare: 50, perKmRate: 12, perMinuteRate: 2 },
    sedan: { baseFare: 50, perKmRate: 12, perMinuteRate: 2 },
    suv: { baseFare: 70, perKmRate: 16, perMinuteRate: 2.5 },
    hatchback: { baseFare: 45, perKmRate: 11, perMinuteRate: 1.8 }
};

// Ride state machine (BACKEND_PLAN.md section 30)
const RIDE_TRANSITIONS = {
    [RIDE_STATUS.REQUESTED]: [
        RIDE_STATUS.ACCEPTED,
        RIDE_STATUS.CANCELLED
    ],
    [RIDE_STATUS.ACCEPTED]: [
        RIDE_STATUS.DRIVER_ARRIVING,
        RIDE_STATUS.CANCELLED
    ],
    [RIDE_STATUS.DRIVER_ARRIVING]: [RIDE_STATUS.DRIVER_ARRIVED, RIDE_STATUS.CANCELLED],
    [RIDE_STATUS.DRIVER_ARRIVED]: [RIDE_STATUS.STARTED, RIDE_STATUS.CANCELLED],
    [RIDE_STATUS.STARTED]: [RIDE_STATUS.COMPLETED],
    [RIDE_STATUS.COMPLETED]: [],
    [RIDE_STATUS.CANCELLED]: []
};

// Cancellation is only allowed before the trip actually starts.
const CANCELLABLE_STATUSES = [
    RIDE_STATUS.REQUESTED,
    RIDE_STATUS.ACCEPTED,
    RIDE_STATUS.DRIVER_ARRIVING,
    RIDE_STATUS.DRIVER_ARRIVED
];

module.exports = {
    ROLES,
    ROLES_LIST,
    VEHICLE_TYPES,
    RIDE_STATUS,
    RIDE_STATUS_LIST,
    VERIFICATION_STATUS,
    VERIFICATION_STATUS_LIST,
    PAYMENT_METHOD,
    PAYMENT_METHOD_LIST,
    PAYMENT_STATUS,
    PAYMENT_STATUS_LIST,
    FARE_TABLE,
    RIDE_TRANSITIONS,
    CANCELLABLE_STATUSES
};