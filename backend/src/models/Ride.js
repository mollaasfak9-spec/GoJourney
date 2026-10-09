const mongoose = require("mongoose");

const { VEHICLE_TYPES, RIDE_STATUS, RIDE_STATUS_LIST } = require("../utils/constants");

const pointSchema = new mongoose.Schema(
    {
        address: {
            type: String,
            trim: true,
            default: null
        },

        lat: {
            type: Number,
            required: [true, "Latitude is required"],
            min: -90,
            max: 90
        },

        lng: {
            type: Number,
            required: [true, "Longitude is required"],
            min: -180,
            max: 180
        }
    },
    {
        _id: false
    }
);

// Ride (BACKEND_PLAN.md section 10)
const rideSchema = new mongoose.Schema(
    {
        passengerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        driverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Driver",
            default: null,
            index: true
        },

        vehicleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vehicle",
            default: null
        },

        vehicleType: {
            type: String,
            enum: {
                values: VEHICLE_TYPES,
                message: "Vehicle type must be one of: {VALUE}"
            },
            required: [true, "Vehicle type is required"]
        },

        pickup: {
            type: pointSchema,
            required: [true, "Pickup location is required"]
        },

        destination: {
            type: pointSchema,
            required: [true, "Destination is required"]
        },

        distance: {
            type: Number,
            default: 0,
            min: 0
        },

        estimatedDuration: {
            type: Number,
            default: 0,
            min: 0
        },

        // Real road route geometry as [lat, lng] pairs, so Rider/Driver tracking
        // can redraw the exact route after a reload. Empty for legacy records.
        routeGeometry: {
            type: [[Number]],
            default: []
        },

        // Where the distance/course came from: "osrm" (real road route) or
        // "approximate" (straight-line fallback when routing was unavailable).
        routeSource: {
            type: String,
            enum: ["osrm", "approximate", null],
            default: null
        },

        estimatedFare: {
            type: Number,
            required: true,
            min: 0
        },

        finalFare: {
            type: Number,
            default: 0,
            min: 0
        },

        status: {
            type: String,
            enum: {
                values: RIDE_STATUS_LIST,
                message: "Invalid ride status"
            },
            default: RIDE_STATUS.REQUESTED,
            index: true
        },

        rejectedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Driver"
            }
        ],

        paymentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Payment",
            default: null
        },

        startedAt: {
            type: Date,
            default: null
        },

        completedAt: {
            type: Date,
            default: null
        },

        cancelledAt: {
            type: Date,
            default: null
        },

        cancelledBy: {
            type: String,
            enum: ["passenger", "driver", "admin"],
            default: null
        },

        cancellationReason: {
            type: String,
            trim: true,
            default: null
        }
    },
    {
        timestamps: true
    }
);

// A passenger can only track their own rides; drivers query assigned rides
rideSchema.index({ passengerId: 1, createdAt: -1 });
rideSchema.index({ driverId: 1, createdAt: -1 });
rideSchema.index({ status: 1, vehicleType: 1, createdAt: -1 });

rideSchema.set("toJSON", {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model("Ride", rideSchema);