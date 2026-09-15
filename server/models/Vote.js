const mongoose = require("mongoose");

const voterSchema = new mongoose.Schema(
  {
    voterId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    constituency: {
      type: String,
      required: true,
      trim: true,
    },

    hasVoted: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
      default: null,
    },

    otpExpires: {
      type: Date,
      default: null,
    },

    // Maximum number of incorrect OTP attempts
    otpAttempts: {
      type: Number,
      default: 0,
    },

    // Prevents repeated OTP requests
    lastOtpSentAt: {
      type: Date,
      default: null,
    },

    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Voter ||
  mongoose.model(
    "Voter",
    voterSchema
  );