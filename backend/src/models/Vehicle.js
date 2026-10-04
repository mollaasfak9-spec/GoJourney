const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
    {
        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Driver",
            required: true
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

        brand: {
            type: String,
            trim: true
        },

        model: {
            type: String,
            trim: true
        },

        color: {
            type: String,
            trim: true
        },

        year: {
            type: Number
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);