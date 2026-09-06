const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const Candidate = require("../models/Candidate");

const JSON_FILE = path.join(
  __dirname,
  "westBengalCandidates.json"
);

async function main() {
  try {
    if (!fs.existsSync(JSON_FILE)) {
      throw new Error(`JSON file not found: ${JSON_FILE}`);
    }

    const data = JSON.parse(
      fs.readFileSync(JSON_FILE, "utf8")
    );

    console.log(`JSON records found: ${data.length}`);

    // Safety: this dataset must contain exactly 4,410 records.
    if (data.length !== 4410) {
      throw new Error(
        `Expected 4410 candidate records but found ${data.length}`
      );
    }

    const candidates = data.map((candidate) => ({
      name: String(candidate.name || "").trim(),
      party: String(candidate.party || "Independent").trim(),
      constituency: String(candidate.constituency || "").trim(),
      constituencyNo: Number(candidate.constituency_no),
      district: String(candidate.district || "").trim(),
      state: "West Bengal",
      votingType: "government",
      symbol: candidate.symbol || "🗳️",
      votes: 0,
    }));

    if (
      candidates.some(
        (c) =>
          !c.name ||
          !c.constituency ||
          !c.district ||
          !Number.isFinite(c.constituencyNo)
      )
    ) {
      throw new Error("Dataset contains an incomplete candidate record.");
    }

    const constituencyCounts = new Map();

    for (const candidate of candidates) {
      const key = `${candidate.district}||${candidate.constituency}`;
      constituencyCounts.set(
        key,
        (constituencyCounts.get(key) || 0) + 1
      );
    }

    if (constituencyCounts.size !== 294) {
      throw new Error(
        `Expected 294 constituencies but found ${constituencyCounts.size}`
      );
    }

    const invalid = [...constituencyCounts.entries()].filter(
      ([, count]) => count !== 15
    );

    if (invalid.length) {
      throw new Error(
        `Expected exactly 15 candidates per constituency. Invalid constituencies: ${invalid.length}`
      );
    }

    const mongoURI =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      "mongodb://127.0.0.1:27017/votingDB";

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected");

    // ONLY government West Bengal candidates are replaced.
    // CollegeCandidate and CollegeVote collections are untouched.
    await Candidate.deleteMany({
      votingType: "government",
      state: "West Bengal",
    });

    console.log("Old government candidates deleted");
    console.log("Inserting 4,410 government candidates...");

    await Candidate.insertMany(candidates, { ordered: true });

    const total = await Candidate.countDocuments({
      votingType: "government",
      state: "West Bengal",
    });

    const groups = await Candidate.aggregate([
      {
        $match: {
          votingType: "government",
          state: "West Bengal",
        },
      },
      {
        $group: {
          _id: {
            district: "$district",
            constituency: "$constituency",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const allHave15 =
      groups.length === 294 &&
      groups.every((group) => group.count === 15);

    console.log("\n================================");
    console.log("VOTEVERSE GOVERNMENT DATA READY");
    console.log("================================");
    console.log("Government candidates:", total);
    console.log("Constituencies:", groups.length);
    console.log("Candidates per constituency: 15");
    console.log("All government votes: 0");
    console.log("College data: PRESERVED");
    console.log("================================");

    if (total !== 4410 || !allHave15) {
      throw new Error("Final verification failed.");
    }

    await mongoose.disconnect();
    console.log("MongoDB disconnected successfully.");
  } catch (error) {
    console.error("\nSEED FAILED:", error.message);
    try {
      await mongoose.disconnect();
    } catch (_) {}
    process.exit(1);
  }
}

main();
