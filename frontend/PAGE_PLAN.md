# RideX — Concrete Page Planning

This document defines every major page before implementation.

For every page we define:

```text
Page
Route
User
Purpose
Entry point
Layout
Sections
Components
Primary action
Secondary actions
Data required
API dependencies
Loading state
Empty state
Error state
Success state
Responsive behavior
Navigation after action
```

---

# 1. Global Navigation Structure

RideX has four navigation experiences.

```text
Public
Passenger
Driver
Admin
```

## Public Navigation

```text
Logo
Home
About
Contact
Login
Register
```

Desktop:

```text
┌────────────────────────────────────────────────────────────┐
│ RideX       Home   About   Contact       Login  Register   │
└────────────────────────────────────────────────────────────┘
```

Mobile:

```text
┌──────────────────────────────┐
│ RideX                    ☰   │
└──────────────────────────────┘
```

---

# 2. Page Inventory

## Public Pages

| Page     | Route       | Priority |
| -------- | ----------- | -------- |
| Landing  | `/`         | P0       |
| About    | `/about`    | P2       |
| Contact  | `/contact`  | P2       |
| Login    | `/login`    | P0       |
| Register | `/register` | P0       |

## Passenger Pages

| Page          | Route                              | Priority |
| ------------- | ---------------------------------- | -------- |
| Dashboard     | `/passenger`                       | P0       |
| Book Ride     | `/passenger/book`                  | P0       |
| Ride Tracking | `/passenger/rides/:rideId`         | P0       |
| Ride History  | `/passenger/rides`                 | P0       |
| Ride Details  | `/passenger/rides/:rideId/details` | P1       |
| Profile       | `/passenger/profile`               | P1       |
| Settings      | `/passenger/settings`              | P2       |

## Driver Pages

| Page          | Route                   | Priority |
| ------------- | ----------------------- | -------- |
| Dashboard     | `/driver`               | P0       |
| Ride Requests | `/driver/rides`         | P0       |
| Active Ride   | `/driver/rides/:rideId` | P0       |
| Earnings      | `/driver/earnings`      | P1       |
| Ride History  | `/driver/rides/history` | P1       |
| Vehicle       | `/driver/vehicle`       | P1       |
| Profile       | `/driver/profile`       | P1       |

## Admin Pages

| Page           | Route                | Priority |
| -------------- | -------------------- | -------- |
| Dashboard      | `/admin`             | P0       |
| Users          | `/admin/users`       | P0       |
| User Details   | `/admin/users/:id`   | P1       |
| Drivers        | `/admin/drivers`     | P0       |
| Driver Details | `/admin/drivers/:id` | P1       |
| Rides          | `/admin/rides`       | P0       |
| Ride Details   | `/admin/rides/:id`   | P1       |
| Payments       | `/admin/payments`    | P1       |

---

# 3. P0 / P1 / P2 Meaning

### P0 — Required for MVP

Must be completed.

### P1 — Important

Build after the main ride flow works.

### P2 — Optional

Build only if the team has enough time.

---

# 4. PAGE: Landing Page

## Route

```text
/
```

## User

Everyone.

## Purpose

Explain RideX and immediately direct users toward booking or authentication.

## Layout

```text
Navbar
   ↓
Hero
   ↓
How RideX Works
   ↓
Vehicle Types
   ↓
Why RideX
   ↓
Call To Action
   ↓
Footer
```

## Hero

Content:

```text
Your ride.
Your destination.
Your way.

Book a reliable ride in a few simple steps.

[ Book a Ride ]
[ Become a Driver ]
```

Visual:

```text
┌────────────────────────────────────────────┐
│                                             │
│ Your ride.          [ Map / Ride Visual ]  │
│ Your destination.                           │
│ Your way.                                   │
│                                             │
│ [Book a Ride] [Become a Driver]            │
│                                             │
└────────────────────────────────────────────┘
```

## Components

```text
Navbar
Hero
CTAButton
VehicleCard
FeatureCard
Footer
```

## Actions

`Book a Ride`:

```text
logged out → /login
logged in passenger → /passenger/book
```

`Become a Driver`:

```text
→ /register
```

---

# 5. PAGE: Login

## Route

```text
/login
```

## Purpose

Authenticate existing users.

## Layout

```text
Logo
Welcome Back
Email / Phone
Password
Forgot Password
Login Button
Register Link
```

## Form

```text
Email
Password

[ Login ]

Don't have an account?
Create account
```

## States

Loading:

```text
Logging in...
```

Error:

```text
Invalid email or password.
```

Success:

```text
Passenger → /passenger
Driver → /driver
Admin → /admin
```

## API

```text
POST /api/auth/login
```

---

