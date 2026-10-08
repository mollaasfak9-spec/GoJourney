# RideX Mobile — Full Implementation Plan

> **Project:** RideX — Online Ride Booking & Management System (Mobile App)
> **Stack:** React Native + Expo, **JavaScript only (NO TypeScript)**
> **Backend:** Existing RideX REST API (Node + Express + MongoDB) — see `PLAN.md` and `backend/BACKEND_PLAN.md`
> **UI source of truth:** `mobile/DESIGN.md` (provided by the project owner)
> **Location in repo:** `RideX_AXION/mobile/`

---

# 0. READ THIS FIRST — Instructions for the AI

You are the **sole engineer** building the RideX mobile app. The project owner is a beginner who does **not** know React Native. You must manage everything yourself: setup, architecture, code, testing, debugging, and explaining things in plain language. Never assume the owner knows anything technical.

## 0.1 Source-of-truth order (when documents disagree)

1. The owner's latest chat message
2. `mobile/DESIGN.md` — everything visual and UX
3. This file (`MOBILE_PLAN.md`) — architecture, phases, rules
4. `backend/` **actual code** (routes, controllers, validators, models) — the real API contract
5. `PLAN.md` and `backend/BACKEND_PLAN.md` — intent and product scope

If the backend code and `BACKEND_PLAN.md` disagree, **the code wins**. Report the difference.

## 0.2 Non-negotiable rules

