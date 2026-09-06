const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  voterId: { type: String, unique: true },
  password: String,
  role: { type: String, default: "voter" },
  state: String,
  constituency: String,
  hasVoted: { type: Boolean, default: false },
  voteHistory: [
    {
      election: String,
      candidateName: String,
      party: String,
      constituency: String,
      votedAt: Date,
    },
  ],
});

module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);