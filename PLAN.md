# RideX — Overall Project Planning

> **Project:** RideX — Online Ride Booking & Management System
> **Type:** Full-stack college project
> **Goal:** Build a simplified, production-style ride-hailing platform for learning and demonstrating full-stack development.

---

# 1. Project Vision

RideX is a web-based ride-booking platform inspired by modern ride-hailing applications.

The system has three primary users:

```text
Passenger
Driver
Admin
```

Each role gets a different experience.

### Passenger

A passenger can:

* Create an account
* Log in
* Set pickup and destination
* Get an estimated fare
* Request a ride
* See ride status
* Cancel a ride
* View ride history
* Make/pay for a ride
* Rate the driver

### Driver

A driver can:

* Register
* Log in
* Complete driver profile
* Add vehicle
* Go online/offline
* Receive ride requests
* Accept/reject requests
* Update ride status
* Complete rides
* View earnings
* View ride history

### Admin

An admin can:

* View platform statistics
* Manage passengers
* Manage drivers
* Verify drivers
* View rides
* View payments
* Manage platform data

---

# 2. Project Philosophy

This is NOT intended to reproduce the entire Uber production system.

The project should demonstrate the important engineering concepts behind a ride-hailing platform without becoming impossible for a student team to finish.

### Priority

```text
Working MVP
      ↓
Clean architecture
      ↓
Good UI/UX
      ↓
Security
      ↓
Real-time functionality
      ↓
Advanced features
```

Do not sacrifice the core working system for advanced features.

---

# 3. MVP Scope

The first completed version must support:

```text
Passenger registration
        ↓
Passenger login
        ↓
Book ride
        ↓
Fare estimate
        ↓
Ride request
        ↓
Driver receives request
        ↓
Driver accepts
        ↓
Driver updates status
        ↓
Ride starts
        ↓
Ride completes
        ↓
Passenger sees history
```

Also:

```text
Admin
 ↓
Dashboard
 ↓
Users
Drivers
Rides
Payments
```

---

# 4. Future Features

Only after the MVP is stable:

```text
Real maps
GPS tracking
Real-time driver movement
Socket.IO
Online payment gateway
Push notifications
Coupons
Advanced driver matching
Surge pricing
Ratings/reviews
Analytics
Cloud deployment
```

---

# 5. System Architecture

```text
                    ┌─────────────────────┐
                    │      RideX Web      │
                    │   React + Vite      │
                    └──────────┬──────────┘
                               │
                         HTTP / REST
                               │
                    ┌──────────▼──────────┐
                    │   Node + Express    │
                    │       API           │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │      MongoDB        │
                    └─────────────────────┘
```

Later:

```text
React
  │
  ├──── REST API ──── Express ──── MongoDB
  │
  └──── Socket.IO ─── Express
                         │
                         └── Real-time events
```

---

# 6. Technology Stack

## Frontend

```text
React
Vite
React Router
Tailwind CSS
Axios
Lucide React
React Hook Form
```

Optional later:

```text
TanStack Query
Socket.IO Client
Map SDK
```

---

## Backend

```text
Node.js
Express
MongoDB
Mongoose
JWT / secure cookie authentication
bcrypt
dotenv
cors
helmet
```

Optional later:

```text
Socket.IO
Rate limiting
Validation library
Payment gateway
Cloudinary
```

---

# 7. Repository Structure

```text
ridex/
│
├── README.md
│
├── docs/
│   ├── PROJECT_PLAN.md
│   ├── DESIGN.md
│   ├── FRONTEND_PLAN.md
│   ├── BACKEND_PLAN.md
│   ├── API_SPEC.md
│   ├── DATABASE_DESIGN.md
│   ├── DEVELOPMENT_ROADMAP.md
│   └── GITHUB_GUIDE.md
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md
│
└── backend/
    ├── src/
    ├── package.json
    └── README.md
```

---

# 8. Frontend Architecture

```text
frontend/src/

components/
    common/
    layout/
    auth/
    ride/
    driver/
    admin/

pages/
    public/
    auth/
    passenger/
    driver/
    admin/

layouts/
    PublicLayout
    PassengerLayout
    DriverLayout
    AdminLayout

routes/
    AppRoutes

services/
    api
    authApi
    rideApi
    driverApi
    adminApi

context/
    AuthContext

hooks/
utils/
constants/
```

---

# 9. Backend Architecture

```text
backend/src/

config/
controllers/
models/
routes/
middleware/
services/
validators/
utils/
sockets/

app.js
server.js
```

### Responsibility

```text
Routes
  ↓
Controllers
  ↓
Services
  ↓
Models
  ↓
MongoDB
```

Routes should not contain business logic.

Controllers should coordinate requests.

Services should contain complex business logic.

Models should define database structures.

---

# 10. Main User Flows

## Passenger Flow

```text
Landing Page
      ↓
Register/Login
      ↓
Passenger Dashboard
      ↓
Book Ride
      ↓
Enter Pickup
      ↓
Enter Destination
      ↓
Choose Vehicle
      ↓
Fare Estimate
      ↓
Confirm Ride
      ↓
Searching Driver
      ↓
Driver Accepted
      ↓
Driver Arriving
      ↓
Driver Arrived
      ↓
Ride Started
      ↓
Ride Completed
      ↓
Payment
      ↓
Rating
```

