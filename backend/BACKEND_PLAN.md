# RideX Backend — Full Beginner-to-MVP Plan

> **Project:** RideX — Online Ride Booking & Management System  
> **Backend:** Node.js + Express  
> **Database:** MongoDB  
> **Goal:** Build a clean REST API for passengers, drivers, rides, payments, and admin management.

---

# 0. Backend Goal

Build the backend in small working stages.

Do NOT start with:

- maps
- payments
- Socket.IO
- advanced matching
- microservices

Start with:

```text
Server
↓
Database
↓
Authentication
↓
Users
↓
Drivers
↓
Rides
↓
Ride lifecycle
↓
Admin
↓
Payments
↓
Real-time
```

---

# 1. Suggested Stack

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
morgan
Socket.IO (later)
```

Optional:

```text
Zod/Joi
express-rate-limit
Cloudinary
Razorpay/Stripe
```

Only add packages when required.

---

# 2. Backend Folder Structure

```text
src/
│
├── config/
│   ├── db.js
│   └── env.js
│
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── driver.controller.js
│   ├── ride.controller.js
│   ├── payment.controller.js
│   └── admin.controller.js
│
├── models/
│   ├── User.js
│   ├── Driver.js
│   ├── Ride.js
│   ├── Vehicle.js
│   ├── Payment.js
│   └── Rating.js
│
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── driver.routes.js
│   ├── ride.routes.js
│   ├── payment.routes.js
│   └── admin.routes.js
│
├── middleware/
│   ├── auth.middleware.js
│   ├── role.middleware.js
│   ├── error.middleware.js
│   └── validation.middleware.js
│
├── services/
│   ├── fare.service.js
│   ├── ride.service.js
│   └── driver.service.js
│
├── validators/
│
├── utils/
│
├── sockets/
│
├── app.js
└── server.js
```

---

# 3. Basic Server Setup

Create:

```text
server.js
app.js
```

Responsibilities:

```text
server.js
→ starts HTTP server

app.js
→ Express configuration
→ middleware
→ routes
→ error handler
```

---

# 4. Environment Variables

Create:

```text
.env
.env.example
```

Example:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017
DB_NAME=ridex
JWT_SECRET=change_me
CLIENT_URL=http://localhost:5173
```

Never commit `.env`.

`.gitignore`:

```text
node_modules/
.env
.env.*
!.env.example
```

---

# 5. Health Endpoint

First API:

```http
GET /api/health
```

Response:

```json
{
  "success": true,
  "message": "RideX API is running"
}
```

This should be your first test.

---

# 6. Database Connection

Create MongoDB connection.

Test:

```text
Server starts
↓
MongoDB connects
↓
Health endpoint works
```

Do not continue until this works.

---

# 7. Data Models

## User

```text
User
├── name
├── email
├── phone
├── passwordHash
├── role
├── profileImage
├── createdAt
└── updatedAt
```

Roles:

```text
passenger
driver
admin
```

For a cleaner design, a separate Driver collection can hold driver-specific information.

---

# 8. Driver Model

```text
Driver
├── userId
├── licenseNumber
├── verificationStatus
├── isOnline
├── currentLocation
├── rating
├── totalRides
└── createdAt
```

Location can initially be:

```json
{
  "lat": 22.45,
  "lng": 88.40
}
```

Later use MongoDB GeoJSON.

---

# 9. Vehicle Model

```text
Vehicle
├── driverId
├── type
├── brand
├── model
├── color
├── registrationNumber
└── createdAt
```

Types:

```text
bike
auto
car
```

---

# 10. Ride Model

Main model:

```text
Ride
├── passengerId
├── driverId
├── vehicleType
├── pickup
├── destination
├── distance
├── estimatedFare
├── finalFare
├── status
├── startedAt
├── completedAt
├── cancelledAt
└── createdAt
```

Statuses:

```text
requested
accepted
driver_arriving
driver_arrived
started
completed
cancelled
```

---

# 11. Authentication APIs

Base:

```text
/api/auth
```

## Register

```http
POST /api/auth/register
```

Body:

```json
{
  "name": "Akash Das",
  "email": "akash@example.com",
  "phone": "9876543210",
  "password": "password"
}
```

## Login

```http
POST /api/auth/login
```

## Current User

```http
GET /api/auth/me
```

Protected.

## Logout

```http
POST /api/auth/logout
```

---

# 12. Authentication Middleware

Create:

```text
auth.middleware.js
```

Responsibilities:

