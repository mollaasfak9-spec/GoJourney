/**
 * Small geo helpers.
 *
 * BACKEND_PLAN.md section 18 allows mock distance/time for the MVP, but a real
 * haversine distance is cheap, deterministic and makes the fare believable.
 * Later this can be swapped for a Maps provider without touching controllers.
 */

const EARTH_RADIUS_KM = 6371;
const AVERAGE_SPEED_KMPH = 24; // realistic urban average including traffic

const toRadians = (degrees) => (degrees * Math.PI) / 180;

const distanceInKm = (from, to) => {
    const { lat: lat1, lng: lng1 } = from;
    const { lat: lat2, lng: lng2 } = to;

    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;

    return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
};

const durationInMinutes = (distanceKm) =>
    Math.max(1, Math.round((distanceKm / AVERAGE_SPEED_KMPH) * 60));

/**
 * Returns { distance, duration } with the distance rounded to 2 decimals and
 * the duration rounded to whole minutes.
 */
const estimateRoute = (pickup, destination) => {
    const distance = distanceInKm(pickup, destination);

    return {
        distance: Math.round(distance * 100) / 100,
        duration: durationInMinutes(distance)
    };
};

module.exports = {
    EARTH_RADIUS_KM,
    AVERAGE_SPEED_KMPH,
    distanceInKm,
    durationInMinutes,
    estimateRoute
};