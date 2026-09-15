const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema({
  title: String,

  type: String,

  state: String,

  status: String,

  startDate: Date,

  endDate: Date
});

module.exports = mongoose.model("Election", electionSchema);