const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const Voter = require("../models/Vote");

const router = express.Router();

/* =========================
   OTP SECURITY SETTINGS
========================= */

const OTP_EXPIRY_MINUTES = 5;
const OTP_MAX_ATTEMPTS = 5;
const OTP_RESEND_COOLDOWN_SECONDS = 60;

/* =========================
   EMAIL
========================= */

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* =========================
   LOGIN
========================= */

router.post("/login", async (req, res) => {
  try {
    const { voterId, password } = req.body;

    if (!voterId || !password) {
      return res.status(400).json({
        message: "Voter ID and password are required.",
      });
    }

    const voter = await Voter.findOne({
      voterId: voterId.trim().toUpperCase(),
    });

    if (!voter) {
      return res.status(401).json({
        message: "Invalid Voter ID or password.",
      });
    }

    const valid = await bcrypt.compare(
      password,
      voter.password
    );

    if (!valid) {
      return res.status(401).json({
        message: "Invalid Voter ID or password.",
      });
    }

    /* =========================
       OTP RESEND COOLDOWN
    ========================= */

    if (voter.lastOtpSentAt) {
      const secondsSinceLastOtp =
        (Date.now() -
          voter.lastOtpSentAt.getTime()) /
        1000;

      if (
        secondsSinceLastOtp <
        OTP_RESEND_COOLDOWN_SECONDS
      ) {
        const remainingSeconds = Math.ceil(
          OTP_RESEND_COOLDOWN_SECONDS -
            secondsSinceLastOtp
        );

        return res.status(429).json({
          message: `Please wait ${remainingSeconds} seconds before requesting another OTP.`,
        });
      }
    }

    /* =========================
       GENERATE OTP
    ========================= */

    const otp = crypto
      .randomInt(100000, 1000000)
      .toString();

    voter.otp = otp;

    voter.otpExpires = new Date(
      Date.now() +
        OTP_EXPIRY_MINUTES * 60 * 1000
    );

    voter.otpAttempts = 0;

    voter.lastOtpSentAt = new Date();

    voter.verified = false;

    await voter.save();

    /* =========================
       SEND EMAIL
    ========================= */

    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: voter.email,

      subject: "VoteVerse Verification OTP",

      text:
        `Your VoteVerse OTP is ${otp}.\n\n` +
        `This OTP is valid for ${OTP_EXPIRY_MINUTES} minutes.\n` +
        `Do not share this OTP with anyone.`,
    });

    return res.json({
      success: true,

      message: "OTP sent successfully.",

      voterId: voter.voterId,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Unable to login.",
    });
  }
});

/* =========================
   VERIFY OTP
========================= */

router.post("/verify-otp", async (req, res) => {
  try {
    const { voterId, otp } = req.body;

    if (!voterId || !otp) {
      return res.status(400).json({
        message:
          "Voter ID and OTP are required.",
      });
    }

    const voter = await Voter.findOne({
      voterId: voterId.trim().toUpperCase(),
    });

    if (!voter) {
      return res.status(404).json({
        message: "Voter not found.",
      });
    }

    /* =========================
       OTP EXISTS
    ========================= */

    if (!voter.otp || !voter.otpExpires) {
      return res.status(400).json({
        message:
          "OTP expired or unavailable.",
      });
    }

    /* =========================
       OTP EXPIRATION
    ========================= */

    if (new Date() > voter.otpExpires) {
      voter.otp = null;
      voter.otpExpires = null;
      voter.otpAttempts = 0;

      await voter.save();

      return res.status(400).json({
        message:
          "OTP expired. Please login again.",
      });
    }

    /* =========================
       MAX ATTEMPTS
    ========================= */

    if (
      voter.otpAttempts >=
      OTP_MAX_ATTEMPTS
    ) {
      voter.otp = null;
      voter.otpExpires = null;
      voter.otpAttempts = 0;

      await voter.save();

      return res.status(429).json({
        message:
          "Too many incorrect OTP attempts. Please login again.",
      });
    }

    /* =========================
       CHECK OTP
    ========================= */

    if (voter.otp !== otp.trim()) {
      voter.otpAttempts += 1;

      const attemptsRemaining =
        OTP_MAX_ATTEMPTS -
        voter.otpAttempts;

      if (
        voter.otpAttempts >=
        OTP_MAX_ATTEMPTS
      ) {
        voter.otp = null;
        voter.otpExpires = null;

        await voter.save();

        return res.status(429).json({
          message:
            "Too many incorrect OTP attempts. Please login again.",
        });
      }

      await voter.save();

      return res.status(401).json({
        message:
          `Incorrect OTP. ${attemptsRemaining} attempt(s) remaining.`,
      });
    }

    /* =========================
       VERIFIED
    ========================= */

    voter.otp = null;
    voter.otpExpires = null;
    voter.otpAttempts = 0;
    voter.lastOtpSentAt = null;
    voter.verified = true;

    await voter.save();

    /* =========================
       JWT
    ========================= */

    const token = jwt.sign(
      {
        voterId: voter.voterId,

        voterMongoId:
          voter._id.toString(),

        role: "voter",
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "2h",
      }
    );

    return res.json({
      success: true,

      message: "Login successful.",

      token,

      voter: {
        voterId: voter.voterId,

        name: voter.name,

        email: voter.email,

        constituency:
          voter.constituency,

        hasVoted:
          voter.hasVoted,

        role: "voter",
      },
    });
  } catch (error) {
    console.error("OTP ERROR:", error);

    return res.status(500).json({
      message:
        "OTP verification failed.",
    });
  }
});

/* =========================
   CURRENT USER
========================= */

router.get("/me", async (req, res) => {
  try {
    const auth =
      req.headers.authorization;

    if (
      !auth ||
      !auth.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        message:
          "Authentication required.",
      });
    }

    const token =
      auth.substring(7).trim();

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (
      decoded.role !== "voter" ||
      !decoded.voterMongoId
    ) {
      return res.status(403).json({
        message:
          "Invalid voter authentication.",
      });
    }

    const voter =
      await Voter.findById(
        decoded.voterMongoId
      ).select(
        "-password -otp -otpExpires -otpAttempts -lastOtpSentAt"
      );

    if (!voter) {
      return res.status(404).json({
        message:
          "Voter not found.",
      });
    }

    res.json({
      success: true,
      voter,
    });
  } catch (error) {
    res.status(401).json({
      message:
        "Session expired.",
    });
  }
});

module.exports = router;