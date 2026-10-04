const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Driver",
            default: null
        },

        pickupLocation: {
            address: {
                type: String,
                required: true
            },

            latitude: {
                type: Number
            },

            longitude: {
                type: Number
            }
        },

        dropLocation: {
            address: {
                type: String,
                required: true
            },

            latitude: {
                type: Number
            },

            longitude: {
                type: Number
            }
        },

        vehicleType: {
            type: String,
            enum: [
                "bike",
                "auto",
                "sedan",
                "suv",
                "hatchback"
            ],
            default: "sedan"
        },

        status: {
            type: String,
            enum: [
                "requested",
                "accepted",
                "started",
                "completed",
                "cancelled"
            ],
            default: "requested"
        },

        fare: {
            type: Number,
            default: 0,
            min: 0
        },

        distance: {
            type: Number,
            default: 0
        },

        duration: {
            type: Number,
            default: 0
        },

        paymentStatus: {
            type: String,
            enum: [
                "pending",
                "paid",
                "failed",
                "refunded"
            ],
            default: "pending"
        },

        cancelledBy: {
            type: String,
            enum: [
                "user",
                "driver",
                "admin"
            ],
            default: null
        },

        cancellationReason: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Ride", rideSchema);