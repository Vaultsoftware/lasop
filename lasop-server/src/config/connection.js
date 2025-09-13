require('dotenv').config();
const mongoose = require('mongoose');

const connection = ({ app, port }) => {
  const dbURL = process.env.MONGO_DB;

  if (!dbURL) {
    console.error('❌ Missing MONGO_DB in .env');
    process.exit(1);
  }

  mongoose.connect(dbURL, { autoIndex: true })
    .then(() => {
      const host = "0.0.0.0"; // required for Fly.io
      const server = app.listen(port, host, () => {
        console.log(`✅ Connected to MongoDB`);
        console.log(`✅ Server running at http://${host}:${port}`);
      });

      // Graceful shutdown
      const shutdown = async (sig) => {
        console.log(`\n${sig} received. Closing server...`);
        server.close(async () => {
          await mongoose.connection.close();
          console.log('MongoDB connection closed');
          process.exit(0);
        });
      };
      ['SIGINT', 'SIGTERM'].forEach(sig => process.on(sig, () => shutdown(sig)));

      return server;
    })
    .catch((err) => {
      console.error('❌ MongoDB connection failed:', err.message);
      process.exit(1);
    });
};

module.exports = connection;
