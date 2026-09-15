const mongoose = require("mongoose");

const Constituency = require("../models/Constituency");
const Candidate = require("../models/Candidate");

const constituencies = require("./westBengalConstituencies.json");
const candidates = require("./westBengalCandidates.json");

require("dotenv").config({ path: "../.env" });

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  await Constituency.deleteMany();
  await Candidate.deleteMany();

  await Constituency.insertMany(constituencies);
  await Candidate.insertMany(candidates);

  console.log("Database Seeded");

  process.exit();
}

seed();