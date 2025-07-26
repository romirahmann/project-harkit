const odbc = require("odbc");
const path = require("path"); // Pastikan import path dengan benar

// Path absolut ke file MDB di dalam proyek
const dbDataPath = path.resolve(__dirname, "../uploads/dbData.mdb");
const dbQtyPath = path.resolve(__dirname, "../uploads/dbQty.mdb");
const realQtyPath = path.resolve(
  "\\\\192.168.9.251\\padaprima\\DBASE\\RSAB. HARAPAN KITA\\DBASE\\dbQty.mdb"
);
const dbPassword = "adi121711";

// Konfigurasi koneksi ODBC menggunakan file path
const connectionStringData = `DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=${dbDataPath};PWD=${dbPassword};`;
const connectionStringQty = `DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=${dbQtyPath};PWD=${dbPassword};`;
const connectionRealQty = `DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=${realQtyPath};PWD=${dbPassword};`;

let dbData, dbQty, realQty;

async function connectDB2() {
  try {
    dbData = await odbc.connect(connectionStringData);
    dbQty = await odbc.connect(connectionStringQty);
    realQty = await odbc.connect(connectionRealQty);
    console.log("✅ Database dbData.mdb & dbQty.mdb connected successfully!");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
}

const getDBData = () => {
  if (!dbData) {
    throw new Error(
      "Database dbData.mdb not connected. Call connectDB2() first."
    );
  }
  return dbData;
};

const getDBQty = () => {
  if (!dbQty) {
    throw new Error(
      "Database dbQty.mdb not connected. Call connectDB2() first."
    );
  }
  return dbQty;
};

const getDbRealQty = () => {
  if (!realQty) {
    throw new Error(
      "Database dbQty.mdb not connected. Call connectDB2() first."
    );
  }
  return realQty;
};

module.exports = { connectDB2, getDBData, getDBQty, getDbRealQty };
