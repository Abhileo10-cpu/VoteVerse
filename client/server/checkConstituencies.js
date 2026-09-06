const mongoose = require("mongoose");
const Candidate = require("./models/Candidate");

async function check() {
  try {
    await mongoose.connect(
      "mongodb://127.0.0.1:27017/votingDB"
    );

    const result = await Candidate.aggregate([
      {
        $match: {
          votingType: "government",
          state: "West Bengal",
        },
      },
      {
        $group: {
          _id: "$constituency",
          district: { $first: "$district" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    console.log("\nTOTAL CONSTITUENCIES:", result.length);
    console.log("\nFIRST 10:");
    console.log(result.slice(0, 10));

    await mongoose.disconnect();
  } catch (error) {
    console.error("ERROR:", error);
    process.exit(1);
  }
}

check();