const express = require('express');
const cors = require('cors');

const authRoutes         = require('./routes/authRoutes');
const candidateRoutes    = require('./routes/candidateRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const { errorHandler }   = require('./middleware/errorHandler');

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── Routes ──────────────────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/candidates',    candidateRoutes);
app.use('/api/verifications', verificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'vShield API is running.' });
});

// ── Global Error Handler ────────────────────────────────────
app.use(errorHandler);

module.exports = app;
