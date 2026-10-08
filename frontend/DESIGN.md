# RideX — Design System

> The visual and interaction source of truth for RideX.
> Read this before building or changing any UI. It describes what the product looks like and how it behaves. It does not contain implementation code beyond design tokens.

Related docs: `../PLAN.md` (what we build), `PAGE_PLAN.md` (what each page contains), `FRONTEND_PLAN.md` (how we build it).

---

## 1. Visual identity

**RideX looks like a quiet, well-made tool.** Light surfaces, black actions, generous space, one strong object per screen. It should feel closer to a product studio's portfolio piece than to a typical college dashboard.

The three references we follow:

| Reference | What we take from it |
| --- | --- |
| **Urban** (ride landing) | Huge centered headline, pill CTA with soft shadow, a pale 3D-style map as the hero, a floating ride card on top of the map, black route line |
| **Brickwise** (property landing) | Floating search bar, map as full-width backdrop, one floating detail card, big-number stats row, soft rounded feature cards, black pill buttons with a small arrow |
| **Profile card** (Henrie) | Image fading into a white card, circular avatar overlapping the edge, small gray labels under bold values, thin vertical dividers, one black pill action |

### Personality in four words

**Calm. Precise. Spacious. Confident.**

### The core idea

> Black is for actions. Everything else is paper, gray, and map.

- **Black** pill buttons are the only heavy element on any screen.
- **Paper white and soft gray** surfaces carry content.
- **The map** is the visual centerpiece. It is pale and desaturated so UI floats on top of it.
- **One small accent** shows live state (online, on the way, available). It is never decorative.

---

## 2. Design principles

1. **One focal point per screen.** A hero headline, a map, or a ride card, never all competing.
2. **Space before borders.** Separate things with whitespace and soft surface shifts first. Use a hairline only when spacing isn't enough.
3. **Floating over flat.** Key cards float above the map or page with a soft shadow. Everything else sits flat.
4. **Big type, small labels.** Large numbers and headings, tiny quiet gray captions. No shouting labels.
5. **Black means act.** If it's solid black, it's the primary action. Never use black fills for decoration.
6. **Show the ride, not the form.** Where possible, show a map, a car, a route, a status line instead of a wall of inputs.
7. **Every state is designed.** Loading, empty, error, and success are first-class screens.
8. **Mobile booking first.** The passenger booking flow must feel native on a phone.

---

## 3. Color

Modern monochrome with a map-derived tint set and one live-state accent. No gradients as decoration. No purple. No glow.

### 3.1 Core palette

| Token | Hex | Use |
| --- | --- | --- |
| `paper` | `#F6F6F5` | App background (the soft off-white behind cards, as in the profile reference) |
| `surface` | `#FFFFFF` | Cards, panels, inputs, navbar |
| `surface-soft` | `#F2F2F1` | Feature cards on white, input fills, inactive pills, map base |
| `line` | `#E7E7E5` | Hairline borders and dividers |
| `ink` | `#000000` | Primary buttons, headings, route line |
| `ink-soft` | `#1C1C1C` | Body text on white |
| `muted` | `#8A8A87` | Captions, secondary labels, placeholders |
| `muted-strong` | `#5E5E5B` | Subtitles, helper text |

### 3.2 Map tints (used only in map and map-like visuals)

| Token | Hex | Use |
| --- | --- | --- |
| `map-road` | `#FFFFFF` | Roads |
| `map-block` | `#ECECEA` | City blocks |
| `map-park` | `#DCF1C9` | Parks, green areas |
| `map-water` | `#CDE3F5` | Water |
| `map-route` | `#000000` | Active route line (with dashed white center) |

### 3.3 Accent and status

| Token | Hex | Use |
| --- | --- | --- |
| `live` | `#1FB26B` | Online dot, driver available, "on the way" pulse |
| `live-tint` | `#E4F6EC` | Background of live badges |
| `pin` | `#FF5A36` | Destination pin and small attention badges (the small orange touch seen in Brickwise) |
| `pin-tint` | `#FFEDE8` | Background of attention badges |

### 3.4 Ride status colors

Badges are soft tinted pills with dark text. Never solid saturated fills.

| Status | Text | Background |
| --- | --- | --- |
| `requested` | `#8A5A00` | `#FFF3D6` |
| `accepted` | `#1F4FA3` | `#E3ECFA` |
| `driver_arriving` | `#1F4FA3` | `#E3ECFA` |
| `driver_arrived` | `#0E6B43` | `#E4F6EC` |
| `started` | `#0E6B43` | `#E4F6EC` |
| `completed` | `#3F3F3D` | `#EDEDEB` |
| `cancelled` | `#A8321B` | `#FFEDE8` |

### 3.5 Color rules

- Maximum **one** solid black element per visual group.
- Text on `paper` or `surface` is `ink` or `ink-soft`. Captions are `muted`.
- `live` and `pin` together never take more than about 5% of a screen.
- Do not add a dark theme in the MVP. Light only, done well.
- Contrast: body text must meet WCAG AA (4.5:1). `muted` is for captions at 13px and above only.

---

## 4. Typography

**One family: Geist** (Google Fonts), with a system fallback. A single grotesk keeps the interface clean and lets size and weight do the work. Use tabular figures for fares, times, and tables.

Fallback stack: `"Geist", "Inter", system-ui, -apple-system, "Segoe UI", sans-serif`

### Type scale

| Role | Size (desktop / mobile) | Weight | Line height | Tracking |
| --- | --- | --- | --- | --- |
| Hero | 72px / 40px | 500 | 1.02 | -0.035em |
| Display | 48px / 32px | 500 | 1.08 | -0.03em |
| Heading 1 | 32px / 26px | 500 | 1.15 | -0.025em |
| Heading 2 | 24px / 20px | 500 | 1.2 | -0.02em |
| Heading 3 | 18px / 17px | 500 | 1.3 | -0.01em |
| Body large | 18px / 16px | 400 | 1.55 | 0 |
| Body | 15px / 15px | 400 | 1.55 | 0 |
| Caption | 13px / 13px | 400 | 1.4 | 0 |
| Stat number | 44px / 32px | 500 | 1 | -0.03em |
| Button | 15px / 15px | 500 | 1 | -0.005em |

### Typography rules

