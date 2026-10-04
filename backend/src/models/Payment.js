const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        ride: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ride",
            required: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        method: {
            type: String,
            enum: [
                "cash",
                "upi",
                "card",
                "wallet"
            ],
            required: true
        },

        status: {
            type: String,
            enum: [
                "pending",
                "success",
                "failed",
                "refunded"
            ],
            default: "pending"
        },

        transactionId: {
            type: String,
            unique: true,
            sparse: true
        },

        paymentGateway: {
            type: String,
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

module.exports = mongoose.model("Payment", paymentSchema);