# RideX Mobile — DESIGN.md

> **Product:** RideX mobile app (React Native / Expo) for Passengers and Drivers (Admin optional)
> **Themes:** Dark and Light, both first-class
> **Direction:** Modern, minimalist, clean, calm, user friendly
> **References:** (1) dark UI with signal-green accent, pill inputs, bottom sheet, slide-to-action; (2) light UI with white canvas, navy info panels, rounded map card, big stats

This file describes what the app looks like and how it behaves. It is the single source of truth for UI. If something is not defined here, choose the simplest option consistent with these tokens and note it in `docs/MOBILE_PLAN.md` under "Assumptions".

---

# 1. Instructions for the AI building the app

1. Implement the UI exactly as described here. Do not invent a different look.
2. Put every value from sections 3 to 7 into `src/theme/` tokens. No hardcoded colors, sizes, radii or fonts in screens or components.
3. Every screen and component must work in both light and dark theme.
4. Never design or build anything listed in section 18 ("Do not").
5. Reuse components from section 9. Do not make a second button, card or input style.
6. Backend endpoints come from `BACKEND_PLAN.md` only. This file never defines API behavior.

---

# 2. Design Principles

```text
One primary action per screen
Map and content share the screen, never fight for it
Big type for the question, small type for the details
Soft rounded shapes, no hard borders
One accent color, used only for what matters now
Motion confirms an action, never decorates
Same component = same look everywhere
```

**Personality:** confident, quiet, fast. The app should feel like a premium mobility tool, not a colorful dashboard.

**What makes RideX recognizable (the one memorable thing):**
The **paired location card**: two pill inputs stacked inside one rounded container with a round swap button sitting on the seam between them. This appears on Home, Book, and Ride screens, and everything else stays quiet around it.

---

# 3. Color System

## 3.1 Brand logic

- **Accent (signal green)** marks the current state: the selected vehicle, the active route, online status, the live ride.
- **Dark theme:** primary buttons are green with near-black text.
- **Light theme:** primary buttons are ink navy with white text. Green appears as a highlight and on the route, never as large text on white.
- Both themes use the same green family so the brand feels the same.

## 3.2 Tokens, Dark theme

| Token | Hex | Use |
|---|---|---|
| `bg` | `#0A0D12` | Screen background |
| `surface` | `#11151B` | Cards, sheets |
| `surfaceRaised` | `#181D25` | Location card container, inputs |
| `surfaceMuted` | `#1F252E` | Inactive chips, icon circles |
| `border` | `#262D38` | Hairlines (use rarely) |
| `textPrimary` | `#FFFFFF` | Headings, key values |
| `textSecondary` | `#A3ACB9` | Labels, descriptions |
| `textTertiary` | `#6B7482` | Placeholders, hints |
| `accent` | `#22E55B` | Primary button, route, selected |
| `accentPressed` | `#19C24B` | Pressed state |
| `accentSoft` | `#0F2A1A` | Selected card background, success tint |
| `onAccent` | `#04110A` | Text/icons on accent |
| `danger` | `#FF5A5F` | Errors, cancel |
| `warning` | `#FFB020` | Pending, caution |
| `info` | `#4DA3FF` | Neutral info |
| `overlay` | `rgba(0,0,0,0.6)` | Modal backdrop |

## 3.3 Tokens, Light theme

