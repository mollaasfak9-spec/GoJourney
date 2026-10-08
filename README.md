# RideX

## Online Ride Booking & Management System

RideX is a college software engineering project inspired by modern ride-hailing platforms.

It provides separate interfaces for:

- Passengers
- Drivers
- Administrators

The goal is to learn and demonstrate real-world full-stack concepts such as authentication, REST APIs, database design, role-based authorization, ride lifecycle management, payments, and real-time communication.

---

# 1. Project Architecture

```text
                    RideX
                      │
          ┌───────────┴───────────┐
          │                       │
     React Frontend          Node/Express API
          │                       │
          │                   MongoDB
          │
     ┌────┼─────┐
     │    │     │
 Passenger Driver Admin
```

Later:

```text
React
  │
  ├── REST API ──────── Express ─────── MongoDB
  │
  └── Socket.IO ─────── Express ─────── Real-time events
```

---

# 2. Repository Structure (current)

```text
RideX_AXION/
│
├── README.md
├── PLAN.md
├── GITHUB_GUIDE.md
├── .gitignore
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── ui_reference/
│   ├── DESIGN.md
│   ├── FRONTEND_PLAN.md
│   ├── PAGE_PLAN.md
│   ├── README.md
│   └── package.json
│
└── backend/
    ├── src/
    ├── tests/
    ├── BACKEND_PLAN.md
    ├── .env.example
    └── package.json
```

Docs live next to the code they describe:

| Doc | Folder |
| --- | --- |
| `README.md`, `PLAN.md`, `GITHUB_GUIDE.md` | root (project-wide) |
| `DESIGN.md`, `FRONTEND_PLAN.md`, `PAGE_PLAN.md`, `README.md` | `frontend/` |
| `BACKEND_PLAN.md` | `backend/` |

One repository is easier for a college team.

---

# 3. Frontend Structure

```text
frontend/
├── DESIGN.md
├── FRONTEND_PLAN.md
├── PAGE_PLAN.md
├── README.md
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
├── public/
├── ui_reference/
└── src/
    ├── App.jsx
    ├── App.css
    ├── main.jsx
    ├── index.css
    ├── assets/
    ├── components/
    │   ├── common/      Footer, MapPlaceholder, Modal, ThemeToggle
    │   ├── layout/      PublicNavbar
    │   └── ride/        RideCarModal, ServiceTypeBar
    ├── constants/       cars.js, services.js
    ├── context/         themeContext.js, ThemeProvider.jsx
    ├── hooks/           useTheme.js
    ├── layouts/         PublicLayout.jsx
    ├── pages/
    │   ├── public/      Home, About, Contact
    │   └── auth/        Login, Register
    └── routes/          AppRoutes.jsx
```

Planned, not created yet: `components/auth|driver|admin`, `pages/passenger|driver|admin`,
`layouts/PassengerLayout|DriverLayout|AdminLayout`, `services/`, `utils/`.

---

# 4. Backend Structure

```text
backend/
├── BACKEND_PLAN.md
├── .env.example
├── package.json
├── tests/
│   ├── run.js
│   └── smoke.test.js
└── src/
    ├── app.js
    ├── server.js
    ├── config/         db.js, env.js
    ├── controllers/    auth, user, driver, ride, payment, admin
    ├── middleware/     auth, role, error, validation, rateLimit
    ├── models/         User, Driver, Vehicle, Ride, Payment, Rating
    ├── routes/         auth, user, driver, ride, payment, admin
    ├── services/       fare, ride, driver
    ├── utils/          ApiError, asyncHandler, constants, geo, pagination, response
    └── validators/     auth, user, driver, ride, payment, admin, helpers
```

`sockets/` is planned for the real-time phase and does not exist yet.

---

# 5. Main User Roles

## Passenger

Can:

- Register/login
- Request ride
- See fare estimate
- View ride status
- Cancel ride
- View ride history
- Pay
- Rate driver

## Driver

Can:

- Register/login
- Manage profile
- Add vehicle
- Go online/offline
- Receive ride requests
- Accept/reject
- Update ride status
- Complete rides
- View earnings

## Admin

Can:

- View dashboard
- Manage users
- Manage drivers
- Verify drivers
- View rides
- View payments
- Manage platform data

---

# 6. Main Ride Lifecycle

```text
REQUESTED
    ↓
ACCEPTED
    ↓
DRIVER_ARRIVING
    ↓
DRIVER_ARRIVED
    ↓
STARTED
    ↓
COMPLETED
```

Alternative:

```text
REQUESTED → CANCELLED
```

The backend owns the state machine.

---

# 7. API Base URL

Development:

```text
http://localhost:5000/api
```

Frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

---

# 8. Environment Files

Backend:

```text
.env
.env.example
```

Frontend:

```text
.env
.env.example
```

Never commit real `.env` files.

---

# 9. Development Setup

## Backend

```bash
cd backend
npm install
npm run dev
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# 10. Recommended Development Order

```text
Backend:
Server
→ Database
→ Auth
→ Users
→ Drivers
→ Rides
→ Payments
→ Admin
→ Real-time

Frontend:
Setup
→ Routing
→ Static pages
→ Auth UI
→ Passenger
→ Driver
→ Admin
→ API integration
→ Real-time
```

---

# 11. Team Development Rule

Do not work directly on `main`.

Use feature branches.

Example:

```text
main
 │
 ├── frontend/landing-page
 ├── frontend/passenger-booking
 ├── backend/auth
 ├── backend/rides
 └── backend/admin
```

Open a Pull Request when the feature is ready.

---

# 12. Code Quality Rules

Use:

- meaningful names
- small functions
- reusable components
- consistent API responses
- environment variables
- validation
- centralized error handling
- comments only where they add useful context

Avoid:

- giant components
- giant controllers
- duplicated code
- hardcoded secrets
- unnecessary dependencies
- committing broken code to `main`

---

# 13. MVP Definition

The first usable version should support:

```text
Passenger register/login
Driver register/login
Passenger creates ride
Driver sees ride request
Driver accepts
Driver updates ride status
Passenger sees status
Driver completes ride
Ride history
Basic admin dashboard
```

Everything else is an enhancement.

---

# 14. Future Features

After MVP:

```text
Maps
GPS
Real-time driver location
Socket.IO
Online payments
Coupons
Notifications
Advanced driver matching
Ratings
Analytics
Cloud deployment
```

---

# 15. Team Roles

Example for a 4-member team:

### Member 1 — Frontend Passenger

```text
Public pages
Authentication UI
Passenger dashboard
Booking
Ride history
Ride tracking
```

### Member 2 — Frontend Driver/Admin

```text
Driver dashboard
Ride requests
Driver ride lifecycle
Earnings
Admin dashboard
```

### Member 3 — Backend Core

```text
Server
Database
Authentication
Users
Drivers
Vehicles
```

### Member 4 — Backend Ride System

```text
Rides
Fare
Ride lifecycle
Payments
Ratings
Admin APIs
```

If you have more/less members, split features instead of randomly splitting files.

---

# 16. Communication Rule

Before starting a frontend API integration, backend must provide:

```text
Endpoint
HTTP method
Authentication requirement
Request body
Query parameters
Success response
Error response
Possible status codes
```

Example:

```text
POST /api/rides

Auth: passenger

Body:
{
  pickup,
  destination,
  vehicleType
}

Response:
{
  success: true,
  data: {...}
}
```

This prevents frontend/backend confusion.

