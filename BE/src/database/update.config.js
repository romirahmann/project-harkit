const odbc = require("odbc");
const fs = require("fs");

// Path file database
const dbDataPath = "X:\\DBASE\\dbTemp\\dbData.mdb";
const dbQtyPath = "X:\\DBASE\\dbTemp\\dbQty.mdb";
const realQtyPath = "X:\\DBASE\\dbQty.mdb";
const dbDataKcpPath = "X:\\DBASE\\dbDataKcp.mdb";
const dbPassword = "adi121711";

function logPathInfo(label, filePath) {
  console.log(`\n[CHECK] ${label}`);
  console.log(`Path: ${filePath}`);
  console.log(`Exists: ${fs.existsSync(filePath)}`);
}

const connectionStringData = `DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=${dbDataPath};PWD=${dbPassword};Mode=Share Deny None;`;
const connectionStringQty = `DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=${dbQtyPath};PWD=${dbPassword};Mode=Share Deny None;`;
const connectionRealQty = `DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=${realQtyPath};PWD=${dbPassword};Mode=Share Deny None;`;
const connectionKCP = `DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=${dbDataKcpPath};PWD=${dbPassword};Mode=Share Deny None;`;

let dbData, dbQty, realQty, dbKcp;

async function connectDB2() {
  try {
    logPathInfo("dbData.mdb", dbDataPath);
    logPathInfo("dbQty.mdb", dbQtyPath);
    logPathInfo("realQty.mdb", realQtyPath);
    logPathInfo("dbDataKcp.mdb", dbDataKcpPath);

    dbData = await odbc.connect(connectionStringData);
    dbQty = await odbc.connect(connectionStringQty);
    realQty = await odbc.connect(connectionRealQty);
    dbKcp = await odbc.connect(connectionKCP);

    console.log("\n✅ Semua database connected successfully!");
  } catch (error) {
    console.error("\n❌ Database connection error:", error.message);
    process.exit(1);
  }
}

const getDBData = () => dbData;
const getDBQty = () => dbQty;
const getDbRealQty = () => realQty;
const getDBKcp = () => dbKcp;

module.exports = { connectDB2, getDBData, getDBQty, getDbRealQty, getDBKcp };