| Token | Hex | Use |
|---|---|---|
| `bg` | `#FFFFFF` | Screen background |
| `surface` | `#F4F5F7` | Cards, chips |
| `surfaceRaised` | `#FFFFFF` | Raised cards (with soft shadow) |
| `surfaceMuted` | `#ECEEF2` | Inactive chips, icon circles |
| `border` | `#E6E8EC` | Hairlines (use rarely) |
| `textPrimary` | `#0B1020` | Headings, key values |
| `textSecondary` | `#5B6475` | Labels, descriptions |
| `textTertiary` | `#9AA2B1` | Placeholders, hints |
| `ink` | `#0B1020` | Primary button, dark panels |
| `onInk` | `#FFFFFF` | Text on ink |
| `accent` | `#22E55B` | Fills only (route, selected dot, progress, online) |
| `accentText` | `#0A8A35` | Green text/icons on white (must reach 4.5:1) |
| `accentSoft` | `#E6FBEC` | Selected card background, success tint |
| `onAccent` | `#04110A` | Text/icons on accent fills |
| `danger` | `#E5383B` | Errors, cancel |
| `warning` | `#C97A00` | Pending, caution |
| `info` | `#1F5FFF` | Neutral info |
| `overlay` | `rgba(11,16,32,0.45)` | Modal backdrop |
| `panelGradient` | `#0B1020` to `#171E45` | Dark info panel at the bottom of cards |

## 3.4 Ride status colors

| Status | Label shown | Color token | Style |
|---|---|---|---|
| `requested` | Finding your driver | `warning` | soft tint badge |
| `accepted` | Driver accepted | `accent` | soft tint badge |
| `driver_arriving` | Driver on the way | `accent` | soft tint badge |
| `driver_arrived` | Driver has arrived | `accent` | solid badge |
| `started` | On the trip | `info` | soft tint badge |
| `completed` | Completed | `accent` | soft tint badge |
| `cancelled` | Cancelled | `danger` | soft tint badge |

Never rely on color alone. Every status also has a text label.

---

# 4. Typography

**Font family:** Plus Jakarta Sans (load with `@expo-google-fonts/plus-jakarta-sans`, weights 400, 500, 600, 700). Fall back to the system font while loading. One family only.

| Style | Size / Line | Weight | Letter spacing | Use |
|---|---|---|---|---|
| `display` | 36 / 42 | 700 | -0.8 | "Where do you want to go?" |
| `h1` | 28 / 34 | 700 | -0.5 | Screen titles |
| `h2` | 22 / 28 | 600 | -0.3 | Section titles, card titles |
| `h3` | 18 / 24 | 600 | 0 | Sub-titles, driver name |
| `body` | 16 / 24 | 400 | 0 | Default text |
| `bodyStrong` | 16 / 24 | 600 | 0 | Emphasis |
| `small` | 14 / 20 | 400 | 0 | Secondary text |
| `caption` | 12 / 16 | 500 | 0.1 | Meta, helper text |
| `statXL` | 40 / 44 | 700 | -0.8 | Stats (trips, earnings) |
| `button` | 16 / 20 | 600 | 0.1 | Buttons |

Rules:
- Sentence case everywhere. No ALL CAPS labels.
- Support system font scaling up to 130%. Layouts must not break.
- Max 2 text sizes per card, plus the price.
- Prices use tabular numbers and the rupee sign: `₹150`.

---

# 5. Spacing, Radius, Elevation, Sizing

**Spacing (4pt grid):** `4, 8, 12, 16, 20, 24, 32, 40, 48`

| Item | Value |
|---|---|
| Screen horizontal padding | 20 |
| Gap between cards | 12 |
| Gap between sections | 24 |
| Minimum touch target | 48 x 48 (never below 44) |

**Radius:**

| Token | Value | Use |
|---|---|---|
| `sm` | 12 | Badges, small chips |
| `md` | 16 | Inputs inside the location card, small cards |
| `lg` | 24 | Cards, vehicle cards |
| `xl` | 32 | Bottom sheets (top corners), location card container |
| `pill` | 999 | Buttons, segmented control, plate, avatars |

**Elevation:**
- Dark theme: no shadows. Separate layers with `surface` and `surfaceRaised` only.
- Light theme: one soft shadow for raised surfaces: `0 8 24` at 8% ink. Cards sitting on `bg` use `surface` fill with no shadow.

**Sizes:**

