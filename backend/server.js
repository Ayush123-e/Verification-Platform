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

// Connect Database
connectDB();

app.use(cors({
  origin: '*', 
  credentials: true
}));
app.use(express.json());

// Routes Setup
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/verifications', verificationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Background Verification Platform API is running.' });
});

// Custom Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;
