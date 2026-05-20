const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/verification_platform';
    console.log(`Connecting to database at ${mongoUri}...`);
    
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000 // Fail fast (2s) to trigger fallback
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Standard Database connection failed: ${error.message}`);
    console.log('Attempting in-memory database fallback using mongodb-memory-server...');
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const inMemoryUri = mongoServer.getUri();
      
      const conn = await mongoose.connect(inMemoryUri);
      console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
      console.log(`Connection URI: ${inMemoryUri}`);
    } catch (fallbackError) {
      console.error(`Fallback Database connection failed: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
