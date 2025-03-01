const odbc = require("odbc");
require("dotenv").config();
const path = require("path");

// Path absolut ke file MDB
const dbDSN = process.env.DB_DSN;
const dbPassword = process.env.DB_PASSWORD || "";

// Konfigurasi koneksi ODBC tanpa DSN
const connectionString = `DSN=${dbDSN};PWD=${dbPassword};`;

let db;

async function connectDB() {
  try {
    db = await odbc.connect(connectionString);
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
}

const getDB = () => {
  if (!db) {
    throw new Error("Database not connected. Call connectDB() first.");
  }
  return db;
};

module.exports = { connectDB, getDB };
