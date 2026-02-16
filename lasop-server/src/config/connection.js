require("dotenv").config();
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const socketHandler = require("./socketHandler");

let io; // shared instance

const setSocket = (socketInstance) => {
  io = socketInstance;
};

const getSocket = () => io;

const connection = async ({
  app,
  port = Number(process.env.PORT) || 3000,
  host = "0.0.0.0",
}) => {
  const uri = process.env.MONGO_DB;
  if (!uri) {
    console.error("❌ MONGO_DB missing");
    process.exit(1);
  }

  mongoose.set("strictQuery", true);

  mongoose.connection.on("connected", () =>
    console.log("✅ MongoDB connected")
  );
  mongoose.connection.on("error", (err) =>
    console.error("❌ MongoDB error:", err.message)
  );

  try {
    await mongoose.connect(uri, { maxPoolSize: 10 });

    const server = http.createServer(app);

    io = new Server(server, {
      cors: { origin: "*" },
    });

    socketHandler(io);
    setSocket(io);

    server.listen(port, host, () => {
      console.log(`🚀 Server running at http://${host}:${port}`);
    });

    const shutdown = async (sig) => {
      console.log(`\n${sig} received. Shutting down...`);
      server.close(async () => {
        await mongoose.connection.close();
        process.exit(0);
      });
      setTimeout(() => process.exit(1), 10_000).unref();
    };

    ["SIGINT", "SIGTERM"].forEach((sig) =>
      process.on(sig, () => shutdown(sig))
    );

    return server;
  } catch (err) {
    console.error("❌ Startup failure:", err.message);
    process.exit(1);
  }
};

module.exports = {
  connection,
  getSocket,
};
