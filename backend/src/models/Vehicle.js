const mongoose = require("mongoose");

const { VEHICLE_TYPES } = require("../utils/constants");

// Vehicle (BACKEND_PLAN.md section 9)
const vehicleSchema = new mongoose.Schema(
    {
        driverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Driver",
            required: true,
            index: true
        },

        type: {
            type: String,
            enum: {
                values: VEHICLE_TYPES,
                message: "Type must be one of: {VALUE}"
            },
            required: [true, "Vehicle type is required"]
        },

        brand: {
            type: String,
            trim: true,
            default: null
        },

        model: {
            type: String,
            trim: true,
            default: null
        },

        color: {
            type: String,
            trim: true,
            default: null
        },

        registrationNumber: {
            type: String,
            required: [true, "Registration number is required"],
            unique: true,
            trim: true,
            uppercase: true
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

vehicleSchema.index({ driverId: 1, isActive: 1 });

vehicleSchema.set("toJSON", {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model("Vehicle", vehicleSchema);