const odbc = require("odbc");
const fs = require("fs");

// Konfigurasi file MDB
const dbPassword = process.env.DB_PASSWORD || "adi121711";

const dbPaths = {
  data: "X:\\DBASE\\dbTemp\\dbData.mdb",
  qty: "X:\\DBASE\\dbTemp\\dbQty.mdb",
  realQty: "X:\\DBASE\\dbQty.mdb",
  kcp: "X:\\DBASE\\dbDataKcp.mdb",
  // kalau mau UNC path bisa pakai:
  // data: "\\\\192.168.9.251\\padaprima\\DBASE\\RSAB. HARAPAN KITA\\DBASE\\dbTemp\\dbData.mdb",
};

function logPath(label, filePath) {
  console.log(`\n[CHECK] ${label}`);
  console.log(`Path: ${filePath}`);
  console.log(`Exists: ${fs.existsSync(filePath)}`);
}

function buildConnStr(path, password) {
  let str = `DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=${path};Mode=Share Deny None;`;
  if (password) str += `PWD=${password};`;
  return str;
}

const dbs = {}; // simpan semua koneksi

async function connectDB2() {
  for (const [name, path] of Object.entries(dbPaths)) {
    logPath(name, path);

    if (!fs.existsSync(path)) {
      console.error(`❌ File not found: ${path}`);
      continue;
    }

    try {
      const connStr = buildConnStr(path, dbPassword);
      dbs[name] = await odbc.connect(connStr);
      console.log(`✅ Connected: ${name}`);
    } catch (err) {
      console.error(
        `❌ Failed to connect (${name}) with password:`,
        err.message
      );

      // coba ulang tanpa password
      try {
        const connStrNoPwd = buildConnStr(path, "");
        dbs[name] = await odbc.connect(connStrNoPwd);
        console.log(`⚠️ Connected without password: ${name}`);
      } catch (err2) {
        console.error(`❌ Still failed (${name}):`, err2.message);
      }
    }
  }

  console.log("\nℹ️ Connection summary:");
  Object.entries(dbs).forEach(([key, conn]) => {
    console.log(`${key}: ${conn ? "connected" : "not connected"}`);
  });
}

// ambil koneksi sesuai nama (data, qty, realQty, kcp)
function getDB(name) {
  if (!dbs[name]) {
    throw new Error(`Database "${name}" not connected`);
  }
  return dbs[name];
}

// close semua koneksi saat shutdown
async function closeAll() {
  for (const [name, conn] of Object.entries(dbs)) {
    if (conn) {
      try {
        await conn.close();
        console.log(`🔒 Closed: ${name}`);
      } catch (err) {
        console.error(`❌ Failed to close ${name}:`, err.message);
      }
    }
  }
}

module.exports = { connectDB2, getDB, closeAll };
