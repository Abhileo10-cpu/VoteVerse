const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });

const CollegeCandidate = require("../models/CollegeCandidate");

const candidates = [
  {
    collegeName: "VoteVerse College",
    name: "Rahul Das",
    position: "College Representative",
    department: "Computer Science",
    symbol: "🦁",
    votes: 0,
  },
  {
    collegeName: "VoteVerse College",
    name: "Priya Sen",
    position: "College Representative",
    department: "Electronics",
    symbol: "🌸",
    votes: 0,
  },
  {
    collegeName: "VoteVerse College",
    name: "Arjun Roy",
    position: "College Representative",
    department: "Mechanical",
    symbol: "🦅",
    votes: 0,
  },
  {
    collegeName: "VoteVerse College",
    name: "Sneha Das",
    position: "College Representative",
    department: "Civil",
    symbol: "🌟",
    votes: 0,
  },
  {
    collegeName: "VoteVerse College",
    name: "Aniket Ghosh",
    position: "College Representative",
    department: "Computer Science",
    symbol: "🔥",
    votes: 0,
  },
  {
    collegeName: "VoteVerse College",
    name: "Riya Chakraborty",
    position: "College Representative",
    department: "Information Technology",
    symbol: "🌺",
    votes: 0,
  },
  {
    collegeName: "VoteVerse College",
    name: "Sourav Mondal",
    position: "College Representative",
    department: "Mechanical",
    symbol: "⚡",
    votes: 0,
  },
  {
    collegeName: "VoteVerse College",
    name: "Ananya Paul",
    position: "College Representative",
    department: "Computer Science",
    symbol: "🕊️",
    votes: 0,
  },
  {
    collegeName: "VoteVerse College",
    name: "Rohan Dutta",
    position: "College Representative",
    department: "Civil",
    symbol: "🚀",
    votes: 0,
  },
  {
    collegeName: "VoteVerse College",
    name: "Madhurima Roy",
    position: "College Representative",
    department: "Electronics",
    symbol: "🌻",
    votes: 0,
  },
  {
    collegeName: "VoteVerse College",
    name: "Amit Saha",
    position: "College Representative",
    department: "Computer Science",
    symbol: "🏆",
    votes: 0,
  },
  {
    collegeName: "VoteVerse College",
    name: "Puja Ghosh",
    position: "College Representative",
    department: "Information Technology",
    symbol: "🌈",
    votes: 0,
  },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    await CollegeCandidate.deleteMany({
      collegeName: "VoteVerse College",
    });

    await CollegeCandidate.insertMany(candidates);

    console.log("12 College Candidates Added Successfully!");

    mongoose.connection.close();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });