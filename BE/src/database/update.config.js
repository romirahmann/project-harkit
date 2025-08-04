const odbc = require("odbc");
const path = require("path");
const fs = require("fs");

// Path langsung (tanpa path.resolve untuk UNC path)
const dbDataPath =
  "\\\\192.168.9.251\\padaprima\\DBASE\\RSAB. HARAPAN KITA\\DBASE\\dbTemp\\dbData.mdb";
const dbQtyPath =
  "\\\\192.168.9.251\\padaprima\\DBASE\\RSAB. HARAPAN KITA\\DBASE\\dbTemp\\dbQty.mdb";
const realQtyPath =
  "\\\\192.168.9.251\\padaprima\\DBASE\\RSAB. HARAPAN KITA\\DBASE\\dbQty.mdb";

const dbPassword = "adi121711";

// Fungsi untuk log detail path dan status file
function logPathInfo(label, filePath) {
  console.log(`\n[CHECK] ${label}`);
  console.log(`Path: ${filePath}`);
  console.log(`Exists: ${fs.existsSync(filePath)}`);
}

const connectionStringData = `DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=${dbDataPath};PWD=${dbPassword};`;
const connectionStringQty = `DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=${dbQtyPath};PWD=${dbPassword};`;
const connectionRealQty = `DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=${realQtyPath};PWD=${dbPassword};`;

let dbData, dbQty, realQty;

async function connectDB2() {
  try {
    // Log semua path sebelum koneksi
    logPathInfo("dbData.mdb", dbDataPath);
    logPathInfo("dbQty.mdb", dbQtyPath);
    logPathInfo("realQty.mdb", realQtyPath);

    // Coba koneksi
    dbData = await odbc.connect(connectionStringData);
    dbQty = await odbc.connect(connectionStringQty);
    realQty = await odbc.connect(connectionRealQty);

    console.log("\n✅ Semua database connected successfully!");
  } catch (error) {
    console.error("\n❌ Database connection error:");
    console.error("Message:", error.message || error);
    if (error.odbcErrors) {
      error.odbcErrors.forEach((err, i) => {
        console.error(`\n[ODBC Error ${i + 1}]`);
        console.error("State:", err.state);
        console.error("Code:", err.code);
        console.error("Message:", err.message);
      });
    }
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
      "Database realQty.mdb not connected. Call connectDB2() first."
    );
  }
  return realQty;
};

module.exports = { connectDB2, getDBData, getDBQty, getDbRealQty };
