require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const verificationRoutes = require('./routes/verificationRoutes');

// Initialize app
const app = express();

// Connect Database — await so it's ready before first request
connectDB().then(() => console.log('DB init complete')).catch(console.error);

app.use(cors({
  origin: [
    'https://verification-platform-xi.vercel.app',
    'http://localhost:5000',
    'http://localhost:5001'
  ],
  credentials: true
}));
app.use(express.json());

// Routes Setup
// Support both prefixed (/api/...) and non-prefixed (/...) routes to handle any Vercel proxy configuration
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/candidates', candidateRoutes);
app.use('/candidates', candidateRoutes);

app.use('/api/verifications', verificationRoutes);
app.use('/verifications', verificationRoutes);

// Health check endpoint
const healthCheck = (req, res) => {
  res.json({ status: 'ok', message: 'Background Verification Platform API is running.' });
};
app.get('/api/health', healthCheck);
app.get('/health', healthCheck);

// Debug endpoint — shows DB state and env presence (remove after testing)
const mongoose = require('mongoose');
const debugCheck = (req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    dbState: states[mongoose.connection.readyState] || 'unknown',
    readyState: mongoose.connection.readyState,
    hasMONGO_URI: !!process.env.MONGO_URI,
    NODE_ENV: process.env.NODE_ENV
  });
};
app.get('/api/debug', debugCheck);
app.get('/debug', debugCheck);

// Custom Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test' && (!process.env.VERCEL || process.env.PORT)) {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;
