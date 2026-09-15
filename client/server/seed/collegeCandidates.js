const mongoose = require("mongoose");

const CollegeCandidate = require("../models/CollegeCandidate");

const candidates = [
  ["Rahul Das", "Computer Science", "??"],
  ["Priya Sen", "Electronics", "??"],
  ["Arjun Roy", "Mechanical", "??"],
  ["Sneha Das", "Civil", "??"],
  ["Aniket Ghosh", "Computer Science", "??"],
  ["Riya Chakraborty", "Information Technology", "??"],
  ["Sourav Mondal", "Mechanical", "?"],
  ["Ananya Paul", "Computer Science", "???"],
  ["Rohan Dutta", "Civil", "??"],
  ["Madhurima Roy", "Electronics", "??"],
  ["Amit Saha", "Computer Science", "??"],
  ["Puja Ghosh", "Information Technology", "??"]
];

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/votingDB";

async function seedCollegeCandidates() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB Connected Successfully");

    await CollegeCandidate.deleteMany({
      collegeName: "VoteVerse College"
    });

    const data = candidates.map(([name, department, symbol]) => ({
      collegeName: "VoteVerse College",
      name,
      position: "College Representative",
      department,
      symbol,
      votes: 0
    }));

    await CollegeCandidate.insertMany(data);

    console.log("12 College Candidates Added Successfully!");

    await mongoose.connection.close();

    console.log("MongoDB Connection Closed");
  } catch (error) {
    console.error("College candidate seed error:", error);
    process.exit(1);
  }
}

seedCollegeCandidates();
