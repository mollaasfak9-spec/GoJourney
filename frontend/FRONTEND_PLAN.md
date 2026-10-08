# RideX Frontend — Beginner Build Plan

> **Project:** RideX — Online Ride Booking & Management System  
> **Frontend:** React + Vite  
> **Goal:** Build the web interfaces for passengers, drivers, and admins step-by-step from scratch.

---

## 0. Important Rules for the Frontend Team

### Do not build everything at once

Follow this order:

1. Project setup
2. Global layout
3. Routing
4. Static pages
5. Forms
6. Authentication UI
7. API integration
8. Ride booking flow
9. Driver flow
10. Admin dashboard
11. Real-time features
12. Validation, loading, errors
13. Responsive UI
14. Testing and cleanup

### First milestone

Before connecting the backend, **all pages and routes should work with mock/static data**.

Do not wait for the backend team to finish before starting frontend work.

---

# 1. Frontend Stack

Installed in `frontend/package.json`:

```text
React 19
Vite
React Router
Axios
Tailwind CSS
Lucide React
```

Planned — add only when a feature needs them:

```text
React Hook Form
Zod
Socket.IO Client
TanStack Query
GSAP / Motion / Lenis   (see DESIGN.md section 11)
```

Do not add libraries just because they are popular. Add them when the project actually needs them.

---

# 2. Initial Setup

The app already lives in `frontend/` (React + Vite + Tailwind):

```bash
cd frontend
npm install
npm run dev
```

Already installed — do not reinstall:

```bash
npm install react-router-dom   # routing
npm install axios              # HTTP client
npm install lucide-react       # icons
```

Tailwind is configured through `tailwind.config.js` and `postcss.config.js` in `frontend/`.

---

# 3. Frontend Folder Structure

Current state of `frontend/src/`:

```text
src/
│
├── assets/            car-front.jpg, car-placeholder.jpg, hero.png, react.svg, vite.svg
│
├── components/
│   ├── common/        Footer.jsx, MapPlaceholder.jsx, Modal.jsx, ThemeToggle.jsx
│   ├── layout/        PublicNavbar.jsx
│   └── ride/          RideCarModal.jsx, ServiceTypeBar.jsx
│
├── constants/         cars.js, services.js
│
├── context/           themeContext.js, ThemeProvider.jsx
│
├── hooks/             useTheme.js
│
├── layouts/           PublicLayout.jsx
│
├── pages/
│   ├── public/        Home.jsx, About.jsx, Contact.jsx
│   └── auth/          Login.jsx, Register.jsx
│
├── routes/            AppRoutes.jsx
│
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

Planned — create these as the matching phase is reached:

```text
components/
    auth/
    driver/
    admin/

pages/
    passenger/
    driver/
    admin/

layouts/
    PassengerLayout.jsx
    DriverLayout.jsx
    AdminLayout.jsx

services/
    api.js
    authApi.js
    rideApi.js
    driverApi.js
    adminApi.js

context/
    AuthContext.jsx

utils/
```

---

# 4. Route Map

## Public

```text
/
 /about
 /contact
 /login
 /register