1. **JavaScript only.** Files are `.js` / `.jsx`. No `.ts`, no `.tsx`, no TypeScript config, no JSDoc-as-types requirement.
2. **Follow `mobile/DESIGN.md` exactly**, in **both light and dark themes**. Do not invent your own look. Read it fully before writing any UI code. If something visual is missing from it, ask the owner — do not guess.
3. **Never invent backend endpoints.** Only call endpoints that exist in the backend code. If one is missing, follow Section 7.4 (Backend Change Request) and wait.
4. **Never hard-code colors, spacing, font sizes, or radii.** All come from theme tokens derived from `DESIGN.md`.
5. **Use Expo (managed workflow)** and install Expo-related packages with `npx expo install <pkg>` so versions match the SDK. Prefer packages that work in **Expo Go** until the owner agrees to a development build.
6. **Do not rely on memory for library APIs.** Versions change. Before using any library, check its current official docs (docs.expo.dev, reactnavigation.org, tanstack.com, etc.) for the installed version. Avoid deprecated APIs.
7. **Add dependencies only when needed**, and say why. No duplicate libraries for the same job.
8. **Work in small steps. Verify every step** (Section 10 commands). Never say "done" without showing evidence (command output / test results).
9. **No placeholder code, no `TODO` stubs, no fake data left in production paths.** Mocks live only in tests or behind a clearly flagged service interface recorded in `PROGRESS.md`.
10. **Every screen handles Loading, Success, Error (with Retry), and Empty states.**
11. **Security:** tokens only in `expo-secure-store`. Never log tokens or passwords. Never commit `.env`. Secrets (payment secret keys etc.) **never** go in the app — they belong to the backend. Anything prefixed `EXPO_PUBLIC_` is visible to anyone who installs the app.
12. **Ask, don't guess.** If you need an API key, a design decision, or a backend change, use the protocols in Sections 7.4 and 12, then **stop and wait**.
13. **Stop at the end of every phase** and wait for the owner's approval (Section 9 format).
14. **Maintain `mobile/PROGRESS.md`** after every phase (what's done, decisions, open issues, known backend gaps). This is your memory if the chat resets.
15. **Plain-language communication.** Explain what you did and how to test it as if to a smart person who has never used React Native. Give exact commands and exact taps.

## 0.2.1 Create `mobile/AGENTS.md` in Phase 1

A short file restating rules 1–15 and pointing to `MOBILE_PLAN.md`, `DESIGN.md`, `PROGRESS.md`, so any AI tool the owner uses later follows the same rules.

---

# 1. Product Scope (Mobile)

One app, role-based experience after login.

| Role | In mobile MVP? | Notes |
|---|---|---|
| Passenger | ✅ Full | Book, track, cancel, history, pay, rate |
| Driver | ✅ Full | Profile, vehicle, online/offline, requests, ride lifecycle, earnings |
| Admin | ⚪ Optional (Phase 10, "Admin-Lite") | Project plan says admin is desktop-first. Only a read-only dashboard/lists on mobile, and only if owner approves |

**MVP flow to deliver (matches `PLAN.md` §3):**

```text
Register → Login → Book ride → Fare estimate → Request ride
→ Driver receives request → Driver accepts → Driver arriving → arrived
→ Ride starts → Ride completes → Passenger sees history
```

**Out of MVP (later phases):** Socket.IO real-time, push notifications, online payment gateway, background GPS, surge pricing, coupons.

---

# 2. Technology Stack

| Purpose | Choice | Reason |
|---|---|---|
| Framework | **Expo (latest stable SDK) + React Native, JavaScript** | Easiest for a beginner; no Android Studio/Xcode needed to start |
| Create command | `npx create-expo-app@latest mobile --template blank` (JS) | Blank JS template, then add structure |
| Navigation | **React Navigation** (native-stack + bottom-tabs) | Mature, well documented, conditional auth flows |
| Server state | **TanStack Query** | Caching, retries, `refetchInterval` polling |
| HTTP | **Axios** | Interceptors for auth + error normalization |
| Forms | **React Hook Form** (+ small hand-written validators in `utils/validators.js`) | Matches web plan |
| Secure storage | `expo-secure-store` | JWT token |
| Simple storage | `@react-native-async-storage/async-storage` | Theme preference, onboarding flag |
| Icons | `lucide-react-native` (+ `react-native-svg`) | Same icon family as the web app |
| Safe areas | `react-native-safe-area-context` | Do **not** use RN's deprecated `SafeAreaView` |
| Gestures/animation | `react-native-gesture-handler`, `react-native-reanimated` (only as needed by navigation / DESIGN.md) | Keep animations minimal |
| Location | `expo-location` | Foreground GPS, reverse geocoding |
| Maps | `react-native-maps` (works in Expo Go) with OpenStreetMap tiles via `UrlTile`, fallback: default provider | No paid key required (Section 6.4) |
| Place search | **Nominatim (OpenStreetMap)** or **Photon** — free, no key | Behind `geocodingService` so it's swappable |
| Route line | **OSRM public demo server** — free, no key | Display only; **official fare comes from backend** |
| Fonts | `expo-font` / `@expo-google-fonts/*` per `DESIGN.md` | |
| Splash | `expo-splash-screen` | Hold until auth bootstrap finishes |
| Haptics (optional) | `expo-haptics` | Only if `DESIGN.md` wants it |
| Unit/component tests | `jest-expo`, `@testing-library/react-native`, `axios-mock-adapter` | |
| E2E tests | **Maestro** (YAML flows) | Beginner-friendly, no code |
| Lint/format | ESLint (`eslint-config-expo`) + Prettier | |
| Later | `socket.io-client`, `expo-notifications`, Razorpay (test mode) | Only in their phases |

> Draggable bottom sheet (`@gorhom/bottom-sheet`) — add **only** if `DESIGN.md` requires a draggable sheet. Otherwise use a simple animated panel.

---

# 3. Folder Structure (`mobile/`)

```text
mobile/
├── AGENTS.md
├── MOBILE_PLAN.md          (this file)
├── DESIGN.md               (owner-provided)
├── PROGRESS.md             (AI-maintained log)
├── README.md               (how to run, test, build — plain language)
├── .env.example
├── .gitignore
├── app.config.js
├── babel.config.js
├── eslint.config.js / .eslintrc.js
├── jest.config.js
├── package.json
├── App.js
├── index.js
├── .maestro/               (E2E flows)
├── scripts/
│   └── check-backend.js    (live API smoke script)
└── src/
    ├── api/
    │   ├── client.js            axios instance + interceptors
    │   ├── authApi.js
    │   ├── userApi.js
    │   ├── driverApi.js
    │   ├── rideApi.js
    │   ├── paymentApi.js
    │   └── adminApi.js          (Phase 10 only)
    ├── services/
    │   ├── geocodingService.js  (Nominatim/Photon behind one interface)
    │   ├── routingService.js    (OSRM)
    │   └── locationService.js   (permissions, current position)
    ├── context/
    │   ├── AuthContext.js
    │   └── ThemeContext.js
    ├── theme/
    │   ├── tokens.js            colors (light+dark), spacing, radii, typography, shadows — from DESIGN.md
    │   └── useTheme.js
    ├── navigation/
    │   ├── RootNavigator.js     chooses stack by auth state + role
    │   ├── AuthNavigator.js
    │   ├── PassengerNavigator.js
    │   ├── DriverNavigator.js
    │   └── AdminNavigator.js    (Phase 10)
    ├── screens/
    │   ├── auth/        Welcome, Login, Register
    │   ├── passenger/   Home, Booking, RideTracking, RideDetails, History, Payment, Rating, Profile
    │   ├── driver/      Dashboard, Requests, ActiveRide, Earnings, History, Vehicle, Profile
    │   └── admin/       (Phase 10)
    ├── components/
    │   ├── ui/          Button, Input, Card, Badge, Modal/Sheet, Avatar, Loader, Skeleton,
    │   │                ErrorState, EmptyState, Toast, Divider, ListItem, ThemeToggle
    │   ├── ride/        RideCard, RideStatusBadge, RideStatusTimeline, VehicleOption, FareSummary,
    │   │                LocationInput, PlaceSearchList, DriverCard
    │   ├── map/         RideMap (markers, route polyline, OSM attribution)
    │   └── layout/      Screen (safe-area + keyboard + scroll wrapper), Header
    ├── hooks/           useRidePolling, useDebounce, useAppState, useNetworkStatus, useCurrentLocation
    ├── constants/       rideStatus.js, vehicleTypes.js, config.js, queryKeys.js
    ├── utils/           validators.js, format.js (₹, distance, dates), errors.js, storage.js
    └── __tests__/       mirrors src structure
```

---

# 4. Theming (from `DESIGN.md`)

1. Read `DESIGN.md` completely. Extract: color palette (light + dark), typography (fonts, sizes, weights), spacing scale, radii, shadows/elevation, button/input/card/badge/modal/nav styles, animation rules, icon rules, empty/loading/error state looks, map styling.
2. Encode them in `src/theme/tokens.js` as `{ light: {...}, dark: {...} }` plus shared `spacing`, `radii`, `typography`.
3. `ThemeContext` supports **System (default) / Light / Dark**, persisted in AsyncStorage, with a `ThemeToggle` (same idea as the web app's toggle).
4. `useTheme()` returns `{ colors, spacing, radii, typography, isDark, mode, setMode }`.
5. Components style via `useTheme()` and `StyleSheet.create` factories/memoized styles. **No raw hex values outside `tokens.js`.**
6. Status bar style, navigation theme, map style, and splash/background must also follow the theme.
7. UX principles (also in the owner's brief): **modern, simple, minimalist, clean, user-friendly.** Minimum 44×44 pt touch targets, readable text (respect system font scaling), generous whitespace, one primary action per screen, no cluttered screens, subtle motion only (150–300 ms), consistent components.
8. Create a hidden dev-only **Component Gallery screen** (reachable only in `__DEV__`) that renders every UI component in light and dark so the owner and you can visually verify theme fidelity against `DESIGN.md`.

> If `DESIGN.md` conflicts with mobile platform conventions (e.g., web hover states), adapt sensibly (pressed states) and note it in `PROGRESS.md`.

---

# 5. Navigation Map

```text
RootNavigator
├── Splash/Bootstrap (reads token → GET /auth/me)
├── AuthNavigator (logged out)
│   ├── Welcome
│   ├── Login
│   └── Register (choose Passenger / Driver)
├── PassengerNavigator (role = passenger)
│   ├── Tabs: Home · Activity(History) · Profile
│   └── Stack: Booking → RideTracking → Payment → Rating · RideDetails
├── DriverNavigator (role = driver)
│   ├── Tabs: Dashboard · Earnings · History · Profile
│   └── Stack: Vehicle · EditProfile · ActiveRide
└── AdminNavigator (role = admin, Phase 10 optional)
```

Rules: screens are chosen by **conditional rendering of navigators based on auth state and role** (not by navigating imperatively after login). Backend still enforces roles; the app only shapes the UI. Handle Android hardware back button correctly (e.g., block back on an active ride tracking screen, or confirm).

---

# 6. Core Architecture

## 6.1 API client (`src/api/client.js`)
- `baseURL` from `EXPO_PUBLIC_API_URL` (e.g., `http://192.168.1.10:5000/api`), 15 s timeout.
- Request interceptor: attach `Authorization: Bearer <token>` from SecureStore.
- Response interceptor: normalize all failures to `{ message, code, status, fieldErrors }` using the backend envelope `{ success:false, message, error:{ code } }`; network/timeouts become friendly messages ("Can't reach server. Check your connection.").
- On `401` (except login/register calls): clear token and reset auth state.
- Unwrap the success envelope `{ success, message, data, pagination }` in the API modules so screens receive clean data.

## 6.2 Auth
- `AuthContext`: `{ user, role, status: 'loading'|'authenticated'|'unauthenticated', login, register, logout, refreshUser }`.
- Bootstrap on app start: read token → `GET /auth/me` → set user; keep splash visible until resolved.
- Logout: call `POST /auth/logout` (ignore failure), delete token, clear TanStack Query cache.

## 6.3 Ride state machine → UI mapping

Backend statuses: `requested → accepted → driver_arriving → driver_arrived → started → completed`, plus `cancelled` (only from `requested` or `accepted`).

| Status | Passenger sees | Passenger actions | Driver sees | Driver actions |
|---|---|---|---|---|
| requested | "Finding your driver…" | Cancel | Incoming request card | Accept / Reject |
| accepted | Driver + vehicle info, "Driver accepted" | Cancel | "Go to pickup" | Mark **Arriving** |
| driver_arriving | "Driver is on the way" | — | Navigating to pickup | Mark **Arrived** |
| driver_arrived | "Driver has arrived" | — | Waiting at pickup | **Start ride** |
| started | "Ride in progress" | — | Ride in progress | **Complete ride** |
| completed | Fare summary | Pay → Rate | Earnings added | Done |
| cancelled | "Ride cancelled" | Book again | Request closed | — |

Keep this mapping in `constants/rideStatus.js` (label, color token, icon, allowed next actions) — **single source** used by badges, timeline, and buttons. The backend remains the authority; the app never trusts its own transition logic, it only hides impossible buttons and handles `409/422` errors gracefully.

## 6.4 Real-time without Socket.IO (MVP): polling
- Passenger active ride: `useRidePolling(rideId)` → `GET /rides/:rideId` every **4 s** while status is non-terminal.
- Driver requests: `GET /drivers/me/ride-requests` every **5 s** while online and no active ride.
- Pause polling when the app is backgrounded (`AppState`) or the screen is unfocused; resume on focus.
- Driver location: while online and app is foreground, `PATCH /drivers/me/location` every **10–15 s** (foreground only; background GPS needs a dev build and is out of MVP).
- Phase 12 replaces polling with Socket.IO **only after** the backend `sockets/` layer exists.

## 6.5 Maps, places, routes (all free, no key for MVP)
- **Map:** `react-native-maps` with OSM `UrlTile` (`https://tile.openstreetmap.org/{z}/{x}/{y}.png`), show "© OpenStreetMap contributors". Verify behaviour in Expo Go on Android and iOS; if a tile approach misbehaves, fall back to the default map provider and note it.
- **Place search:** `geocodingService.search(query)` using Nominatim (`https://nominatim.openstreetmap.org/search?format=jsonv2&q=…&countrycodes=in&limit=6`). **Follow the usage policy:** debounce ≥ 600 ms, min 3 characters, max ~1 request/second, send an identifying `User-Agent`/`Referer`, cache results. Photon (`https://photon.komoot.io/api/`) is an acceptable alternative. Always also offer **"Use current location"** and **"Pick on map"**.
- **Reverse geocode:** `expo-location` `reverseGeocodeAsync` (device-based, free).
- **Route line:** OSRM `https://router.project-osrm.org/route/v1/driving/{lng},{lat};{lng},{lat}?overview=full&geometries=geojson` — ⚠️ **longitude first, then latitude**; convert GeoJSON `[lng,lat]` to map `{latitude, longitude}`. Demo server: low volume only; handle failure by simply not drawing the line.
- **Fare & distance/time shown to the user come from the backend** `POST /rides/fare-estimate`. The app never computes the official fare.
- If heavier usage or a polished map is requested later, ask the owner for a key (Section 12) — e.g., OpenRouteService.

## 6.6 Permissions
Foreground location only. Provide human-friendly explanation before the system prompt; if denied, show an inline state with a button to open Settings (`Linking.openSettings()`) **and** still allow manual address entry. Set required permission strings in `app.config.js`.

## 6.7 Environment
`.env.example`:
```env
EXPO_PUBLIC_API_URL=http://YOUR_COMPUTER_IP:5000/api
```
`app.config.js` sets name `RideX`, slug `ridex`, scheme `ridex`, `userInterfaceStyle: "automatic"`, bundle/package id `com.ridex.app`. A phone cannot use `localhost` for your computer — see the owner's guide.

---

# 7. Backend Contract

## 7.1 Endpoints (from `BACKEND_PLAN.md` — **verify each in the real code before use**)

| Area | Endpoints |
|---|---|
| Health | `GET /api/health` |
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/logout` |
| Users | `GET/PATCH/DELETE /users/me`, `PATCH /users/me/password` (optional) |
| Driver | `GET/PATCH /drivers/me`, `PATCH /drivers/me/status` `{isOnline}`, `PATCH /drivers/me/location` `{lat,lng}`, `GET /drivers/me/ride-requests` |
| Vehicles | `POST/GET /drivers/me/vehicles`, `PATCH/DELETE /drivers/me/vehicles/:vehicleId` |
| Rides | `POST /rides/fare-estimate`, `POST /rides`, `GET /rides/:rideId`, `GET /rides/history?page&limit&status`, `PATCH /rides/:rideId/{cancel,accept,reject,arriving,arrived,start,complete}`, `POST/GET /rides/:rideId/rating` |
| Payments | `POST /payments/:rideId`, `GET /payments/:paymentId`, `GET /payments/history` |
| Admin | `GET /admin/dashboard`, `/admin/users`, `/admin/drivers`, `/admin/rides`, `/admin/payments` (+ verify/status PATCHes) |

Response envelope: `{ success, message, data }` / errors `{ success:false, message, error:{ code } }` / lists add `pagination`. Vehicle types: `bike | auto | car`. Coordinates: `{ lat, lng }` (+ `address` for rides).

## 7.2 Phase-0 contract audit (mandatory)
Read `backend/src/routes`, `controllers`, `validators`, `models`, `middleware/auth.middleware.js`. Produce `mobile/API_CONTRACT.md` listing, per endpoint the app uses: method, path, auth/role, exact request body fields, exact response shape, error codes. This file is what the app code is built against.

## 7.3 Known gaps to check (likely issues in the plans)

| # | Potential gap | What the mobile app needs |
|---|---|---|
| 1 | **Token transport.** Backend plan says "JWT / secure cookie". Mobile apps handle cookies poorly. | Login/register response must return a token in JSON **and** `auth.middleware` must accept `Authorization: Bearer <token>` |
| 2 | **Driver registration.** Register body has no `role`; no endpoint listed to create the Driver profile (`licenseNumber`). | A clear way to sign up as a driver and create the driver profile |
| 3 | **Driver earnings / driver ride history / driver active ride** are not listed. | Endpoints (or a documented way) to get these |
| 4 | **Passenger active ride** on app restart. | Use `GET /rides/history?status=…` or a dedicated endpoint to find an in-progress ride |
| 5 | **Server binding.** Phone on Wi-Fi must reach the backend. | Backend must listen on `0.0.0.0` (not only localhost) |
| 6 | **Payment body** for `POST /payments/:rideId` is unspecified. | Exact fields (method cash/online, etc.) |
| 7 | **Reject semantics** (`PATCH /rides/:rideId/reject`). | Whether the driver's request list hides it afterwards |
| 8 | **Driver verification gate.** Can an unverified driver go online? | Rules and error codes |

## 7.4 Backend Change Request protocol
If a gap blocks you, **do not edit the backend silently and do not fake it.** Stop and output:

```text
🛠 BACKEND CHANGE REQUEST
Gap: <what is missing>
Why the app needs it: <1–2 lines>
Smallest proposed change: <endpoint/field, file(s) to touch>
Impact on existing web app: <none / what>
Options: A) I make this change in backend/ (needs your approval)  B) mock behind a service interface for now
Waiting for your choice.
```
After approval: make the change on a separate branch/commit prefixed `feat(backend):`, add/adjust backend tests, update `API_CONTRACT.md`.

---

# 8. Development Phases

Each phase ends with the **Phase Report** (Section 9) and waits for approval. Do not start the next phase until the owner says to continue.

## Phase 0 — Preflight & Contract Audit (no app code)
**Goal:** Know exactly what exists.
- Read `PLAN.md`, `BACKEND_PLAN.md`, `mobile/DESIGN.md`, this file.
- Inspect `backend/` code. Run the backend if possible; hit `GET /api/health`.
- Check the owner's machine tools: Node (LTS), npm, Git. Report versions; tell the owner exactly what to install if missing.
- Produce `mobile/API_CONTRACT.md` and a **Gaps list** (Section 7.3) with proposed handling.
- Summarize `DESIGN.md` in ≤ 20 lines to prove you read it (palette, fonts, key components, any missing pieces you need answered).
- Ask the owner for: their computer's local IP (or tell them how to get it), a test passenger and test driver account (or offer to create via API).
**Done when:** contract file exists, gaps listed, owner answered open questions.

## Phase 1 — Scaffold, Tooling, Quality Gates
- Create the Expo JS app in `mobile/`; install base dependencies (Section 2) with `npx expo install`.
- Create folder structure (Section 3), `.env.example`, `.gitignore` (incl. `.env`), `app.config.js`, ESLint + Prettier, Jest (`jest-expo`) + RNTL, scripts in `package.json`: `start`, `lint`, `test`, `doctor`, `bundle-check`.
- Create `AGENTS.md`, `PROGRESS.md`, `README.md` (plain-language: install, run, test).
- A single "Hello RideX" screen proves the app boots in Expo Go.
**Verify:** `npx expo-doctor`, `npm run lint`, `npm test` (one sample test passes), `npx expo export --platform android` bundles successfully, app opens in Expo Go.
**Commit:** `chore(mobile): scaffold expo app with tooling`

## Phase 2 — Theme & UI Kit (strictly from DESIGN.md)
- `tokens.js`, `ThemeContext`, `useTheme`, fonts loaded, status bar/navigation theme.
- Components: Screen, Header, Button (variants/sizes/loading/disabled), Input (label/error/secure/icon), Card, Badge, Modal/Sheet, Loader, Skeleton, ErrorState, EmptyState, Toast, ListItem, Avatar, ThemeToggle.
- Dev-only Component Gallery in light & dark.
**Tests:** each component renders in both themes; Button disabled/loading blocks presses; Input shows error; theme persists across restart.
**Done when:** the owner visually confirms the gallery matches `DESIGN.md` in light and dark.
**Commit:** `feat(mobile): add design tokens, theme and ui kit`

## Phase 3 — Navigation Shell
- Root/Auth/Passenger/Driver navigators with placeholder screens that use the real UI kit; role switching via a temporary dev-only switch (removed in Phase 4).
- Tab bars and headers styled from `DESIGN.md`; Android back handling; deep link scheme `ridex://` configured.
**Tests:** navigation renders correct stack per role/state; tab labels present.
**Commit:** `feat(mobile): add role-based navigation shell`

## Phase 4 — API Layer & Authentication
- `client.js`, `authApi.js`, SecureStore token helpers, `AuthContext`, bootstrap + splash.
- Screens: Welcome, Login, Register (role choice), with validation (email, phone, password rules matching backend validators), inline field errors from the server, loading state, double-submit protection, keyboard-friendly layout.
- Logout in Profile; session expiry handling (401).
- `scripts/check-backend.js`: hits `/health`, registers/logs in a test user, calls `/auth/me` — prints a pass/fail table.
**Tests:** validators; API client error normalization; AuthContext (login success, invalid credentials, bootstrap with/without token, 401 → logout); Login/Register screen validation; mocked with `axios-mock-adapter`.
**Live check:** `node scripts/check-backend.js` passes against the real backend.
**Commit:** `feat(mobile): add authentication flow`

## Phase 5 — Passenger: Booking
- Home screen (greeting, primary "Where to?" CTA, recent rides preview, theme-aware map preview).
- Booking screen: pickup (default current location), destination (search + pick on map), vehicle selection (`bike/auto/car`), fare estimate via backend, route line (OSRM, optional), confirm → `POST /rides`.
- Location permission flow (Section 6.6), debounce, race-condition-safe search (ignore stale results), clear errors.
**Tests:** debounce hook; geocoding service parsing (mocked); fare formatting; booking form validation; confirm button disabled until valid; error states; mocked booking happy path.
**Commit:** `feat(mobile): passenger booking with fare estimate`

## Phase 6 — Passenger: Ride Lifecycle, History, Profile
- RideTracking screen driven by `useRidePolling`, status timeline/badge, driver & vehicle card when assigned, **Cancel** (confirm dialog, only where allowed), terminal states (completed/cancelled).
- Restore an in-progress ride after app restart (gap #4 solution).
- History (pagination, status filter, pull-to-refresh, skeletons, empty/error states) and RideDetails.
- Profile (view/edit, change password if backend supports it, theme toggle, logout).
**Tests:** polling starts/stops by status & focus; status→UI mapping; cancel flow incl. `409` handling; history pagination; empty/error states.
**Commit:** `feat(mobile): passenger ride tracking, history and profile`

## Phase 7 — Driver: Onboarding & Dashboard
- Driver profile (license, verification status badge), Vehicle CRUD (type, brand, model, color, registration number).
- Dashboard: **Online/Offline switch** (blocked with clear message if unverified/no vehicle, per backend rules), foreground location updates while online, incoming requests list (polling) with RideRequest cards.
**Tests:** switch behaviour & error messages; location update scheduler starts/stops with online state & app state; vehicle form validation; requests list states.
**Commit:** `feat(mobile): driver profile, vehicle and online dashboard`

## Phase 8 — Driver: Ride Lifecycle & Earnings
- Accept/Reject with optimistic-safe UI (handle "already taken" `409`).
- ActiveRide screen: one large primary button that always matches the next valid action (Arriving → Arrived → Start → Complete), pickup/destination info, map with markers.
- Complete → show final fare. Earnings and History per gap #3 resolution.
**Tests:** every transition button maps to correct endpoint; invalid transition error shown nicely; earnings formatting; double-tap protection.
**Commit:** `feat(mobile): driver ride lifecycle and earnings`

## Phase 9 — Payments & Ratings
- After completion: Payment screen (cash / online per backend; online is **mock/test** until the owner chooses a gateway — then follow Section 12), payment history.
- Rating screen (1–5 stars + optional comment), view rating.
**Tests:** payment states (pending/paid/failed), rating validation, duplicate-submission guard.
**Commit:** `feat(mobile): payments and ratings`

## Phase 10 — Admin-Lite (OPTIONAL — ask the owner first)
- Read-only: dashboard stats, users, drivers (with verify action if backend allows), rides, payments; paginated lists with search/filter; mobile-friendly tables as cards.
**Tests:** list pagination/filter, role guard (non-admin never sees these routes).
**Commit:** `feat(mobile): admin lite`

## Phase 11 — Polish, Accessibility, Performance, Resilience
- Accessibility: labels/roles/hints for all touchables, contrast per `DESIGN.md`, dynamic text size, screen-reader order, reduced-motion respect.
- Offline/slow network banner (`useNetworkStatus`), retry everywhere, request cancellation on unmount.
- Performance: `FlatList` for lists with proper `keyExtractor`, memoization where measured, image sizing, no unnecessary re-renders from polling.
- Keyboard handling on every form, small-phone and tablet checks, RTL-safe layout where feasible.
- App icon, adaptive icon, splash (from `DESIGN.md` brand), app name.
- Remove dev-only switches; strip `console.log`; confirm no secrets in bundle.
**Commit:** `chore(mobile): polish, accessibility and resilience`

## Phase 12 — Real-time & Push (FUTURE — only if backend Socket.IO exists)
- `socket.io-client` connection authenticated with the token; events for ride status, new requests, driver location; fallback to polling on disconnect.
- Push notifications via `expo-notifications` (note: requires a development build for full behaviour on recent SDKs — explain and ask owner first).
**Commit:** `feat(mobile): realtime updates`

## Phase 13 — Full Integration Test, Docs, Release Build
- Run the **end-to-end scenario** with two real devices/emulators (passenger + driver) against the real backend: register → book → accept → arriving → arrived → start → complete → pay → rate → history.
- Maestro flows for critical paths in `.maestro/`.
- Final `README.md` (run, test, env, troubleshooting), update `PROGRESS.md`, screenshots checklist for the viva.
- Build an installable **Android APK** with EAS Build (free tier) — ask the owner to create a free Expo account when you reach this step; guide them click by click.
**Commit:** `docs(mobile): final docs and release build`

---

# 9. Phase Report Format (end of EVERY phase)

```text
## ✅ Phase N — <name> — Report
1. What was built (plain language, 3–8 lines)
2. Files created/changed
3. Verification evidence: commands run + results (lint, tests, bundle check, live script)
4. HOW YOU TEST IT (owner steps): exact commands and exact taps on the phone, and what you should see
5. Light/Dark theme check results vs DESIGN.md
6. Known issues / assumptions / decisions made
7. Backend gaps or change requests (if any)
8. Updated PROGRESS.md ✔
9. Next phase preview + question: "Reply 'approved' to continue, or tell me what to fix."
```

Then **stop**.

---

# 10. Testing Strategy

## 10.1 Layers

| Layer | Tool | What |
|---|---|---|
| Static | ESLint, Prettier, `npx expo-doctor` | Code quality, config/dependency health |
| Bundle | `npx expo export --platform android` (and `ios`) | Proves the app compiles without a device |
| Unit | Jest | validators, formatters, status map, hooks (`useDebounce`, `useRidePolling`), services with mocked fetch |
| Component | RNTL | UI kit in both themes, forms, screens with mocked API |
| Integration | Jest + RNTL + `axios-mock-adapter` + QueryClient wrapper | auth flow, booking flow, driver lifecycle |
| Live contract | `scripts/check-backend.js` | Real backend responds as `API_CONTRACT.md` says |
| E2E | Maestro (`.maestro/*.yaml`) | Login, booking, driver accept & complete on emulator/device |
| Manual QA | Checklist below | Real device behaviour |

## 10.2 Commands (all must pass before a phase is "done")
```bash
npm run lint
npm test -- --ci
npx expo-doctor
npx expo export --platform android
node scripts/check-backend.js     # when the backend is running
```

## 10.3 Test rules
- Every API module and every screen with logic gets tests: **success, failure, loading, empty**.
- Mock the network in tests; never hit the real backend from Jest.
- Test both themes for visual components (snapshot **or** style assertions using tokens — no brittle pixel snapshots of whole screens).
- Fix failing tests by fixing the code, not by deleting tests or loosening assertions.
- Add a regression test for every bug you fix.

## 10.4 Manual QA matrix (per major phase)
- Android + iOS (whichever the owner has) · Light + Dark · small + large phone
- Fresh install, relogin, killed-and-reopened app, expired token
- Permission denied/granted, GPS off, airplane mode, slow network, backend down
- Double-tap submit, rapid back/forward navigation, keyboard covering inputs
- Rotate device (or confirm portrait lock is intentional)

---

# 11. Error Handling & UX States

| Situation | Behavior |
|---|---|
| No internet / server unreachable | Friendly message + Retry; non-blocking banner |
| 401 | Silent logout → Login with "Session expired" |
| 403 | "You don't have access to this." |
| 404 | Clear "not found" state |
| 409 / 422 | Show backend message; field errors inline |
| 500 | "Something went wrong. Try again." (never show stack traces) |
| Empty list | Illustrated/iconic EmptyState with next action |
| Long operation | Skeleton or loader; disable the triggering button |

Use one `errors.js` helper to translate API error codes to user text. Never expose raw error objects in UI.

---

# 12. "Ask the Owner for a Key" Protocol

**The MVP needs NO paid or secret API keys** (OSM tiles, Nominatim/Photon, OSRM, expo-location are all keyless). You will only need the backend URL.

When you reach something that needs an external account, key, or setting, **stop and output exactly**:

```text
🔑 I NEED SOMETHING FROM YOU
What: <e.g., OpenRouteService API key>
Why: <what feature breaks or is worse without it>
Cost: <free tier limits / any card required>
How to get it (step by step, for a beginner):
  1. ...
  2. ...
Where to put it: <file + variable name, e.g. mobile/.env → EXPO_PUBLIC_ORS_KEY=...>
Is it safe inside the app? <yes (public key) / NO — must live in backend>
Alternative if you'd rather not: <keyless option or skip>
Reply with the key (or "skip") and I'll continue.
```

**Possible requests (only when its phase/feature is reached):**

| When | What | Free? |
|---|---|---|
| Better routing than OSRM demo | OpenRouteService key | Free tier |
| Standalone Android build with Google Maps | Google Maps API key | Needs billing account (free credit) — prefer staying on OSM |
| Online payments | Razorpay **test** Key ID (public) in app; **secret stays in backend** | Free in test mode |
| Push notifications / APK build | Free Expo account (EAS) | Free tier |
| Hosting backend for demos | MongoDB Atlas + Render/Railway free tiers | Free tiers |

Never put a secret key (payment secret, DB password, JWT secret) into the mobile app or `EXPO_PUBLIC_*`. Never commit keys. Add each new variable to `.env.example` with a placeholder.

---

# 13. Debugging Playbook (common Expo / React Native problems)

| Symptom | Likely cause → fix |
|---|---|
| "Network request failed" on phone | App uses `localhost`. Use computer LAN IP; backend must listen on `0.0.0.0`; same Wi-Fi; firewall allows the port. Test `http://IP:5000/api/health` in the phone's browser first. |
| Android blocks `http://` | Cleartext traffic. Expo Go allows it in dev; for standalone builds use HTTPS (deploy backend) or enable cleartext via config plugin — explain tradeoff to owner |
| Metro stale / weird errors | `npx expo start -c` |
| Version mismatch warnings | `npx expo install --check` / `npx expo install --fix` |
| Reanimated / gesture handler errors | Ensure required babel plugin/setup per installed version's docs; restart with `-c` |
| Map is blank | Check API key requirements for build type; verify `UrlTile` config; test with default provider |
| Keyboard hides input | Use `Screen` wrapper with keyboard avoiding + scroll |
| Polling keeps running in background | Missing AppState/focus gating in `useRidePolling` |
| Red screen after adding library | Library needs a dev build — switch to an Expo-Go-compatible alternative or ask owner |

When a bug appears: reproduce → read the **full** error → find root cause → fix → add regression test → re-run all checks. Don't paper over errors with try/catch that hides them.

---

# 14. Definition of Done

**A feature is done when:** UI matches `DESIGN.md` in light + dark; all four states handled; uses real backend endpoints per `API_CONTRACT.md`; tests written and passing; lint/bundle checks pass; owner's manual test steps verified; `PROGRESS.md` updated; committed with a conventional message on a feature branch (`feature/mobile-<name>`).

**Mobile MVP is complete when:**
- [ ] Passenger: register, login, book, fare, track status, cancel, history, pay, rate
- [ ] Driver: register, login, vehicle, online/offline, receive/accept/reject, full lifecycle, earnings, history
- [ ] (Optional) Admin-lite
- [ ] Light and dark themes match `DESIGN.md` on every screen
- [ ] All tests pass; Maestro critical flows pass
- [ ] Installable APK builds; README lets a classmate run it
- [ ] The team can explain every part during the viva

---

# 15. PROMPT LIBRARY (owner copy-pastes these)

## P1 — Kickoff Prompt (use once, at the very start)

```text
You are the sole senior mobile engineer for my project "RideX" (a ride-booking app). I am a complete beginner in React Native — you must handle everything yourself and explain things in plain language.

Files in the repo you must read FIRST, fully:
1. mobile/MOBILE_PLAN.md  — your complete implementation plan and rules (follow it strictly)
2. mobile/DESIGN.md       — I have provided the full UI design. Build the app EXACTLY according to it, in BOTH dark and light themes. UX must be modern, simple, minimalist, clean and user friendly. Do not invent your own design; if something is missing from DESIGN.md, ask me.
3. PLAN.md and backend/BACKEND_PLAN.md — the project and backend plans. The backend code in backend/ is the real API contract.

Hard rules:
- JavaScript only. NO TypeScript.
- React Native with Expo, as described in MOBILE_PLAN.md.
- Never invent backend endpoints; if something is missing, send a BACKEND CHANGE REQUEST and wait.
- Check the official docs for the library versions you install; avoid deprecated APIs.
- Work phase by phase (Phase 0 → 13). Verify every step with the commands in MOBILE_PLAN.md Section 10 and show me the evidence. Write proper tests as you go.
- Whenever you need an API key, account, or any information from me, STOP and ask using the "I NEED SOMETHING FROM YOU" format in Section 12, with beginner-friendly step-by-step instructions. Prefer free, keyless options.
- Keep mobile/PROGRESS.md updated.
- After EVERY phase, give the Phase Report (Section 9), tell me exactly how to test on my phone, then STOP and wait for my "approved".

Start now with Phase 0 (preflight & contract audit) and then Phase 1. Do not skip ahead.
```

## P2 — Start / Continue a phase

```text
Phase <N-1> is approved. Re-read mobile/MOBILE_PLAN.md (Phase <N>), mobile/DESIGN.md, mobile/API_CONTRACT.md and mobile/PROGRESS.md. Build Phase <N> completely, following every rule. Run all verification commands, write the tests, then give the Phase Report and stop.
```

## P3 — Fix a bug

```text
Something is wrong. Here is what I did, what I expected, and what happened:
<describe + paste the full red error text and/or attach a screenshot>

Find the ROOT CAUSE (don't guess or hide the error), fix it, add a regression test, re-run lint/tests/bundle check, and tell me in plain language what was wrong and how to re-test. Keep the design consistent with DESIGN.md in both themes.
```

## P4 — Audit before approving a phase

```text
Before I approve this phase, audit your own work: (1) compare every screen against DESIGN.md in light and dark, (2) check all four states (loading/success/error/empty) exist, (3) look for hard-coded colors/sizes, TypeScript files, unused dependencies, console.logs, leaked secrets, (4) confirm every API call exists in API_CONTRACT.md, (5) re-run all verification commands. List problems found and fix them.
```

## P5 — Resume after the chat/context was reset

```text
You are continuing the RideX mobile app. Read mobile/AGENTS.md, mobile/MOBILE_PLAN.md, mobile/DESIGN.md, mobile/API_CONTRACT.md and mobile/PROGRESS.md, inspect the current code, tell me in 10 lines where we are, then continue with the next unfinished step under the same rules.
```

## P6 — Ask the AI to explain (viva prep)

```text
Explain <screen / feature / folder> of the RideX mobile app to me like I'm a beginner, then give me 5 likely viva questions with short answers.
```

---

*End of MOBILE_PLAN.md*