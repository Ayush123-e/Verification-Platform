/**
 * Vercel Serverless Entry Point
 * Import the Express app and export as a serverless function.
 * Set `vercel.json` `builds` and `routes` to point here.
 */
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

// Ensure DB is connected before any request is handled
connectDB();

module.exports = app;