| Item | Size |
|---|---|
| Avatar small / medium / large | 36 / 48 / 72 |
| Icon button | 48 circle |
| Icon (default) | 22, stroke 2 |
| Bottom tab bar height | 64 plus safe area |
| Map marker | 20 dot with 40 soft pulse ring |

---

# 6. Iconography and Imagery

- **Icons:** `lucide-react-native`, stroke width 2, rounded caps. No mixed icon families.
- Icons sit inside 48 circles (`surfaceMuted`) when they are tappable or decorative anchors.
- **Vehicle images:** transparent PNG, top-down or 3/4 view, soft neutral colors (white or silver body). Three types only: bike, auto, car. Use placeholder images until real assets exist; the layout must not depend on exact image size.
- **Avatars:** circle. Fallback is initials on `surfaceMuted`.
- No stock photos, no illustrations on core screens. Empty states use a single line icon.

---

# 7. Motion

Use `react-native-reanimated`. Motion answers an action; it does not run by itself.

| Moment | Animation | Duration |
|---|---|---|
| Button press | Scale to 0.97 + light haptic | 120 ms |
| Vehicle card select | Background to `accentSoft`, border to `accent`, scale 1.02 | 200 ms |
| Bottom sheet | Spring slide up, damping 20 | ~320 ms |
| Screen transition | Native stack default (slide), fade for modals | default |
| Status change | Cross-fade badge text, progress bar eases | 250 ms |
| Searching driver | One soft pulse ring on the pickup marker (loop) | 1600 ms |
| Slide to confirm | Thumb follows finger, track fills with accent | follows drag |
| Skeleton loader | Gentle shimmer | 1200 ms loop |
| Theme switch | Instant color swap (no flash) | none |

Rules:
- Respect "Reduce motion": replace slides and pulses with simple fades.
- No entrance animations on every list item. One reveal at most per screen.
- Haptics: light on button press and selection, success on ride completion, warning on errors.

---

# 8. Layout Shell

- **Safe areas** are respected on every screen.
- **Status bar:** light content on dark theme, dark content on light theme.
- **Map screens:** the map fills the whole screen. UI floats on top: top bar with back/menu, location card, and a bottom sheet.
- **Content screens** (history, profile, earnings): `bg` background, 20 px padding, large title at top, scrolling content.
- **Bottom sheet:** top radius 32, drag handle 40 x 4 (`textTertiary`, 40% opacity), three snap points: peek, half, full.
- **Keyboard:** screens with inputs use keyboard avoiding behavior; the primary button stays visible above the keyboard.

---

# 9. Components

Every component supports both themes, a disabled state, and accessibility labels.

## 9.1 Button

| Variant | Dark | Light |
|---|---|---|
| `primary` | `accent` fill, `onAccent` text | `ink` fill, `onInk` text |
| `secondary` | `surfaceMuted` fill, `textPrimary` text | `surface` fill, `textPrimary` text |
| `ghost` | transparent, `textPrimary` text | transparent, `textPrimary` text |
| `danger` | `danger` tint fill, `danger` text | `danger` tint fill, `danger` text |

- Height 56, pill shape, full width by default, 16 horizontal padding.
- Optional leading or trailing icon (22).
- Loading state: spinner replaces label, width stays the same.
- Disabled: 40% opacity, no press feedback.

## 9.2 IconButton

48 circle, `surfaceMuted` fill (dark) or `surface` fill with soft shadow (light). Used for menu, back, bell, close, swap.

## 9.3 Input (text field)

- Height 56, radius `md`, `surfaceRaised` fill, no border by default.
- Leading icon in a 36 circle (`surfaceMuted`).
- Placeholder `textTertiary`, value `textPrimary`.
- Focus: 1.5 px `accent` border (dark) or `ink` border (light).
- Error: `danger` border, message in `caption` below.
- Password field has a show/hide toggle.

## 9.4 Location pair card (signature component)

