require('dotenv').config();
const app = require('../backend/app');
const connectDB = require('../backend/config/db');

// Connect to database for serverless function
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err.message);
});

// Export the Express app as a serverless function
module.exports = app;
