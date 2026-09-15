const mongoose = require("mongoose");

const candidateSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },

      party: {
        type: String,
        default: "Independent",
      },

      constituency: {
        type: String,
        required: true,
      },

      constituencyNo: {
        type: Number,
      },

      district: {
        type: String,
        default: "West Bengal",
      },

      state: {
        type: String,
        default: "West Bengal",
      },

      votingType: {
        type: String,
        default: "government",
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

module.exports = mongoose.model(
  "Candidate",
  candidateSchema
);