const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const Candidate = require("../models/Candidate");
const Voter = require("../models/Vote");

// CAST GOVERNMENT VOTE
router.post("/", async (req, res) => {
  try {
    /* =========================
       AUTHENTICATION
    ========================= */

    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const token = auth.split(" ")[1];

    let decoded;

    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired session.",
      });
    }

    if (
      !decoded.voterMongoId ||
      decoded.role !== "voter"
    ) {
      return res.status(403).json({
        success: false,
        message: "Invalid voter authentication.",
      });
    }

    /* =========================
       FIND AUTHENTICATED VOTER
    ========================= */

    const voter = await Voter.findById(
      decoded.voterMongoId
    );

    if (!voter) {
      return res.status(401).json({
        success: false,
        message: "Voter account not found.",
      });
    }

    /* =========================
       CHECK VOTER STATUS
    ========================= */

    if (voter.hasVoted) {
      return res.status(400).json({
        success: false,
        message: "You have already voted.",
      });
    }

    /* =========================
       CANDIDATE
    ========================= */

    const { candidateId } = req.body;

    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: "Candidate ID is required.",
      });
    }

    const candidate = await Candidate.findById(
      candidateId
    );

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found.",
      });
    }

    /* =========================
       CHECK CONSTITUENCY
    ========================= */

    if (
      voter.constituency &&
      candidate.constituency &&
      voter.constituency !== candidate.constituency
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You cannot vote for a candidate outside your constituency.",
      });
    }

    /* =========================
       CAST VOTE
    ========================= */

    candidate.votes =
      (candidate.votes || 0) + 1;

    await candidate.save();

    /* =========================
       MARK VOTER AS VOTED
    ========================= */

    voter.hasVoted = true;

    await voter.save();

    res.status(200).json({
      success: true,
      message: "Vote cast successfully!",
    });

  } catch (error) {
    console.error("Vote error:", error);

    res.status(500).json({
      success: false,
      message: "Vote failed.",
    });
  }
});

module.exports = router;