```text
┌──────────────────────────────────┐
│ ( ◉ )  Add a pick-up location    │
│              ( ⇅ )               │
│ ( ◉ )  Add your destination      │
└──────────────────────────────────┘
```

- Container: `surfaceRaised`, radius `xl`, padding 8, gap 4.
- Two inputs (9.3), each with a location icon circle.
- Swap button: 40 circle, centered on the seam, `surfaceMuted` fill, overlapping both inputs by half.
- Tapping an input opens the search sheet (section 10.5). On the Home screen the card is tappable as a whole and opens Book.

## 9.5 Segmented control

- Pill container (`surfaceRaised`), padding 4, height 56.
- Active segment: pill with `accent` fill and `onAccent` text (dark) or `ink` fill and `onInk` text (light).
- Inactive segment: `textSecondary` text.
- Used for: vehicle category filter, ride history filter (All, Completed, Cancelled), theme choice (System, Light, Dark).

## 9.6 Vehicle card

Horizontal scroll list, snap to card, 12 gap. Width 140, radius `lg`.

```text
┌───────────────┐
│ Car           │
│ 4 min         │
│ 👤 4          │
│ (🚗)    ₹150  │
└───────────────┘
```

- Default: `surface` fill. Name `h3`, ETA `small` `textSecondary`, price `bodyStrong`.
- Selected: `accentSoft` fill, name in `accent` (dark) or `accentText` (light), price in `textPrimary`, vehicle icon circle in `accent` fill.
- Types: **Bike, Auto, Car** (matches backend `vehicleType`).
- Light theme variant (from reference 2): the top half is a white area showing the vehicle image; the bottom half is a dark `panelGradient` panel with name, ETA and price in white. Use this variant for the vehicle picker on the Book screen in light theme only; dark theme uses the compact card above.

## 9.7 Driver card

```text
┌──────────────────────────────────┐
│ (avatar)  Ucok Behel   ★ 4.9     │
│           Honda CRV   [AB6299ZG] │
└──────────────────────────────────┘
```

- Container: `surfaceRaised` (dark) or `surface` (light), radius `lg`, padding 16.
- Avatar 48, name `h3`, vehicle model `small` `textSecondary`.
- Plate pill: white fill, near-black text, `bodyStrong`, pill shape. Same in both themes.
- Rating: single star icon in `warning` + number.
- Two round action buttons (call, chat) shown on the Driver Arriving screen.

## 9.8 Status banner (top tab of the ride sheet)

A strip attached to the top of the ride bottom sheet:
- Dark: `accent` fill, `onAccent` text. Left: status text ("The driver will arrive in"). Right: time chip (`onAccent` at 15% fill) showing "3 min".
- Light: `accentSoft` fill, `accentText` text.
- Text changes with ride status (see 3.4).

## 9.9 Slide to action

Full-width pill (height 64), `surfaceRaised`.
- Left: 48 circle thumb with icon (`accent` fill, `onAccent` icon in dark; `ink` fill, `onInk` icon in light).
- Center: label ("Chat with driver", "Slide to start ride", "Slide to complete").
- Right: three fading chevrons.
- Used for the driver's irreversible steps (start ride, complete ride). Passenger uses it for "Chat with driver" only if chat is built (not in MVP; show a plain button for "Call driver").
- Must have a tap alternative for accessibility (double tap on the thumb triggers the action).

## 9.10 Status badge

Pill, height 28, horizontal padding 12, `caption` text. Soft tint fill (color at 14% opacity), text in the status color (`accentText` in light for green). One badge per ride card.

## 9.11 Stat block

Big number (`statXL`) with a `small` `textSecondary` label under it. Used for completed trips, rating, earnings. Maximum three per row, left-aligned.

## 9.12 Progress bar

Height 10, pill shape, track `surfaceMuted`, fill `accent`. Optional label above in `small`. Used for the safety rating.

## 9.13 Route timeline (Pick up / Drop off)

