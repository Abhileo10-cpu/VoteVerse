const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema({
  name: String,
  currentCM: String,
  rulingParty: String,
  nextElection: String,
  status: String
});

module.exports = mongoose.model("State", stateSchema);