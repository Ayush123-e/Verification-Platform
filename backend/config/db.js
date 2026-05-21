const mongoose = require('mongoose');

let connectionPromise = null;

const connectDB = async () => {
  // Reuse existing connection
  if (mongoose.connection.readyState === 1) {
    console.log('MongoDB already connected');
    return mongoose.connection;
  }

  // Reuse in-progress connection attempt
  if (connectionPromise) {
    return connectionPromise;
  }

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    const error = new Error('MONGO_URI environment variable is not set!');
    console.error('❌', error.message);
    throw error;
  }

  console.log('🔄 Attempting to connect to MongoDB...');
  console.log('   Environment:', process.env.NODE_ENV || 'development');

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
      return conn.connection;
    })
    .catch((error) => {
      console.error(`❌ MongoDB connection failed: ${error.message}`);
      console.error('   Troubleshooting:');
      console.error('   1. Check MONGO_URI environment variable');
      console.error('   2. Verify MongoDB Atlas IP whitelist (0.0.0.0/0)');
      console.error('   3. Confirm database user credentials');
      console.error('   4. Check NODE_TLS_REJECT_UNAUTHORIZED setting');
      connectionPromise = null;
      throw error;
    });

  return connectionPromise;
};

module.exports = connectDB;
