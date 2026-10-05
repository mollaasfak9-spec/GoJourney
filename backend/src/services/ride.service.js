const ApiError = require("../utils/ApiError");
const {
    RIDE_STATUS,
    RIDE_TRANSITIONS,
    CANCELLABLE_STATUSES
} = require("../utils/constants");

/**
 * Ride state machine (BACKEND_PLAN.md section 30).
 *
 * requested -> accepted -> driver_arriving -> driver_arrived -> started -> completed
 * requested | accepted | driver_arriving | driver_arrived -> cancelled
 *
 * Terminal states (completed, cancelled) have no outgoing transitions.
 */

const canTransition = (from, to) => (RIDE_TRANSITIONS[from] || []).includes(to);

const getAllowedTransitions = (status) => RIDE_TRANSITIONS[status] || [];

const isTerminal = (status) => getAllowedTransitions(status).length === 0;

/**
 * Throws 409 when the requested transition is not allowed, so clients cannot
 * jump from requested to completed or revive a cancelled ride.
 */
const assertTransition = (ride, nextStatus) => {
    if (ride.status === nextStatus) {
        throw ApiError.conflict(
            `Ride is already ${nextStatus}`,
            "RIDE_ALREADY_IN_STATUS"
        );
    }

    if (isTerminal(ride.status)) {
        throw ApiError.conflict(
            `Ride is ${ride.status} and can no longer be changed`,
            "RIDE_FINALIZED"
        );
    }

    if (!canTransition(ride.status, nextStatus)) {
        throw ApiError.conflict(
            `Cannot move a ride from ${ride.status} to ${nextStatus}`,
            "INVALID_RIDE_TRANSITION"
        );
    }

    return nextStatus;
};

const assertCancellable = (ride) => {
    if (!CANCELLABLE_STATUSES.includes(ride.status)) {
        throw ApiError.conflict(
            `A ride that is ${ride.status} can no longer be cancelled`,
            "RIDE_NOT_CANCELLABLE"
        );
    }
};

/**
 * Side effects that must happen together with a status change.
 * `startedAt`, `completedAt` and `cancelledAt` come from the plan's Ride model.
 */
const applyTransition = (ride, nextStatus, actor = null, reason = null) => {
    assertTransition(ride, nextStatus);

    ride.status = nextStatus;

    const now = new Date();

    switch (nextStatus) {
        case RIDE_STATUS.ACCEPTED:
            ride.driverId = actor && actor.driverId ? actor.driverId : ride.driverId;
            break;

        case RIDE_STATUS.STARTED:
            ride.startedAt = now;
            break;

        case RIDE_STATUS.COMPLETED:
            ride.completedAt = now;
            break;

        case RIDE_STATUS.CANCELLED:
            ride.cancelledAt = now;
            ride.cancelledBy = actor && actor.cancelledBy ? actor.cancelledBy : "passenger";
            ride.cancellationReason = reason || ride.cancellationReason || null;
            break;

        default:
            break;
    }

    return ride;
};

module.exports = {
    canTransition,
    getAllowedTransitions,
    isTerminal,
    assertTransition,
    assertCancellable,
    applyTransition,
    RIDE_TRANSITIONS,
    CANCELLABLE_STATUSES
};