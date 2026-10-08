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

### DESIGN.md summary (≤ 20 lines)

1. Two first-class themes (dark + light); user can pick System/Light/Dark; choice persists.
2. Accent is signal green `#22E55B` for the "current" thing only. Dark primary buttons = green; light primary buttons = ink navy `#0B1020`.
3. Signature component: the **paired location card** — two pill inputs in one `surfaceRaised` rounded container with a swap button on the seam. Appears on Home, Book, Ride.
4. Font: **Plus Jakarta Sans** (400/500/600/700) via `@expo-google-fonts/plus-jakarta-sans`; 10 type styles from `display` 36/700 down to `caption` 12/500.
5. Spacing on a 4-pt grid (4…48); screen padding 20; sectional gap 24. Radii sm12/md16/lg24/xl32/pill999.
6. Elevation: dark = no shadows (use `surface`/`surfaceRaised` layers); light = one soft shadow `0 8 24` at 8% ink.
7. Icons: `lucide-react-native`, stroke 2, inside 48 circles. Vehicle types shown: **Bike, Auto, Car**.
8. Motion via `react-native-reanimated`: press scale 0.97 (120 ms), sheet spring ~320 ms, status cross-fade 250 ms, pulse ring 1600 ms; respect Reduce Motion.
9. Layout shell: safe areas everywhere; status bar follows theme; map screens full-bleed with floating top bar + bottom sheet; content screens padded with a large `h1`.
10. Bottom sheet: top radius 32, drag handle 40×4, snap points peek/half/full.
11. Components (single style each): Button (primary/secondary/ghost/danger, h56 pill), IconButton, Input, Location pair, Segmented control, Vehicle card, Driver card, Status banner, Slide-to-action, Status badge, Stat block, Progress bar, Route timeline, Ride card, Bottom tab bar, Top bar, Modal, Toast, Skeleton/Empty/Error.
12. Ride status → colour mapping in §3.4 (requested=warning, accepted/arriving/arrived/completed=accent, started=info, cancelled=danger); never colour-only.
13. Screens: Splash/Onboarding, Login, Register, Passenger Home, Book, Choose vehicle, Searching, Driver on the way, Driver arrived, In progress, Completed, Rides history, Ride detail, Profile; Driver Home, Incoming request, Driver active ride, Earnings, Vehicle.
14. Every data screen must have Loading / Success / Empty / Error states; plus offline banner, permission-denied card, session-expired toast, 409/422 toast.
15. Copy: sentence case, short, active, same words everywhere; ₹ currency; "3 min" times.
16. Responsive: 360–430 dp first; <360 shrink; tablets max content width 520; portrait lock.
17. Accessibility: 4.5:1 contrast (green text on white uses `accentText` `#0A8A35`), ≥44 targets, labels on every control, Reduce Motion.
18. "Do Not": no extra accents, no gradients (except the light-theme dark info panel), no heavy shadows/glassmorphism, no ALL CAPS, one primary button per screen, no custom component variants, no colourful map pins, no auto-play decoration, no text <12 px, no chat/package/coupons/surge.
19. Token file shape is given in §17 (JS in `src/theme/tokens.js`).
20. Missing pieces to note: vehicle images are placeholders; onboarding illustrations minimal; no chat in MVP (show "Call driver" only).

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