```

## Passenger

```text
/passenger
/passenger/book
/passenger/rides
/passenger/rides/:rideId
/passenger/profile
```

## Driver

```text
/driver
/driver/rides
/driver/rides/:rideId
/driver/earnings
/driver/profile
```

## Admin

```text
/admin
/admin/users
/admin/drivers
/admin/rides
/admin/payments
```

---

# 5. Build the Pages in This Exact Order

## Phase 1 — Public pages

Create:

```text
Home
About
Contact
Login
Register
```

At this stage:

- no backend
- no authentication
- no API
- forms can simply log values

---

# 6. Build Routing

Exists: `src/routes/AppRoutes.jsx`

Public routes are wired (Home, About, Contact inside `PublicLayout`, plus Login and Register):

```jsx
<Routes>
  <Route element={<PublicLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
  </Route>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
</Routes>
```

Next: add passenger, driver, and admin routes.

---

# 7. Create Layouts

Do not duplicate navigation bars on every page.

```text
PublicLayout      ✅ exists (src/layouts/PublicLayout.jsx)
PassengerLayout   planned
DriverLayout      planned
AdminLayout       planned
```

Example:

```text
PassengerLayout
 ├── Navbar
 ├── Sidebar
 ├── Page Content
 └── Footer
```

---

# 8. Passenger Dashboard

Create:

```text
/passenger
```

Show:

```text
Welcome, Akash

[ Book a Ride ]

Recent Rides

Ride ID
Pickup
Destination
Status
Fare
```

Use mock data first.

---

# 9. Booking Page

Create:

```text
/passenger/book
```

UI:

```text
Pickup Location
Destination
Vehicle Type

Bike
Auto
Car

Estimated Fare

[ Book Ride ]
```

Initially:

```js
const mockFare = 120;
```

Later replace it with:

```text
POST /api/rides/fare-estimate
```

---

# 10. Ride Tracking Page

Create:

```text
/passenger/rides/:rideId
```

Display:

```text
Searching for driver
       ↓
Driver accepted
       ↓
Driver arriving
       ↓
Driver reached pickup
       ↓
Ride started
       ↓
Ride completed
```

Later connect Socket.IO for real-time updates.

---

# 11. Passenger Ride History

Create:

```text
/passenger/rides
```

Show:

```text
All
Completed
Cancelled
Ongoing
```

Later connect:

```text
GET /api/rides/history
```

---

# 12. Driver Pages

Create:

```text
/driver
/driver/rides
/driver/rides/:rideId
/driver/earnings
/driver/profile
```

Driver dashboard should contain:

```text
Online / Offline

New Ride Requests

Today's Rides

Today's Earnings
```

---

# 13. Driver Ride Request

Example:

```text
New Ride Request

Pickup:
GMIT College

Destination:
Baruipur Station

Distance:
5.4 km

Estimated Fare:
₹120

[ Accept ] [ Reject ]
```

Later:

```text
PATCH /api/rides/:rideId/accept
PATCH /api/rides/:rideId/reject
```

---

# 14. Driver Ride Lifecycle

Buttons should change according to ride status.

```text
accepted
   ↓
[ Start Ride ]

started
   ↓
[ Complete Ride ]

completed
   ↓
Ride completed
```

Never allow random status transitions from the frontend.

The backend must also validate every transition.

---

# 15. Driver Earnings

Create:

```text
/driver/earnings
```

Display:

```text
Today's Earnings
Weekly Earnings
Total Completed Rides

Ride | Date | Fare | Your Earnings
```

Later:

```text
GET /api/drivers/earnings
```

---

# 16. Admin Dashboard

Create:

```text
/admin
```

Cards:

```text
Total Users
Total Drivers
Total Rides
Completed Rides
Cancelled Rides
Revenue
```

Pages:

```text
/admin/users
/admin/drivers
/admin/rides
/admin/payments
```

---

# 17. Authentication

After static pages are complete, integrate:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

Store authentication securely according to the backend/frontend design.

For a learning project, discuss with the backend team whether the project will use:

- HttpOnly cookie-based auth, preferred for a normal web app
- or token-based auth for learning/API clients

Do not put secrets in frontend source code.

---

# 18. Axios Setup

Create (not in the repo yet):

```text
src/services/api.js
```

Concept:

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
```

`.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Never commit real secrets.

Commit:

```text
.env.example
```

not:

```text
.env
```

---

# 19. API Service Separation

Do not put every request inside components.

Create these next to `src/services/api.js` (folder does not exist yet):

```text
authApi.js
rideApi.js
driverApi.js
adminApi.js
```

Example:

```js
export const createRide = (data) =>
  api.post("/rides", data);
```

Then the page calls:

```js
await createRide(formData);
```

---

# 20. Loading / Error / Empty States

Every API-based page should handle:

```text
Loading
Success
Empty
Error
```

Example:

```text
Loading rides...

No rides found.

Failed to load rides.
[ Try Again ]
```

This is not optional in a polished project.

---

# 21. Protected Routes

Create:

```text
ProtectedRoute
RoleRoute
```

Examples:

```text
Passenger cannot access /admin
Driver cannot access /admin
Logged-out user cannot access /passenger
```

The frontend protects navigation, but **backend authorization is the real security boundary**.

---

# 22. Final Frontend Development Order

```text
01 Setup
02 Folder structure
03 Global CSS / Tailwind
04 Navbar / Footer
05 Routing
06 Public pages
07 Auth pages
08 Passenger layout
09 Passenger dashboard
10 Booking page
11 Ride history
12 Ride tracking
13 Driver layout
14 Driver dashboard
15 Driver ride request
16 Driver ride lifecycle
17 Earnings
18 Admin layout
19 Admin dashboard
20 Admin management pages
21 API integration
22 Authentication
23 Protected routes
24 Loading/error states
25 Real-time Socket.IO
26 Responsive design
27 Testing
28 Production cleanup
```

---

# 23. Definition of Done

A frontend feature is complete only when:

- Page exists
- Route works
- UI is responsive
- Loading state exists
- Error state exists
- API is connected if available
- Form validation exists
- Unauthorized access is handled
- No console errors
- Code is committed on the correct branch

