const mongoose = require('mongoose');

const constituencySchema = new mongoose.Schema(
  {
    constituencyNumber: { type: Number },
    name: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    state: { type: String, default: 'West Bengal', trim: true },
  },
  { timestamps: true }
);

const Constituency =
  mongoose.models.Constituency ||
  mongoose.model('Constituency', constituencySchema);

module.exports = Constituency;
