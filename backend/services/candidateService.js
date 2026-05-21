const Candidate = require('../models/Candidate');
const Verification = require('../models/Verification');
const { createError } = require('../middleware/errorHandler');

/**
 * Create a new candidate record.
 */
const createCandidate = async ({ fullName, email, dob, aadhaarNumber, panNumber }, userId) => {
  if (!fullName || !email || !dob || !aadhaarNumber || !panNumber) {
    throw createError(400, 'All candidate fields are required');
  }

  const candidate = await Candidate.create({
    fullName,
    email,
    dob,
    aadhaarNumber: aadhaarNumber.replace(/\s|-/g, ''),
    panNumber: panNumber.trim().toUpperCase(),
    createdBy: userId
  });

  return candidate;
};

/**
 * Get all candidates submitted by a user.
 */
const getCandidates = async (userId) => {
  return await Candidate.find({ createdBy: userId }).sort({ createdAt: -1 });
};

/**
 * Get a single candidate with their verification report.
 */
const getCandidateById = async (candidateId, userId) => {
  const candidate = await Candidate.findOne({ _id: candidateId, createdBy: userId });
  if (!candidate) throw createError(404, 'Candidate not found or unauthorized access');

  const report = await Verification.findOne({ candidateId: candidate._id });
  return { candidate, report: report || null };
};

/**
 * Delete a candidate and associated verification report.
 */
const deleteCandidate = async (candidateId, userId) => {
  const candidate = await Candidate.findOne({ _id: candidateId, createdBy: userId });
  if (!candidate) throw createError(404, 'Candidate not found or unauthorized access');

  await Verification.deleteOne({ candidateId: candidate._id });
  await candidate.deleteOne();

  return { message: 'Candidate and associated verification reports successfully deleted.' };
};

module.exports = { createCandidate, getCandidates, getCandidateById, deleteCandidate };