# 6. PAGE: Register

## Route

```text
/register
```

## Purpose

Create a new account.

## Form

```text
Full Name
Email
Phone
Password
Confirm Password

Account Type

○ Passenger
○ Driver

[ Create Account ]
```

If driver is selected, additional driver onboarding can happen after account creation.

## Validation

```text
Name required
Valid email
Valid phone
Password minimum length
Passwords match
```

## API

```text
POST /api/auth/register
```

---

# 7. PAGE: Passenger Dashboard

## Route

```text
/passenger
```

## Purpose

Passenger's main home screen after login.

## Layout

```text
Passenger Navbar
       │
       ▼
┌───────────────────────────────┐
│ Good morning, Akash           │
│                               │
│ Where are you going?          │
│ [ Book a Ride ]               │
└───────────────────────────────┘

Current Ride
     OR
No Active Ride

Recent Rides

Quick Actions
```

## Components

```text
PassengerNavbar
WelcomeCard
BookRideCard
ActiveRideCard
RecentRideCard
QuickAction
```

## Primary action

```text
Book a Ride
```

→ `/passenger/book`

## API

```text
GET /api/auth/me
GET /api/rides/history
```

---

# 8. PAGE: Book Ride

## Route

```text
/passenger/book
```

## Purpose

Main passenger booking experience.

## Desktop

```text
┌──────────────────────────────────────────────────────────┐
│                       MAP AREA                            │
│                                                          │
│                Pickup ●                                  │
│                           🚗                             │
│                                      ● Destination      │
│                                                          │
├──────────────────────┬───────────────────────────────────┤
│ BOOK YOUR RIDE        │                                   │
│                       │                                   │
│ Pickup                │                                   │
│ [________________]    │                                   │
│                       │                                   │
│ Destination           │                                   │
│ [________________]    │                                   │
│                       │                                   │
│ Vehicle               │                                   │
│ [Car] [Auto] [Bike]  │                                   │
│                       │                                   │
│ Estimated fare        │                                   │
│ ₹150                  │                                   │
│                       │                                   │
│ [ Confirm Ride ]      │                                   │
└───────────────────────┴───────────────────────────────────┘
```

## Mobile

Map:

```text
Top 45–50%
```

Booking panel:

```text
Bottom section
```

## Components

```text
MapPlaceholder
LocationInput
VehicleSelector
FareEstimateCard
ConfirmRideButton
```

## API

First:

```text
POST /api/rides/fare-estimate
```

Then:

```text
POST /api/rides
```

## States

Before locations:

```text
Enter pickup and destination
```

Calculating:

```text
Calculating fare...
```

No available drivers:

```text
No drivers are currently available.
```

Success:

```text
Ride requested successfully.
```

Then:

```text
→ /passenger/rides/:rideId
```

---

# 9. PAGE: Ride Tracking

## Route

```text
/passenger/rides/:rideId
```

## Purpose

Show the current ride lifecycle.

## Layout

```text
┌───────────────────────────────────────────┐
│                  MAP                      │
│                                           │
│        Passenger ●                        │
│                    🚗 Driver              │
│                                           │
├───────────────────────────────────────────┤
│ Ride Status                               │
│                                           │
│ ● Ride requested                          │
│ │                                         │
│ ● Driver accepted                         │
│ │                                         │
│ ○ Driver arriving                         │
│ │                                         │
│ ○ Ride started                            │
│ │                                         │
│ ○ Ride completed                          │
│                                           │
│ Driver                                    │
│ Rahul Das                                 │
│ ★ 4.8                                     │
│ Hyundai i20 • WB XX XXXX                  │
└───────────────────────────────────────────┘
```

## Status UI

```text
requested
accepted
driver_arriving
driver_arrived
started
completed
cancelled
```

## Primary data

```text
Driver
Vehicle
Pickup
Destination
Status
Fare
```

## API

```text
GET /api/rides/:rideId
```

Later:

```text
Socket.IO
```

---

# 10. PAGE: Ride History

## Route

```text
/passenger/rides
```

## Layout

```text
Ride History

[All] [Completed] [Cancelled]

┌──────────────────────────────────────────┐
│ GMIT College → Baruipur Station         │
│ Oct 4, 2026                              │
│ Completed                       ₹150     │
│                         [View Details]    │
└──────────────────────────────────────────┘
```

## Components

```text
FilterTabs
RideCard
StatusBadge
Pagination
```

## API

```text
GET /api/rides/history
```

---

# 11. PAGE: Passenger Profile

## Route

```text
/passenger/profile
```

## Layout

```text
Profile

[ Avatar ]

Name
Email
Phone

[ Edit Profile ]

Account Information

Member since
Total rides
Rating
```

