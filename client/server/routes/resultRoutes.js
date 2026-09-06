const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");

router.get("/", async (req, res) => {
  const data = await Candidate.find().sort({
    votes: -1,
  });

  res.json(data);
});

module.exports = router;