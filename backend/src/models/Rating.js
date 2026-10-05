const mongoose = require("mongoose");

// Rating (BACKEND_PLAN.md section 33)
const ratingSchema = new mongoose.Schema(
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
            required: true,
            index: true
        },

        rating: {
            type: Number,
            required: [true, "Rating is required"],
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating cannot be more than 5"]
        },

        comment: {
            type: String,
            trim: true,
            maxlength: [500, "Comment cannot exceed 500 characters"],
            default: null
        }
    },
    {
        timestamps: true
    }
);

ratingSchema.index({ driverId: 1, createdAt: -1 });

ratingSchema.set("toJSON", {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model("Rating", ratingSchema);