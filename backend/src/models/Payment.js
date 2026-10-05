const mongoose = require("mongoose");

const {
    PAYMENT_METHOD_LIST,
    PAYMENT_STATUS,
    PAYMENT_STATUS_LIST
} = require("../utils/constants");

// Payment (BACKEND_PLAN.md section 31)
const paymentSchema = new mongoose.Schema(
    {
        rideId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ride",
            required: true,
            unique: true,
            index: true
        },

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

        amount: {
            type: Number,
            required: [true, "Amount is required"],
            min: 0
        },

        method: {
            type: String,
            enum: {
                values: PAYMENT_METHOD_LIST,
                message: "Method must be one of: {VALUE}"
            },
            required: [true, "Payment method is required"]
        },

        status: {
            type: String,
            enum: {
                values: PAYMENT_STATUS_LIST,
                message: "Invalid payment status"
            },
            default: PAYMENT_STATUS.PENDING,
            index: true
        },

        transactionId: {
            type: String,
            unique: true,
            sparse: true,
            default: null
        },

        paidAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

paymentSchema.index({ passengerId: 1, createdAt: -1 });

paymentSchema.set("toJSON", {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model("Payment", paymentSchema);