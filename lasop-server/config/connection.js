// src/config/connection.js
require('dotenv').config();
const mongoose = require('mongoose');

module.exports = async function connection({ app, port }) {
  const uri = process.env.MONGO_DB;
  if (!uri) {
    console.error('❌ MONGO_DB is missing in .env');
    process.exit(1);
  }

  // Optional tweaks
  mongoose.set('strictQuery', true);

  // Helpful logs
  mongoose.connection.on('connected', () => {
    console.log('Connected to database');
  });
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });

  try {
    await mongoose.connect(uri, {
      // Mongoose v6+ doesn’t need useNewUrlParser/useUnifiedTopology
      maxPoolSize: 10,
    });

    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

    // Graceful shutdown
    const shutdown = async (sig) => {
      console.log(`\n${sig} received. Closing server...`);
      server.close(async () => {
        try {
          await mongoose.connection.close();
          console.log('MongoDB connection closed');
        } finally {
          process.exit(0);
        }
      });
      // Failsafe
      setTimeout(() => process.exit(1), 10000).unref();
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
