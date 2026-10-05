process.env.NODE_ENV = "test";
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret_do_not_use_in_production";
process.env.MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ridex_smoke";
process.env.BCRYPT_SALT_ROUNDS = "4"; // keep the smoke test fast
process.env.PORT = "5099";
process.env.CLIENT_URL = "http://localhost:5173";

const mongoose = require("mongoose");
const request = require("supertest");

const app = require("../src/app");
const User = require("../src/models/User");
const Driver = require("../src/models/Driver");
const Ride = require("../src/models/Ride");
const Payment = require("../src/models/Payment");

let passed = 0;
let failed = 0;
const failures = [];

const check = (label, condition, extra = "") => {
    if (condition) {
        passed += 1;
        console.log(`  PASS  ${label}`);
    } else {
        failed += 1;
        failures.push(`${label} ${extra}`);
        console.log(`  FAIL  ${label} ${extra}`);
    }
};

const section = (title) => console.log(`\n=== ${title} ===`);

const uniqueEmail = (prefix) => `${prefix}.${Date.now()}.${Math.floor(Math.random() * 100000)}@example.com`;

const registerUser = async (body) => {
    const response = await request(app).post("/api/auth/register").send(body);

    return response;
};

const authHeader = (token) => ["Authorization", `Bearer ${token}`];

