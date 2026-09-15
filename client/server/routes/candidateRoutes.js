const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');

// GET all government constituencies in a frontend-friendly format.
router.get('/constituencies', async (req, res) => {
  try {
    const data = await Candidate.aggregate([
      { $match: { votingType: 'government', state: 'West Bengal' } },
      { $group: { _id: { district: '$district', constituency: '$constituency' } } },
      { $project: { _id: 0, district: '$_id.district', constituency: '$_id.constituency' } },
      { $sort: { constituency: 1, district: 1 } },
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/candidates/by-constituency/:constituencyName
router.get('/by-constituency/:constituencyName', async (req, res) => {
  try {
    const constituencyName = req.params.constituencyName;
    const candidates = await Candidate.find({
      votingType: 'government',
      constituency: { $regex: new RegExp(`^${escapeRegex(constituencyName)}$`, 'i') },
    }).sort({ votes: -1, name: 1 });
    res.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ message: 'Server error fetching candidates' });
  }
});

// Backward-compatible route used by the existing VotePage.
router.get('/:constituencyName', async (req, res) => {
  try {
    const constituencyName = req.params.constituencyName;
    const candidates = await Candidate.find({
      votingType: 'government',
      constituency: { $regex: new RegExp(`^${escapeRegex(constituencyName)}$`, 'i') },
    }).sort({ votes: -1, name: 1 });
    res.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ message: 'Server error fetching candidates' });
  }
});

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = router;