- **Weights are 400 and 500 only**, with 600 reserved for tiny numerals. Heavy bold looks dated here.
- Headlines are **sentence case**, centered on the landing hero and left-aligned everywhere else.
- Hero text wraps to two balanced lines. Use `text-wrap: balance`.
- Body line length stays under 70 characters.
- Stats pair a **large number** with a **small gray caption** directly beside or under it (as in Brickwise: `$1B+` with `TOTAL INVESTED` beside it, but ours are sentence case).
- Do not highlight a single word in a headline with color or italic.
- Do not use all-caps labels.
- Do not put a small label above every heading. Use one only when it carries real information, such as a status or section category.

---

## 5. Layout, spacing, shape, depth

### 5.1 Spacing

Base unit **4px**. Allowed steps: 4, 8, 12, 16, 20, 24, 32, 40, 56, 72, 96, 128.

- Page horizontal padding: 20px mobile, 32px tablet, 48px desktop.
- Content max width: **1200px** (landing), **1280px** (dashboards).
- Landing sections are separated by **96–128px** vertical space.
- Card inner padding: 20px mobile, 24px desktop.

### 5.2 Radius

Radius follows the size of the element. Larger objects get larger radius.

| Element | Radius |
| --- | --- |
| Buttons, search bars, badges, chips | **Full pill** (`9999px`) |
| Inputs | 14px |
| Small cards, list rows | 18px |
| Standard cards | 24px |
| Hero card, ride card, map container | 32px |
| Page-level frame (landing shell, as in Brickwise) | 32px |

### 5.3 Depth

Three levels only. Shadows are soft, wide, and low opacity.

| Level | Use | Shadow |
| --- | --- | --- |
| `flat` | Cards on paper | No shadow, border `line` or fill `surface` |
| `float` | Floating ride card, search bar, navbar on scroll | `0 12px 40px -12px rgba(0,0,0,0.14), 0 2px 6px rgba(0,0,0,0.04)` |
| `button` | Black pill buttons | `0 10px 24px -8px rgba(0,0,0,0.35)` |

Do not stack shadows on nested cards. A card inside a floating card is flat.

### 5.4 Grid

- Landing: 12 columns, 24px gutter.
- Dashboards: sidebar 248px + fluid content.
- Booking page: map is fluid, booking panel is **400px** fixed on desktop.

---

## 6. Iconography, imagery, and the map

### Icons

- **Lucide React** only (already in the stack).
- 1.75px stroke, 20px default, 16px in tight rows, 24px in nav.
- Icons are `ink-soft` or `muted`. Never colored, except inside a status badge.
- Icon containers (like the shield in Brickwise) are 44px rounded squares with a black fill and white icon, used at most once per card.

### Imagery

- Landscape or city photos fade into white at the bottom (the profile card technique): a `surface` gradient overlay covers the lower 30% of the image.
- No stock illustrations of people. No emoji in the UI.
- Driver and passenger avatars are circles. If there's no photo, use a `surface-soft` circle with initials in `ink`.

### The map is the hero

The map is what makes RideX recognizable. It must look intentional even before real maps are connected.

**Phase 1 (MVP): `MapPlaceholder`**
- A stylized, pale, slightly tilted city map built from SVG or CSS, matching the Urban reference: white roads on `map-block`, `map-park` patches with small rounded trees, a `map-water` edge.
- A black route line with a dashed white center runs between a **pickup dot** (black ring) and a **destination pin** (`pin`).
- Small gray car shapes sit on the roads. One car is the highlighted driver car.
- On the landing hero the map is tilted in perspective (about 55° rotateX) and fades into `paper` at the top edge.
- On app pages the map is flat, top-down, and full bleed.

**Phase 2: real map SDK**
- Use a light, low-saturation style that matches the tokens above. Hide POI clutter. Roads white, land `map-block`, parks `map-park`, water `map-water`.
- Markers and route follow the same visual rules as the placeholder.

**Map markers**

| Marker | Look |
| --- | --- |
| Pickup | 14px white dot, 4px black ring |
| Destination | Black teardrop pin with white dot, or `pin` for active highlight |
| Driver | Small top-down car icon, black body, white roof outline, soft shadow |
| Cluster / count | 36px black circle, white number (as the `20` in Brickwise) |

---

## 7. Components

Each component is designed once and reused. Names match the plan files.

### 7.1 Button

| Variant | Look | Use |
| --- | --- | --- |
| **Primary** | Black fill, white text, pill, `button` shadow, optional small chevron or arrow icon after label | One per view: Book a Ride, Confirm Ride, Create Account |
| **Secondary** | `surface` fill, `line` border, black text, pill | Become a Driver, Login |
| **Quiet** | No fill, black text, hover `surface-soft` | Cancel, Back, inline actions |
| **Danger** | `surface` fill, `#A8321B` text, `line` border | Cancel ride, Suspend |
| **Icon** | 44px circle, `surface` or translucent white over images (the bookmark button in the profile reference) | Save, close, menu |

- Height: 48px default, 56px for hero CTAs, 40px compact (tables).
- Horizontal padding: 24px (default), 32px (hero).
- Hover: slight lift (translateY -1px) and shadow deepens. Active: returns and scales to 0.98.
- Disabled: 40% opacity, no shadow, `cursor: not-allowed`.
- Loading: label stays, a 16px spinner replaces the arrow, button width does not change.
- Focus: 2px `ink` ring with 2px `paper` offset.

### 7.2 Input and LocationInput

- 52px tall, `surface-soft` fill, 14px radius, no border at rest, `ink` 1.5px border on focus. Placeholder in `muted`.
- Label is above the field in `muted` 13px, sentence case.
- **LocationInput**: leading marker icon (black dot for pickup, `pin` pin for destination), a thin vertical connector line between the two fields, trailing clear button. Suggestions open in a floating white list (`float` shadow, 18px radius).
- **Search bar (landing, Brickwise style)**: a single floating pill with segmented fields separated by thin vertical dividers, label on top in `muted`, value in `ink`, and a **black circular search button** at the right end.
- Error: border `#A8321B`, message below in the same color, 13px, with a specific fix ("Enter a 10-digit phone number").

### 7.3 Select, RadioCard, Toggle