const run = async () => {
    // ---------------------------------------------------------------
    section("Health (BACKEND_PLAN.md section 5)");

    let res = await request(app).get("/api/health");
    check("GET /api/health returns 200", res.status === 200, `got ${res.status}`);
    check("health message matches plan", res.body.message === "RideX API is running");
    check("health uses success flag", res.body.success === true);

    res = await request(app).get("/api/does-not-exist");
    check("unknown route returns 404", res.status === 404, `got ${res.status}`);
    check("404 body is standardized", res.body.success === false && res.body.error.code === "ROUTE_NOT_FOUND");

    // ---------------------------------------------------------------
    section("Auth (section 11)");

    const passenger = await registerUser({
        name: "Asha Passenger",
        email: uniqueEmail("passenger"),
        phone: "9876543210",
        password: "password123",
        role: "passenger"
    });

    check("POST /api/auth/register returns 201", passenger.status === 201, `got ${passenger.status}`);
    check("register returns a token", typeof passenger.body.data.token === "string");
    check("register never returns the hash", passenger.body.data.user.passwordHash === undefined);

    const passengerToken = passenger.body.data.token;
    const passengerId = passenger.body.data.user.id;

    const duplicate = await registerUser({
        name: "Copy Cat",
        email: passenger.body.data.user.email,
        password: "password123"
    });
    check("duplicate email returns 409", duplicate.status === 409, `got ${duplicate.status}`);

    const weakPassword = await registerUser({
        name: "Weak Pass",
        email: uniqueEmail("weak"),
        password: "123"
    });
    check("short password returns 422", weakPassword.status === 422, `got ${weakPassword.status}`);
    check(
        "422 error code is VALIDATION_ERROR",
        weakPassword.body.error && weakPassword.body.error.code === "VALIDATION_ERROR",
        JSON.stringify(weakPassword.body)
    );

    const badEmail = await registerUser({
        name: "Bad Email",
        email: "not-an-email",
        password: "password123"
    });
    check("invalid email returns 422", badEmail.status === 422, `got ${badEmail.status}`);

    const adminAttempt = await registerUser({
        name: "Sneaky Admin",
        email: uniqueEmail("sneaky"),
        password: "password123",
        role: "admin"
    });
    check("self signup cannot create an admin", adminAttempt.status === 403, `got ${adminAttempt.status}`);
    check(
        "role escalation error code",
        adminAttempt.body.error && adminAttempt.body.error.code === "ROLE_NOT_SELF_ASSIGNABLE",
        JSON.stringify(adminAttempt.body)
    );

    const login = await request(app)
        .post("/api/auth/login")
        .send({ email: passenger.body.data.user.email, password: "password123" });

    check("POST /api/auth/login returns 200", login.status === 200, `got ${login.status}`);
    check("login returns a token", typeof login.body.data.token === "string");

    const wrongPassword = await request(app)
        .post("/api/auth/login")
        .send({ email: passenger.body.data.user.email, password: "wrongpassword" });

    check("wrong password returns 401", wrongPassword.status === 401, `got ${wrongPassword.status}`);
    check("401 does not reveal whether the email exists", wrongPassword.body.error.code === "INVALID_CREDENTIALS");

    res = await request(app).get("/api/auth/me").set(...authHeader(passengerToken));
    check("GET /api/auth/me returns 200", res.status === 200, `got ${res.status}`);
    check("/auth/me returns the right user", res.body.data.user.id === passengerId);

    res = await request(app).get("/api/auth/me");
    check("GET /api/auth/me without token returns 401", res.status === 401, `got ${res.status}`);

    res = await request(app).get("/api/auth/me").set("Authorization", "Bearer not.a.jwt");
    check("invalid token returns 401", res.status === 401, `got ${res.status}`);

    res = await request(app).post("/api/auth/logout");
    check("POST /api/auth/logout returns 200", res.status === 200, `got ${res.status}`);

    // ---------------------------------------------------------------
    section("Users (section 14)");

    res = await request(app).get("/api/users/me").set(...authHeader(passengerToken));
    check("GET /api/users/me returns 200", res.status === 200, `got ${res.status}`);

    res = await request(app)
        .patch("/api/users/me")
        .set(...authHeader(passengerToken))
        .send({ name: "Asha Updated", phone: "9123456789" });

    check("PATCH /api/users/me returns 200", res.status === 200, `got ${res.status}`);
    check("name was updated", res.body.data.user.name === "Asha Updated");

    res = await request(app)
        .patch("/api/users/me")
        .set(...authHeader(passengerToken))
        .send({ role: "admin" });

    check("passenger cannot self promote to admin", res.status === 403, `got ${res.status}`);

    res = await request(app)
        .patch("/api/users/me/password")
        .set(...authHeader(passengerToken))
        .send({ currentPassword: "wrongpassword", newPassword: "newpassword123" });

    check("wrong current password returns 401", res.status === 401, `got ${res.status}`);

    res = await request(app)
        .patch("/api/users/me/password")
        .set(...authHeader(passengerToken))
        .send({ currentPassword: "password123", newPassword: "newpassword123" });

    check("PATCH /api/users/me/password returns 200", res.status === 200, `got ${res.status}`);

    const loginNewPassword = await request(app)
        .post("/api/auth/login")
        .send({ email: passenger.body.data.user.email, password: "newpassword123" });

    check("login works with the new password", loginNewPassword.status === 200, `got ${loginNewPassword.status}`);

    // ---------------------------------------------------------------
    section("Driver profile and vehicles (sections 15-16)");

    const driverRegistration = await registerUser({
        name: "Dan Driver",
        email: uniqueEmail("driver"),
        password: "password123",
        role: "driver"
    });

    const driverToken = driverRegistration.body.data.token;
    const driverUserId = driverRegistration.body.data.user.id;

    check("driver gets a driver profile on signup", Boolean(driverRegistration.body.data.user.id));

    res = await request(app).get("/api/drivers/me").set(...authHeader(driverToken));
    check("GET /api/drivers/me returns 200", res.status === 200, `got ${res.status}`);

    res = await request(app).get("/api/drivers/me").set(...authHeader(passengerToken));
    check("passenger cannot read /api/drivers/me", res.status === 403, `got ${res.status}`);

    res = await request(app)
        .patch("/api/drivers/me")
        .set(...authHeader(driverToken))
        .send({ licenseNumber: "WB-01-2024-9999" });

    check("PATCH /api/drivers/me returns 200", res.status === 200, `got ${res.status}`);
    check("new licence resets verification", res.body.data.driver.verificationStatus === "pending");

    res = await request(app)
        .patch("/api/drivers/me/location")
        .set(...authHeader(driverToken))
        .send({ lat: 22.45, lng: 88.4 });

    check("PATCH /api/drivers/me/location returns 200", res.status === 200, `got ${res.status}`);

    res = await request(app)
        .patch("/api/drivers/me/location")
        .set(...authHeader(driverToken))
        .send({ lat: 999, lng: 88.4 });

    check("invalid latitude returns 422", res.status === 422, `got ${res.status}`);

    res = await request(app)
        .patch("/api/drivers/me/status")
        .set(...authHeader(driverToken))
        .send({ isOnline: true });

    check("unverified driver cannot go online", res.status === 403, `got ${res.status}`);
    check("blocked reason is DRIVER_NOT_VERIFIED", res.body.error.code === "DRIVER_NOT_VERIFIED");

    res = await request(app)
        .post("/api/drivers/me/vehicles")
        .set(...authHeader(driverToken))
        .send({ type: "car", brand: "Maruti", model: "Swift", color: "White", registrationNumber: "WB 07 AB 1234" });

    check("POST /api/drivers/me/vehicles returns 201", res.status === 201, `got ${res.status}`);
    const vehicleId = res.body.data.vehicle.id;

    res = await request(app).post("/api/drivers/me/vehicles").set(...authHeader(driverToken)).send({
        type: "car",
        registrationNumber: "WB 07 AB 1234"
    });
    check("duplicate registration number returns 409", res.status === 409, `got ${res.status}`);

    res = await request(app)
        .post("/api/drivers/me/vehicles")
        .set(...authHeader(driverToken))
        .send({ type: "spaceship", registrationNumber: "ZZ 00 ZZ 0000" });

    check("invalid vehicle type returns 422", res.status === 422, `got ${res.status}`);

    res = await request(app).get("/api/drivers/me/vehicles").set(...authHeader(driverToken));
    check("GET /api/drivers/me/vehicles returns 200", res.status === 200, `got ${res.status}`);
    check("vehicle list has one entry", res.body.data.length === 1, `got ${res.body.data.length}`);

    res = await request(app)
        .patch(`/api/drivers/me/vehicles/${vehicleId}`)
        .set(...authHeader(driverToken))
        .send({ color: "Silver" });

    check("PATCH vehicle returns 200", res.status === 200, `got ${res.status}`);
    check("vehicle colour was updated", res.body.data.vehicle.color === "Silver");

    res = await request(app)
        .delete(`/api/drivers/me/vehicles/${vehicleId}`)
        .set(...authHeader(passengerToken));
    check("passenger cannot delete a driver vehicle", res.status === 403, `got ${res.status}`);

    // re-create the vehicle we just deleted scope test around
    res = await request(app)
        .post("/api/drivers/me/vehicles")
        .set(...authHeader(driverToken))
        .send({ type: "car", registrationNumber: "WB 07 AB 5678" });
    const vehicleId2 = res.body.data.vehicle.id;
    check("second vehicle created", res.status === 201, `got ${res.status}`);

    res = await request(app)
        .patch(`/api/drivers/me/vehicles/${vehicleId2}`)
        .set(...authHeader(driverToken))
        .send({ color: "Black" });
    check("PATCH on the second vehicle returns 200", res.status === 200, `got ${res.status}`);

    // delete as the owning driver and confirm it is gone
    res = await request(app)
        .delete(`/api/drivers/me/vehicles/${vehicleId2}`)
        .set(...authHeader(driverToken));
    check("owner can delete their vehicle", res.status === 200, `got ${res.status}`);

    res = await request(app)
        .delete(`/api/drivers/me/vehicles/${vehicleId2}`)
        .set(...authHeader(driverToken));
    check("deleted vehicle returns 404", res.status === 404, `got ${res.status}`);

    // ---------------------------------------------------------------
    section("Admin setup (sections 13 and 34)");

    const adminUser = await User.create({
        name: "Root Admin",
        email: uniqueEmail("admin"),
        passwordHash: "password123",
        role: "admin"
    });

    const adminLogin = await request(app)
        .post("/api/auth/login")
        .send({ email: adminUser.email, password: "password123" });

    check("admin login works", adminLogin.status === 200, `got ${adminLogin.status}`);
    const adminToken = adminLogin.body.data.token;

    res = await request(app).get("/api/admin/dashboard").set(...authHeader(adminToken));
    check("GET /api/admin/dashboard returns 200", res.status === 200, `got ${res.status}`);
    check("dashboard exposes ride counts", res.body.data.rides && typeof res.body.data.rides.total === "number");

    res = await request(app).get("/api/admin/users").set(...authHeader(adminToken));
    check("GET /api/admin/users returns 200", res.status === 200, `got ${res.status}`);
    check("users list is paginated", typeof res.body.pagination.totalPages === "number");

    res = await request(app).get("/api/admin/users").set(...authHeader(passengerToken));
    check("passenger cannot reach admin routes", res.status === 403, `got ${res.status}`);

    res = await request(app).get("/api/admin/dashboard");
    check("admin route without token returns 401", res.status === 401, `got ${res.status}`);

    const driverProfile = await Driver.findOne({ userId: driverUserId });

    res = await request(app)
        .patch(`/api/admin/drivers/${driverProfile.id}/verify`)
        .set(...authHeader(adminToken))
        .send({ verificationStatus: "verified" });

    check("PATCH /api/admin/drivers/:id/verify returns 200", res.status === 200, `got ${res.status}`);
    check("driver is now verified", res.body.data.driver.verificationStatus === "verified");

    // the driver could not go online before verification, so do it now
    res = await request(app)
        .patch("/api/drivers/me/status")
        .set(...authHeader(driverToken))
        .send({ isOnline: true });
    check("verified driver can go online", res.status === 200, `got ${res.status}`);

    res = await request(app)
        .patch(`/api/admin/drivers/${driverProfile.id}/verify`)
        .set(...authHeader(adminToken))
        .send({ verificationStatus: "not-a-status" });

    check("invalid verification status returns 422", res.status === 422, `got ${res.status}`);

    res = await request(app)
        .patch(`/api/admin/users/${passengerId}/status`)
        .set(...authHeader(adminToken))
        .send({ isActive: true });

    check("PATCH /api/admin/users/:id/status returns 200", res.status === 200, `got ${res.status}`);

    res = await request(app)
        .patch(`/api/admin/users/${adminUser._id}/status`)
        .set(...authHeader(adminToken))
        .send({ isActive: false });

    check("admin cannot deactivate themselves", res.status === 400, `got ${res.status}`);

    // ---------------------------------------------------------------
    section("Fare estimate (sections 17-18)");

    res = await request(app)
        .post("/api/rides/fare-estimate")
        .set(...authHeader(passengerToken))
        .send({
            pickup: { lat: 22.45, lng: 88.4 },
            destination: { lat: 22.48, lng: 88.43 },
            vehicleType: "car"
        });

    check("POST /api/rides/fare-estimate returns 200", res.status === 200, `got ${res.status}`);
    check("estimate has vehicleType", res.body.data.vehicleType === "car");
    check("estimate has estimatedFare", typeof res.body.data.estimatedFare === "number");
    check("estimate has estimatedDistance", typeof res.body.data.estimatedDistance === "number");
    check("estimate has estimatedDuration", typeof res.body.data.estimatedDuration === "number");

    // Sanity check the documented formula for a car
    const expectedFare = fareFor(50, 12, 2, res.body.data.estimatedDistance, res.body.data.estimatedDuration);
    check(
        `fare matches baseFare + km*12 + min*2 (${res.body.data.estimatedFare} vs ${expectedFare})`,
        res.body.data.estimatedFare === expectedFare
    );

    res = await request(app)
        .post("/api/rides/fare-estimate")
        .set(...authHeader(passengerToken))
        .send({ pickup: { lat: 22.45, lng: 88.4 }, destination: { lat: 22.45, lng: 88.4 }, vehicleType: "car" });

    check("identical pickup and destination returns 400", res.status === 400, `got ${res.status}`);

    res = await request(app)
        .post("/api/rides/fare-estimate")
        .set(...authHeader(passengerToken))
        .send({ pickup: { lat: 22.45 }, destination: { lat: 22.48, lng: 88.43 }, vehicleType: "car" });

    check("missing coordinates return 422", res.status === 422, `got ${res.status}`);

    // ---------------------------------------------------------------
    section("Ride lifecycle (sections 19-29)");

    res = await request(app)
        .post("/api/rides")
        .set(...authHeader(passengerToken))
        .send({
            pickup: { address: "GMIT College", lat: 22.45, lng: 88.4 },
            destination: { address: "Baruipur Station", lat: 22.36, lng: 88.43 },
            vehicleType: "car"
        });

    check("POST /api/rides returns 201", res.status === 201, `got ${res.status}`);
    check("ride starts as requested", res.body.data.ride.status === "requested");
    check("ride stores the estimated fare", res.body.data.ride.estimatedFare > 0);
    check("ride keeps the pickup address", res.body.data.ride.pickup.address === "GMIT College");
    check("matched driver was detected", res.body.data.hasNearbyDriver === true);

    const rideId = res.body.data.ride.id;

    res = await request(app)
        .post("/api/rides")
        .set(...authHeader(driverToken))
        .send({
            pickup: { lat: 22.45, lng: 88.4 },
            destination: { lat: 22.36, lng: 88.43 },
            vehicleType: "car"
        });

    check("driver cannot book a ride", res.status === 403, `got ${res.status}`);

    res = await request(app)
        .post("/api/rides")
        .set(...authHeader(passengerToken))
        .send({
            pickup: { lat: 22.5, lng: 88.5 },
            destination: { lat: 22.36, lng: 88.43 },
            vehicleType: "bike"
        });

    check("second active ride is rejected with 409", res.status === 409, `got ${res.status}`);
    check("conflict code is RIDE_ALREADY_IN_PROGRESS", res.body.error.code === "RIDE_ALREADY_IN_PROGRESS");

    res = await request(app).get(`/api/rides/${rideId}`).set(...authHeader(passengerToken));
    check("GET /api/rides/:rideId returns 200", res.status === 200, `got ${res.status}`);

    res = await request(app).get(`/api/rides/${rideId}`).set(...authHeader(adminToken));
    check("admin can read any ride", res.status === 200, `got ${res.status}`);

    const stranger = await registerUser({
        name: "Stranger",
        email: uniqueEmail("stranger"),
        password: "password123",
        role: "passenger"
    });
    res = await request(app)
        .get(`/api/rides/${rideId}`)
        .set(...authHeader(stranger.body.data.token));

    check("another passenger cannot read the ride", res.status === 403, `got ${res.status}`);

    res = await request(app).get("/api/rides/history").set(...authHeader(passengerToken));
    check("GET /api/rides/history returns 200", res.status === 200, `got ${res.status}`);
    check("history is paginated", res.body.pagination.page === 1);

    res = await request(app).get("/api/rides/active").set(...authHeader(passengerToken));
    check("GET /api/rides/active finds the ride", res.body.data.ride && res.body.data.ride.id === rideId);

    // Driver ride requests
    res = await request(app).get("/api/drivers/me/ride-requests").set(...authHeader(driverToken));
    check("GET /api/drivers/me/ride-requests returns 200", res.status === 200, `got ${res.status}`);
    check("request appears for the matching driver", res.body.data.some((r) => r.id === rideId));
    check(
        "ride requests expose the pickup distance",
        typeof res.body.data[0].pickupDistance === "number"
    );

    // Lifecycle updates are rejected before a driver is assigned
    res = await request(app)
        .patch(`/api/rides/${rideId}/start`)
        .set(...authHeader(driverToken));
    check("unassigned driver cannot start the ride", res.status === 403, `got ${res.status}`);
    check(
        "start before accept reports DRIVER_NOT_ASSIGNED",
        res.body.error.code === "DRIVER_NOT_ASSIGNED",
        JSON.stringify(res.body.error)
    );

    // accept
    res = await request(app).patch(`/api/rides/${rideId}/accept`).set(...authHeader(driverToken));
    check("PATCH /api/rides/:rideId/accept returns 200", res.status === 200, `got ${res.status}`);
    check("ride is accepted", res.body.data.ride.status === "accepted");
    check("driver is assigned", Boolean(res.body.data.ride.driverId));
    check("accept records the vehicle", Boolean(res.body.data.ride.vehicleId));

    res = await request(app).patch(`/api/rides/${rideId}/accept`).set(...authHeader(driverToken));
    check("double accept is rejected", res.status === 409, `got ${res.status}`);

    // Invalid transitions now that a driver owns the ride
    res = await request(app)
        .patch(`/api/rides/${rideId}/complete`)
        .set(...authHeader(driverToken));
    check("accepted -> completed is blocked", res.status === 409, `got ${res.status}`);
    check(
        "invalid transition error code",
        res.body.error.code === "INVALID_RIDE_TRANSITION",
        JSON.stringify(res.body.error)
    );

    // A second driver should not be able to touch this ride
    const driverTwo = await registerUser({
        name: "Dev Driver",
        email: uniqueEmail("driver2"),
        password: "password123",
        role: "driver"
    });
    const driverTwoToken = driverTwo.body.data.token;

    await request(app)
        .patch("/api/drivers/me")
        .set(...authHeader(driverTwoToken))
        .send({ licenseNumber: "WB-02-2024-8888" });

    const driverTwoProfile = await Driver.findOne({ userId: driverTwo.body.data.user.id });
    await request(app)
        .patch(`/api/admin/drivers/${driverTwoProfile.id}/verify`)
        .set(...authHeader(adminToken))
        .send({ verificationStatus: "verified" });
    await request(app)
        .post("/api/drivers/me/vehicles")
        .set(...authHeader(driverTwoToken))
        .send({ type: "car", registrationNumber: "WB 08 CD 9999" });

    res = await request(app)
        .patch(`/api/rides/${rideId}/arriving`)
        .set(...authHeader(driverTwoToken));

    check("unassigned driver cannot update the ride", res.status === 403, `got ${res.status}`);

    // arriving -> arrived -> start -> complete
    res = await request(app).patch(`/api/rides/${rideId}/arriving`).set(...authHeader(driverToken));
    check("PATCH arriving returns 200", res.status === 200, `got ${res.status}`);
    check("status is driver_arriving", res.body.data.ride.status === "driver_arriving");

    res = await request(app).patch(`/api/rides/${rideId}/arrived`).set(...authHeader(driverToken));
    check("PATCH arrived returns 200", res.status === 200, `got ${res.status}`);
    check("status is driver_arrived", res.body.data.ride.status === "driver_arrived");

    res = await request(app).patch(`/api/rides/${rideId}/cancel`).set(...authHeader(passengerToken));
    check("cancel before start is allowed", res.status === 200, `got ${res.status}`);
    check("status is cancelled", res.body.data.ride.status === "cancelled");
    check("cancelledBy is passenger", res.body.data.ride.cancelledBy === "passenger");
    check("cancelledAt is set", Boolean(res.body.data.ride.cancelledAt));

    // cancelled rides are terminal
    res = await request(app).patch(`/api/rides/${rideId}/start`).set(...authHeader(driverToken));
    check("cancelled -> started is blocked", res.status === 409, `got ${res.status}`);
    check("terminal state error code", res.body.error.code === "RIDE_FINALIZED");

    // Second ride that goes all the way to completed
    res = await request(app)
        .post("/api/rides")
        .set(...authHeader(passengerToken))
        .send({
            pickup: { address: "GMIT College", lat: 22.45, lng: 88.4 },
            destination: { address: "Baruipur Station", lat: 22.36, lng: 88.43 },
            vehicleType: "car"
        });

    const completedRideId = res.body.data.ride.id;

    await request(app).patch(`/api/rides/${completedRideId}/accept`).set(...authHeader(driverToken));
    await request(app).patch(`/api/rides/${completedRideId}/arriving`).set(...authHeader(driverToken));
    await request(app).patch(`/api/rides/${completedRideId}/arrived`).set(...authHeader(driverToken));

    res = await request(app).patch(`/api/rides/${completedRideId}/start`).set(...authHeader(driverToken));
    check("PATCH start returns 200", res.status === 200, `got ${res.status}`);
    check("status is started", res.body.data.ride.status === "started");
    check("startedAt is set", Boolean(res.body.data.ride.startedAt));

    res = await request(app).patch(`/api/rides/${completedRideId}/cancel`).set(...authHeader(passengerToken));
    check("started ride cannot be cancelled", res.status === 409, `got ${res.status}`);
    check("cancel guard code", res.body.error.code === "RIDE_NOT_CANCELLABLE");

    res = await request(app).patch(`/api/rides/${completedRideId}/complete`).set(...authHeader(driverToken));
    check("PATCH complete returns 200", res.status === 200, `got ${res.status}`);
    check("status is completed", res.body.data.ride.status === "completed");
    check("finalFare was calculated", res.body.data.ride.finalFare > 0);
    check("completedAt is set", Boolean(res.body.data.ride.completedAt));

    const driverAfter = await Driver.findById(driverProfile.id);
    check("driver totalRides incremented", driverAfter.totalRides === 1, `got ${driverAfter.totalRides}`);

    // ---------------------------------------------------------------
    section("Payments (section 32)");

    res = await request(app)
        .post(`/api/payments/${completedRideId}`)
        .set(...authHeader(passengerToken))
        .send({ method: "cash" });

    check("POST /api/payments/:rideId returns 201", res.status === 201, `got ${res.status}`);
    check("cash payment is paid immediately", res.body.data.payment.status === "paid");
    check("payment amount equals the final fare", res.body.data.payment.amount > 0);

    const paymentId = res.body.data.payment.id;

    res = await request(app)
        .post(`/api/payments/${completedRideId}`)
        .set(...authHeader(passengerToken))
        .send({ method: "cash" });

    check("double payment is rejected with 409", res.status === 409, `got ${res.status}`);

    res = await request(app).get(`/api/payments/${paymentId}`).set(...authHeader(passengerToken));
    check("GET /api/payments/:paymentId returns 200", res.status === 200, `got ${res.status}`);

    res = await request(app)
        .get(`/api/payments/${paymentId}`)
        .set(...authHeader(stranger.body.data.token));

    check("another passenger cannot read the payment", res.status === 403, `got ${res.status}`);

    res = await request(app).get("/api/payments/history").set(...authHeader(passengerToken));
    check("GET /api/payments/history returns 200", res.status === 200, `got ${res.status}`);
    check("payment history has one record", res.body.data.length === 1, `got ${res.body.data.length}`);

    res = await request(app)
        .post(`/api/payments/${rideId}`)
        .set(...authHeader(passengerToken))
        .send({ method: "cash" });

    check("cannot pay for a cancelled ride", res.status === 409, `got ${res.status}`);

    res = await request(app)
        .post(`/api/payments/${completedRideId}`)
        .set(...authHeader(passengerToken))
        .send({ method: "bitcoin" });

    check("invalid payment method returns 422", res.status === 422, `got ${res.status}`);

    // ---------------------------------------------------------------
    section("Ratings (section 33)");

    res = await request(app)
        .post(`/api/rides/${completedRideId}/rating`)
        .set(...authHeader(passengerToken))
        .send({ rating: 5, comment: "Good ride" });

    check("POST rating returns 201", res.status === 201, `got ${res.status}`);
    check("rating value was stored", res.body.data.rating.rating === 5);

    res = await request(app)
        .post(`/api/rides/${completedRideId}/rating`)
        .set(...authHeader(passengerToken))
        .send({ rating: 4 });

    check("double rating is rejected with 409", res.status === 409, `got ${res.status}`);

    res = await request(app)
        .post(`/api/rides/${rideId}/rating`)
        .set(...authHeader(passengerToken))
        .send({ rating: 3 });

    check("cannot rate a cancelled ride", res.status === 409, `got ${res.status}`);

    res = await request(app)
        .post(`/api/rides/${completedRideId}/rating`)
        .set(...authHeader(passengerToken))
        .send({ rating: 9 });

    check("rating above 5 returns 422", res.status === 422, `got ${res.status}`);

    res = await request(app).get(`/api/rides/${completedRideId}/rating`).set(...authHeader(passengerToken));
    check("GET rating returns 200", res.status === 200, `got ${res.status}`);
    check("GET rating returns the stored rating", res.body.data.rating.rating === 5);

    const driverAfterRating = await Driver.findById(driverProfile.id);
    check("driver average rating recalculated", driverAfterRating.rating === 5, `got ${driverAfterRating.rating}`);
    check("driver ratingCount is 1", driverAfterRating.ratingCount === 1);

    // ---------------------------------------------------------------
    section("Reject keeps the request available (section 25)");

    const thirdPassenger = await registerUser({
        name: "Pat Pending",
        email: uniqueEmail("third"),
        password: "password123",
        role: "passenger"
    });
    const thirdToken = thirdPassenger.body.data.token;

    res = await request(app)
        .post("/api/rides")
        .set(...authHeader(thirdToken))
        .send({
            pickup: { lat: 22.45, lng: 88.4 },
            destination: { lat: 22.36, lng: 88.43 },
            vehicleType: "car"
        });
    const rejectRideId = res.body.data.ride.id;

    res = await request(app).get("/api/drivers/me/ride-requests").set(...authHeader(driverTwoToken));
    check("second driver sees the open request", res.body.data.some((r) => r.id === rejectRideId));

    res = await request(app)
        .patch(`/api/rides/${rejectRideId}/reject`)
        .set(...authHeader(driverTwoToken))
        .send({ reason: "Too far" });

    check("PATCH reject returns 200", res.status === 200, `got ${res.status}`);
    check("rejected ride is still requested", res.body.data.ride.status === "requested");

    res = await request(app).get("/api/drivers/me/ride-requests").set(...authHeader(driverTwoToken));
    check(
        "rejecting driver no longer sees the ride",
        !res.body.data.some((r) => r.id === rejectRideId)
    );

    res = await request(app).get("/api/drivers/me/ride-requests").set(...authHeader(driverToken));
    check("other drivers still see the rejected ride", res.body.data.some((r) => r.id === rejectRideId));

    res = await request(app)
        .patch(`/api/rides/${rejectRideId}/accept`)
        .set(...authHeader(driverToken));

    check("another driver can accept the ride", res.status === 200, `got ${res.status}`);

    // ---------------------------------------------------------------
    section("Driver listing, history and earnings");

    res = await request(app).get("/api/drivers/me/rides").set(...authHeader(driverToken));
    check("GET /api/drivers/me/rides returns 200", res.status === 200, `got ${res.status}`);

    res = await request(app).get("/api/drivers/me/earnings").set(...authHeader(driverToken));
    check("GET /api/drivers/me/earnings returns 200", res.status === 200, `got ${res.status}`);
    check("earnings reflect the paid ride", res.body.data.totalPaidRides === 1, `got ${res.body.data.totalPaidRides}`);

    // ---------------------------------------------------------------
    section("Admin listings and filters (sections 34, 40 and 41)");

    res = await request(app).get("/api/admin/drivers").set(...authHeader(adminToken));
    check("GET /api/admin/drivers returns 200", res.status === 200, `got ${res.status}`);

    res = await request(app).get("/api/admin/drivers?verified=true").set(...authHeader(adminToken));
    check("verified=true filter works", res.body.data.every((d) => d.verificationStatus === "verified"));

    res = await request(app).get(`/api/admin/drivers/${driverProfile.id}`).set(...authHeader(adminToken));
    check("GET /api/admin/drivers/:id returns 200", res.status === 200, `got ${res.status}`);
    check("driver detail includes earnings", typeof res.body.data.stats.totalEarnings === "number");

    res = await request(app).get("/api/admin/rides?status=completed").set(...authHeader(adminToken));
    check("GET /api/admin/rides?status=completed returns 200", res.status === 200, `got ${res.status}`);
    check("only completed rides are returned", res.body.data.every((r) => r.status === "completed"));

    res = await request(app).get("/api/admin/rides?status=bogus").set(...authHeader(adminToken));
    check("invalid ride status filter returns 422", res.status === 422, `got ${res.status}`);

    res = await request(app).get(`/api/admin/rides/${completedRideId}`).set(...authHeader(adminToken));
    check("GET /api/admin/rides/:id returns 200", res.status === 200, `got ${res.status}`);

    res = await request(app).get("/api/admin/rides/000000000000000000000000").set(...authHeader(adminToken));
    check("unknown admin ride returns 404", res.status === 404, `got ${res.status}`);

    res = await request(app).get("/api/admin/payments").set(...authHeader(adminToken));
    check("GET /api/admin/payments returns 200", res.status === 200, `got ${res.status}`);

    res = await request(app).get(`/api/admin/users/${passengerId}`).set(...authHeader(adminToken));
    check("GET /api/admin/users/:id returns 200", res.status === 200, `got ${res.status}`);

    res = await request(app).get("/api/admin/users?page=1&limit=1").set(...authHeader(adminToken));
    check("admin pagination honours limit", res.body.data.length === 1, `got ${res.body.data.length}`);
    check("admin pagination reports totalPages", res.body.pagination.totalPages >= 1);

    // ---------------------------------------------------------------
    section("Account deletion (section 14)");

    res = await request(app).get("/api/admin/dashboard").set(...authHeader(adminToken));
    const ridesBefore = res.body.data.rides.total;
    const usersBefore = res.body.data.users.total;

    res = await request(app).delete("/api/users/me").set(...authHeader(stranger.body.data.token));
    check("DELETE /api/users/me returns 200", res.status === 200, `got ${res.status}`);

    res = await request(app).get("/api/admin/dashboard").set(...authHeader(adminToken));
    check("deleted user is deactivated, not removed", res.body.data.users.total === usersBefore);

    res = await request(app).get("/api/auth/me").set(...authHeader(stranger.body.data.token));
    check("deactivated account cannot authenticate", res.status === 403, `got ${res.status}`);

    res = await request(app).delete("/api/users/me").set(...authHeader(passengerToken));
    check("a user with no active ride can delete their account", res.status === 200, `got ${res.status}`);

    // a fresh user books a ride and must not be able to delete the account
    const blockingPassenger = await registerUser({
        name: "Busy Rider",
        email: uniqueEmail("blocking"),
        password: "password123",
        role: "passenger"
    });

    res = await request(app)
        .post("/api/rides")
        .set(...authHeader(blockingPassenger.body.data.token))
        .send({
            pickup: { lat: 12.9716, lng: 77.5946 },
            destination: { lat: 13.0358, lng: 77.6 },
            vehicleType: "car"
        });
    check("blocking ride was created", res.status === 201, `got ${res.status}`);

    res = await request(app)
        .delete("/api/users/me")
        .set(...authHeader(blockingPassenger.body.data.token));
    check("cannot delete an account with an active ride", res.status === 409, `got ${res.status}`);

    res = await request(app).get("/api/admin/dashboard").set(...authHeader(adminToken));
    check("ride count is unchanged", res.body.data.rides.total === ridesBefore + 1);

    // ---------------------------------------------------------------
    section("Data integrity checks");

    const rideCount = await Ride.countDocuments({});
    check("rides were persisted", rideCount >= 3, `got ${rideCount}`);

    const paymentCount = await Payment.countDocuments({});
    check("payments were persisted", paymentCount === 1, `got ${paymentCount}`);

    const user = await User.findOne({ _id: passengerId }).select("+passwordHash");
    check("password is stored as a bcrypt hash", user.passwordHash.startsWith("$2"), user.passwordHash.slice(0, 4));
    check("plain text password is never stored", user.passwordHash !== "password123");

    const matches = await user.comparePassword("newpassword123");
    check("comparePassword validates the new password", matches === true);

    const mismatch = await user.comparePassword("password123");
    check("comparePassword rejects the old password", mismatch === false);
};

const fareFor = (base, perKm, perMin, distance, duration) =>
    Math.round(base + distance * perKm + duration * perMin);

run()
    .then(async () => {
        await mongoose.connection.close();

        console.log(`\n${"=".repeat(50)}`);
        console.log(`PASSED: ${passed}`);
        console.log(`FAILED: ${failed}`);

        if (failures.length > 0) {
            console.log("\nFailures:");
            failures.forEach((f) => console.log(`  - ${f}`));
        }

        console.log(`${"=".repeat(50)}`);

        process.exit(failed === 0 ? 0 : 1);
    })
    .catch(async (error) => {
        console.error("\nSmoke test crashed:", error);
        await mongoose.connection.close();
        process.exit(1);
    });