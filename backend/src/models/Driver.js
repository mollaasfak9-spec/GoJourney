const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        licenseNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        vehicleNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
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
            required: true
        },

        isOnline: {
            type: Boolean,
            default: false
        },

        isApproved: {
            type: Boolean,
            default: false
        },

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },

        totalRides: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Driver", driverSchema);