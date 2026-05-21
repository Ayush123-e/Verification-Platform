// Vercel serverless function entry point
// Note: dotenv is not needed in Vercel (env vars are auto-injected)
const app = require('../backend/app');
const connectDB = require('../backend/config/db');

// Initialize database connection
let dbConnected = false;

const initDB = async () => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
      console.log('Database connected successfully');
    } catch (err) {
      console.error('Failed to connect to MongoDB:', err.message);
      // Don't throw - let the app handle it gracefully
    }
  }
};

// Initialize on cold start
initDB();

// Export the Express app as a serverless function
module.exports = app;
