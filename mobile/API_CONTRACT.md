# RideX Mobile — API Contract

> **Source of truth:** the real backend code in `backend/src` (routes, controllers, validators, models, middleware, services).
> This file records exactly what the mobile app is allowed to call. If the backend changes, update this file first.
>
> **Audited on:** Phase 0 (preflight). Backend branch read: `develop`.
> **Base URL:** `<EXPO_PUBLIC_API_URL>` → e.g. `http://192.168.1.10:5000/api` (the `/api` prefix is part of the base URL).

---

## 1. Conventions

### 1.1 Response envelope

Success:

```jsonc
{
  "success": true,
  "message": "Human readable message",
  "data": { },              // object, array, or null
  "pagination": {           // ONLY present on paginated list endpoints
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

Failure:

```jsonc
{
  "success": false,
  "message": "Human readable message",
  "error": {
    "code": "MACHINE_CODE",
    // "details" is present ONLY for 422 validation errors:
    "details": [
      { "field": "email", "message": "email must be a valid email address", "location": "body" }
    ]
  }
}
```

The app unwraps `data` in the API modules. The app maps `error.code` + `error.details` to friendly text and inline field errors (`src/utils/errors.js`).

### 1.2 Authentication

- `POST /auth/register` and `POST /auth/login` return a JWT in **`data.token`** **and** set an httpOnly cookie.
- The mobile app uses the **Bearer header**: `Authorization: Bearer <token>`.
- `backend/src/middleware/auth.middleware.js` accepts the token from either the `Authorization` header **or** the cookie. ✅ (Gap #1 resolved)
- Token is stored only in `expo-secure-store`.
- On `401` (except login/register), the app clears the token and returns to Login.

### 1.3 HTTP status codes used by the backend

```text
200 OK · 201 Created · 400 Bad Request · 401 Unauthorized · 403 Forbidden
404 Not Found · 409 Conflict · 422 Validation Error · 429 Too Many Requests · 500 Internal Server Error
```

### 1.4 Enums (from `backend/src/utils/constants.js`)

```text
Roles:               passenger | driver | admin
Vehicle types:       bike | auto | car | sedan | suv | hatchback
                     (DESIGN.md only shows bike/auto/car to the user — see note in §9)
Ride status:         requested | accepted | driver_arriving | driver_arrived | started | completed | cancelled
Verification status: unverified | pending | verified | rejected
Payment method:      cash | online
Payment status:      pending | paid | failed | refunded
```

### 1.5 Coordinates

`pickup` / `destination` are `{ lat: Number, lng: Number, address?: String }`. `lat` ∈ [-90, 90], `lng` ∈ [-180, 180]. `address` is optional on all request bodies.

- `lat` / `lng` must be **numbers** (not strings).
- `vehicleType` must always be sent.

---

## 2. Health

| Method | Path | Auth | Role |
|---|---|---|---|
| GET | `/api/health` | none | any |

**Response `200`**

```jsonc
{
  "success": true,
  "message": "RideX API is running",
  "data": { "status": "ok", "environment": "development", "database": "connected", "uptime": 12 }
}
```

`GET /` is an alias of the same handler.

---

## 3. Auth — `/api/auth`

### 3.1 `POST /api/auth/register` — public

**Body**

| Field | Type | Required | Rules |
|---|---|---|---|
| `name` | string | ✅ | 2–80 chars |
| `email` | string | ✅ | valid email |
| `phone` | string | ❌ | exactly 10 digits if sent |
| `password` | string | ✅ | 6–72 chars |
| `role` | string | ❌ | `passenger` or `driver` only (defaults to `passenger`) |

Unknown fields are rejected (422). `admin` cannot be self-assigned.

**Response `201`**

```jsonc
{ "success": true, "message": "Account registered successfully",
  "data": { "user": { "_id": "...", "id": "...", "name": "...", "email": "...", "phone": null,
                      "role": "passenger", "profileImage": null, "isActive": true,
                      "createdAt": "...", "updatedAt": "..." },
            "token": "eyJ..." } }
