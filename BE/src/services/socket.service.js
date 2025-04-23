let io;
let realtimeData = { message: "Conneted Socket Successfully!" };

function init(server) {
  io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 WebSocket client connected:", socket.id);

    // Kirim data awal
    socket.emit("update_data", realtimeData);

    // Terima perubahan dan broadcast
    socket.on("data_changed", (newData) => {
      realtimeData = newData;
      socket.broadcast.emit("update_data", realtimeData);
    });

    socket.on("disconnect", () => {
      console.log("❌ WebSocket client disconnected:", socket.id);
    });
  });

  return io;
}

function getIO() {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
}

module.exports = { init, getIO };
