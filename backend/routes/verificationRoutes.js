const express = require('express');
const router = express.Router();
const { triggerVerification, getVerificationReport, getDashboardStats } = require('../controllers/verificationController');
const { protect } = require('../middleware/auth');

router.post('/trigger/:candidateId',  protect, triggerVerification);
router.get('/report/:candidateId',    protect, getVerificationReport);
router.get('/dashboard-stats',        protect, getDashboardStats);

module.exports = router;
