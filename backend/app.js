const express = require('express');
const cors = require('cors');

const authRoutes         = require('./routes/authRoutes');
const candidateRoutes    = require('./routes/candidateRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const { errorHandler }   = require('./middleware/errorHandler');

const app = express();

// ── Middleware ──────────────────────────────────────────────
// CORS configuration - Allow specific origins only
app.use(cors({
  origin: [
    "http://localhost:5173",  // Local development
    "https://vshield-frontend.vercel.app"  // Production frontend
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-JSON'],
  maxAge: 86400 // 24 hours
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── Routes ──────────────────────────────────────────────────
// Root route for Vercel deployment check
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'vShield API is running.',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      candidates: '/api/candidates',
      verifications: '/api/verifications'
    }
  });
});

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
