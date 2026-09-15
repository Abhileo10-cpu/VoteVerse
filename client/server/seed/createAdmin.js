const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/user");

const ADMIN_VOTER_ID = "ADMIN001";
const ADMIN_PASSWORD = "ChangeThisAdminPassword123!";

async function createAdmin() {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      "mongodb://127.0.0.1:27017/votingDB";

    await mongoose.connect(mongoUri);

    console.log("MongoDB connected.");

    const existingAdmin = await User.findOne({
      voterId: ADMIN_VOTER_ID,
    });

    if (existingAdmin) {
      console.log("Admin account already exists.");
      await mongoose.disconnect();
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    const admin = new User({
      name: "VoteVerse Administrator",
      voterId: ADMIN_VOTER_ID,
      password: hashedPassword,
      role: "admin",
      state: "West Bengal",
      constituency: "Administration",
      hasVoted: false,
    });

    await admin.save();

    console.log("====================================");
    console.log("ADMIN ACCOUNT CREATED SUCCESSFULLY");
    console.log("Voter ID:", ADMIN_VOTER_ID);
    console.log("Password:", ADMIN_PASSWORD);
    console.log("Role:", admin.role);
    console.log("====================================");

    await mongoose.disconnect();
  } catch (error) {
    console.error("Admin creation failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

createAdmin();