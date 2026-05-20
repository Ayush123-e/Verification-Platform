const express = require('express');
const router = express.Router();
const { createCandidate, getCandidates, getCandidateById, deleteCandidate } = require('../controllers/candidateController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createCandidate)
  .get(protect, getCandidates);

router.route('/:id')
  .get(protect, getCandidateById)
  .delete(protect, deleteCandidate);

module.exports = router;
