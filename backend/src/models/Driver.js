const mongoose = require("mongoose");

const { VERIFICATION_STATUS, VERIFICATION_STATUS_LIST } = require("../utils/constants");

const locationSchema = new mongoose.Schema(
    {
        lat: {
            type: Number,
            required: true,
            min: -90,
            max: 90
        },

        lng: {
            type: Number,
            required: true,
            min: -180,
            max: 180
        },

        address: {
            type: String,
            trim: true,
            default: null
        },

        updatedAt: {
            type: Date,
            default: null
        }
    },
    {
        _id: false
    }
);

// Driver (BACKEND_PLAN.md section 8)
const driverSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true
        },

        licenseNumber: {
            type: String,
            required: [true, "License number is required"],
            unique: true,
            trim: true,
            uppercase: true
        },

        verificationStatus: {
            type: String,
            enum: {
                values: VERIFICATION_STATUS_LIST,
                message: "Invalid verification status"
            },
            default: VERIFICATION_STATUS.UNVERIFIED
        },

        verificationRemarks: {
            type: String,
            trim: true,
            default: null
        },

        isOnline: {
            type: Boolean,
            default: false
        },

        currentLocation: {
            type: locationSchema,
            default: null
        },

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },

        ratingCount: {
            type: Number,
            default: 0,
            min: 0
        },

        totalRides: {
            type: Number,
            default: 0,
            min: 0
        },

        // Drivers that already rejected a ride request, used to keep the request
        // available for the other eligible drivers (BACKEND_PLAN.md section 25)
        rejectedRideRequests: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Ride"
            }
        ]
    },
    {
        timestamps: true
    }
);

driverSchema.index({ isOnline: 1, verificationStatus: 1 });

driverSchema.set("toJSON", {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model("Driver", driverSchema);