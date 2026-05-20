const Candidate = require('../models/Candidate');
const Verification = require('../models/Verification');
const { verifyAadhaar, verifyPAN } = require('../services/mockVerificationService');

/**
 * Trigger background check verification report (mock)
 * ROUTE: POST /api/verifications/trigger/:candidateId
 */
const triggerVerification = async (req, res) => {
  try {
    const { candidateId } = req.params;

    // Find the candidate
    const candidate = await Candidate.findOne({
      _id: candidateId,
      createdBy: req.user.id
    });

    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found or unauthorized' });
    }

    // Check if verification report already exists
    let existingReport = await Verification.findOne({ candidateId });
    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: 'Verification has already been run for this candidate.',
        data: existingReport
      });
    }

    // Point 3: Call Mock External API Gateways concurrently (UIDAI + NSDL)
    console.log(`[Mock API] Calling UIDAI Aadhaar gateway for candidate ${candidateId}...`);
    console.log(`[Mock API] Calling NSDL PAN gateway for candidate ${candidateId}...`);

    const [aadhaarRes, panRes] = await Promise.all([
      verifyAadhaar(candidate.aadhaarNumber, candidate.fullName, candidate.dob),
      verifyPAN(candidate.panNumber, candidate.fullName, candidate.dob)
    ]);

    console.log(`[Mock API] UIDAI response:`, { status: aadhaarRes.status, referenceId: aadhaarRes.referenceId });
    console.log(`[Mock API] NSDL response:`,  { status: panRes.status,    referenceId: panRes.referenceId });

    // Map mock gateway results to Mongoose schema values
    const aadhaarStatus = aadhaarRes.status === 'success' ? 'verified' : 'rejected';
    const panStatus     = panRes.status    === 'success' ? 'verified' : 'rejected';

    let candidateStatus = 'completed';
    if (aadhaarStatus === 'rejected' || panStatus === 'rejected') {
      candidateStatus = 'failed';
    }

    // Save full gateway response to database
    const verificationReport = await Verification.create({
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

    // Update candidate status in DB
    candidate.status = candidateStatus;
    await candidate.save();

    return res.status(201).json({
      success: true,
      message: 'Background verification compiled successfully.',
      data: {
        candidate,
        report: verificationReport
      }
    });
  } catch (error) {
    console.error('Trigger Verification Error:', error);
    return res.status(500).json({ success: false, message: 'Server error processing candidate verification' });
  }
};


/**
 * Retrieve background report
 * ROUTE: GET /api/verifications/report/:candidateId
 */
const getVerificationReport = async (req, res) => {
  try {
    const { candidateId } = req.params;

    // Find candidate to verify ownership
    const candidate = await Candidate.findOne({
      _id: candidateId,
      createdBy: req.user.id
    });

    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate record not found or unauthorized' });
    }

    // Find report
    const report = await Verification.findOne({ candidateId });
    if (!report) {
      return res.status(404).json({ success: false, message: 'Verification report has not been triggered yet.' });
    }

    // Calculate overall status
    let overallStatus = 'PENDING';
    if (report.aadhaarStatus === 'verified' && report.panStatus === 'verified') {
      overallStatus = 'VERIFIED';
    } else if (report.aadhaarStatus === 'rejected' || report.panStatus === 'rejected') {
      overallStatus = 'FAILED';
    }

    // Point 4: Return structured professional report with full gateway metadata
    return res.json({
      success: true,
      data: {
        candidateDetails: {
          id: candidate._id,
          fullName: candidate.fullName,
          email: candidate.email,
          dob: candidate.dob
        },
        // Aadhaar (UIDAI) gateway result
        aadhaarResult: {
          aadhaarNumber:   candidate.aadhaarNumber,
          status:          report.aadhaarStatus.toUpperCase(),
          referenceId:     report.aadhaarReferenceId || 'N/A',
          gatewayMessage:  report.aadhaarMessage    || 'N/A',
          extractedData:   report.aadhaarExtracted  || null,
          verificationDate: report.verificationDate
        },
        // PAN (NSDL) gateway result
        panResult: {
          panNumber:       candidate.panNumber,
          status:          report.panStatus.toUpperCase(),
          referenceId:     report.panReferenceId || 'N/A',
          gatewayMessage:  report.panMessage    || 'N/A',
          extractedData:   report.panExtracted  || null,
          verificationDate: report.verificationDate
        },
        overallStatus
      }
    });
  } catch (error) {
    console.error('Get Verification Report Error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving verification report' });
  }
};


