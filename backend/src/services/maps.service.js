const env = require("../config/env");
const ApiError = require("../utils/ApiError");
const { estimateRoute, distanceInKm } = require("../utils/geo");

/**
 * Maps service (geocoding + road routing) on top of the OpenStreetMap stack.
 *
 *   - Address search / reverse geocoding -> Nominatim
 *   - Road routes, distance and ETA      -> OSRM
 *
 * Both providers are free community services with usage policies, so every call
 * is proxied through the backend, cached briefly and rate limited at the route
 * layer. The backend never fabricates data: when routing is unreachable it
 * returns a clearly flagged straight-line approximation (approximate: true)
 * instead of pretending to have a road route.
 */

const CACHE_TTL_MS = 5 * 60 * 1000;
const MAX_CACHE_ENTRIES = 500;

const cache = new Map();

const readCache = (key) => {
    const entry = cache.get(key);

    if (!entry) {
        return undefined;
    }

    if (entry.expires < Date.now()) {
        cache.delete(key);
        return undefined;
    }

    return entry.value;
};

const writeCache = (key, value) => {
    // Cheap FIFO-ish eviction so the map cannot grow without bound.
    if (cache.size >= MAX_CACHE_ENTRIES) {
        const oldest = cache.keys().next().value;
        cache.delete(oldest);
    }

    cache.set(key, { value, expires: Date.now() + CACHE_TTL_MS });
};

const clearCache = () => cache.clear();

const isExternalDisabled = () => env.NODE_ENV === "test";

const trimBaseUrl = (url) => url.replace(/\/+$/, "");

const fetchJson = async (url, { headers = {}, timeoutMs = env.EXTERNAL_API_TIMEOUT_MS } = {}) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            headers,
            signal: controller.signal,
            redirect: "follow"
        });

        if (!response.ok) {
            throw new Error(`Upstream responded with ${response.status}`);
        }

        return await response.json();
    } finally {
        clearTimeout(timer);
    }
};

// ==========================================
// Geocoding (Nominatim)
// ==========================================

const normalizeGeocodeResult = (item) => {
    const lat = Number(item.lat);
    const lng = Number(item.lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return null;
    }

    const fallbackName = item.display_name ? item.display_name.split(",")[0].trim() : "";

    return {
        id: String(item.place_id ?? `${lat},${lng}`),
        name: item.name || fallbackName || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        address: item.display_name || "",
        lat,
        lng,
        type: item.type || null,
        category: item.class || null
    };
};

/**
 * Free-text address search. Returns an array (possibly empty) of normalized
 * results. Throws 503 when the provider is unreachable so the client can retry.
 */
const geocode = async (query, { limit = 6 } = {}) => {
    const trimmed = String(query || "").trim();

    if (trimmed.length < 3) {
        return [];
    }

    if (!env.GEOCODING_ENABLED || isExternalDisabled()) {
        return [];
    }

    const safeLimit = Math.min(Math.max(Number(limit) || 6, 1), 10);
    const cacheKey = `geocode:${trimmed.toLowerCase()}:${safeLimit}`;

    const cached = readCache(cacheKey);

    if (cached) {
        return cached;
    }

    const url =
        `${trimBaseUrl(env.NOMINATIM_BASE_URL)}/search?format=jsonv2&addressdetails=1` +
        `&limit=${safeLimit}&q=${encodeURIComponent(trimmed)}`;

    try {
        const data = await fetchJson(url, {
            headers: {
                "User-Agent": env.GEOCODER_USER_AGENT,
                "Accept-Language": "en",
                Accept: "application/json"
            }
        });

        const results = Array.isArray(data)
            ? data.map(normalizeGeocodeResult).filter(Boolean)
            : [];

        writeCache(cacheKey, results);

        return results;
    } catch (error) {
        throw ApiError.serviceUnavailable(
            "Address search is temporarily unavailable. Please try again.",
            "GEOCODING_UNAVAILABLE"
        );
    }
};

/**
 * Reverse geocoding: coordinates -> a readable address. Best effort, resolves
 * to null when it fails so callers can fall back to a coordinate label instead
 * of inventing an address.
 */
