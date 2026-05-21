const crypto = require('crypto');
const Candidate = require('../models/Candidate');
const Verification = require('../models/Verification');
const { createError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// ── Mock Gateway Helpers ─────────────────────────────────────────────────────

/**
 * Simulate UIDAI Aadhaar verification gateway.
 */
const verifyAadhaar = async (aadhaarNumber, fullName, dob) => {
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));

  const cleanAadhaar = aadhaarNumber.replace(/\s|-/g, '');
  const isNumeric = /^\d{12}$/.test(cleanAadhaar);

  if (!isNumeric) {
    return { status: 'failed', referenceId: null, message: 'Invalid Aadhaar format. Must be a 12-digit numeric code.', extractedData: null };
  }
  if (cleanAadhaar.startsWith('0000')) {
    return { status: 'failed', referenceId: crypto.randomBytes(8).toString('hex').toUpperCase(), message: 'Aadhaar Card does not exist / Authentication failed.', extractedData: null };
  }

  const nameMatch = !cleanAadhaar.endsWith('9');
  const candidateNameNorm = fullName.trim().toLowerCase();

  return {
    status: 'success',
    referenceId: 'UIDAI-' + crypto.randomBytes(6).toString('hex').toUpperCase(),
    verifiedAt: new Date(),
    message: 'Aadhaar biometric & demographic verification successful.',
    extractedData: {
      nameMatch,
      dobMatch: true,
      gender: candidateNameNorm.includes('devi') || candidateNameNorm.includes('kumari') || candidateNameNorm.includes('shrut') ? 'Female' : 'Male',
      address: '102, Silver Crest Apartments, Sector 15, Dwarka, New Delhi - 110075'
    }
  };
};

/**
 * Simulate NSDL PAN verification gateway.
 */
const verifyPAN = async (panNumber, fullName, dob) => {
  await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 500));

  const cleanPAN = panNumber.trim().toUpperCase();
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  if (!panRegex.test(cleanPAN)) {
    return { status: 'failed', referenceId: null, message: 'Invalid PAN card format. Standard format is XXXXX1234X.', extractedData: null };
  }
  if (cleanPAN.startsWith('ABCDE')) {
    return { status: 'failed', referenceId: crypto.randomBytes(8).toString('hex').toUpperCase(), message: 'PAN number not found in Income Tax records.', extractedData: null };
  }

  const nameMatch = !cleanPAN.endsWith('Z');

  return {
    status: 'success',
    referenceId: 'NSDL-' + crypto.randomBytes(6).toString('hex').toUpperCase(),
    verifiedAt: new Date(),
    message: 'PAN status verified active.',
    extractedData: { nameMatch, dobMatch: true, category: 'Individual', panStatus: 'Active' }
  };
};

// ── Service Functions ────────────────────────────────────────────────────────

/**
 * Trigger background verification for a candidate (Aadhaar + PAN).
 */
const triggerVerification = async (candidateId, userId) => {
  const candidate = await Candidate.findOne({ _id: candidateId, createdBy: userId });
  if (!candidate) throw createError(404, 'Candidate not found or unauthorized');

  const existing = await Verification.findOne({ candidateId });
  if (existing) throw createError(400, 'Verification has already been run for this candidate.');

  logger.info(`[Mock API] Calling UIDAI Aadhaar gateway for candidate ${candidateId}...`);
  logger.info(`[Mock API] Calling NSDL PAN gateway for candidate ${candidateId}...`);

  const [aadhaarRes, panRes] = await Promise.all([
    verifyAadhaar(candidate.aadhaarNumber, candidate.fullName, candidate.dob),
    verifyPAN(candidate.panNumber, candidate.fullName, candidate.dob)
  ]);

  logger.debug(`[Mock API] UIDAI →`, { status: aadhaarRes.status, ref: aadhaarRes.referenceId });
  logger.debug(`[Mock API] NSDL  →`, { status: panRes.status,    ref: panRes.referenceId });

  const aadhaarStatus = aadhaarRes.status === 'success' ? 'verified' : 'rejected';
  const panStatus     = panRes.status    === 'success' ? 'verified' : 'rejected';
  const candidateStatus = (aadhaarStatus === 'rejected' || panStatus === 'rejected') ? 'failed' : 'completed';

  const report = await Verification.create({
    candidateId,
    aadhaarStatus,
    aadhaarReferenceId: aadhaarRes.referenceId || null,
    aadhaarMessage:     aadhaarRes.message    || null,
    aadhaarExtracted:   aadhaarRes.extractedData || null,
    panStatus,
    panReferenceId: panRes.referenceId || null,
    panMessage:     panRes.message    || null,
    panExtracted:   panRes.extractedData || null,
    verificationDate: new Date()
  });

  candidate.status = candidateStatus;
  await candidate.save();

  return { candidate, report };
};

/**
 * Get the structured verification report for a candidate.
 */
const getVerificationReport = async (candidateId, userId) => {
  const candidate = await Candidate.findOne({ _id: candidateId, createdBy: userId });
  if (!candidate) throw createError(404, 'Candidate record not found or unauthorized');

  const report = await Verification.findOne({ candidateId });
  if (!report) throw createError(404, 'Verification report has not been triggered yet.');

  let overallStatus = 'PENDING';
  if (report.aadhaarStatus === 'verified' && report.panStatus === 'verified') overallStatus = 'VERIFIED';
  else if (report.aadhaarStatus === 'rejected' || report.panStatus === 'rejected') overallStatus = 'FAILED';

  return {
    candidateDetails: { id: candidate._id, fullName: candidate.fullName, email: candidate.email, dob: candidate.dob },
    aadhaarResult: {
      aadhaarNumber: candidate.aadhaarNumber,
      status: report.aadhaarStatus.toUpperCase(),
      referenceId: report.aadhaarReferenceId || 'N/A',
      gatewayMessage: report.aadhaarMessage  || 'N/A',
      extractedData:  report.aadhaarExtracted || null,
      verificationDate: report.verificationDate
    },
    panResult: {
      panNumber: candidate.panNumber,
      status: report.panStatus.toUpperCase(),
      referenceId: report.panReferenceId || 'N/A',
      gatewayMessage: report.panMessage  || 'N/A',
      extractedData:  report.panExtracted || null,
      verificationDate: report.verificationDate
    },
    overallStatus
  };
};

/**
 * Calculate dashboard statistics for a user.
 */
const getDashboardStats = async (userId) => {
  const candidates   = await Candidate.find({ createdBy: userId });
  const candidateIds = candidates.map(c => c._id);
  const reports      = await Verification.find({ candidateId: { $in: candidateIds } });

  return {
    totalSubmitted:    candidates.length,
    pendingVerification: candidates.filter(c => c.status === 'pending').length,
    totalVerified:     reports.length,
    passed:  reports.filter(r => r.aadhaarStatus === 'verified' && r.panStatus === 'verified').length,
    warning: 0,
    failed:  reports.filter(r => r.aadhaarStatus === 'rejected' || r.panStatus === 'rejected').length
  };
};

module.exports = { verifyAadhaar, verifyPAN, triggerVerification, getVerificationReport, getDashboardStats };