/**
 * Get dashboard status metrics for user
 * ROUTE: GET /api/verifications/dashboard-stats
 */
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all candidate ids belonging to user
    const candidates = await Candidate.find({ createdBy: userId });
    const candidateIds = candidates.map(c => c._id);

    // Total Candidates submitted
    const totalCandidates = candidates.length;

    // Pending candidates
    const pendingCandidates = candidates.filter(c => c.status === 'pending').length;

    // Fetch all generated verification reports for this user
    const reports = await Verification.find({ candidateId: { $in: candidateIds } });

    const totalVerified = reports.length;
    // Map to simplified status metrics
    const passedChecks = reports.filter(r => r.aadhaarStatus === 'verified' && r.panStatus === 'verified').length;
    const warningChecks = 0; // Simplified schema does not support warning status
    const failedChecks = reports.filter(r => r.aadhaarStatus === 'rejected' || r.panStatus === 'rejected').length;

    return res.json({
      success: true,
      data: {
        totalSubmitted: totalCandidates,
        pendingVerification: pendingCandidates,
        totalVerified,
        passed: passedChecks,
        warning: warningChecks,
        failed: failedChecks
      }
    });
  } catch (error) {
    console.error('Get Dashboard Stats Error:', error);
    return res.status(500).json({ success: false, message: 'Server error calculating system metrics' });
  }
};

/**
 * Standalone Aadhaar Card Mock Verification
 * ROUTE: POST /api/verifications/verify/aadhaar
 */
const verifyAadhaarEndpoint = async (req, res, next) => {
  try {
    const { candidateId, aadhaarNumber } = req.body;

    if (!candidateId || !aadhaarNumber) {
      return res.status(400).json({ success: false, message: 'candidateId and aadhaarNumber are required.' });
    }

    const candidate = await Candidate.findOne({ _id: candidateId, createdBy: req.user.id });
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found or unauthorized' });
    }

    const cleanedAadhaar = aadhaarNumber.replace(/\s|-/g, '');

    // Rule: Aadhaar valid if length = 12
    const isValidSyntax = cleanedAadhaar.length === 12 && /^\d+$/.test(cleanedAadhaar);
    if (!isValidSyntax) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Aadhaar format. Must be exactly 12 digits.'
      });
    }

    // Simulate random mock success/failure (90% success)
    const isVerified = Math.random() > 0.1;
    const aadhaarStatus = isVerified ? 'verified' : 'rejected';

    let report = await Verification.findOne({ candidateId });
    if (!report) {
      report = new Verification({ candidateId });
    }

    report.aadhaarStatus = aadhaarStatus;
    report.verificationDate = new Date();
    await report.save();

    if (aadhaarStatus === 'rejected' || report.panStatus === 'rejected') {
      candidate.status = 'failed';
    } else if (aadhaarStatus === 'verified' && report.panStatus === 'verified') {
      candidate.status = 'completed';
    }
    await candidate.save();

    return res.json({
      success: true,
      message: `Aadhaar verification check complete: status set to ${aadhaarStatus}`,
      data: {
        aadhaarStatus,
        verificationDate: report.verificationDate
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Standalone PAN Card Mock Verification
 * ROUTE: POST /api/verifications/verify/pan
 */
const verifyPanEndpoint = async (req, res, next) => {
  try {
    const { candidateId, panNumber } = req.body;

    if (!candidateId || !panNumber) {
      return res.status(400).json({ success: false, message: 'candidateId and panNumber are required.' });
    }

    const candidate = await Candidate.findOne({ _id: candidateId, createdBy: req.user.id });
    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found or unauthorized' });
    }

    const cleanedPAN = panNumber.trim().toUpperCase();

    // Rule: PAN valid if pattern = 5 letters + 4 digits + 1 letter
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const isValidSyntax = panPattern.test(cleanedPAN);

    if (!isValidSyntax) {
      return res.status(400).json({
        success: false,
        message: 'Invalid PAN format. Must match standard pattern (5 letters, 4 digits, 1 letter).'
      });
    }

    // Simulate random mock success/failure (90% success)
    const isVerified = Math.random() > 0.1;
    const panStatus = isVerified ? 'verified' : 'rejected';

    let report = await Verification.findOne({ candidateId });
    if (!report) {
      report = new Verification({ candidateId });
    }

    report.panStatus = panStatus;
    report.verificationDate = new Date();
    await report.save();

    if (report.aadhaarStatus === 'rejected' || panStatus === 'rejected') {
      candidate.status = 'failed';
    } else if (report.aadhaarStatus === 'verified' && panStatus === 'verified') {
      candidate.status = 'completed';
    }
    await candidate.save();

    return res.json({
      success: true,
      message: `PAN verification check complete: status set to ${panStatus}`,
      data: {
        panStatus,
        verificationDate: report.verificationDate
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  triggerVerification,
  getVerificationReport,
  getDashboardStats,
  verifyAadhaarEndpoint,
  verifyPanEndpoint
};
