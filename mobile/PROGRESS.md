# RideX Mobile — Build Progress

> Living status file. Updated after **every** phase.
> Source of truth for process: `mobile/MOBILE_PLAN.md`. Source of truth for UI: `mobile/DESIGN.md`.
> Source of truth for the API: `mobile/API_CONTRACT.md` (mirrors `backend/src`).

**App:** RideX Mobile — React Native (Expo, managed workflow), **JavaScript only** (no TypeScript).
**Current phase:** `Phase 0 — Preflight & contract audit` ✅ complete → Phase 1 next.
**Last updated:** Phase 0.

---

## Phase checklist

| # | Phase | Status | Branch | Notes |
|---|-------|--------|--------|-------|
| 0 | Preflight & contract audit | ✅ done | `docs/mobile-api-contract` | `API_CONTRACT.md`, this file, env report |
| 1 | Project scaffold & tooling | ⬜ next | `chore/mobile-scaffold` | Expo app, lint, format, jest, folder structure |
| 2 | Design system & theme | ⬜ | | DESIGN.md tokens, light/dark |
| 3 | Core UI components | ⬜ | | |
| 4 | Auth screens & session | ⬜ | | |
| 5 | Passenger home & map | ⬜ | | |
| 6 | Ride request & driver matching | ⬜ | | |
| 7 | Driver app (online, requests, actions) | ⬜ | | |
| 8 | Ride lifecycle tracking | ⬜ | | |
| 9 | Payments & ratings | ⬜ | | |
| 10 | Admin panel | ⬜ | | |
| 11 | Profile, history, settings | ⬜ | | |
| 12 | Polish, errors, offline, a11y | ⬜ | | |
| 13 | Final QA & release readiness | ⬜ | | |

---

## Phase 0 — Preflight & contract audit

### What was done

- Read `MOBILE_PLAN.md`, `DESIGN.md`, root `PLAN.md`, `backend/BACKEND_PLAN.md`, `GITHUB_GUIDE.md`.
- Read the **entire** backend implementation: `backend/src/{routes,controllers,models,validators,middleware,services,utils,config}` and `backend/tests`.
- Wrote `mobile/API_CONTRACT.md` from the real code (method, path, auth/role, body, response, error codes, enums).
- Audited every "gap" the plan suspected. **All eight are already handled by the current backend — no backend change requests are needed.**
- Installed backend dependencies and ran the backend contract tests as live evidence.

### Environment report

| Tool | Version |
|---|---|
| Node.js | v24.21.0 |
| npm | 12.2.0 |
| npx | 12.2.0 |
| git | 2.51.0.windows.1 |
| OS | Windows (win32) |
| MongoDB (`mongod`) | **not installed** |

### Contract audit — gap resolution

| # | Suspected gap | Status | Evidence |
|---|---------------|--------|----------|
| 1 | Token transport auth | ✅ resolved | `auth.middleware.js` accepts `Authorization: Bearer` **or** cookie |
| 2 | Driver self-registration | ✅ resolved | `POST /auth/register` accepts `role:"driver"` and auto-creates the driver profile |
| 3 | Driver earnings / ride history | ✅ resolved | `GET /drivers/me/earnings`, `GET /drivers/me/rides` exist |
| 4 | Passenger active-ride restore | ✅ resolved | `GET /rides/active` exists |
| 5 | Server bind host | ✅ resolved | `app.listen(env.PORT)` binds all interfaces (LAN-reachable) |
| 6 | Payment request body | ✅ resolved | `POST /payments/:rideId` `{ method, amount?, transactionId? }`; completing a ride creates a `pending` payment |
| 7 | Reject semantics | ✅ resolved | Reject keeps ride `requested` and excludes the driver via `rejectedBy` |
| 8 | Driver online gate | ✅ resolved | Must be `verified` (`DRIVER_NOT_VERIFIED`) and have an active vehicle (`DRIVER_WITHOUT_VEHICLE`) |

### Findings / differences to be aware of

1. Backend `VEHICLE_TYPES = bike | auto | car | sedan | suv | hatchback`, but `DESIGN.md` shows only **Bike, Auto, Car**. The app will show only the three design types. No backend change needed.
2. `driver` role guard: every `/api/drivers/*` route returns `403 INSUFFICIENT_ROLE` for passengers.
3. Auth endpoints are rate-limited to 20 requests / 15 min (300 / 15 min globally). The app must not retry auth aggressively.
4. Fare is **always** computed by the backend (`POST /rides/fare-estimate`); the app never calculates it.

### Assumptions (owner-supplied values deferred — see MOBILE_PLAN §12)

The user asked to proceed without questions, so these are recorded as assumptions and will be confirmed when first needed:

- **`EXPO_PUBLIC_API_URL`** — will be `http://<PC-LAN-IP>:5000/api`. The PC's LAN IP must be supplied by the owner before on-device testing.
- **API keys** — the MVP uses only **free, keyless** options (OpenStreetMap tiles via `react-native-maps`, Nominatim geocoding). No key required.
- **Test accounts** — the app can register accounts itself; no seeded credentials required. (Optional: owner may create an admin via the backend.)

### Phase 0 live evidence

- Installed backend dependencies (`backend/npm install`).
- Ran the backend contract suite against a real in-memory MongoDB:
  **173 checks passed, 0 failed** (exit code 0). This is the authoritative
  live confirmation that the API behaves as `API_CONTRACT.md` documents
  (health, auth, rides lifecycle, payments, ratings, driver lists, admin).
- Note: `npm test` in `backend/` can fail on a cold machine because
  `mongodb-memory-server` allows only **10 s** for the mongod first start, while
  the first Windows start takes longer. Running the same suite through a harness
  that passes `instance.startupTimeout` fixes it — no backend change needed.

### Running the backend (for on-device testing)

The API needs a MongoDB. Two paths:
1. Local MongoDB, or
2. Free **MongoDB Atlas** cluster.

Then `backend/.env` needs `MONGODB_URI` + `JWT_SECRET` (see `backend/.env.example`), and `npm run dev` in `backend/`.

---

## Backend change requests

_None._ (See `API_CONTRACT.md` §10.)