- Select matches Input styling, with a chevron.
- **RadioCard** (Passenger/Driver on register, vehicle type): white card, `line` border, selected state is a **black 1.5px border** and a small black check in the corner. No colored fills.
- **Toggle**: 52×30 pill. Off is `line`, on is `ink`. The **online/offline** driver switch is the exception: on uses `live`.

### 7.4 Card

- `surface` fill, 24px radius, 24px padding, no shadow by default.
- **Soft feature card**: `surface-soft` fill, 24px radius, title in `ink` 500, description in `muted-strong`. Used in the "why RideX" grid (the Brickwise right-hand cards).
- **Floating card**: 32px radius, `float` shadow, used for the live ride card over the map and the property-style highlight card.

### 7.5 RideCard (floating ride card)

The signature component. Modeled on the Urban "Your Ride" card.

```text
┌──────────────────────────────┐
│ Your ride                    │
│ Arriving in                  │
│ 4 min                        │
│                              │
│        [ car image ]         │
│                              │
│ Matched ── On the way ── Arriving │
│ ●─────────◉────────────○     │
└──────────────────────────────┘
```

- Small gray caption, large time value, a clean car render in the center, a 3-step progress track beneath.
- Progress track: 2px `line` track, filled portion `ink`, current step is a ring node.
- Used on: landing hero (static demo), passenger dashboard (active ride), ride tracking.

### 7.6 Profile-style summary card (DriverCard, PassengerCard)

Modeled on the Henrie card.

```text
┌──────────────────────────────────────────┐
│  [ photo fading to white ]        (save) │
│ (avatar)                                 │
│ Rahul Das                     (Hyundai i20 chip) │
│ Verified driver                          │
│                                          │
│  ★ 4.8   │  1,240   │  WB 12 AB 3456  [ Call driver ] │
│  rating  │  trips   │  plate                          │
└──────────────────────────────────────────┘
```

- Header image or map crop fading to white. 80px circular avatar overlapping the fade edge, with a 4px `paper` ring.
- Name in Heading 3, role in `muted`.
- Stat trio: value in `ink` 500 at 20px, label in `muted` 13px, separated by 1px vertical `line` dividers.
- One black pill action at the right.

### 7.7 StatCard and StatRow

- **Landing StatRow (Brickwise):** four stats in one row, number at 44px, small caption beside it, thin top and bottom `line` borders, no cards.
- **Dashboard StatCard:** `surface` card, caption on top in `muted`, big number below, optional small delta chip (`live-tint` for up, `pin-tint` for down).

### 7.8 Badge and StatusBadge

- Pill, 28px tall, 12px horizontal padding, 13px text, weight 500, tinted fill with dark text (see section 3.4).
- A 6px dot before the label is allowed for `live` states only (online, on the way). The dot pulses slowly.

### 7.9 Table

For admin pages.

- No outer border. Header row is `muted` 13px on `paper`, no fill. Rows are `surface` with 1px `line` separators, 56px tall.
- Wrapped in one 24px-radius card. Row hover is `surface-soft`.
- Number columns are right-aligned with tabular figures.
- Row actions are Quiet buttons (compact). Destructive actions require a confirm modal.
- On mobile the table scrolls horizontally inside its card. The first column stays sticky.
- Pagination: pill buttons, current page is black.

### 7.10 Modal and Drawer

- Centered modal: 32px radius, max width 440px, `float` shadow, backdrop `rgba(0,0,0,0.35)` with a light blur.
- Mobile: modals become **bottom sheets** with a 36×4 grab handle.
- Admin sidebar on mobile becomes a left drawer.
- Escape closes. Focus is trapped. Focus returns to the trigger.

### 7.11 Toast

- Floating black pill at the top center (desktop) or bottom (mobile), white text, 14px, optional leading icon.
- Auto-dismiss after 4s. Errors stay until closed.
- Copy uses the same verb as the action: button "Request ride" → toast "Ride requested".

### 7.12 Tabs / FilterTabs

- Segmented pill group on `surface-soft`. Selected tab is a white pill with `float`-lite shadow and black text. Unselected is `muted`.
- Used for Ride history (All, Completed, Cancelled) and admin filters.

### 7.13 RideTimeline

- Vertical list. Completed steps are a filled black dot, the current step is a black ring with a small `live` pulse, future steps are an empty `line` ring.
- The connector line is 2px: black for completed, `line` for future.
- Each step has a title in `ink` and a time in `muted`.

### 7.14 VehicleSelector

- Horizontal row of three RadioCards: **Car**, **Auto**, **Bike**.
- Each card shows a small clean vehicle render (grayscale, same style as the map cars), the name, ETA in `muted`, and fare in `ink`.
- Selected card has the black border. The fare updates with a quick number transition (150ms).

### 7.15 FareCard

- Row layout: label left (`muted`), value right (`ink`, tabular).
- Total row separated by a `line` divider, with the total at 24px weight 500.
- Currency is ₹ with Indian grouping (`₹5,40,000`).

---

## 8. Navigation

### 8.1 Public navbar

```text
┌──────────────────────────────────────────────────────────┐
│ RideX         Home   About   Contact        Login  [Register] │
└──────────────────────────────────────────────────────────┘
```

- 72px tall, transparent over the hero. On scroll it becomes a floating white pill-shaped bar with `float` shadow, 16px from the top, 1000px max width.
- Logo wordmark "RideX" in 500 weight at 22px, tight tracking, plain black. No symbol is required in MVP.
- Center links: 15px, `muted-strong`, active is `ink` with a small black dot beneath. Hover is `ink`.
- Right: Login (Quiet button) and Register (Primary compact pill, small arrow).
- Mobile: logo left, menu icon button right. Opens a full-height sheet with large links (28px) and the two actions pinned at the bottom.

### 8.2 Passenger navigation

- **Desktop:** top navbar, no sidebar. Links: Home, Book, Rides, Profile. Right side shows the avatar circle with a dropdown (Settings, Logout).
- **Mobile:** fixed **bottom tab bar**, a floating white pill 16px from the bottom with `float` shadow. Four icons with labels: Home, Book, Rides, Profile. Active icon sits inside a black circle with a white icon.

### 8.3 Driver navigation

- **Desktop:** sidebar (248px) with Dashboard, Requests, Earnings, Vehicle, Profile. The online/offline toggle sits at the top of the sidebar.
- **Mobile:** same floating bottom tab bar as passenger. The online toggle sits in the top bar.

