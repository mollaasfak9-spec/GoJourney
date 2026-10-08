# AGENTS.md — RideX Mobile

This file is for any AI coding tool (or human) that works on the RideX mobile app.
**Read this file first, then read the docs it points to.**

## Read these, in this order

1. **`DESIGN.md`** — the exact UI. Everything visual is defined here.
2. **`MOBILE_PLAN.md`** — architecture, phases, rules, testing strategy.
3. **`API_CONTRACT.md`** — the exact backend endpoints the app may call.
4. **`PROGRESS.md`** — where the build currently is.
5. `../PLAN.md` and `../backend/BACKEND_PLAN.md` — product scope. The real
   backend code in `../backend/src` is the real API contract.

Source-of-truth order when documents disagree: **owner's latest message →
`DESIGN.md` → `MOBILE_PLAN.md` → backend code → `PLAN.md`/`BACKEND_PLAN.md`.**

## Non-negotiable rules (restated from `MOBILE_PLAN.md` §0.2)

1. **JavaScript only.** Files are `.js` / `.jsx`. No `.ts`, `.tsx`, or TypeScript config.
2. **Follow `DESIGN.md` exactly, in both light and dark themes.** Never invent a look.
3. **Never invent backend endpoints.** Only call endpoints in `API_CONTRACT.md`.
   If one is missing, raise a Backend Change Request and wait.
4. **Never hard-code colors, spacing, font sizes, or radii.** Use theme tokens
   from `src/theme/tokens.js` via `useTheme()`.
5. **Use Expo (managed workflow).** Install native packages with
   `npx expo install <pkg>` so versions match the SDK. Prefer Expo Go.
6. **Check official docs for the installed library version.** Don't trust memory;
   avoid deprecated APIs.
7. **Add dependencies only when needed**, and say why. No duplicate libraries.
8. **Work in small steps and verify every step** with the commands in
   `MOBILE_PLAN.md` §10. Never say "done" without evidence.
9. **No placeholder code, no `TODO` stubs, no fake data** in production paths.
   Mocks live only in tests or behind a clearly-flagged service interface.
10. **Every screen handles Loading, Success, Error (with Retry), and Empty states.**
11. **Security:** tokens only in `expo-secure-store`. Never log tokens or passwords.
    Never commit `.env`. Secrets never go in the app; anything `EXPO_PUBLIC_*`
    is public.
12. **Ask, don't guess.** For a key, design decision, or backend change, use
    `MOBILE_PLAN.md` §7.4 or §12 and wait.
13. **Stop at the end of every phase** and wait for the owner's approval
    (`MOBILE_PLAN.md` §9 format).
14. **Maintain `PROGRESS.md`** after every phase — it is the memory if the chat resets.
15. **Plain-language communication.** Explain things for a beginner; give exact
    commands and exact taps.

## Commands

```bash
npm start            # start Expo dev server (scan QR with Expo Go)
npm run lint         # ESLint
npm run format       # Prettier (write)
npm test             # Jest unit/component tests
npm run doctor       # npx expo-doctor
npm run bundle-check # npx expo export --platform android
```

## Git

Follow `../GITHUB_GUIDE.md`. Branch from `develop` as `feature/mobile-<name>`
(or `chore/`, `docs/`). Conventional commits. Never commit `node_modules`,
`.env`, or secrets. One feature = one branch.
