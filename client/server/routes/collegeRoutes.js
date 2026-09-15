const express = require("express");
const router = express.Router();

const CollegeCandidate = require("../models/CollegeCandidate");
const CollegeVote = require("../models/CollegeVote");

// =====================================================
// DEFAULT COLLEGE CANDIDATES
// =====================================================

const defaultCandidates = [
  ["Rahul Das", "Computer Science", "🦁"],
  ["Priya Sen", "Electronics", "🌸"],
  ["Arjun Roy", "Mechanical", "🦅"],
  ["Sneha Das", "Civil", "🌟"],
  ["Aniket Ghosh", "Computer Science", "🔥"],
  ["Riya Chakraborty", "Information Technology", "🌺"],
  ["Sourav Mondal", "Mechanical", "⚡"],
  ["Ananya Paul", "Computer Science", "🕊️"],
  ["Rohan Dutta", "Civil", "🚀"],
  ["Madhurima Roy", "Electronics", "🌻"],
  ["Amit Saha", "Computer Science", "🏆"],
  ["Puja Ghosh", "Information Technology", "🌈"],
];

// =====================================================
// ENSURE COLLEGE CANDIDATES EXIST
// =====================================================

async function ensureCollegeCandidates() {
  const count = await CollegeCandidate.countDocuments({
    collegeName: "VoteVerse College",
  });

  if (count === 0) {
    const candidates = defaultCandidates.map(
      ([name, department, symbol]) => ({
        collegeName: "VoteVerse College",
        name,
        position: "College Representative",
        department,
        symbol,
        votes: 0,
      })
    );

    await CollegeCandidate.insertMany(candidates);

    console.log("12 College Candidates Added Automatically!");
  }
}

// =====================================================
// COLLEGE POSITIONS
// =====================================================

router.get("/positions", async (req, res) => {
  try {
    await ensureCollegeCandidates();

    const positions = await CollegeCandidate.distinct("position", {
      collegeName: "VoteVerse College",
    });

    res.json(positions.sort());
  } catch (err) {
    console.error("College positions error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to load college positions",
      error: err.message,
    });
  }
});

// =====================================================
// COLLEGE CANDIDATES
// =====================================================

router.get("/candidates/:position", async (req, res) => {
  try {
    await ensureCollegeCandidates();

    const position = decodeURIComponent(req.params.position);

    const candidates = await CollegeCandidate.find({
      collegeName: "VoteVerse College",
      position,
    }).sort({ createdAt: 1 });

    res.json(candidates);
  } catch (err) {
    console.error("College candidates error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to load candidates",
      error: err.message,
    });
  }
});

// =====================================================
// ADD COLLEGE CANDIDATE
// =====================================================

router.post("/candidate", async (req, res) => {
  try {
    const {
      collegeName,
      name,
      position,
      department,
      symbol,
    } = req.body;

    if (!collegeName || !name) {
      return res.status(400).json({
        success: false,
        message: "College name and candidate name are required",
      });
    }

    const candidate = new CollegeCandidate({
      collegeName: collegeName.trim(),
      name: name.trim(),
      position: position || "College Representative",
      department: department || "",
      symbol: symbol || "🗳️",
      votes: 0,
    });

    await candidate.save();

    res.status(201).json({
      success: true,
      candidate,
    });
  } catch (err) {
    console.error("Add college candidate error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to add candidate",
      error: err.message,
    });
  }
});

// =====================================================
// CAST COLLEGE VOTE
// =====================================================

router.post("/vote", async (req, res) => {
  try {
    const {
      candidateId,
      voterId,
      collegeId,
      collegeName,
      voterName,
    } = req.body;

    const effectiveCollegeId = String(
      collegeId || voterId || ""
    ).trim();

    if (!candidateId || !effectiveCollegeId) {
      return res.status(400).json({
        success: false,
        message: "Candidate and voter ID are required",
      });
    }

    const candidate = await CollegeCandidate.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    const cleanCollegeName = String(
      collegeName || candidate.collegeName
    ).trim();

    const existingVote = await CollegeVote.findOne({
      collegeName: cleanCollegeName,
      collegeId: effectiveCollegeId,
    });

    if (existingVote) {
      return res.status(400).json({
        success: false,
        message: "This College ID has already voted!",
      });
    }

    const cleanVoterName = String(
      voterName || effectiveCollegeId
    ).trim();

    const serialNumber =
      "VV-COL-" +
      Date.now().toString().slice(-8) +
      "-" +
      Math.floor(1000 + Math.random() * 9000);

    const vote = new CollegeVote({
      collegeName: cleanCollegeName,
      voterName: cleanVoterName,
      collegeId: effectiveCollegeId,
      candidateId: candidate._id,
      serialNumber,
    });

    await vote.save();

    candidate.votes += 1;
    await candidate.save();

    res.status(201).json({
      success: true,
      message: "Vote recorded successfully!",
      serialNumber,
      collegeName: vote.collegeName,
      voterName: vote.voterName,
      collegeId: vote.collegeId,
    });
  } catch (err) {
    console.error("College vote error:", err);

    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "This College ID has already voted!",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to record college vote",
      error: err.message,
    });
  }
});

// =====================================================
// COLLEGE LIVE RESULTS
// =====================================================

router.get("/results", async (req, res) => {
  try {
    await ensureCollegeCandidates();

    const candidates = await CollegeCandidate.find({
      collegeName: "VoteVerse College",
    }).sort({ votes: -1 });

    const totalVotes = await CollegeVote.countDocuments({
      collegeName: "VoteVerse College",
    });

    res.json({
      success: true,
      collegeName: "VoteVerse College",
      totalVotes,
      candidates,
    });
  } catch (err) {
    console.error("College results error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to load college results",
      error: err.message,
    });
  }
});

// =====================================================
// COLLEGE RESULTS BY NAME
// =====================================================

router.get("/results/:collegeName", async (req, res) => {
  try {
    const collegeName = decodeURIComponent(
      req.params.collegeName
    );

    const candidates = await CollegeCandidate.find({
      collegeName,
    }).sort({ votes: -1 });

    const totalVotes = await CollegeVote.countDocuments({
      collegeName,
    });

    res.json({
      success: true,
      collegeName,
      totalVotes,
      candidates,
    });
  } catch (err) {
    console.error("College results error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to load college results",
      error: err.message,
    });
  }
});

// =====================================================
// RESET COLLEGE ELECTION
// =====================================================

router.post("/reset-votes/:collegeName", async (req, res) => {
  try {
    const collegeName = decodeURIComponent(
      req.params.collegeName
    );

    await CollegeCandidate.updateMany(
      { collegeName },
      { $set: { votes: 0 } }
    );

    await CollegeVote.deleteMany({
      collegeName,
    });

    res.json({
      success: true,
      message: "College election has been reset successfully!",
    });
  } catch (err) {
    console.error("College reset error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to reset college election",
      error: err.message,
    });
  }
});

module.exports = router;