### 8.4 Admin navigation

- **Desktop:** sidebar (248px, `surface`, right `line` border) with Dashboard, Users, Drivers, Rides, Payments. Active item is a black pill with white text. Top bar holds breadcrumb, search, and avatar.
- **Mobile:** sidebar becomes a left drawer opened from a menu icon.

### 8.5 Breadcrumbs

Used only on admin detail pages: `Users / Rahul Das`. 13px `muted`, current page in `ink`.

---

## 9. Pages

Every page below follows `PAGE_PLAN.md` for content and routes. This section defines how each one looks.

### 9.1 Landing page (`/`)

**Hero (follows Urban)**

```text
┌─────────────────────────────────────────────────────────────┐
│ RideX                Home  About  Contact        Login Register │
│                                                             │
│                    Your ride.                               │
│                    Your destination.                        │
│                    Your way.                                │
│                                                             │
│       Book a reliable ride in a few simple steps.           │
│                                                             │
│            [ Book a Ride ]   [ Become a Driver ]            │
│                                                             │
│        ╱────── tilted pale city map with route ──────╲      │
│       ╱     ┌────────────┐                            ╲     │
│      ╱      │ Your ride  │   black route line          ╲    │
│     ╱       │ 4 min [car]│                              ╲   │
└─────────────────────────────────────────────────────────────┘
```

- Headline: Hero size, centered, three short lines or two balanced lines. Sub-copy in `muted-strong`, 18px, 480px max width.
- Two CTAs side by side: Primary "Book a Ride", Secondary "Become a Driver".
- Beneath: the tilted map (perspective) fading into `paper` at its top, a floating **RideCard** overlapping the map's upper area, and a black route line with a destination pin running off the lower right.
- Motion: the headline mask-reveals, the map rises into its tilt, the route draws, and the ride card floats in, as a single timeline. Full choreography in section 11.4.

**Stats row (follows Brickwise)**

Four stats in one row between thin `line` borders. Content must be truthful placeholders for a college project, for example: `3` roles, `6` ride statuses, `24/7` booking, `₹` fare estimates. Do not invent fake big numbers like "1M+ rides."

**How RideX works**

Three steps in a horizontal row, since the content is a true sequence: Set pickup and destination, Choose your vehicle, Ride and pay. Numbering is allowed here because it's an ordered process. Each step is a soft feature card with a small illustration crop from the map style.

**Vehicle types**

Three VehicleCards (Car, Auto, Bike) on `surface`, each showing a grayscale vehicle render, name, short description, and "from ₹" starting fare.

**Why RideX**

Brickwise-style split: left column has a large Heading 1 and short paragraph with a black pill CTA, right column has a 2×2 grid of soft feature cards. One card is wide and holds a small map visual. Keep to four cards.

**Call to action**

A single large rounded block (32px radius) in `ink` with white text and a white pill button. This is the **only** dark block on the page.

**Footer**

`paper` background, thin top `line`. Logo, three link groups, copyright in `muted`. Generous padding.

### 9.2 Login (`/login`) and Register (`/register`)

- **Desktop:** split layout. Left half is the form on `surface`, right half is the pale map visual with a floating RideCard. The right half is hidden below 960px.
- **Mobile:** form only, on `paper`, with the logo at the top.
- Form width 400px. Heading 1 "Welcome back" (login) or "Create your account" (register), a one-line sub in `muted-strong`.
- Fields stacked with 16px gaps. Primary button full width below. "Don't have an account? Create account" centered under it in `muted`, with the link in `ink` underlined.
- Register has a RadioCard pair at the top: **Passenger** and **Driver**, each with a one-line description.
- Show/hide password uses an eye icon button inside the field.
- Validation runs on blur and on submit. The submit button shows the loading state while the request runs.
- Error from the server shows as a small `pin-tint` banner above the button: "Invalid email or password. Check your details and try again."

### 9.3 Passenger dashboard (`/passenger`)

```text
┌──────────────────────────────────────────────┐
│ Good morning, Akash                          │
│ Where are you going?                         │
│ [ pickup → destination search pill ] (Book)  │
├───────────────────────────┬──────────────────┤
│ Current ride (RideCard)   │ Quick actions    │
│ or "No active ride"       │ Saved places     │
├───────────────────────────┴──────────────────┤
│ Recent rides                                 │
└──────────────────────────────────────────────┘
```

- Greeting in Display size, left aligned. The "Where are you going?" line is `muted-strong`.
- The booking entry is a **floating search pill** (Brickwise style) with a black Book button. Tapping it goes to `/passenger/book`.
- Current ride uses the floating RideCard. With no active ride, show an EmptyState card with a faint map crop behind it.
- Recent rides are compact RideCards (3 max) with a "View all" Quiet button.
- Quick actions are small soft cards with an icon, label, and one line: Book a ride, Ride history, Profile.

### 9.4 Book ride (`/passenger/book`)

**Desktop:** the map fills the page. The booking panel is a **floating white card** (32px radius, `float` shadow) pinned 24px from the left, 400px wide, with its content in this order: Heading "Book your ride", pickup and destination LocationInputs, VehicleSelector, FareCard, and the Confirm Ride primary button.

**Mobile:** map takes the top 45–50% of the screen. The booking panel is a **bottom sheet** with rounded top corners (32px) and a grab handle. It has two snap points: collapsed (locations only) and expanded (vehicle + fare + confirm).

Behavior:
- Before locations: the fare area shows "Enter pickup and destination" in `muted`, and Confirm is disabled.
- After both locations are set: the route draws on the map, the camera fits both points, and the fare area fills in with a quick fade.
- Calculating: skeleton lines in the fare area, text "Calculating fare...".
- Confirm Ride shows the total, e.g. "Confirm ride · ₹150".
- No drivers: a `pin-tint` inline notice "No drivers are currently available. Try again in a few minutes."
- Success: toast "Ride requested", then navigate to tracking.

### 9.5 Ride tracking (`/passenger/rides/:rideId`)

