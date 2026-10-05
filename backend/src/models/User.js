const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const env = require("../config/env");
const { ROLES, ROLES_LIST } = require("../utils/constants");

// User (BACKEND_PLAN.md section 7)
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            maxlength: [80, "Name cannot exceed 80 characters"]
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address"]
        },

        phone: {
            type: String,
            trim: true,
            match: [/^[0-9]{10}$/, "Phone must be a 10 digit number"]
        },

        // Never expose the hash by default, use comparePassword()
        passwordHash: {
            type: String,
            required: [true, "Password is required"],
            select: false
        },

        role: {
            type: String,
            enum: {
                values: ROLES_LIST,
                message: "Role must be one of: {VALUE}"
            },
            default: ROLES.PASSENGER
        },

        profileImage: {
            type: String,
            default: null
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

// Hash password whenever it is set or changed (BACKEND_PLAN.md section 39)
userSchema.pre("save", async function hashPassword() {
    if (!this.isModified("passwordHash")) {
        return;
    }

    this.passwordHash = await bcrypt.hash(this.passwordHash, env.BCRYPT_SALT_ROUNDS);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
    return bcrypt.compare(candidate, this.passwordHash);
};

userSchema.methods.toSafeJSON = function toSafeJSON() {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        phone: this.phone,
        role: this.role,
        profileImage: this.profileImage,
        isActive: this.isActive,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    };
};

userSchema.set("toJSON", {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret.passwordHash;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model("User", userSchema);