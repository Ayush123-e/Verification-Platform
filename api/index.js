require('dotenv').config();
const app = require('../backend/app');
const connectDB = require('../backend/config/db');

// Connect to database for serverless function
connectDB();

module.exports = app;
