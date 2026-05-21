const mongoose = require('mongoose');

let connectionPromise = null;

const connectDB = async () => {
  // Reuse existing connection
  if (mongoose.connection.readyState === 1) {
    return;
  }

  // Reuse in-progress connection attempt
  if (connectionPromise) {
    return connectionPromise;
  }

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('MONGO_URI environment variable is not set!');
    return;
  }

  connectionPromise = mongoose
    .connect(mongoUri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10
      // bufferCommands: true (default) — allows queuing ops while connecting
    })
    .then((conn) => {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      connectionPromise = null;
    })
    .catch((error) => {
      console.error(`MongoDB connection failed: ${error.message}`);
      connectionPromise = null;
    });

  return connectionPromise;
};

module.exports = connectDB;