Vertical line with a round dot (pickup) and a square (drop-off), as in reference 2. Each row: label `small` `textSecondary`, address `bodyStrong`, time right-aligned.

## 9.14 Ride card (history list item)

- `surface` fill, radius `lg`, padding 16.
- Top: route timeline (compact) and price right-aligned.
- Bottom: date `small` `textSecondary`, status badge, vehicle type icon.
- Whole card is tappable and opens Ride detail.

## 9.15 Bottom tab bar

- Height 64 plus safe area, `surface` fill, no top border (a 1 px `border` hairline in light theme only).
- Passenger tabs: **Home, Rides, Profile**.
- Driver tabs: **Home, Rides, Earnings, Profile**.
- Active tab: icon and label in `textPrimary` with a small `accent` dot under the icon (dark) or `ink` dot (light). Inactive: `textTertiary`.
- Hide the tab bar during an active ride flow.

## 9.16 Top bar

- Transparent over maps, `bg` on content screens.
- Left: back or menu IconButton. Right: bell IconButton and avatar (36).
- Content screens use a large `h1` title below the bar, no title in the bar itself.

## 9.17 Modal and confirmation dialog

- Centered card, radius `xl`, `surface` fill, 24 padding, `overlay` backdrop.
- Title `h2`, message `body` `textSecondary`, two buttons stacked (primary then ghost).
- Destructive confirmations (cancel ride) use the `danger` variant for the confirm button.

## 9.18 Toast

Top of the screen, pill, `surfaceRaised`, icon + one line. Auto-dismiss after 3 s. Success uses the accent icon, error uses `danger`.

## 9.19 Skeleton, Empty state, Error state

- **Skeleton:** same shape as the real content in `surfaceMuted` with shimmer. Never use a spinner for list screens.
- **Empty state:** one line icon (48, `textTertiary`), title `h3`, one sentence `small`, optional primary action. Example: "No rides yet" / "Your completed trips will show up here." / [Book a ride].
- **Error state:** warning icon, what failed in plain words, and a `Retry` button. Example: "Couldn't load your rides" / "Check your connection and try again."

## 9.20 Map styling

- Use `react-native-maps` with a custom muted map style per theme.
- **Dark map:** near-black land (`#0E1217`), slightly lighter roads (`#1B2128`), muted labels (`#6B7482`), water slightly darker than land. No colorful POI icons.
- **Light map:** very light gray land (`#F1F2F4`), white roads, muted labels (`#9AA2B1`). No colorful POI icons.
- **Route line:** `accent`, 5 px, rounded caps. In light theme add a 2 px white casing so it stays visible.
- **Pickup marker:** filled circle with white ring. **Drop-off marker:** rounded square, `ink` (light) or white (dark).
- **Driver marker:** top-down car icon that rotates with heading; soft pulse ring when the driver is moving.
- **User location:** `info` dot with a soft ring.

---

# 10. Screens

Every screen has a purpose, content, and one primary action.

## 10.1 Splash and Onboarding

- **Splash:** `bg` background, RideX wordmark centered (white on dark, ink on light), accent dot after the X.
- **Onboarding (3 slides, skippable):** large `display` headline, one line of support text, minimal line illustration or vehicle image, page dots, primary button "Continue" (last slide: "Get started"). Only shown on first launch.

## 10.2 Login

- **Purpose:** get back into the app quickly.
- **Content:** wordmark, headline "Welcome back" (`h1`), email input, password input, "Forgot password?" is not in MVP (omit), primary button "Log in", ghost link "New here? Create an account".
- **Primary action:** Log in.

## 10.3 Register

- **Content:** headline "Create your account", name, email, phone, password, role choice as a segmented control ("Ride" or "Drive") when the backend supports role at registration, primary button "Create account", link back to login.
- Show password rules as a one-line hint, not a long list.

## 10.4 Passenger Home

