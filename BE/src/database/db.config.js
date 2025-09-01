const odbc = require("odbc");
require("dotenv").config();
const path = require("path");

const dbDataPath = process.env.DB_PATH;

const dbPassword = process.env.DB_PASSWORD || "adi121711";

// Konfigurasi koneksi ODBC tanpa DSN
const connectionString = `DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=${dbDataPath};PWD=${dbPassword};Exclusive=0;Readonly=0;`;
let db;

async function connectDB() {
  try {
    db = await odbc.connect(connectionString);
    console.log("✅ Primary Database connected successfully!");
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
