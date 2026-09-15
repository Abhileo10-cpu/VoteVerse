const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const Constituency = require('../models/Constituency');

router.get('/', async (req, res) => {
  try {
    // Prefer the restored candidate data, which contains all 294 constituencies.
    const fromCandidates = await Candidate.aggregate([
      { $match: { votingType: 'government', state: 'West Bengal' } },
      {
        $group: {
          _id: { district: '$district', name: '$constituency' },
        },
      },
      {
        $project: {
          _id: 0,
          district: '$_id.district',
          name: '$_id.name',
        },
      },
      { $sort: { name: 1, district: 1 } },
    ]);

    if (fromCandidates.length) {
      return res.json(
        fromCandidates.map((item, index) => ({
          ...item,
          constituencyNumber: index + 1,
        }))
      );
    }

    const constituencies = await Constituency.find({})
      .sort({ constituencyNumber: 1, name: 1 })
      .lean();

    return res.json(constituencies);
  } catch (error) {
    console.error('Error fetching constituencies:', error);
    return res.status(500).json({ message: 'Failed to fetch constituencies' });
  }
});

module.exports = router;