---

# 11. Driver Flow

```text
Driver Login
      ↓
Driver Dashboard
      ↓
Go Online
      ↓
Receive Request
      ↓
Accept
      ↓
Navigate to Passenger
      ↓
Arrived
      ↓
Start Ride
      ↓
Complete Ride
      ↓
Earnings Updated
```

---

# 12. Admin Flow

```text
Admin Login
      ↓
Dashboard
      ↓
Users
Drivers
Rides
Payments
Reports
```

---

# 13. Ride State Machine

This is one of the most important parts of the project.

```text
                    ┌─────────────┐
                    │  REQUESTED  │
                    └──────┬──────┘
                           │
                    Driver accepts
                           │
                           ▼
                    ┌─────────────┐
                    │  ACCEPTED   │
                    └──────┬──────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │ DRIVER_ARRIVING  │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │  DRIVER_ARRIVED  │
                  └────────┬─────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   STARTED   │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  COMPLETED  │
                    └─────────────┘


REQUESTED ──────────────→ CANCELLED
ACCEPTED ───────────────→ CANCELLED
```

The backend must enforce valid transitions.

---

# 14. Main Database Entities

```text
User
Driver
Vehicle
Ride
Payment
Rating
```

Relationship:

```text
User
 │
 ├──── Passenger
 │
 └──── Driver
          │
          └──── Vehicle

Passenger
    │
    └──── Ride ──── Driver
             │
             ├──── Payment
             │
             └──── Rating
```

---

# 15. API Architecture

Base:

```text
/api
```

Authentication:

```text
/api/auth
```

Users:

```text
/api/users
```

Drivers:

```text
/api/drivers
```

Rides:

```text
/api/rides
```

Payments:

```text
/api/payments
```

Admin:

```text
/api/admin
```

---

# 16. API Design Rule

Every API must clearly define:

```text
Method
Endpoint
Authentication
Role
Request body
Query parameters
Success response
Error response
Status codes
```

Example:

```text
POST /api/rides

Role:
Passenger

Body:
{
    pickup,
    destination,
    vehicleType
}

Response:
{
    success: true,
    data: ride
}
```

---

# 17. Frontend Design Philosophy

The UI should feel like a modern mobility platform, but it should NOT blindly copy Uber.

Design goals:

```text
Clean
Modern
Fast
Simple
Professional
Mobile-friendly
Accessible
Consistent
```

Avoid:

```text
Too many colors
Huge unnecessary animations
Overloaded dashboards
Random gradients everywhere
Tiny text
Inconsistent buttons
Different styles on every page
```

---

# 18. Design System

The detailed visual system belongs in:

```text
docs/DESIGN.md
```

It should define:

```text
Color system
Typography
Spacing
Buttons
Inputs
Cards
Navigation
Tables
Modals
Status badges
Map area
Responsive behavior
Animations
Icons
Empty states
Loading states
Error states
```

---

# 19. Design.md Generation Rules

When generating `DESIGN.md`, it should describe the product visually and functionally.

It should answer:

```text
What does RideX look like?

What is the visual identity?

What does the homepage look like?

What does the passenger dashboard look like?

What does the driver dashboard look like?

What does the admin dashboard look like?

What components are reusable?

How does navigation work?

How should mobile/tablet/desktop behave?

What are the important states?

What should NOT be designed?
```

It should NOT contain huge implementation code.

---

# 20. AI Design Tool Rules

If an AI coding/design tool is used, it must:

1. Read `PROJECT_PLAN.md`
2. Read `DESIGN.md`
3. Read `FRONTEND_PLAN.md`
4. Inspect the existing code
5. Reuse existing components
6. Follow existing design tokens
7. Avoid unnecessary dependencies
8. Never invent backend endpoints
9. Never change architecture without approval
10. Keep pages responsive
11. Keep accessibility in mind
12. Test the page after implementation

---

# 21. Design Before Code

For each feature:

```text
Requirement
    ↓
User flow
    ↓
Wireframe
    ↓
Design
    ↓
Component breakdown
    ↓
Frontend implementation
    ↓
Backend API integration
    ↓
Testing
```

Do not jump directly from an idea to code.

---

# 22. Page Planning

Every page should have a defined purpose.

Example:

```text
Passenger Dashboard

Purpose:
Give passenger a quick overview of current and previous rides.

Contains:
- Current ride
- Book ride CTA
- Recent rides
- Saved places
- Profile shortcut

Primary action:
Book a Ride
```

This format should be used when planning every important page.

---

# 23. Component Strategy

Build reusable components.

Examples:

```text
Button
Input
Modal
Card
Badge
Navbar
Sidebar
Dropdown
Table
Pagination
Loader
ErrorState
EmptyState
RideCard
DriverCard
VehicleCard
```

Do not create separate visually identical buttons for every page.

---

# 24. Responsive Strategy

Three major breakpoints:

```text
Mobile
Tablet
Desktop
```