- Map on top (desktop: fills the page and the status card floats left like the booking panel; mobile: top 45%).
- Status card has three parts: a large status line ("Driver is on the way" with a time), the **RideTimeline**, and the driver **summary card** (name, rating, vehicle, plate, Call button).
- While `requested`: show a searching state. A soft pulsing ring expands from the pickup dot on the map (1.6s loop, slow, low opacity). Copy: "Looking for a driver nearby".
- A **Cancel ride** Danger button appears only in `requested` and `accepted`, with a confirm modal.
- On `completed`: the card switches to a receipt layout (route, fare breakdown, payment method) with a Rate your driver 5-star row and a Primary "Done" button.
- On `cancelled`: a neutral card, "Ride cancelled", with a Primary "Book another ride".

### 9.6 Ride history (`/passenger/rides`)

- Heading 1 "Your rides", FilterTabs (All, Completed, Cancelled).
- List of RideCards on `surface`: route as "GMIT College → Baruipur Station" (Heading 3), date in `muted`, StatusBadge, and fare right-aligned in `ink`.
- Whole card is clickable. A small chevron appears at the right on hover.
- Pagination at the bottom.

### 9.7 Passenger profile (`/passenger/profile`)

- Uses the profile-style summary card at the top: image header fading to white, avatar overlapping, name, email, phone, and an Edit profile pill.
- Below: a three-stat row (Member since, Total rides, Rating) with thin dividers, then a soft card of account information.
- Edit opens a modal or inline form with the same Input style.

### 9.8 Driver dashboard (`/driver`)

```text
┌────────────────────────────────────────────┐
│ Good afternoon, Rahul        [ ● Online ]  │
├──────────────────┬─────────────────────────┤
│ Today's earnings │ Today's rides           │
│ ₹850             │ 7                       │
├──────────────────┴─────────────────────────┤
│ Ride requests                              │
│ ┌────────────────────────────────────────┐ │
│ │ Akash          GMIT → Baruipur   ₹150  │ │
│ │ 3.2 km                [Reject][Accept] │ │
│ └────────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

- The Online toggle is the first thing on the page: a large pill toggle with `live` when on, and the label "Online" / "Offline".
- Offline state: stat cards dim slightly and the requests area shows "Go online to receive ride requests".
- Request cards are flat white cards with a mini route graphic (two dots joined by a line), passenger name, distance, fare, and two buttons (Reject as Secondary, Accept as Primary). A thin countdown bar along the card's bottom edge shows time left to respond.
- New request arrival: card slides in from the top with a single 200ms motion and the page title updates. No sound in MVP.

### 9.9 Driver ride requests (`/driver/rides`)

Same request cards as the dashboard in a single column, with distance and estimated fare. Empty state: "No requests right now. Stay online and they'll appear here."

### 9.10 Driver active ride (`/driver/rides/:rideId`)

- Map on top, a floating action card on the bottom (a bottom sheet on mobile).
- The card shows **one thing at a time**, changing with state:
  - Accepted: pickup address, **I'm arriving**
  - Arriving: "Navigate to passenger", **I've arrived**
  - Arrived: "Passenger is here", **Start ride**
  - Started: destination address, **Complete ride**
  - Completed: fare in Display size, **Back to dashboard**
- The primary action is a full-width 56px black pill. Only one action is ever visible, so there is no way to press the wrong one.
- A thin 4-step progress line sits at the top of the card.

### 9.11 Driver earnings (`/driver/earnings`)

- Three big StatCards (Today, This week, This month), then a **Completed rides** count.
- A simple bar chart (Recharts is not in the stack, so build a light SVG or CSS bar chart): black bars for the current period and `line` bars for past, rounded tops, no gridlines except one baseline, tooltips in a small black pill.
- Recent earnings table: Date, Ride, Fare, Earnings.

### 9.12 Driver vehicle (`/driver/vehicle`)

- A soft card with a large grayscale vehicle render, then a form: Vehicle type (RadioCards), Brand, Model, Color, Registration number, and a Primary Save vehicle button.
- Registration number is uppercase monospace-free (same Geist, with extra letter spacing of 0.04em).

### 9.13 Admin dashboard (`/admin`)

- Stat row of four StatCards: Users, Drivers, Rides, Revenue. Each is a plain number with a small caption and a delta chip.
- Below: a two-column layout with a wide **Ride activity** chart (the same light bar/line style as earnings) and a narrower **Recent rides** list.
- Keep it airy. Do not fill every pixel with widgets.

### 9.14 Admin tables (`/admin/users`, `/drivers`, `/rides`, `/payments`)

- Heading 1, a search pill and filter selects in a toolbar row, then a single Table card.
- **Drivers:** Verification is a StatusBadge (Verified / Pending). Pending rows get a Primary compact **Verify** button.
- **Rides:** columns shown in `PAGE_PLAN.md`. Ride ID is `muted`, route is `ink`, and status is a badge.
- **Payments:** amount right-aligned, method in `muted`, status badge.
- Detail pages (User, Driver, Ride) use the profile-style summary card at the top and soft cards below.

---

## 10. Important states

Every page and every data component defines all four.

### Loading

- Use **skeletons** that match the final layout (same radius, same height). Skeleton color `surface-soft` with a very slow, subtle shimmer (2s).
- Buttons use the inline spinner. Never block the whole page with a full-screen spinner except on first app load.

### Empty

An EmptyState is a centered block inside the card: a small icon in a 56px `surface-soft` circle, a Heading 3 title, one line of explanation in `muted-strong`, and, when there's a next step, a Primary or Secondary pill.

```text
No rides yet

Book your first ride to see it here.

[ Book a Ride ]
```

### Error

Plain language, no apology, say what happened and what to do.

```text
Couldn't load your rides

Check your connection and try again.