- **Purpose:** the fastest path to booking.
- **Layout (dark reference 1):** top bar (menu, bell, avatar) → `display` heading "Where do you want to go?" → location pair card → segmented control (Ride, Package is not in MVP, so show Ride only and hide the control) → horizontal vehicle cards below.
- **Layout (light reference 2):** wordmark top-left, menu top-right → underlined "Where to?" input → rounded map card with nearby vehicle markers → dark info panel at the card bottom ("Car, 28 drivers nearby, 4 to 8 min") → pill category row (Car, Bike, Auto) at the bottom. Use this layout in light theme; dark theme uses the dark reference layout. Both layouts expose the same actions.
- **If an active ride exists:** a "Current ride" card at the top with the status badge and a button "View ride". The booking area moves below it.
- **Primary action:** tapping the location card or "Where to?" opens Book.

## 10.5 Book ride (map + search)

- Full-screen map, top bar with back, location pair card floating at the top.
- Tapping an input opens a **search sheet** (half height): input at the top, list of recent places and saved places below, each with a location icon circle, name `bodyStrong`, address `small`.
- When both locations are set, the route draws on the map and the **vehicle sheet** slides up.

## 10.6 Choose vehicle and fare

- Bottom sheet with: title "Choose a ride" (`h2`), three vehicle cards (Bike, Auto, Car) with ETA and estimated fare from the backend, selected card in accent, route summary (distance and time), primary button "Confirm Car" (the label includes the selected vehicle).
- The fare shown is always the backend estimate, with a small label "Estimated".

## 10.7 Searching for a driver

- Map with the pickup marker pulsing, route kept visible.
- Bottom sheet: status banner "Finding your driver" (warning tone), short text "This usually takes under a minute", the route timeline, and a ghost button "Cancel ride".
- Cancel opens the confirmation dialog.

## 10.8 Driver on the way (reference 1, screens 2 and 3)

- Map shows the route and the moving driver marker.
- Bottom sheet:
  - Status banner on top: "The driver will arrive in" with a time chip.
  - Driver card (avatar, name, vehicle, plate pill, rating).
  - Row: vehicle type with ETA on the left, fare on the right.
  - Two action circles: Call, and Message (hide Message until chat exists).
  - Ghost button "Cancel ride" (visible only while status is `accepted` or `driver_arriving`).
- Expanding the sheet (drag up) shows the vehicle detail view: large top-down vehicle image on the right, name and plate on the left, small stat chips (seats, trips), and the safety rating progress bar (reference 1 screen 3 and reference 2 screen 3).

## 10.9 Driver arrived

Same layout. The status banner becomes solid: "Your driver has arrived". A light haptic fires once. The ETA chip is replaced by "Now".

## 10.10 Ride in progress

- Map with the live route and the vehicle marker.
- Bottom sheet peek: status badge "On the trip", remaining time, destination name. Expanded: route timeline, driver card, fare.
- No cancel action once started.

## 10.11 Ride completed

- Full screen (not a sheet). Large check icon in an accent circle, `h1` "You've arrived", final fare in `statXL`, route timeline, payment method row (Cash or Online, per backend), five-star rating row (tap a star, 48 touch targets), optional comment input, primary button "Done", ghost button "Skip".
- Rating screen submits through the rating endpoint only if it exists in the backend plan; it does (`POST /api/rides/:rideId/rating`).

## 10.12 Rides (history)

- Large title "Your rides".
- Segmented control: All, Completed, Cancelled.
- List of ride cards (9.14) with pull to refresh and paginated loading at the bottom.
- Empty state: "No rides yet".

## 10.13 Ride detail

- Static map preview card (rounded, top), route timeline, driver card, fare breakdown (base, distance, time, total as a simple list), payment status badge, ride status badge, date and time.
- Secondary action "Book again" (prefills pickup and destination).

## 10.14 Profile and Settings

- Avatar large, name `h2`, email `small`.
- Rows (icon circle + label + chevron): Edit profile, Appearance (segmented control System, Light, Dark inline), Notifications (placeholder toggle), Help, Log out.
- Log out opens the confirmation dialog.
- Delete account lives under Edit profile, at the bottom, in `danger` text.

