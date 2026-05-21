const mongoose = require('mongoose');

let connectionPromise = null;

const connectDB = async () => {
  // Reuse existing connection
  if (mongoose.connection.readyState === 1) {
    console.log('MongoDB already connected');
    return;
  }

  // Reuse in-progress connection attempt
  if (connectionPromise) {
    return connectionPromise;
  }

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('MONGO_URI environment variable is not set!');
    throw new Error('MONGO_URI is required');
  }

  console.log('Attempting to connect to MongoDB...');

  // Special configuration for MongoDB Atlas with Node.js v20+
  const isAtlas = mongoUri.includes('mongodb+srv://');
  
  const options = {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
    maxPoolSize: 10,
    retryWrites: true,
    w: 'majority'
  };

  // For MongoDB Atlas, add specific SSL/TLS options
  if (isAtlas) {
    options.tls = true;
    options.tlsAllowInvalidCertificates = false;
    options.tlsAllowInvalidHostnames = false;
  }

  connectionPromise = mongoose
    .connect(mongoUri, options)
    .then((conn) => {
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      console.log(`   Database: ${conn.connection.name}`);
      connectionPromise = null;
      return conn;
    })
    .catch((error) => {
      console.error(`❌ MongoDB connection failed: ${error.message}`);
      console.error('   Please check:');
      console.error('   1. MongoDB URI is correct');
      console.error('   2. Database user has correct permissions');
      console.error('   3. IP address is whitelisted in MongoDB Atlas (0.0.0.0/0)');
      console.error('   4. Network connection is stable');
      connectionPromise = null;
      throw error;
    });

  return connectionPromise;
};

module.exports = connectDB;
