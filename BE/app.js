require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { connectDB } = require("./src/database/db.config");
const { connectDB2 } = require("./src/database/update.config");
const mainRoutes = require("./src/routes/routes");
const { init } = require("./src/services/socket.service");

const app = express();
const server = createServer(app);

// Inisialisasi Socket.IO
const io = init(server);

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Endpoint default
app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    service: "Backend Project RS-HARKIT Starter Kit with WebSocket",
  });
});

// Routes utama
app.use("/api", mainRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

// Jalankan server setelah DB terkoneksi
Promise.all([connectDB(), connectDB2()])
  .then(() => {
    console.log("✅ All Database connections established");

    const PORT = process.env.PORT || 8800;
    const HOST = process.env.HOST || "localhost";
    server.listen(PORT, HOST, () => {
      console.log(
        `🚀 Backend is Running on URL: ${HOST}:${PORT} 
        `
      );
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to database:", err);
    process.exit(1);
  });

// Ekspor app dan server jika dibutuhkan
module.exports = { app, server };