```text
Request
 ↓
Read authentication
 ↓
Verify credentials/token
 ↓
Find user
 ↓
req.user = user
 ↓
next()
```

---

# 13. Role Middleware

Create:

```text
role.middleware.js
```

Example:

```text
requireRole("admin")
requireRole("driver")
requireRole("passenger")
```

Remember:

Frontend route protection is NOT security.

The backend must enforce roles.

---

# 14. User APIs

Base:

```text
/api/users
```

```http
GET /api/users/me
PATCH /api/users/me
DELETE /api/users/me
```

Optional:

```http
PATCH /api/users/me/password
```

---

# 15. Driver APIs

Base:

```text
/api/drivers
```

## Driver profile

```http
GET /api/drivers/me
PATCH /api/drivers/me
```

## Online / Offline

```http
PATCH /api/drivers/me/status
```

Body:

```json
{
  "isOnline": true
}
```

## Current location

```http
PATCH /api/drivers/me/location
```

Body:

```json
{
  "lat": 22.45,
  "lng": 88.40
}
```

---

# 16. Vehicle APIs

```http
POST   /api/drivers/me/vehicles
GET    /api/drivers/me/vehicles
PATCH  /api/drivers/me/vehicles/:vehicleId
DELETE /api/drivers/me/vehicles/:vehicleId
```

---

# 17. Fare Calculation

Do NOT make the frontend calculate the official fare.

Backend should calculate it.

Create:

```text
services/fare.service.js
```

Example formula:

```text
baseFare
+ distance × perKmRate
+ time × perMinuteRate
```

Example:

```text
Car:
Base = ₹50
Per km = ₹12
Per minute = ₹2
```

If:

```text
distance = 5 km
time = 20 min
```

Then:

```text
Fare = 50 + (5 × 12) + (20 × 2)
     = ₹150
```

This is only a project formula. Real pricing is much more complex.

---

# 18. Fare Estimate API

```http
POST /api/rides/fare-estimate
```

Body:

```json
{
  "pickup": {
    "lat": 22.45,
    "lng": 88.40
  },
  "destination": {
    "lat": 22.48,
    "lng": 88.43
  },
  "vehicleType": "car"
}
```

Response:

```json
{
  "vehicleType": "car",
  "estimatedFare": 150,
  "estimatedDistance": 5.2,
  "estimatedDuration": 18
}
```

Initially you can use mock distance/time.

---

# 19. Ride APIs

Base:

```text
/api/rides
```

## Create ride

```http
POST /api/rides
```

Passenger only.

Body:

```json
{
  "pickup": {
    "address": "GMIT College",
    "lat": 22.45,
    "lng": 88.40
  },
  "destination": {
    "address": "Baruipur Station",
    "lat": 22.36,
    "lng": 88.43
  },
  "vehicleType": "car"
}
```

Initial status:

```text
requested
```

---

# 20. Get Ride

```http
GET /api/rides/:rideId
```

Passenger or assigned driver.

---

# 21. Passenger Ride History

```http
GET /api/rides/history
```

Optional query:

```text
?page=1&limit=10&status=completed
```

---

# 22. Cancel Ride

```http
PATCH /api/rides/:rideId/cancel
```

Only allow cancellation when business rules permit it.

---

# 23. Driver Ride Requests

```http
GET /api/drivers/me/ride-requests
```

Initially return available requests.

Later use location-based matching.

---

# 24. Accept Ride

```http
PATCH /api/rides/:rideId/accept
```

Driver only.

Status:

```text
requested → accepted
```

---

# 25. Reject Ride

```http
PATCH /api/rides/:rideId/reject
```

Driver only.

A rejected request should remain available for other eligible drivers according to your matching logic.

---

# 26. Driver Arriving

```http
PATCH /api/rides/:rideId/arriving
```

Status:

```text
accepted → driver_arriving
```

---

# 27. Driver Arrived

```http
PATCH /api/rides/:rideId/arrived
```

Status:

```text
driver_arriving → driver_arrived
```

---

# 28. Start Ride

```http
PATCH /api/rides/:rideId/start
```

Status:

```text
driver_arrived → started
```

---

# 29. Complete Ride

```http
PATCH /api/rides/:rideId/complete
```

Status:

```text
started → completed
```

Backend calculates final fare and creates the appropriate payment record.

---

# 30. Ride State Machine

The backend should enforce:

```text
requested
   │
   ├── accepted
   │      │
   │      └── driver_arriving
   │              │
   │              └── driver_arrived
   │                       │
   │                       └── started
   │                              │
   │                              └── completed
   │
   └── cancelled
```

