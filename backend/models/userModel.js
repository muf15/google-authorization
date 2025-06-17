const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: false,
      trim: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    refreshToken: {
      type: String,
      select: false, // Won't be returned in queries by default
    },
    refreshTokenExpiresAt: {
      type: Date,
      select: false,
    },
    lastLogin: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    loginProvider: {
      type: String,
      enum: ["google", "email"],
      required: true,
      default: "google",
    },
  },
  {
    timestamps: true,
    // Add indexes for frequently queried fields
    indexes: [{ email: 1 }, { googleId: 1 }, { createdAt: 1 }],
  }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
