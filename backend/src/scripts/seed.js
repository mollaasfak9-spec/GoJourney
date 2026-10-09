const mongoose = require("mongoose");

const connectDB = require("../config/db");
const User = require("../models/User");
const Driver = require("../models/Driver");
const Vehicle = require("../models/Vehicle");

const { ROLES, VERIFICATION_STATUS } = require("../utils/constants");

/**
 * Idempotent demo seed.
 *
 * Creates one passenger, one verified + online driver (with a vehicle and a
 * current location so dispatch matching can find it) and one admin, so the
 * whole flow can be exercised without clicking through admin verification.
 *
 * Run with: npm run seed
 */

const DEMO_PASSWORD = "ridex1234";

const DEMO_USERS = [
    {
        name: "Demo Passenger",
        email: "passenger@ridex.com",
        phone: "9000000001",
        role: ROLES.PASSENGER
    },
    {
        name: "Demo Driver",
        email: "driver@ridex.com",
        phone: "9000000002",
        role: ROLES.DRIVER
    },
    {
        name: "Demo Admin",
        email: "admin@ridex.com",
        phone: "9000000003",
        role: ROLES.ADMIN
    }
];

// India Gate, New Delhi - a central point so the demo driver can be nearby.
const DEMO_DRIVER_LOCATION = {
    lat: 28.6129,
    lng: 77.2295,
    address: "India Gate, New Delhi"
};

const upsertUser = async ({ name, email, phone, role }) => {
    const existing = await User.findOne({ email });

    if (existing) {
        console.log(`  = user already exists: ${email} (${role})`);
        return existing;
    }

    const user = await User.create({
        name,
        email,
        phone,
        role,
        passwordHash: DEMO_PASSWORD
    });

    console.log(`  + created user: ${email} (${role})`);
    return user;
};

const seedDriverProfile = async (user) => {
    let driver = await Driver.findOne({ userId: user._id });

    if (!driver) {
        driver = await Driver.create({
            userId: user._id,
            licenseNumber: "DL01DEMO0001",
            verificationStatus: VERIFICATION_STATUS.VERIFIED,
            isOnline: true,
            currentLocation: { ...DEMO_DRIVER_LOCATION, updatedAt: new Date() }
        });

        console.log("  + created verified driver profile (online)");
    } else {
        driver.verificationStatus = VERIFICATION_STATUS.VERIFIED;
        driver.isOnline = true;

        if (!driver.currentLocation || driver.currentLocation.lat === undefined) {
            driver.currentLocation = { ...DEMO_DRIVER_LOCATION, updatedAt: new Date() };
        }

        await driver.save();
        console.log("  = driver profile already exists (ensured verified + online)");
    }

    return driver;
};

const seedVehicle = async (driver) => {
    const existing = await Vehicle.findOne({ driverId: driver._id });

    if (existing) {
        console.log(`  = vehicle already exists: ${existing.registrationNumber}`);
        return existing;
    }

    const vehicle = await Vehicle.create({
        driverId: driver._id,
        type: "car",
        brand: "Maruti",
        model: "Swift",
        color: "White",
        registrationNumber: "DL01DEMO1",
        isActive: true
    });

    console.log(`  + created vehicle: ${vehicle.registrationNumber} (car)`);
    return vehicle;
};

const seed = async () => {
    console.log("Seeding demo data...\n");

    await connectDB();

    const [passengerUser, driverUser, adminUser] = await Promise.all(
        DEMO_USERS.map((user) => upsertUser(user))
    );

    const driver = await seedDriverProfile(driverUser);
    await seedVehicle(driver);

    console.log("\nDemo accounts (password for all: %s)", DEMO_PASSWORD);
    console.log("  Passenger : %s", passengerUser.email);
    console.log("  Driver    : %s", driverUser.email);
    console.log("  Admin     : %s", adminUser.email);
    console.log("\nDone.");

    await mongoose.disconnect();
    process.exit(0);
};

seed().catch(async (error) => {
    console.error("Seed failed:", error.message);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
});
