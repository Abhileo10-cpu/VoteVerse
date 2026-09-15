const express = require("express");
const router = express.Router();

const Candidate = require("../models/Candidate");

// CAST GOVERNMENT VOTE
router.post("/", async (req, res) => {
  try {
    const { candidateId } = req.body;

    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: "Candidate ID is required",
      });
    }

    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    candidate.votes = (candidate.votes || 0) + 1;

    await candidate.save();

    res.status(200).json({
      success: true,
      message: "Vote cast successfully!",
    });
  } catch (error) {
    console.error("Vote error:", error);

    res.status(500).json({
      success: false,
      message: "Vote failed: " + error.message,
    });
  }
});

module.exports = router;