## 10.15 Driver Home

- **Purpose:** go online and get rides.
- **Layout:** full-screen map, top bar (menu, earnings chip for today, avatar), bottom sheet.
- **Offline state:** sheet shows a big primary button "Go online" and today's stats (trips, earnings).
- **Online state:** the button becomes a slide-to-action "Slide to go offline"; a green dot with "You're online" shows in the top bar; sheet text "Looking for ride requests".
- **Not verified or no vehicle:** the sheet replaces the "Go online" button with a clear checklist (Add a vehicle, Wait for verification) and a button to fix the first missing step.

## 10.16 Incoming ride request

- Slides up as a sheet over the map. Content: pickup and drop-off timeline, distance to pickup, trip distance, estimated fare in `statXL`, vehicle type.
- Two buttons: primary "Accept", ghost "Decline".
- A thin countdown bar at the top of the sheet (accent, drains over the request window). When it ends the request closes.

## 10.17 Driver active ride

- Map with route to pickup, then to destination.
- Bottom sheet shows the passenger (avatar, name), route timeline, and one **slide-to-action** whose label follows the ride state:
  - accepted → "Slide when you're on the way" (`driver_arriving`)
  - driver_arriving → "Slide when you've arrived" (`driver_arrived`)
  - driver_arrived → "Slide to start ride" (`started`)
  - started → "Slide to complete ride" (`completed`)
- Only the next valid action is ever shown.
- On completion: summary sheet with fare, then "Back to home".

## 10.18 Earnings

- Large title "Earnings".
- Segmented control: Today, Week, Month.
- `statXL` total, small label, then two stat blocks (trips, online hours if available).
- Simple bar chart (accent bars on `surfaceMuted` track, no gridlines), then a list of recent completed rides.

## 10.19 Driver vehicle

- Vehicle card with type icon, brand, model, color, registration plate pill.
- "Add vehicle" and "Edit" forms use the standard input and button components.

## 10.20 Admin (optional)

- Admin is secondary on mobile. Use simple list screens (Users, Drivers, Rides, Payments) with the same ride card, segmented filters and status badges. A "Verify driver" primary button appears on the driver detail screen. No charts beyond stat blocks on the dashboard.

---

# 11. Navigation

```text
Auth stack
  Onboarding → Login ⇄ Register

Passenger (tabs: Home, Rides, Profile)
  Home → Book → Choose vehicle → Searching → Driver on the way → In progress → Completed
  Rides → Ride detail
  Profile → Edit profile

Driver (tabs: Home, Rides, Earnings, Profile)
  Home → Request → Active ride → Completed summary
  Rides → Ride detail
  Earnings
  Profile → Vehicle

Admin (optional, simple stack)
  Dashboard → Users / Drivers / Rides / Payments
```

- The ride flow is a stack on top of the tabs; the tab bar is hidden during it.
- If the app opens while a ride is active, go straight to the active ride screen.
- Back gestures work everywhere except during an active ride (back minimizes to Home, it never cancels).

---

# 12. Required States

Every data-driven screen defines all four:

| State | Look |
|---|---|
| Loading | Skeleton in the shape of the content |
| Success | Normal content |
| Empty | Icon, one line, one action |
| Error | What failed, why if known, `Retry` button |

Extra states:
- **Offline:** a slim banner under the top bar: "You're offline. Reconnecting…" (`warning` tint).
- **Permission denied (location):** inline card with explanation and "Open settings"; manual address entry remains available.
- **Session expired:** return to login with a toast: "Please log in again."
- **Invalid action (409/422 from backend):** toast with the backend message, and refresh the ride.

---

# 13. Copy and Tone

