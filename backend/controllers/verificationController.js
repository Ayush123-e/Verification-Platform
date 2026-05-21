const verificationService = require('../services/verificationService');

/** POST /api/verifications/trigger/:candidateId */
const triggerVerification = async (req, res, next) => {
  try {
    const result = await verificationService.triggerVerification(req.params.candidateId, req.user.id);
    res.status(201).json({ success: true, message: 'Background verification compiled successfully.', data: result });
  } catch (err) { next(err); }
};

/** GET /api/verifications/report/:candidateId */
const getVerificationReport = async (req, res, next) => {
  try {
    const report = await verificationService.getVerificationReport(req.params.candidateId, req.user.id);
    res.json({ success: true, data: report });
  } catch (err) { next(err); }
};

/** GET /api/verifications/dashboard-stats */
const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await verificationService.getDashboardStats(req.user.id);
    res.json({ success: true, data: stats });
  } catch (err) { next(err); }
};

module.exports = { triggerVerification, getVerificationReport, getDashboardStats };