const reverseGeocode = async (lat, lng) => {
    const latitude = Number(lat);
    const longitude = Number(lng);

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return null;
    }

    if (!env.GEOCODING_ENABLED || isExternalDisabled()) {
        return null;
    }

    const cacheKey = `reverse:${latitude.toFixed(5)},${longitude.toFixed(5)}`;

    const cached = readCache(cacheKey);

    if (cached !== undefined) {
        return cached;
    }

    const url =
        `${trimBaseUrl(env.NOMINATIM_BASE_URL)}/reverse?format=jsonv2&addressdetails=1` +
        `&zoom=18&lat=${latitude}&lon=${longitude}`;

    try {
        const data = await fetchJson(url, {
            headers: {
                "User-Agent": env.GEOCODER_USER_AGENT,
                "Accept-Language": "en",
                Accept: "application/json"
            }
        });

        if (!data || data.error) {
            return null;
        }

        const shortName = data.name || (data.display_name ? data.display_name.split(",")[0].trim() : "");

        const result = {
            name: shortName || data.display_name || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
            address: data.display_name || "",
            lat: latitude,
            lng: longitude
        };

        writeCache(cacheKey, result);

        return result;
    } catch (error) {
        return null;
    }
};

// ==========================================
// Routing (OSRM)
// ==========================================

const normalizeGeometry = (coordinates) => {
    if (!Array.isArray(coordinates)) {
        return [];
    }

    return coordinates
        .map((pair) => {
            if (!Array.isArray(pair) || pair.length < 2) {
                return null;
            }

            const lng = Number(pair[0]);
            const lat = Number(pair[1]);

            return Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : null;
        })
        .filter(Boolean);
};

/**
 * Straight-line fallback used when OSRM is disabled or unreachable. Explicitly
 * flagged as approximate so the UI never presents it as a real road route.
 */
const approximateRoute = (origin, destination) => {
    const { distance, duration } = estimateRoute(origin, destination);

    return {
        distanceKm: distance,
        durationMin: duration,
        geometry: [
            [origin.lat, origin.lng],
            [destination.lat, destination.lng]
        ],
        source: "approximate",
        approximate: true
    };
};

/**
 * Road route between two points: distance (km), duration (min) and geometry.
 * Falls back to a labelled approximation rather than throwing, so fare
 * estimation still works offline.
 */
const route = async ({ origin, destination }) => {
    if (!origin || !destination) {
        throw ApiError.badRequest("origin and destination are required", "ROUTE_POINTS_REQUIRED");
    }

    if (!env.ROUTING_ENABLED || isExternalDisabled()) {
        return approximateRoute(origin, destination);
    }

    const cacheKey = `route:${origin.lat},${origin.lng}:${destination.lat},${destination.lng}`;

    const cached = readCache(cacheKey);

    if (cached) {
        return cached;
    }

    const coordinates = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;

    const url =
        `${trimBaseUrl(env.OSRM_BASE_URL)}/route/v1/driving/${coordinates}` +
        `?overview=full&geometries=geojson&alternatives=false&steps=false`;

    try {
        const data = await fetchJson(url, { headers: { Accept: "application/json" } });

        if (!data || data.code !== "Ok" || !Array.isArray(data.routes) || data.routes.length === 0) {
            return approximateRoute(origin, destination);
        }

        const best = data.routes[0];
        const distanceKm = Math.round((Number(best.distance) / 1000) * 100) / 100;
        const durationMin = Math.max(1, Math.round(Number(best.duration) / 60));
        const geometry = normalizeGeometry(best.geometry && best.geometry.coordinates);

        const result = {
            distanceKm: Number.isFinite(distanceKm) && distanceKm > 0 ? distanceKm : 0,
            durationMin,
            geometry:
                geometry.length >= 2
                    ? geometry
                    : [
                          [origin.lat, origin.lng],
                          [destination.lat, destination.lng]
                      ],
            source: "osrm",
            approximate: false
        };

        writeCache(cacheKey, result);

        return result;
    } catch (error) {
        return approximateRoute(origin, destination);
    }
};

/**
 * Shared guard for ride booking / fare estimation: rejects pickup and
 * destination that are identical or effectively the same point.
 */
const assertDistinctPoints = (pickup, destination) => {
    if (
        Number(pickup.lat) === Number(destination.lat) &&
        Number(pickup.lng) === Number(destination.lng)
    ) {
        throw ApiError.badRequest(
            "Pickup and destination cannot be the same point",
            "SAME_PICKUP_AND_DESTINATION"
        );
    }

    if (distanceInKm(pickup, destination) < env.MIN_TRIP_DISTANCE_KM) {
        throw ApiError.badRequest(
            "Pickup and destination are too close to each other",
            "PICKUP_AND_DESTINATION_TOO_CLOSE"
        );
    }
};

module.exports = {
    geocode,
    reverseGeocode,
    route,
    approximateRoute,
    assertDistinctPoints,
    clearCache
};