## API

```text
GET /api/users/me
PATCH /api/users/me
```

---

# 12. PAGE: Driver Dashboard

## Route

```text
/driver
```

## Purpose

Driver's main workspace.

## Layout

```text
┌─────────────────────────────────────────┐
│ Driver Dashboard                        │
│                                         │
│ Status                                  │
│ [ ● ONLINE ]                            │
│                                         │
│ Today's Earnings       Today's Rides    │
│ ₹850                   7                │
│                                         │
│ Ride Requests                           │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Passenger: Akash                    │ │
│ │ Pickup: GMIT                        │ │
│ │ Destination: Baruipur               │ │
│ │ ₹150                                │ │
│ │ [Accept] [Reject]                   │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## APIs

```text
GET /api/drivers/me
GET /api/drivers/me/ride-requests
GET /api/drivers/earnings
```

---

# 13. PAGE: Driver Ride Requests

## Route

```text
/driver/rides
```

## Purpose

Show available ride requests.

## Ride Request Card

```text
Passenger
Pickup
Destination
Distance
Estimated Fare

[ Accept ]
[ Reject ]
```

## Accept

```text
PATCH /api/rides/:rideId/accept
```

## Reject

```text
PATCH /api/rides/:rideId/reject
```

After accepting:

```text
→ /driver/rides/:rideId
```

---

# 14. PAGE: Driver Active Ride

## Route

```text
/driver/rides/:rideId
```

## UI changes based on state.

### Accepted

```text
Ride accepted

Pickup:
GMIT College

