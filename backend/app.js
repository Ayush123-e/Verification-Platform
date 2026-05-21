const express = require('express');
const cors = require('cors');

const authRoutes         = require('./routes/authRoutes');
const candidateRoutes    = require('./routes/candidateRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const { errorHandler }   = require('./middleware/errorHandler');

const app = express();

// ── Middleware ──────────────────────────────────────────────
// Using a callback for `origin` so the server reflects back the
// requesting origin — required when credentials:true is set.
// The wildcard '*' cannot be used together with credentials.
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    // and any browser origin in development / any deployed frontend
    callback(null, origin || '*');
  },
  credentials: true
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
