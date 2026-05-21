const candidateService = require('../services/candidateService');

/** POST /api/candidates */
const createCandidate = async (req, res, next) => {
  try {
    const candidate = await candidateService.createCandidate(req.body, req.user.id);
    res.status(201).json({ success: true, message: 'Candidate submitted. Verification pending.', data: candidate });
  } catch (err) { next(err); }
};

/** GET /api/candidates */
const getCandidates = async (req, res, next) => {
  try {
    const candidates = await candidateService.getCandidates(req.user.id);
    res.json({ success: true, count: candidates.length, data: candidates });
  } catch (err) { next(err); }
};

/** GET /api/candidates/:id */
const getCandidateById = async (req, res, next) => {
  try {
    const result = await candidateService.getCandidateById(req.params.id, req.user.id);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

/** DELETE /api/candidates/:id */
const deleteCandidate = async (req, res, next) => {
  try {
    const result = await candidateService.deleteCandidate(req.params.id, req.user.id);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

module.exports = { createCandidate, getCandidates, getCandidateById, deleteCandidate };