[ Try again ]
```

- Inline form errors sit under the field. Page-level errors replace the content area with the ErrorState card. Network errors on actions use a toast.

### Success

- Short confirmation toast, or an in-place change (button label to "Saved", a checkmark draw).
- Ride completed gets a full receipt screen (see 9.5).

### Disabled

- Buttons are disabled while submitting, when required data is missing, or when the action isn't allowed. Disabled buttons never hide. Where it isn't obvious why, show a short helper line under the button.

---

## 11. Motion and animation

Motion is what separates a good template from a product that feels alive. In RideX it does three jobs: **introduce** (the landing page tells a short story), **explain** (state changes show what happened), and **confirm** (every action gets a response). Nothing moves just to move.

### 11.1 Animation stack

| Library | Role | Where |
| --- | --- | --- |
| **GSAP** (`gsap` + `@gsap/react`) with ScrollTrigger, SplitText, DrawSVG, MotionPath | Choreographed timelines, scroll-driven storytelling, SVG route drawing, car moving along a path | Landing page, map visuals, ride tracking, number counters |
| **Motion** (`motion`, formerly Framer Motion) | Component-level enter/exit, layout animation, springs, gestures | Modals, bottom sheets, toasts, dropdowns, page transitions, list changes, tab pill, request cards |
| **Lenis** (`lenis`) | Smooth, inertial scrolling | Landing page only |
| **CSS transitions** | Hover, focus, press | Buttons, links, inputs, cards |

Why this split:
- GSAP is the industry standard for timelines and scroll choreography. Since version 3.13 the whole library and its former paid plugins (ScrollTrigger, SplitText, DrawSVG, MotionPath) are free for everyone. Check the current license on gsap.com before you ship.
- Motion is the better fit for React component state: `AnimatePresence` handles exit animations that GSAP handles awkwardly, and its springs feel natural for sheets and toasts.
- Use each for what it does best. Never animate the same element with both.
- Do not add more animation libraries (no AOS, no Animate.css, no Lottie, no three.js in the MVP).

Install: `gsap`, `@gsap/react`, `motion`, `lenis`.

### 11.2 Motion tokens

All durations and easings come from these tokens. Do not invent new ones.

| Token | Value | Use |
| --- | --- | --- |
| `dur-instant` | 100ms | Press feedback |
| `dur-fast` | 180ms | Hover, focus, toggles, small fades |
| `dur-base` | 320ms | Cards, tabs, dropdowns, toasts |
| `dur-slow` | 600ms | Sheets, modals, page transitions |
| `dur-hero` | 900–1400ms | Landing timelines only |
| `ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` (GSAP: `expo.out` or `power4.out`) | Entrances. The default. |
| `ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` (GSAP: `power3.inOut`) | Moves between two visible positions |
| `ease-in` | `cubic-bezier(0.5, 0, 0.75, 0)` | Exits only, kept short |
| `spring-soft` | stiffness 260, damping 28 (Motion) | Sheets, tab pill, toasts |
| `stagger-tight` | 0.06s | Letters or small items |
| `stagger-base` | 0.10s | Cards and list rows |

Entrances use `ease-out`. Exits are about 30% faster than entrances. Never use linear except for looping progress and the route draw.

### 11.3 Motion rules

1. **Animate `transform` and `opacity` only.** Never animate width, height, top, left, or box-shadow in a loop.
2. **One orchestrated moment per view.** The landing hero is the showpiece. Everything else is quiet.
3. **Trigger per group, not per element.** One ScrollTrigger per section, with the children staggered inside it. Do not give every card its own trigger.
4. **Play once.** Scroll reveals run once and do not reverse. Only scroll-linked effects (map flattening, progress) scrub.
5. **No layout shift.** Hidden start states are set before first paint (CSS class or `gsap.set` inside `useGSAP`), and use `autoAlpha`. Wait for `document.fonts.ready` before splitting text.
6. **Motion follows the user.** Hover, tap, and drag always answer within 100ms.
7. **Keep it short.** Interface motion is 150–400ms. Only landing timelines go beyond 600ms.
8. **Distance is small.** Entrances travel 12–24px, not 100px. Text reveals use a mask slide, not a big fade-and-fly.
9. **Clean up.** Every GSAP animation lives inside `useGSAP` with a scope so it reverts on unmount. Kill ScrollTriggers on route change and call `ScrollTrigger.refresh()` after images and fonts load.
10. **Respect `prefers-reduced-motion`.** Use `gsap.matchMedia()` to run the full experience only under `(prefers-reduced-motion: no-preference)`. In reduced mode, content is simply visible, transitions become 150ms fades, loops stop, and Lenis is disabled.
11. **Lighter on phones.** Under 768px, disable scrub effects, tilt, and the magnetic button. Keep reveals and the route draw.

### 11.4 Landing page choreography

**Hero intro** (one GSAP timeline, about 2.2s total, plays once on load)

| Step | What happens | Timing |
| --- | --- | --- |
| 1 | Navbar fades down 12px | 0.0s, 500ms |
| 2 | Headline lines reveal: each line sits in an `overflow: hidden` mask and slides up from 110% (SplitText by lines, `stagger-base`) | 0.15s, 900ms, `expo.out` |
| 3 | Sub-copy fades in and rises 16px | 0.65s, 600ms |
| 4 | CTA buttons rise and fade, staggered | 0.8s, 600ms |
| 5 | Map plane rises from below and settles into its tilt (`rotateX` 62° to 55°, `y` 80 to 0), with the top edge already faded into paper | 0.4s, 1400ms, `power4.out` |
| 6 | Route line draws from pickup to destination (DrawSVG, 0% to 100%) | 1.1s, 1200ms, `power2.inOut` |
| 7 | Pickup dot pops in, destination pin drops in with a tiny bounce | 1.1s and 2.1s |
| 8 | Floating RideCard rises and fades in, then its progress track fills | 1.5s, 700ms |

After the intro, two subtle loops run:
- The highlighted car travels slowly along the route (MotionPath, 14s, `none` ease, loops back by fading out and in at the start).
- The RideCard drifts up and down 6px on a 5s sine loop.

Both loops pause when the tab is hidden and are off in reduced-motion mode.

**Hero extras (desktop with a fine pointer only)**
- The primary CTA has a **magnetic** pull: it follows the cursor within a 60px radius, up to 8px, and eases back on leave (`gsap.quickTo`).
- The map tilt responds very slightly to pointer position (max 2°). Skip this if it ever feels distracting.

**Scroll story** (Lenis smooth scroll + ScrollTrigger)

| Section | Animation |
| --- | --- |
| Hero to next section | As the page scrolls, the map **flattens** from 55° toward 40° and fades slightly (scrubbed, subtle) |
| Stats row | Numbers **count up** once when entering the viewport (`power2.out`, 1.4s). Dividers draw in from the left (scaleX 0 to 1). |
| How RideX works | The three step cards reveal with `stagger-base`. A thin connector line between them draws across as they appear, because it is a real sequence. |
| Vehicle types | Cards rise 24px with stagger. The vehicle render slides in 16px from the side. Hover tilts the vehicle 2° and lifts the card 4px (CSS). |
| Why RideX | Headline reveals by lines, the 2×2 grid staggers in. The wide card's small map draws its dotted route. |
| Final CTA block | The black block scales from 0.96 to 1 and its radius eases from 48px to 32px as it enters. The text lines reveal using the same mask technique as the hero. |
| Footer | No animation |

Do not pin sections or hijack scroll. The page must scroll at the normal pace.

### 11.5 Authenticated app motion

| Moment | Motion | Tool |
| --- | --- | --- |
| Route change | Content fades out 120ms, fades in with 12px rise, 240ms (`AnimatePresence`, `mode="wait"`) | Motion |
| Dashboard load | Cards stagger in once (`stagger-base`, 16px rise). Never re-run on data refetch. | Motion |
| Skeleton to content | Cross-fade 180ms, no movement | CSS |
| Modal | Backdrop fades, panel scales 0.96 to 1 and fades, `spring-soft` | Motion |
| Bottom sheet | Slides up with `spring-soft`, drag to dismiss, snap points on the booking sheet | Motion |
| Toast | Slides 16px and fades, exits 30% faster, swipe to dismiss on mobile | Motion |
| Dropdown and suggestions | Fade and scale from 0.98, origin at the trigger, `dur-fast` | Motion |
| Tab pill (FilterTabs) | The selected white pill **slides** between tabs using a shared `layoutId` | Motion |
| Status badge change | Cross-fade of text and background, 180ms | CSS |
| Fare and numbers change | Value counts or cross-fades over 300ms (tabular figures prevent jitter) | GSAP or CSS |
| Toggle (online/offline) | Knob slides with `spring-soft`, track color fades, the `live` dot starts a slow pulse | Motion |
| Ride request card arrives | Slides down 16px and fades in over 320ms. The countdown bar drains linearly. Card exits by sliding left and collapsing its height. | Motion |
| Button press | Scale 0.98 for 100ms, spinner replaces the arrow on loading | CSS |
| Card hover (clickable cards only) | Lift 2px, shadow moves from flat to `float`, 180ms | CSS |

**Booking page**
1. When pickup and destination are both set, the route **draws** on the map (DrawSVG, 900ms) while the camera eases to fit both points.
2. The vehicle cards stagger in once, then the fare cross-fades in.
3. Switching vehicle types animates the selected black border between cards (`layoutId`) and counts the fare to the new value.
4. On Confirm, the button shows its loading state, then the panel hands off to the tracking page with a shared-element feel: the route stays on screen while the panel content changes.

**Ride tracking**
- **Searching:** a ring expands from the pickup dot (scale 1 to 3, opacity 0.35 to 0, 1.8s loop, 2 rings offset by 0.9s).
- **Driver accepted:** the driver car fades in at its start point. The ring stops and fades out. The status line cross-fades to "Driver accepted".
- **Driver arriving:** the car moves along the route path (MotionPath) and its position eases to each new update instead of jumping. When real GPS arrives, use `gsap.quickTo` for position and rotate the car toward its heading.
- **Timeline:** when a step completes, its connector line fills downward (scaleY from the top, 400ms), the dot fills black with a small scale pop 1 to 1.15 to 1, and the next step's ring starts its pulse.
- **Completed:** the map dims, the receipt card rises from the bottom, the fare counts up, the 5-star rating row fills its stars in sequence on hover or tap.

**Driver active ride:** when the state advances, the single action button swaps with a 200ms vertical cross-slide (old label out up, new label in from below) and the thin 4-step progress line fills.

**Admin:** keep it nearly still. Stat numbers count up once on first load, tables fade in, rows have a `surface-soft` hover. No scroll effects.

### 11.6 Loops and ambient motion

Only these loops are allowed:
- Live dot pulse (online, on the way), 2s, opacity and scale only
- Searching ring on the map
- Landing car and RideCard drift
- Skeleton shimmer, 2s

All loops stop when the tab is hidden, in reduced-motion mode, and when scrolled out of view.

### 11.7 Implementation notes

Use one shared file, `src/motion/` (not created yet — build it when the motion work starts), so every animation uses the same tokens:

```text
src/motion/
  tokens.js        durations, eases, staggers
  gsap.js          registers plugins once, sets defaults
  useReveal.js     hook: staggered reveal for a section (ScrollTrigger, once)
  useCountUp.js    hook: number count-up on enter
  variants.js      shared Motion variants (fade, rise, sheet, toast)
  SmoothScroll.jsx Lenis provider, landing only, disabled for reduced motion