```

**Errors:** `409 EMAIL_ALREADY_REGISTERED`, `403 ROLE_NOT_SELF_ASSIGNABLE`, `422 VALIDATION_ERROR` (+details).

> Registering with `role:"driver"` **automatically creates the driver profile** (placeholder licence `PENDING-…`, status `unverified`). ✅ (Gap #2 resolved)

### 3.2 `POST /api/auth/login` — public

**Body:** `{ "email": string, "password": string }`

**Response `200`:** same shape as register — `data: { user, token }`.

**Errors:** `401 INVALID_CREDENTIALS`, `403 ACCOUNT_DEACTIVATED`, `422 VALIDATION_ERROR`.

### 3.3 `GET /api/auth/me` — auth (any role)

**Response `200`:** `data: { user }` (password hash never returned).

**Errors:** `401 TOKEN_REQUIRED | TOKEN_EXPIRED | INVALID_TOKEN | USER_NOT_FOUND`, `403 ACCOUNT_DEACTIVATED`.

### 3.4 `POST /api/auth/logout` — optional auth

Always `200`. `data: null`. The app ignores failures and clears its own token.

---

## 4. Users — `/api/users` (auth required)

| Method | Path | Body / Query | Response `data` |
|---|---|---|---|
| GET | `/api/users/me` | — | `{ user }` |
| PATCH | `/api/users/me` | `{ name?, phone?, profileImage? }` (≥1 field) | `{ user }` |
| PATCH | `/api/users/me/password` | `{ currentPassword, newPassword }` | `null` |
| DELETE | `/api/users/me` | — | `null` |

**Notes / errors**

- `profileImage` must be an `http(s)://` URL.
- Password: `newPassword` 6–72 chars; `401 INVALID_CURRENT_PASSWORD`; `400 PASSWORD_UNCHANGED`.
- `DELETE` deactivates + anonymises the account (ride history is kept).
  Blocks with `409 ACTIVE_RIDE_EXISTS` while a ride is active.
- `PATCH /users/me` with `role` that differs → `403 ROLE_CHANGE_FORBIDDEN` for non-admins.
- Unknown fields → `422 VALIDATION_ERROR`.

---

## 5. Driver — `/api/drivers` (auth + `driver` role)

All routes require role `driver`; a passenger token gets `403 INSUFFICIENT_ROLE`.

### 5.1 `GET /api/drivers/me`

**Response `200`:** `data: { driver, vehicles: [Vehicle], user }`

`Driver` shape:

```jsonc
{ "_id": "...", "id": "...", "userId": "...", "licenseNumber": "WB-01-2024-9999",
  "verificationStatus": "unverified|pending|verified|rejected",
  "verificationRemarks": null, "isOnline": false,
  "currentLocation": { "lat": 22.45, "lng": 88.4, "address": null, "updatedAt": "..." } | null,
  "rating": 0, "ratingCount": 0, "totalRides": 0,
  "createdAt": "...", "updatedAt": "..." }
```

### 5.2 `PATCH /api/drivers/me`

**Body:** `{ licenseNumber }` (4–30 chars). Response `data: { driver }`.
Submitting a new licence resets `verificationStatus` to `pending`.

### 5.3 `PATCH /api/drivers/me/status`

**Body:** `{ isOnline: Boolean }` → `data: { driver }`.