- Plain, short, active voice. Buttons say exactly what happens: "Confirm Car", "Cancel ride", "Go online".
- The same action keeps the same name everywhere ("Cancel ride" in the button, the dialog and the toast).
- Errors say what happened and how to fix it. No apologies, no jokes.
- Numbers use the user's locale; currency is ₹; time shows as "3 min".

---

# 14. Responsive and Device Behavior

- Design for 360 to 430 dp wide phones first.
- Small phones (width under 360): reduce `display` to 30/36, vehicle card width to 128, keep padding 16.
- Large phones and tablets: keep a centered content column with max width 520 for non-map screens; map screens stay full bleed.
- Landscape is not required; lock to portrait.

---

# 15. Accessibility

- Text contrast at least 4.5:1 (3:1 for large text and icons). Green text on white must use `accentText`.
- Every touch target is at least 44 x 44 (48 preferred).
- Every icon button and image has an `accessibilityLabel`; custom controls set `accessibilityRole` and `accessibilityState`.
- The slide-to-action has an accessible alternative (double tap).
- Status is never color-only.
- Screen readers announce ride status changes.
- Support system font scaling and Reduce Motion.

---

# 16. Theme Behavior

- Default: follow the system theme. User can override in Profile → Appearance (System, Light, Dark) and the choice persists.
- Theme change is instant and app-wide; the map style switches with it.
- Status bar style, navigation bar, keyboard appearance and splash background follow the theme.
- Images with transparent backgrounds (vehicles) must look right on both `surface` colors; use soft shadows under the vehicle in light theme only.

---

# 17. Token File Shape (reference only)

The implementation lives in `src/theme/`. Keep the structure like this:

```ts
// src/theme/tokens.ts
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 };
export const radius = { sm: 12, md: 16, lg: 24, xl: 32, pill: 999 };

export const darkColors = {
  bg: '#0A0D12', surface: '#11151B', surfaceRaised: '#181D25', surfaceMuted: '#1F252E',
  border: '#262D38', textPrimary: '#FFFFFF', textSecondary: '#A3ACB9', textTertiary: '#6B7482',
  accent: '#22E55B', accentPressed: '#19C24B', accentSoft: '#0F2A1A', onAccent: '#04110A',
  danger: '#FF5A5F', warning: '#FFB020', info: '#4DA3FF', overlay: 'rgba(0,0,0,0.6)',
};

export const lightColors = {
  bg: '#FFFFFF', surface: '#F4F5F7', surfaceRaised: '#FFFFFF', surfaceMuted: '#ECEEF2',
  border: '#E6E8EC', textPrimary: '#0B1020', textSecondary: '#5B6475', textTertiary: '#9AA2B1',
  ink: '#0B1020', onInk: '#FFFFFF', accent: '#22E55B', accentText: '#0A8A35',
  accentSoft: '#E6FBEC', onAccent: '#04110A', danger: '#E5383B', warning: '#C97A00',
  info: '#1F5FFF', overlay: 'rgba(11,16,32,0.45)',
};
```

Components read colors through a `useTheme()` hook. Components never import hex values directly.

---

# 18. Do Not

```text
No extra accent colors beyond the tokens
No gradients except the dark info panel in light theme
No heavy shadows, glows or glassmorphism
No ALL CAPS labels
No more than one primary button per screen
No custom button, card or input styles outside section 9
No colorful map pins or POI icons
No auto-playing decorative animation
No tiny text under 12 px
No chat, package delivery, coupons, or surge UI in the MVP
No screens or flows that need endpoints missing from BACKEND_PLAN.md
```

---

# 19. Definition of Done for Any Screen

- [ ] Matches this file in dark theme
- [ ] Matches this file in light theme
- [ ] Uses only theme tokens and shared components
- [ ] Loading, Empty, Error and Success states exist
- [ ] Touch targets 44 or larger, labels set
- [ ] Works on a small (360 wide) and a large (430 wide) phone
- [ ] Keyboard never covers inputs or the primary button
- [ ] Reduce Motion respected