Never allow:

```text
completed → started
requested → completed
cancelled → accepted
```

unless there is an explicitly designed business rule.

---

# 31. Payment Model

```text
Payment
├── rideId
├── passengerId
├── amount
├── method
├── status
├── transactionId
└── createdAt
```

Methods:

```text
cash
online
```

Statuses:

```text
pending
paid
failed
refunded
```

---

# 32. Payment APIs

For the college MVP:

```http
POST /api/payments/:rideId
GET  /api/payments/:paymentId
GET  /api/payments/history
```

Do not implement real payment gateway integration until the core ride flow works.

---

# 33. Rating APIs

```http
POST /api/rides/:rideId/rating
GET  /api/rides/:rideId/rating
```

Example:

```json
{
  "rating": 5,
  "comment": "Good ride"
}
```

---

# 34. Admin APIs

Base:

```text
/api/admin
```

Dashboard:

```http
GET /api/admin/dashboard
```

Users:

```http
GET    /api/admin/users
GET    /api/admin/users/:id
PATCH  /api/admin/users/:id/status
```

Drivers:

```http
GET    /api/admin/drivers
GET    /api/admin/drivers/:id
PATCH  /api/admin/drivers/:id/verify
PATCH  /api/admin/drivers/:id/status
```

Rides:

```http
GET /api/admin/rides
GET /api/admin/rides/:id
```

Payments:

```http
GET /api/admin/payments
```

---

# 35. API Response Standard

Keep responses consistent.

Success:

```json
{
  "success": true,
  "message": "Ride created successfully",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Ride not found",
  "error": {
    "code": "RIDE_NOT_FOUND"
  }
}
```

---

# 36. HTTP Status Codes

Use meaningful status codes.

```text
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Validation Error
500 Internal Server Error
```

---

# 37. Validation

Validate:

- email
- phone
- password
- coordinates
- vehicle type
- ride status
- rating
- required fields

Never trust frontend validation.

---

# 38. Error Handling

Create centralized:

```text
error.middleware.js
```

Controllers should not contain huge repeated try/catch blocks.

Use a consistent error structure.

---

# 39. Security Checklist

Implement:

```text
Password hashing
Authentication
Role authorization
Input validation
Helmet
CORS
Rate limiting
Environment variables
No secrets in Git
```

Never store plain passwords.

Never commit:

```text
.env
database passwords
JWT secrets
API keys
payment secrets
```

---

# 40. Pagination

For lists:

```text
GET /api/admin/users?page=1&limit=10
GET /api/admin/rides?page=1&limit=10
```

Response:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

# 41. Search / Filtering

Later:

```text
GET /api/admin/users?search=akash
GET /api/admin/rides?status=completed
GET /api/admin/drivers?verified=true
```

---

# 42. Real-Time Phase

Only after REST APIs work.

Add:

```text
Socket.IO
```

Use it for:

```text
Driver location
Ride request notifications
Ride status updates
```

Concept:

```text
Passenger
    ↕
Socket.IO
    ↕
Backend
    ↕
Socket.IO
    ↕
Driver
```

---

# 43. Driver Matching

MVP:

```text
Find online drivers
→ filter vehicle type
→ choose nearest available driver
```

Later:

```text
Geospatial query
→ nearest drivers
→ send request
→ timeout
→ try next driver
```

Do not implement sophisticated production-grade dispatch algorithms for the college MVP.

---

# 44. API Build Order

Follow exactly:

```text
01 Project setup
02 Environment variables
03 Express server
04 MongoDB
05 Health API
06 User model
07 Auth register
08 Auth login
09 Auth middleware
10 Role middleware
11 User APIs
12 Driver model
13 Driver APIs
14 Vehicle APIs
15 Ride model
16 Fare service
17 Fare estimate API
18 Create ride
19 Get ride
20 Ride history
21 Driver requests
22 Accept ride
23 Reject ride
24 Arriving
25 Arrived
26 Start ride
27 Complete ride
28 Cancel ride
29 Payment model
30 Payment APIs
31 Rating APIs
32 Admin APIs
33 Validation
34 Error handling
35 Pagination/filtering
36 Security
37 Socket.IO
38 Driver matching
39 Testing
40 Documentation
```

---

# 45. Definition of Done

An API is complete only when:

- Route exists
- Controller exists
- Service exists if business logic is needed
- Model exists if database data is needed
- Validation exists
- Authentication/authorization is correct
- Success response is standardized
- Error response is standardized
- Postman test exists
- Edge cases are considered
- Code is committed to the correct Git branch
