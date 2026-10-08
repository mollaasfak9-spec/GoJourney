# RideX — Mobile App

The customer-facing RideX app for **passengers** and **drivers**, built with
**React Native + Expo (JavaScript)**. It talks to the existing RideX backend
(Node + Express + MongoDB).

> New here? Read `AGENTS.md` first. The UI is defined in `DESIGN.md`, the build
> plan in `MOBILE_PLAN.md`, and the exact API in `API_CONTRACT.md`.

---

## 1. What you need installed

| Tool | Version used | How to get it |
|---|---|---|
| Node.js | 24.x (LTS) | https://nodejs.org |
| npm | 11+ (comes with Node) | — |
| Git | 2.x | https://git-scm.com |
| **Expo Go** app | latest | Play Store / App Store (on your phone) |

Check them:

```bash
node -v
npm -v
git --version
```

---

## 2. First-time setup

```bash
# from the repository root
cd mobile
npm install
```

Copy the environment file and edit it (see step 4):

```bash
cp .env.example .env
```

---

## 3. Start the app

```bash
cd mobile
npm start
```

A QR code appears in the terminal. Open the **Expo Go** app on your phone and
scan it (Android: scan inside Expo Go; iOS: use the Camera app). The app should
show the RideX boot screen.

If something looks stale or broken:

```bash
npx expo start -c
```

---

## 4. Connect to the backend (important for a real phone)

A phone cannot reach your computer using `localhost`. Use your computer's Wi-Fi
IP address.

1. Start the backend (see `../backend/README.md` or `BACKEND_PLAN.md`). It needs
   a MongoDB connection (`MONGODB_URI`) and a `JWT_SECRET` in `../backend/.env`.
2. Find your computer's IP:
   - Windows: run `ipconfig`, look for **IPv4 Address** on the Wi-Fi adapter.
   - macOS: `ipconfig getifaddr en0`
   - Linux: `hostname -I`
3. Put it in `mobile/.env`:

   ```env
   EXPO_PUBLIC_API_URL=http://192.168.1.10:5000/api
   ```

   (Replace with **your** IP. Keep the `/api` at the end.)
4. Keep the phone and the computer on the **same Wi-Fi**.
5. Quick test from the phone's browser: open `http://<your-ip>:5000/api/health`.
   You should see JSON with `"status": "ok"`.

After changing `.env`, restart with `npx expo start -c`.

---

## 5. Run the checks

```bash
npm run lint          # code style
npm test              # unit/component tests
npm run doctor        # Expo config & dependency health
npm run bundle-check  # proves the app compiles for Android
```

---

## 6. Project structure

See `MOBILE_PLAN.md` §3 for the full tree. In short:

- `src/api/` — the only place that calls the backend.
- `src/theme/` — design tokens (colors, spacing, type) from `DESIGN.md`.
- `src/components/` — reusable UI pieces.
- `src/screens/` — one file per screen, grouped by role.
- `src/navigation/` — the role-based navigators.
- `src/hooks/`, `src/utils/`, `src/constants/` — shared logic.
- `scripts/check-backend.js` — live API smoke test (added in Phase 4).

---

## 7. Troubleshooting

| Problem | Fix |
|---|---|
| "Network request failed" on the phone | You are probably using `localhost`. Use the PC's LAN IP (`EXPO_PUBLIC_API_URL`), same Wi-Fi, and test `http://IP:5000/api/health` in the phone browser. |
| Blank / stale screen | `npx expo start -c` |
| Version mismatch warnings | `npx expo install --check` then `npx expo install --fix` |
| Map is blank | Confirm `react-native-maps` + OSM tiles (see `MOBILE_PLAN.md` §6.5). |

---

## 8. Status

See `PROGRESS.md` for the current phase and what is done.