[ I'm Arriving ]
```

### Arriving

```text
Navigate to passenger

[ I've Arrived ]
```

### Arrived

```text
Passenger is here

[ Start Ride ]
```

### Started

```text
Ride in progress

Destination:
Baruipur Station

[ Complete Ride ]
```

### Completed

```text
Ride completed

Fare:
₹150

[ Back to Dashboard ]
```

## APIs

```text
PATCH /api/rides/:rideId/arriving
PATCH /api/rides/:rideId/arrived
PATCH /api/rides/:rideId/start
PATCH /api/rides/:rideId/complete
```

---

# 15. PAGE: Driver Earnings

## Route

```text
/driver/earnings
```

## Layout

```text
Earnings

Today
₹850

This Week
₹5,200

This Month
₹18,500

Completed Rides
42

Recent Earnings

Date | Ride | Fare | Earnings
```

## API

```text
GET /api/drivers/earnings
```

---

# 16. PAGE: Driver Vehicle

## Route

```text
/driver/vehicle
```

## Layout

```text
My Vehicle

Vehicle Type
Car

Brand
Hyundai

Model
i20

Color
White

Registration Number
WB XX XXXX

[ Save Vehicle ]
```

## API

```text
GET /api/drivers/me/vehicles
POST /api/drivers/me/vehicles
PATCH /api/drivers/me/vehicles/:vehicleId
```

---

# 17. PAGE: Admin Dashboard

## Route

```text
/admin
```

## Purpose

Give administrators a platform overview.

## Layout

```text
Admin Dashboard

┌────────────┐ ┌────────────┐ ┌────────────┐
│ Users      │ │ Drivers    │ │ Rides      │
│ 1,240      │ │ 320        │ │ 8,450      │
└────────────┘ └────────────┘ └────────────┘

┌────────────┐
│ Revenue    │
│ ₹5,40,000  │
└────────────┘

Recent Rides

Ride Activity
```

## API

```text
GET /api/admin/dashboard
```

---

# 18. PAGE: Admin Users

## Route

```text
/admin/users
```

## Table

```text
Name | Email | Role | Status | Created | Actions
```

Actions:

```text
View
Suspend
Activate
```

## Components

```text
SearchInput
Filter
UserTable
StatusBadge
Pagination
```

## API

```text
GET /api/admin/users
PATCH /api/admin/users/:id/status
```

---

# 19. PAGE: Admin Drivers

## Route

```text
/admin/drivers
```

## Table

```text
Driver
Phone
Vehicle
Verification
Status
Rating
Actions
```

Actions:

```text
View
Verify
Suspend
```

## APIs

```text
GET /api/admin/drivers
PATCH /api/admin/drivers/:id/verify
PATCH /api/admin/drivers/:id/status
```

---

# 20. PAGE: Admin Rides

## Route

```text
/admin/rides
```

## Table

```text
Ride ID
Passenger
Driver
Pickup
Destination
Status
Fare
Date
```

Filters:

```text
Status
Date
Driver
Passenger
```

## API

```text
GET /api/admin/rides
```

---

# 21. PAGE: Admin Payments

## Route

```text
/admin/payments
```

## Table

```text
Transaction
Ride
Passenger
Amount
Method
Status
Date
```

## API

```text
GET /api/admin/payments
```

---

# 22. Shared Components

These should be designed once and reused.

## Navigation

```text
Navbar
Sidebar
MobileNavigation
Breadcrumb
```

## Forms

```text
Input
Select
LocationInput
PasswordInput
FormError
```

## Feedback

```text
Loader
Skeleton
Toast
ErrorState
EmptyState
SuccessMessage
```

## Data Display

```text
Card
Table
Badge
StatusBadge
Pagination
Modal
Dropdown
```

## Ride Components

```text
RideCard
RideStatus
RideTimeline
DriverCard
VehicleCard
FareCard
```

---

# 23. Important UI States

Every major page must define these states.

## Loading

```text
Skeleton / Spinner
```

## Empty

Example:

```text
No rides yet.

Book your first ride to see it here.

[ Book a Ride ]
```

## Error

```text
Something went wrong.

We couldn't load your rides.

[ Try Again ]
```

## Success

```text
Ride booked successfully.
```

## Disabled

Buttons should be disabled when:

```text
Form is submitting
Required data is missing
Action is not allowed
```

---

# 24. Responsive Page Rules

## Mobile

Passenger booking:

```text
Map
↓
Booking panel
```

Driver:

```text
Dashboard cards
↓
Ride requests
```

Admin:

```text
Sidebar becomes drawer
Tables can horizontally scroll
```

## Tablet

Use two-column layouts where appropriate.

## Desktop

Use:

```text
Sidebar + Main Content
```

for authenticated dashboards.

---

# 25. Page Implementation Order

Frontend developers should implement pages in this order.

## Sprint 1

```text
1. Landing
2. Login
3. Register
4. Public Navbar
5. Public Footer
6. Routing
```

## Sprint 2

```text
7. Passenger Layout
8. Passenger Dashboard
9. Book Ride
10. Ride Tracking
11. Ride History
```

## Sprint 3

```text
12. Driver Layout
13. Driver Dashboard
14. Ride Requests
15. Active Ride
16. Earnings
17. Vehicle
```

## Sprint 4

```text
18. Admin Layout
19. Admin Dashboard
20. Users
21. Drivers
22. Rides
23. Payments
```

## Sprint 5

```text
24. API integration
25. Authentication
26. Protected routes
27. Loading/error states
28. Form validation
```

## Sprint 6

```text
29. Real-time updates
30. Maps
31. Responsive refinement
32. Accessibility
33. Testing
```

---

# 26. Definition of Done for Every Page

Do not mark a page complete just because it visually exists.

A page is complete when:

```text
[ ] Route works
[ ] Layout works
[ ] Desktop works
[ ] Mobile works
[ ] Components are reusable
[ ] Loading state exists
[ ] Empty state exists
[ ] Error state exists
[ ] Form validation exists where needed
[ ] API integrated where available
[ ] Correct role protection exists
[ ] No console errors
[ ] No hardcoded secrets
[ ] Tested manually
[ ] Code reviewed
```

---

# 27. Design-to-Code Workflow

For every page:

```text
1. Read page specification
        ↓
2. Create rough wireframe
        ↓
3. Identify reusable components
        ↓
4. Build static UI
        ↓
5. Make responsive
        ↓
6. Add local/mock data
        ↓
7. Connect API
        ↓
8. Add loading/error/empty states
        ↓
9. Test
        ↓
10. Pull Request
```

---

# 28. Rule for Frontend Team

Before creating a new component, ask:

```text
"Does this already exist?"
```

If yes:

```text
Reuse it.
```

If no:

```text
Create a reusable component if another page may need it.
```

Avoid page-specific copies of common components.

---

# 29. Rule for Backend Team

Frontend developers must never invent API behavior.

Before integration, backend provides:

```text
METHOD
ENDPOINT
AUTH
ROLE
REQUEST
RESPONSE
ERRORS
```

Example:

```text
POST /api/rides

Role: passenger

Request:
{
  pickup,
  destination,
  vehicleType
}

Success:
201

{
  success: true,
  data: {...}
}
```

---

# 30. Final Product Navigation

The final application should feel like:

```text
                    RideX
                      │
          ┌───────────┼───────────┐
          │           │           │
       Passenger     Driver      Admin
          │           │           │
       Dashboard   Dashboard   Dashboard
          │           │           │
       Book Ride   Requests      Users
          │           │           │
       Tracking    Active Ride   Drivers
          │           │           │
       History     Earnings      Rides
          │                       │
       Profile                 Payments
```

The entire team should use this document as the **page-level source of truth** before implementing the UI.
