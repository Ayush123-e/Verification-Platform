const express = require('express');
const cors = require('cors');

const authRoutes         = require('./routes/authRoutes');
const candidateRoutes    = require('./routes/candidateRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const { errorHandler }   = require('./middleware/errorHandler');

const app = express();

// ── Middleware ──────────────────────────────────────────────
// CORS configuration for production and development
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://verification-platform-kwgt.vercel.app',
  // Add your frontend Vercel URLs here
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // Allow all Vercel preview deployments and allowed origins
    if (origin.includes('.vercel.app') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow localhost in development
    if (origin.includes('localhost')) {
      return callback(null, true);
    }
    
    callback(null, true); // Allow all for now
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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
