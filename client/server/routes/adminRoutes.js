const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

const User = require("../models/user");
const Vote = require("../models/Vote");
const Candidate = require("../models/Candidate");

// =====================================================
// ADMIN LOGIN
// =====================================================

router.post("/login", async (req, res) => {
  try {
    const { voterId, password } = req.body;

    if (!voterId || !password) {
      return res.status(400).json({
        success: false,
        message: "Admin ID and password are required.",
      });
    }

    const admin = await User.findOne({
      voterId: voterId.trim().toUpperCase(),
      role: "admin",
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin ID or password.",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      admin.password
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin ID or password.",
      });
    }

    const token = jwt.sign(
      {
        userMongoId: admin._id.toString(),
        voterId: admin.voterId,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    return res.json({
      success: true,
      message: "Admin login successful.",
      token,
      admin: {
        id: admin.voterId,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to login as administrator.",
    });
  }
});

// =====================================================
// ADMIN AUTHENTICATION
// =====================================================

function authenticateAdmin(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Admin authentication required.",
    });
  }

  const token = auth.substring(7).trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Admin authentication token missing.",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required.",
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.error(
      "Admin authentication error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or expired admin session.",
    });
  }
}

// =====================================================
// DASHBOARD STATS
// =====================================================

router.get(
  "/stats",
  authenticateAdmin,
  async (req, res) => {
    try {
      const totalVoters =
        await User.countDocuments({
          role: "voter",
        });

      const totalVotesResult =
        await Candidate.aggregate([
          {
            $match: {
              votingType: "government",
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: "$votes",
              },
            },
          },
        ]);

      const totalVotes =
        totalVotesResult[0]?.total || 0;

      const leader =
        await Candidate.findOne({
          votingType: "government",
        }).sort({
          votes: -1,
        });

      res.json({
        success: true,
        totalVoters,
        totalVotes,
        turnout: totalVoters
          ? (
              (totalVotes / totalVoters) *
              100
            ).toFixed(1)
          : "0.0",
        leader,
      });
    } catch (err) {
      console.error(
        "Admin stats error:",
        err
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to load admin statistics.",
      });
    }
  }
);

// =====================================================
// RESET GOVERNMENT ELECTION
// =====================================================

router.post(
  "/reset-votes",
  authenticateAdmin,
  async (req, res) => {
    try {
      await Candidate.updateMany(
        {
          votingType: "government",
        },
        {
          $set: {
            votes: 0,
          },
        }
      );

      await Vote.updateMany(
        {},
        {
          $set: {
            hasVoted: false,
            verified: false,
            otp: null,
            otpExpires: null,
          },
        }
      );

      res.json({
        success: true,
        message:
          "Election reset successfully!",
      });
    } catch (err) {
      console.error(
        "Election reset error:",
        err
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to reset election.",
      });
    }
  }
);

module.exports = router;