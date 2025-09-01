const odbc = require("odbc");
const fs = require("fs");

// Konfigurasi file MDB
const dbPassword = process.env.DB_PASSWORD || "adi121711";

// Mapping file MDB (utama pakai drive letter, fallback UNC)
const dbPaths = {
  data: {
    primary: "X:\\DBASE\\dbTemp\\dbData.mdb",
    fallback:
      "\\\\192.168.9.251\\padaprima\\DBASE\\RSAB. HARAPAN KITA\\DBASE\\dbTemp\\dbData.mdb",
  },
  qty: {
    primary: "X:\\DBASE\\dbTemp\\dbQty.mdb",
    fallback:
      "\\\\192.168.9.251\\padaprima\\DBASE\\RSAB. HARAPAN KITA\\DBASE\\dbTemp\\dbQty.mdb",
  },
  realQty: {
    primary: "X:\\DBASE\\dbQty.mdb",
    fallback:
      "\\\\192.168.9.251\\padaprima\\DBASE\\RSAB. HARAPAN KITA\\DBASE\\dbQty.mdb",
  },
  kcp: {
    primary: "X:\\DBASE\\dbDataKcp.mdb",
    fallback:
      "\\\\192.168.9.251\\padaprima\\DBASE\\RSAB. HARAPAN KITA\\DBASE\\dbDataKcp.mdb",
  },
};

function logPath(label, filePath) {
  console.log(`[CHECK] ${label}`);
  console.log(`  Path:   ${filePath}`);
  console.log(`  Exists: ${fs.existsSync(filePath)}`);
}

function buildConnStr(path, password) {
  let str = `DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=${path};Mode=Share Deny None;`;
  if (password) str += `PWD=${password};`;
  return str;
}

const dbs = {}; // simpan semua koneksi

async function connectDB2() {
  for (const [name, { primary, fallback }] of Object.entries(dbPaths)) {
    console.log(`\n=== Connecting DB: ${name} ===`);

    // cek path utama
    logPath(`${name} (primary)`, primary);

    let pathToUse = null;
    if (fs.existsSync(primary)) {
      pathToUse = primary;
    } else if (fs.existsSync(fallback)) {
      console.warn(`⚠️ Primary path not found for ${name}, using fallback UNC`);
      logPath(`${name} (fallback)`, fallback);
      pathToUse = fallback;
    } else {
      console.error(`❌ Both primary & fallback path not found for ${name}`);
      continue;
    }

    // coba connect pakai password
    try {
      const connStr = buildConnStr(pathToUse, dbPassword);
      dbs[name] = await odbc.connect(connStr);
      console.log(`✅ Connected (${name}) with password`);
    } catch (err) {
      console.error(
        `❌ Failed to connect (${name}) with password:`,
        err.message
      );

      // coba tanpa password
      try {
        const connStrNoPwd = buildConnStr(pathToUse, "");
        dbs[name] = await odbc.connect(connStrNoPwd);
        console.log(`⚠️ Connected (${name}) WITHOUT password`);
      } catch (err2) {
        console.error(
          `❌ Still failed (${name}) even without password:`,
          err2.message
        );
      }
    }
  }

  // summary
  console.log("\nℹ️ Connection summary:");
  Object.entries(dbPaths).forEach(([key]) => {
    console.log(`- ${key}: ${dbs[key] ? "connected" : "NOT connected"}`);
  });
}

// Generic
function getDB(name) {
  if (!dbs[name]) {
    throw new Error(`Database "${name}" not connected`);
  }
  return dbs[name];
}

// Gaya lama → fungsi per DB
const getDBData = () => getDB("data");
const getDBQty = () => getDB("qty");
const getDbRealQty = () => getDB("realQty");
const getDBKcp = () => getDB("kcp");

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

module.exports = {
  connectDB2,
  getDB,
  getDBData,
  getDBQty,
  getDbRealQty,
  getDBKcp,
  closeAll,
};