**Errors (going online):** `403 DRIVER_NOT_VERIFIED` (not verified), `403 DRIVER_WITHOUT_VEHICLE` (no active vehicle). Going offline is always allowed. ✅ (Gap #8 resolved)

### 5.4 `PATCH /api/drivers/me/location`

**Body:** `{ lat: Number, lng: Number, address?: String }` → `data: { currentLocation }`.

### 5.5 `GET /api/drivers/me/ride-requests`

**Query:** `page`, `limit`, `radius?` (1–50), `vehicleType?` (enum).

**Response `data`:** array of rides with two extra fields:

```jsonc
[ { ...ride, "id": "<rideId>", "pickupDistance": 1.23 } ]   // pickupDistance may be null
```

- Only `requested` rides, no assigned driver, matching one of the driver's active vehicle types, and **not** already rejected by this driver.
- Empty array when the driver has no active vehicle or no matching type.
- Paginated (`pagination` present).

### 5.6 `GET /api/drivers/me/rides`

**Query:** `page`, `limit`, `status?`. **Response `data`:** `[ride]` + pagination. ✅ (Gap #3 resolved)

### 5.7 `GET /api/drivers/me/earnings`

**Response `200`**

```jsonc
{ "success": true, "message": "Earnings fetched successfully",
  "data": { "totalEarnings": 150, "totalPaidRides": 1, "completedRides": 1,
            "cancelledRides": 0, "averageRating": 5, "totalRatings": 1 } }
```

### 5.8 Vehicles

| Method | Path | Body | Response `data` |
|---|---|---|---|
| POST | `/api/drivers/me/vehicles` | `{ type, registrationNumber, brand?, model?, color?, year? }` | `{ vehicle }` (201) |
| GET | `/api/drivers/me/vehicles` | — | `[vehicle]` |
| PATCH | `/api/drivers/me/vehicles/:vehicleId` | any subset of the above + `isActive` (≥1 field) | `{ vehicle }` |
| DELETE | `/api/drivers/me/vehicles/:vehicleId` | — | `null` |

`Vehicle` shape:

```jsonc
{ "_id": "...", "id": "...", "driverId": "...", "type": "car", "brand": "Maruti",
  "model": "Swift", "color": "White", "registrationNumber": "WB07AB1234",
  "isActive": true, "createdAt": "...", "updatedAt": "..." }
```

**Errors:** `422 VALIDATION_ERROR` (bad type/registration/year), `409 DUPLICATE_RESOURCE` (registration number already used), `404 VEHICLE_NOT_FOUND`.

---

## 6. Rides — `/api/rides` (auth required)

`Ride` shape (`loadRideForActor`):

```jsonc
{ "_id": "...", "id": "...", "passengerId": "...", "driverId": null|"...",
  "vehicleId": null|"...", "vehicleType": "car",
  "pickup":     { "address": "GMIT College", "lat": 22.45, "lng": 88.4 },
  "destination":{ "address": "Baruipur Station", "lat": 22.36, "lng": 88.43 },
  "distance": 5.2, "estimatedDuration": 18, "estimatedFare": 150, "finalFare": 0,
  "status": "requested", "paymentId": null,
  "rejectedBy": [],
  "startedAt": null, "completedAt": null, "cancelledAt": null,
  "cancelledBy": null, "cancellationReason": null,
  "createdAt": "...", "updatedAt": "..." }
```

### 6.1 `POST /api/rides/fare-estimate` — auth (any role)

**Body:** `{ pickup, destination, vehicleType }`.

**Response `200`**

```jsonc
{ "success": true, "message": "Fare estimated successfully",
  "data": { "vehicleType": "car", "estimatedFare": 150, "estimatedDistance": 5.2,
            "estimatedDuration": 18,
            "breakdown": { "baseFare": 50, "distanceCharge": 62, "timeCharge": 36 } } }
```

**Errors:** `400 SAME_PICKUP_AND_DESTINATION`, `422 VALIDATION_ERROR`, `400 UNSUPPORTED_VEHICLE_TYPE`.

> The **official fare always comes from the backend**. The app never computes it. Fare table: bike 20/6/1 · auto 30/8/1.2 · car 50/12/2 (base/₹per km/₹per min). `estimatedDuration` is minutes; `distance` is km.

### 6.2 `POST /api/rides` — passenger only

**Body:** `{ pickup, destination, vehicleType }`.

**Response `201`**

```jsonc
{ "success": true, "message": "Ride created successfully",
  "data": { "ride": { ...ride, "status": "requested" },
            "hasNearbyDriver": true,
            "nearestDriverId": "..." | null } }
```

**Errors:** `409 RIDE_ALREADY_IN_PROGRESS`, `400 SAME_PICKUP_AND_DESTINATION`, `422`, `403 INSUFFICIENT_ROLE`.

### 6.3 `GET /api/rides/history` — passenger only

**Query:** `page`, `limit`, `status?`. **Response `data`:** `[ride]` + pagination.

### 6.4 `GET /api/rides/active` — passenger only

**Response `200`:** `data: { ride: Ride | null }`. Used on app start to restore an in-progress ride. ✅ (Gap #4 resolved)

### 6.5 `GET /api/rides/:rideId` — passenger (own) / assigned driver / admin

**Response `200`:** `data: { ride, driver | null, payment | null }`

`driver` (populated) shape:

```jsonc
{ "_id": "...", "userId": { "_id": "...", "name": "Dan Driver", "phone": "9876543210", "profileImage": null },
  "rating": 4.9, "totalRides": 12, "vehicleType"... /* driver doc fields */ }
```

**Errors:** `404 RIDE_NOT_FOUND`, `403 RIDE_ACCESS_DENIED`.

### 6.6 Lifecycle transitions (`PATCH`)

| Path | Role | Body | From → To | Response `data` |
|---|---|---|---|---|
| `/api/rides/:rideId/cancel` | passenger(own)/assigned driver/admin | `{ reason? }` | any cancellable → `cancelled` | `{ ride }` |
| `/api/rides/:rideId/accept` | driver | — | `requested` → `accepted` | `{ ride }` |
| `/api/rides/:rideId/reject` | driver | `{ reason? }` | stays `requested` | `{ ride }` |
| `/api/rides/:rideId/arriving` | assigned driver | — | `accepted` → `driver_arriving` | `{ ride }` |
| `/api/rides/:rideId/arrived` | assigned driver | — | `driver_arriving` → `driver_arrived` | `{ ride }` |
| `/api/rides/:rideId/start` | assigned driver | — | `driver_arrived` → `started` | `{ ride }` |
| `/api/rides/:rideId/complete` | assigned driver | — | `started` → `completed` | `{ ride }` |

Cancellable statuses: `requested`, `accepted`, `driver_arriving`, `driver_arrived` (**not** `started`).

**Errors:** `403 RIDE_CANCEL_FORBIDDEN | DRIVER_NOT_ASSIGNED | DRIVER_NOT_VERIFIED | DRIVER_OFFLINE | DRIVER_WITHOUT_VEHICLE | VEHICLE_TYPE_MISMATCH`,
`409 RIDE_ALREADY_ACCEPTED | RIDE_ALREADY_IN_STATUS | RIDE_FINALIZED | INVALID_RIDE_TRANSITION | RIDE_NOT_CANCELLABLE | DRIVER_BUSY | RIDE_ALREADY_REJECTED`,
`404 RIDE_NOT_FOUND`.

> Completing a ride sets `finalFare`, creates a `pending` payment record, increments the driver's `totalRides` and puts the driver back online.
> **Reject semantics:** the ride stays `requested` and visible to other eligible drivers; the rejecting driver no longer sees it. ✅ (Gap #7 resolved)

### 6.7 Ratings

| Method | Path | Role | Body | Response `data` |
|---|---|---|---|---|
| POST | `/api/rides/:rideId/rating` | passenger (own) | `{ rating: 1–5, comment? }` | `{ rating }` (201) |
| GET | `/api/rides/:rideId/rating` | passenger/driver(own)/admin | — | `{ rating: Rating \| null }` |

**Errors:** `403 RATING_FORBIDDEN`, `409 RIDE_NOT_COMPLETED | RIDE_ALREADY_RATED | NO_DRIVER_TO_RATE`, `422`.

`Rating` shape: `{ "_id", "id", "rideId", "passengerId", "driverId", "rating", "comment", "createdAt", "updatedAt" }`.

---

## 7. Payments — `/api/payments` (auth required)

### 7.1 `POST /api/payments/:rideId` — passenger (own)

**Body**

| Field | Type | Required | Rules |
|---|---|---|---|
| `method` | string | ✅ | `cash` \| `online` |
| `amount` | number | ❌ | if sent must equal the ride fare (`400 AMOUNT_MISMATCH`) |
| `transactionId` | string | ❌ | 4–100 chars (online only) |

**Behaviour:** completing a ride already created a `pending` payment; this call **settles it**. `cash` → `paid` immediately. `online` → stays `pending` and stores `transactionId` (no real gateway in MVP).

**Response `201`:** `data: { payment }`.

`Payment` shape: `{ "_id", "id", "rideId", "passengerId", "driverId", "amount", "method", "status", "transactionId", "paidAt", "createdAt", "updatedAt" }`.

**Errors:** `403 PAYMENT_ACCESS_DENIED`, `409 RIDE_NOT_COMPLETED | PAYMENT_ALREADY_COMPLETED`, `400 AMOUNT_MISMATCH`, `422`.

### 7.2 `GET /api/payments/:paymentId` — passenger(own)/admin

`data: { payment }`. `404 PAYMENT_NOT_FOUND`, `403 PAYMENT_ACCESS_DENIED`.

### 7.3 `GET /api/payments/history` — passenger only

**Query:** `page`, `limit`, `status?`, `method?`. `data: [payment]` + pagination.

### 7.4 `GET /api/payments/ride/:rideId` — passenger(own)/admin

`data: { payment: Payment | null }`. Used on the completed-ride screen to show the payment. ✅ (extra endpoint, present in code)

---

## 8. Admin — `/api/admin` (auth + `admin` role) — Phase 10 only

| Method | Path | Query / Body | Response `data` |
|---|---|---|---|
| GET | `/api/admin/dashboard` | — | aggregate stats object |
| GET | `/api/admin/users` | `page, limit, role?, isActive?, search?` | `[user]` + pagination |
| GET | `/api/admin/users/:id` | — | `{ user, driver, vehicles, stats }` |
| PATCH | `/api/admin/users/:id/status` | `{ isActive, reason? }` | `{ user }` |
| GET | `/api/admin/drivers` | `page, limit, verified?, isOnline?, search?` | `[driver(populated)]` + pagination |
| GET | `/api/admin/drivers/:id` | — | `{ driver, vehicles, ratings, stats }` |
| PATCH | `/api/admin/drivers/:id/verify` | `{ verificationStatus, remarks? }` | `{ driver }` |
| PATCH | `/api/admin/drivers/:id/status` | `{ isOnline, reason? }` | `{ driver }` |
| GET | `/api/admin/rides` | `page, limit, status?, vehicleType?, driverId?, passengerId?` | `[ride(populated)]` + pagination |
| GET | `/api/admin/rides/:id` | — | `{ ride, rating }` |
| GET | `/api/admin/payments` | `page, limit, status?, method?` | `[payment(populated)]` + pagination |

Dashboard `data`:

```jsonc
{ "users": { "total", "passengers", "drivers", "admins", "newThisWeek" },
  "drivers": { "total", "verified", "pending", "online" },
  "rides": { "total", "active", "completed", "cancelled", "byStatus": { "<status>": count } },
  "payments": { "total", "paidCount", "totalRevenue", "pendingCount",
                "byMethod": { "cash": { "amount", "count" }, "online": { "amount", "count" } } },
  "ratings": { "average", "total" } }
```

---

## 9. Notes, assumptions and differences found

1. **Vehicle types.** The backend enum is wider than the design: `bike | auto | car | sedan | suv | hatchback`. `DESIGN.md` shows only **Bike, Auto, Car**. The app will present only `bike | auto | car` (per DESIGN) but the API accepts the wider set. No change needed.
2. **`/api/rides/active` already exists** — this is what the plan called "gap #4". No backend change required.
3. **Driver earnings / ride history already exist** (`/drivers/me/earnings`, `/drivers/me/rides`) — plan "gap #3" resolved.
4. **Payment-for-ride lookup exists** (`/payments/ride/:rideId`) — not in the original plan's list but very useful; documented here.
5. **Server binding.** `server.js` calls `app.listen(env.PORT)` with no host, so it binds all interfaces (reachable from the phone over LAN). No change needed. The phone must still use the computer's LAN IP, not `localhost`.
6. **MongoDB requirement.** The server needs a real MongoDB via `MONGODB_URI`. Backend *tests* use `mongodb-memory-server` and need no database. Running the API for the phone requires either a local MongoDB or a free MongoDB Atlas cluster. (Operational note, not a code gap.)
7. **Rate limiting.** Global `/api` limit 300 / 15 min; auth endpoints 20 / 15 min (skipped when `NODE_ENV=test`). The app should not retry auth aggressively.
8. **`driver` role guard.** Every `/api/drivers/*` route requires the `driver` role; a passenger gets `403 INSUFFICIENT_ROLE`.
9. **`GET /api/auth/me` returns the full user document** (with `_id` and `id`). The app treats `user.role` as the source for choosing the navigator.
10. **No backend change requests are required for the mobile MVP.** All eight suspected gaps are addressed in the current code.

---

## 10. Backend Change Requests

_None open._ If the app ever needs an endpoint that is not listed above, it will be raised using the `BACKEND CHANGE REQUEST` format in `MOBILE_PLAN.md` §7.4 before any code is written.
