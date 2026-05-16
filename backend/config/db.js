const mongoose = require('mongoose');

/** Reuse connection across serverless invocations (Vercel). */
const globalCache = global;

if (!globalCache.__mongoose) {
  globalCache.__mongoose = { conn: null, promise: null };
}

const cache = globalCache.__mongoose;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not set');
  }

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        maxPoolSize: 10,
      })
      .then((mongooseInstance) => {
        console.log(`MongoDB Connected: ${mongooseInstance.connection.host}`);
        return mongooseInstance;
      })
      .catch((error) => {
        cache.promise = null;
        console.error(`MongoDB Connection Error: ${error.message}`);
        throw error;
      });
  }

  cache.conn = await cache.promise;
  return cache.conn;
};

module.exports = connectDB;
