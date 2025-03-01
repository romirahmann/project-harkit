const { Server } = require("socket.io");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Sesuaikan dengan domain frontend
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    socket.on("message", (data) => {
      console.log(`📩 Message received: ${data}`);
      io.emit("message", data); // Broadcast ke semua client
    });

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized!");
  }
  return io;
};

module.exports = { initializeSocket, getIo };