Passenger booking should work particularly well on mobile-sized screens.

Admin dashboards can prioritize desktop but must remain usable on smaller screens.

---

# 25. Error Handling Philosophy

Every important operation needs:

```text
Loading
Success
Error
Empty
```

Example:

```text
Loading rides...

No rides yet.

Unable to load rides.
[Retry]
```

---

# 26. Security Philosophy

Security must never depend only on the frontend.

Frontend:

```text
Protected routes
UI permissions
Form validation
```

Backend:

```text
Authentication
Authorization
Validation
Password hashing
Rate limiting
CORS
Helmet
Secret management
```

The backend is the final security boundary.

---

# 27. Development Phases

## Phase 1 — Foundation

```text
Repository
Frontend setup
Backend setup
MongoDB
Environment
Git workflow
```

---

## Phase 2 — Authentication

```text
Register
Login
Logout
Current user
Roles
Protected routes
```

---

## Phase 3 — Passenger

```text
Dashboard
Booking
Fare estimate
Ride request
Ride status
History
```

---

## Phase 4 — Driver

```text
Driver registration
Vehicle
Online/offline
Ride requests
Accept/reject
Ride lifecycle
Earnings
```

---

## Phase 5 — Admin

```text
Dashboard
Users
Drivers
Rides
Payments
```

---

## Phase 6 — Advanced

```text
Maps
GPS
Socket.IO
Notifications
Payments
Ratings
```

---

## Phase 7 — Production Preparation

```text
Testing
Security review
Error handling
Performance
Responsive UI
Documentation
Deployment
```

---

# 28. Team Workflow

```text
Issue
 ↓
Assign
 ↓
Create branch
 ↓
Develop
 ↓
Test
 ↓
Commit
 ↓
Push
 ↓
Pull Request
 ↓
Code Review
 ↓
Fix review comments
 ↓
Merge
```

---

# 29. Branch Strategy

Examples:

```text
feature/frontend-login
feature/frontend-booking
feature/frontend-driver-dashboard

feature/backend-auth
feature/backend-rides
feature/backend-payments

fix/ride-status
fix/login-validation

docs/design-system
docs/api-documentation
```

Never use:

```text
main
```

for normal feature development.

---

# 30. Commit Strategy

Use:

```text
feat:
fix:
refactor:
docs:
test:
chore:
```

Examples:

```text
feat: add passenger booking page
feat: add ride creation API
fix: prevent invalid ride status transition
docs: add API specification
test: add ride controller tests
```

---

# 31. Testing Strategy

## Frontend

Test:

```text
Routing
Forms
Validation
Protected routes
API states
Responsive UI
```

## Backend

Test:

```text
Authentication
Authorization
Validation
Ride creation
Ride transitions
Fare calculation
Error cases
```

## Integration

Test complete flow:

```text
Passenger
   ↓
Request ride
   ↓
Driver
   ↓
Accept
   ↓
Start
   ↓
Complete
   ↓
Passenger history
```

---

# 32. Documentation Strategy

The project documentation should remain separated by responsibility.

```text
PROJECT_PLAN.md
→ What we are building and why

DESIGN.md
→ What the product should look and feel like

FRONTEND_PLAN.md
→ How frontend developers should implement it

BACKEND_PLAN.md
→ How backend developers should implement it

API_SPEC.md
→ Exact API contract

DATABASE_DESIGN.md
→ Database structure

DEVELOPMENT_ROADMAP.md
→ What to build first/next

GITHUB_GUIDE.md
→ How the team collaborates with Git
```

This prevents one giant documentation file from becoming impossible to maintain.

---

# 33. Definition of MVP Complete

RideX MVP is complete when:

### Passenger

* [ ] Register
* [ ] Login
* [ ] Book ride
* [ ] View fare
* [ ] View ride status
* [ ] Cancel ride
* [ ] View history

### Driver

* [ ] Register
* [ ] Login
* [ ] Add vehicle
* [ ] Go online
* [ ] Receive ride
* [ ] Accept ride
* [ ] Update status
* [ ] Complete ride
* [ ] View earnings

### Admin

* [ ] Login
* [ ] Dashboard
* [ ] Users
* [ ] Drivers
* [ ] Rides
* [ ] Payments

### Engineering

* [ ] API validation
* [ ] Authentication
* [ ] Role authorization
* [ ] Error handling
* [ ] Git workflow
* [ ] Documentation
* [ ] Responsive frontend
* [ ] Basic testing

---

# 34. What We Should NOT Build Initially

Do not start with:

```text
Microservices
Kubernetes
Advanced AI driver matching
Complex surge pricing
Production-scale geospatial algorithms
Multiple payment providers
Native Android/iOS applications
Huge analytics system
```

Those can become future extensions.

---

# 35. Success Criteria

The project should demonstrate that the team understands:

```text
Frontend development
Backend development
REST APIs
Database design
Authentication
Authorization
CRUD
Business logic
State management
Real-time communication
Git/GitHub collaboration
Testing
Documentation
```

The goal is not to have the largest project.

The goal is to have a project that the entire team can **understand, explain, demonstrate, and defend during the college presentation/viva.**
