const mongoose = require("mongoose");

const collegeCandidateSchema = new mongoose.Schema(
  {
    collegeName: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    position: {
      type: String,
      default: "College Representative",
    },

    department: {
      type: String,
      default: "",
    },

    symbol: {
      type: String,
      default: "🗳️",
    },

    votes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.CollegeCandidate ||
  mongoose.model("CollegeCandidate", collegeCandidateSchema);