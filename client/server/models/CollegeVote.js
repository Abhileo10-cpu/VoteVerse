const mongoose = require("mongoose");

const collegeVoteSchema = new mongoose.Schema(
  {
    collegeName: {
      type: String,
      required: true,
    },

    voterName: {
      type: String,
      required: true,
    },

    collegeId: {
      type: String,
      required: true,
      unique: true,
    },

    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CollegeCandidate",
      required: true,
    },

    serialNumber: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.CollegeVote ||
  mongoose.model("CollegeVote", collegeVoteSchema);