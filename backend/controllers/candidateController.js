const Candidate = require('../models/Candidate');
const Verification = require('../models/Verification');

/**
 * Submit a candidate for background verification
 * ROUTE: POST /api/candidates
 */
const createCandidate = async (req, res) => {
  try {
    const { fullName, email, dob, aadhaarNumber, panNumber } = req.body;

    if (!fullName || !email || !dob || !aadhaarNumber || !panNumber) {
      return res.status(400).json({ success: false, message: 'All candidate fields are required' });
    }

    // Basic syntax formatting/masking helpers
    const formattedAadhaar = aadhaarNumber.replace(/\s|-/g, '');
    const formattedPAN = panNumber.trim().toUpperCase();

    // Create Candidate
    const candidate = await Candidate.create({
      fullName,
      email,
      dob,
      aadhaarNumber: formattedAadhaar,
      panNumber: formattedPAN,
      createdBy: req.user.id
    });

    return res.status(201).json({
      success: true,
      message: 'Candidate details submitted successfully. Verification pending.',
      data: candidate
    });
  } catch (error) {
    console.error('Create Candidate Error:', error);
    return res.status(500).json({ success: false, message: 'Server error creating candidate submission' });
  }
};

/**
 * Get all candidates submitted by current user
 * ROUTE: GET /api/candidates
 */
const getCandidates = async (req, res) => {
  try {
    // Return candidates submitted by the authenticated user, sorted by most recent
    const candidates = await Candidate.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: candidates.length,
      data: candidates
    });
  } catch (error) {
    console.error('Get Candidates Error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving candidates' });
  }
};

/**
 * Get details of a single candidate
 * ROUTE: GET /api/candidates/:id
 */
const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found or unauthorized access' });
    }

    // Fetch corresponding verification report if available
    const verificationReport = await Verification.findOne({ candidateId: candidate._id });

    return res.json({
      success: true,
      data: {
        candidate,
        report: verificationReport || null
      }
    });
  } catch (error) {
    console.error('Get Candidate Detail Error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving candidate details' });
  }
};

/**
 * Delete a candidate and associated verification report
 * ROUTE: DELETE /api/candidates/:id
 */
const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found or unauthorized access' });
    }

    // Delete associated verification reports first to prevent orphan data
    await Verification.deleteOne({ candidateId: candidate._id });

    // Delete candidate
    await candidate.deleteOne();

    return res.json({
      success: true,
      message: 'Candidate and associated verification reports successfully deleted.'
    });
  } catch (error) {
    console.error('Delete Candidate Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during candidate deletion' });
  }
};

module.exports = {
  createCandidate,
  getCandidates,
  getCandidateById,
  deleteCandidate
};
