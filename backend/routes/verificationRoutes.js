const express = require('express');
const router = express.Router();
const { 
  triggerVerification, 
  getVerificationReport, 
  getDashboardStats,
  verifyAadhaarEndpoint,
  verifyPanEndpoint
} = require('../controllers/verificationController');
const { protect } = require('../middleware/auth');

router.post('/trigger/:candidateId', protect, triggerVerification);
router.get('/report/:candidateId', protect, getVerificationReport);
router.get('/dashboard-stats', protect, getDashboardStats);

router.post('/verify/aadhaar', protect, verifyAadhaarEndpoint);
router.post('/verify/pan', protect, verifyPanEndpoint);

module.exports = router;
