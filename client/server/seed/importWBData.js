require("dotenv").config();

const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const mongoose = require("mongoose");

const Candidate = require("../models/Candidate");

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/votingDB";

const csvPath = path.join(
  __dirname,
  "wb-assembly-2021-results.csv"
);

const rows = [];

function findValue(row, possibleNames) {
  for (const name of possibleNames) {
    const key = Object.keys(row).find(
      (k) =>
        k
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "") ===
        name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
    );

    if (key && row[key] !== undefined && row[key] !== "") {
      return String(row[key]).trim();
    }
  }

  return "";
}

async function importData() {
  try {
    if (!fs.existsSync(csvPath)) {
      console.error("❌ CSV FILE NOT FOUND:");
      console.error(csvPath);
      process.exit(1);
    }

    console.log("📂 Reading:", csvPath);

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (row) => {
        rows.push(row);
      })
      .on("end", async () => {
        try {
          console.log(`📊 Found ${rows.length} rows in CSV`);

          if (rows.length === 0) {
            throw new Error("CSV has no data rows.");
          }

          console.log("CSV columns:");
          console.log(Object.keys(rows[0]));

          await mongoose.connect(MONGO_URI);

          console.log("✅ MongoDB Connected");

          // Remove only existing government candidates
          // before restoring the complete CSV dataset
          await Candidate.deleteMany({
            votingType: {
              $in: ["government", "Government"],
            },
          });

          console.log("🗑️ Old government candidate data cleared");

          const candidatesToInsert = [];
          const seenCandidates = new Set();

          for (const row of rows) {
            const constituency =
              findValue(row, [
                "constituency_name",
                "constituency",
                "assembly_constituency",
                "assemblyconstituency",
                "ac_name",
                "acname",
              ]);

            const constituencyNo =
              findValue(row, [
                "constituency_no",
                "constituency_number",
                "ac_no",
                "acno",
                "no",
              ]);

            const district =
              findValue(row, [
                "district",
                "district_name",
                "districtname",
              ]) || "West Bengal";

            if (!constituency) {
              continue;
            }

            /*
              WINNER
            */

            const winnerName =
              findValue(row, [
                "winner_name",
                "winner",
                "candidate_name",
                "candidatename",
              ]);

            const winnerParty =
              findValue(row, [
                "winner_party",
                "party",
                "party_name",
                "partyname",
              ]) || "Independent";

            /*
              RUNNER UP
            */

            const runnerUpName =
              findValue(row, [
                "runner_up",
                "runnerup",
                "runner_up_name",
                "runnerupname",
                "second_candidate",
              ]);

            const runnerUpParty =
              findValue(row, [
                "runner_up_party",
                "runnerupparty",
                "second_party",
              ]) || "Independent";

            // Add winner
            if (winnerName) {
              const uniqueWinnerKey =
                `${constituency}-${winnerName}`
                  .toLowerCase();

              if (!seenCandidates.has(uniqueWinnerKey)) {
                seenCandidates.add(uniqueWinnerKey);

                candidatesToInsert.push({
                  name: winnerName,
                  party: winnerParty,
                  constituency,
                  constituencyNo,
                  district,
                  state: "West Bengal",
                  votingType: "government",
                  symbol: "🗳️",
                  votes: 0,
                });
              }
            }

            // Add runner-up
            if (runnerUpName) {
              const uniqueRunnerKey =
                `${constituency}-${runnerUpName}`
                  .toLowerCase();

              if (!seenCandidates.has(uniqueRunnerKey)) {
                seenCandidates.add(uniqueRunnerKey);

                candidatesToInsert.push({
                  name: runnerUpName,
                  party: runnerUpParty,
                  constituency,
                  constituencyNo,
                  district,
                  state: "West Bengal",
                  votingType: "government",
                  symbol: "🗳️",
                  votes: 0,
                });
              }
            }
          }

          if (candidatesToInsert.length === 0) {
            throw new Error(
              "No candidates could be extracted. Check CSV column names shown above."
            );
          }

          await Candidate.insertMany(
            candidatesToInsert
          );

          const uniqueConstituencies = new Set(
            candidatesToInsert.map(
              (candidate) =>
                candidate.constituency
            )
          );

          console.log("\n🎉 IMPORT SUCCESSFUL");
          console.log(
            `🏛️ Constituencies: ${uniqueConstituencies.size}`
          );
          console.log(
            `👤 Candidates: ${candidatesToInsert.length}`
          );

          await mongoose.disconnect();

          console.log("MongoDB disconnected");
          process.exit(0);
        } catch (error) {
          console.error(
            "❌ IMPORT ERROR:",
            error.message
          );

          await mongoose.disconnect();
          process.exit(1);
        }
      });
  } catch (error) {
    console.error(error);
  }
}

importData();