```

Setup rules:
- Register plugins once in `gsap.js`: `gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin)`.
- Connect Lenis to ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)` and drive Lenis from `gsap.ticker`), and turn off `gsap.ticker.lagSmoothing` for it.
- Wrap each page's animations in `useGSAP(() => {...}, { scope: ref })` so selectors stay local and cleanup is automatic.
- Use `gsap.matchMedia()` for the reduced-motion and mobile branches.
- Route draw needs the SVG path to have `pathLength` set. Keep map SVG paths simple (one path per route).
- Lazy-load GSAP plugins and Lenis only on the landing route so the app bundle stays small.

A hero timeline should read like this (shape only, not production code):

```js
const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
tl.from('.nav', { autoAlpha: 0, y: -12, duration: 0.5 })
  .from(split.lines, { yPercent: 110, duration: 0.9, stagger: 0.1 }, 0.15)
  .from('.hero-sub, .hero-cta > *', { autoAlpha: 0, y: 16, stagger: 0.08 }, 0.65)
  .from('.map-plane', { y: 80, rotateX: 62, duration: 1.4, ease: 'power4.out' }, 0.4)
  .from('.route', { drawSVG: '0%', duration: 1.2, ease: 'power2.inOut' }, 1.1)
  .from('.ride-card', { autoAlpha: 0, y: 24, duration: 0.7 }, 1.5);
```

### 11.8 Performance budget

- Animations hold 60fps on a mid-range phone. Test with 4x CPU throttling in DevTools.
- Add `will-change: transform` only to elements that animate continuously (map plane, car, RideCard) and remove it when idle.
- Never animate large blurred or shadowed elements. Fade them instead.
- The map and car are SVG or CSS. No video, no Lottie, no canvas in the MVP.
- Landing JS for animation stays under about 90KB gzipped, loaded after first paint.
- Cumulative Layout Shift stays at or near 0. Animations never move content that is already read.

