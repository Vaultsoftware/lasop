// src/config/connection.js
require('dotenv').config();
const mongoose = require('mongoose');

module.exports = async function connection({
  app,
  port = Number(process.env.PORT) || 3000,
  host = '0.0.0.0', // why: Fly proxy reaches the app via all interfaces
}) {
  const uri = process.env.MONGO_DB;
  if (!uri) {
    console.error('❌ MONGO_DB is missing in .env');
    process.exit(1);
  }

  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () => {
    console.log('✅ Connected to MongoDB');
  });
  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected');
  });

  try {
    await mongoose.connect(uri, { maxPoolSize: 10 });

    const server = app.listen(port, host, () => {
      console.log(`✅ Server running at http://${host}:${port}`);
    });

    // why: graceful shutdown avoids abrupt disconnects
    const shutdown = async (sig) => {
      console.log(`\n${sig} received. Closing server...`);
      server.close(async () => {
        try {
          await mongoose.connection.close();
          console.log('✅ MongoDB connection closed');
        } finally {
          process.exit(0);
        }
      });
      setTimeout(() => process.exit(1), 10_000).unref();
    };

    ['SIGINT', 'SIGTERM'].forEach((sig) => {
      process.on(sig, () => shutdown(sig));
    });

    return server;
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
};