---

## 12. Responsive behavior

| Breakpoint | Width | Behavior |
| --- | --- | --- |
| Mobile | below 640px | One column. Bottom tab bar. Sheets instead of modals. Booking: map 45–50% top, bottom sheet below. |
| Tablet | 640–1023px | Two-column where it helps (stats, cards). Booking panel is a bottom sheet or a 360px floating card. Admin sidebar becomes a drawer. |
| Desktop | 1024px and above | Sidebar + main layouts for driver and admin. Floating panel over a full map for booking. |

Rules:
- Touch targets are at least **44×44px**.
- Hero type scales down to 40px on mobile, never smaller.
- The tilted landing map flattens to a gentler tilt on mobile and the RideCard moves below the CTA.
- Tables scroll horizontally on small screens with a sticky first column.
- Test at 360, 390, 768, 1024, 1280, and 1440 widths.
- Use `100dvh`, not `100vh`, for map layouts on mobile browsers.

---

## 13. Copy and voice

- **Sentence case** everywhere. Plain verbs. No filler.
- Buttons say exactly what happens: **Book a ride**, **Confirm ride**, **Accept**, **Start ride**, **Complete ride**, **Save vehicle**. The toast after an action repeats the same verb in past tense.
- Errors say what happened and how to fix it. They don't apologize and they aren't vague.
- Empty states invite an action, they don't describe a mood.
- Use "ride" consistently. Do not mix "trip", "booking", and "journey".
- Use real, believable placeholder data (GMIT College → Baruipur Station, ₹150, Hyundai i20). Never "Lorem ipsum" or "John Doe".

---

## 14. Accessibility

- Every interactive element is keyboard reachable with a visible focus ring (2px `ink`, 2px offset).
- Color is never the only signal: status badges always include text.
- Form fields have visible labels and `aria-describedby` for errors.
- Map content has a text alternative: the pickup, destination, and driver status are also available as text in the status card.
- Modals and sheets trap focus and close on Escape.
- Live status changes (driver accepted, arriving, arrived) announce through an `aria-live="polite"` region.
- Minimum body text 15px. Minimum caption 13px.
- Respect `prefers-reduced-motion`.

---

## 15. Tokens (reference)

Tailwind theme extension. Tokens only. Components are built in React per `FRONTEND_PLAN.md`.

```js
// tailwind.config.js (theme.extend)
{
  colors: {
    paper: '#F6F6F5',
    surface: { DEFAULT: '#FFFFFF', soft: '#F2F2F1' },
    line: '#E7E7E5',
    ink: { DEFAULT: '#000000', soft: '#1C1C1C' },
    muted: { DEFAULT: '#8A8A87', strong: '#5E5E5B' },
    live: { DEFAULT: '#1FB26B', tint: '#E4F6EC' },
    pin: { DEFAULT: '#FF5A36', tint: '#FFEDE8' },
    map: { block: '#ECECEA', park: '#DCF1C9', water: '#CDE3F5' },
  },
  fontFamily: {
    sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
  },
  borderRadius: {
    input: '14px', row: '18px', card: '24px', hero: '32px',
  },
  boxShadow: {
    float: '0 12px 40px -12px rgba(0,0,0,0.14), 0 2px 6px rgba(0,0,0,0.04)',
    button: '0 10px 24px -8px rgba(0,0,0,0.35)',
  },
}
```

---

## 16. What should NOT be designed

Keep the product clean and finishable. Do not add:

- A dark theme (post-MVP at the earliest)
- Gradient backgrounds, glassmorphism, neon glows, or glowing borders
- Purple, blue-to-pink gradients, or any rainbow accent
- Emoji as icons or decoration
- Stock photos of smiling people
- Colored button fills other than black (and `live` on the online toggle)
- Heavy bold headlines or all-caps tracked labels
- Identical cards repeated for every section when a list or open layout works better
- Fake large-number statistics
- Scroll-jacking, pinned-section tricks, heavy parallax, custom cursors, page preloaders, or confetti
- Any animation library beyond the four in section 11.1, or scattered one-off animations that ignore the motion tokens
- Chat, in-app voice calls, surge-pricing visuals, coupons, or social features (see `../PLAN.md` section 34)
- Separate one-off versions of Button, Card, Input, or Badge on any page

---

## 17. Rules for anyone building the UI (including AI tools)

1. Read `../PLAN.md`, `PAGE_PLAN.md`, and this file first.
2. Inspect the existing code. Reuse existing components and tokens before creating anything new.
3. Use only the tokens in section 15. Do not introduce new hex values, radii, or shadows without updating this document.
4. Follow the layout sketches here and in `PAGE_PLAN.md`. Do not redesign navigation.
5. Build every page with loading, empty, error, and success states.
6. Check each page at mobile, tablet, and desktop widths before calling it done.
7. Do not add dependencies for something CSS or Lucide can do. The only approved animation libraries are GSAP, Motion, and Lenis (section 11.1). All timing and easing come from `src/motion/tokens.js`.
8. Never invent backend endpoints. Use mock data until the API contract exists.
9. If something is not defined here, choose the quieter, simpler option and document it in this file.

---

## 18. Pre-merge visual checklist

- [ ] There is one clear focal point and one black primary action in view
- [ ] Only tokens from this file are used
- [ ] Headlines are sentence case, weights 400/500 only
- [ ] Radius matches the element size scale
- [ ] Shadows are limited to `float` and `button`
- [ ] The map and ride card look like the Urban reference, the search and stats like Brickwise, the summary card like the profile card
- [ ] Touch targets are 44px or larger
- [ ] Keyboard focus is visible
- [ ] Loading, empty, error, and success states exist
- [ ] Reduced motion is respected (`gsap.matchMedia`, Lenis off, loops stopped)
- [ ] Animations use motion tokens and only animate transform and opacity
- [ ] GSAP animations live in `useGSAP` and clean up on route change
- [ ] Scroll reveals run once, one trigger per section, no scroll hijacking
- [ ] Landing intro timeline and route draw run without layout shift
- [ ] Animations hold 60fps on a throttled mobile profile
- [ ] No console errors, no layout shift on load