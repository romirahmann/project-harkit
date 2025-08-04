const api = require("../../tools/common");
const modelUpdate = require("../../models/update.model");
const modelCandra = require("../../models/candra.model");
const modelMR = require("../../models/mr.model");
const moment = require("moment");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Fungsi backup file MDB
const backupMDB = (sourceFile) => {
  try {
    const backupDir = path.join("X:\\DBASE\\dbBackup");
    if (!fs.existsSync(sourceFile)) {
      throw new Error(`File sumber tidak ditemukan: ${sourceFile}`);
    }

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = moment().format("YYYYMMDD");
    const randomChar = Math.random().toString(36).substring(2, 6);
    const backupFileName = `Backup_${path.basename(
      sourceFile,
      ".mdb"
    )}_${timestamp}_${randomChar}.mdb`;
    const backupFilePath = path.join(backupDir, backupFileName);

    fs.copyFileSync(sourceFile, backupFilePath);
  } catch (err) {
    console.error("❌ Gagal membackup database:", err.message);
    throw new Error(`Gagal membackup database: ${err.message}`);
  }
};

// Fungsi bantu: jalankan async dalam batch paralel
const runInBatches = async (dataArray, batchSize, callback) => {
  for (let i = 0; i < dataArray.length; i += batchSize) {
    const batch = dataArray.slice(i, i + batchSize);
    await Promise.all(batch.map(callback));
  }
};

// Modular update CANDRA
const updateCandra = async (data) => {
  console.log("PROSES UPLOAD CANDRA");
  const inserted = [];

  await runInBatches(data, 25, async (candra) => {
    const existing = await modelCandra.dataExisting(
      candra.kode_checklist,
      candra.idproses
    );
    if (!existing) {
      await modelCandra.createCandra(candra);
      inserted.push(candra);
    }
  });

  console.log("✅ DATA CANDRA UPDATED:", inserted.length);
  return inserted;
};

// Modular update MR
const updateMR = async (data) => {
  console.log("PROSES UPLOAD MR");
  const inserted = [];

  await runInBatches(data, 25, async (mr) => {
    const existing = await modelMR.dataExisting(mr.NoUrut, mr.Kode_Checklist);
    if (!existing) {
      await modelMR.createDataMR(mr);
      inserted.push(mr);
    }
  });

  console.log("✅ DATA MR UPDATED:", inserted.length);
  return inserted;
};

// Modular update MR3
const updateMR3 = async (data) => {
  console.log("PROSES UPLOAD MRT3");

  await modelMR.deletAllRowMrt3();
  const inserted = [];

  await runInBatches(data, 25, async (mr3) => {
    await modelMR.createDataMRt3(mr3);
    inserted.push(mr3);
  });

  console.log("✅ DATA MR3 UPDATED:", inserted.length);
  return inserted;
};

// Main uploadFile
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filename = req.file.originalname;
    const mdbFilePath = process.env.DB_PATH;

    backupMDB(mdbFilePath);

    // === Proses file dbData.mdb ===
    if (filename === "dbData.mdb") {
      const [dataCandra, dataMR, dataMR3] = await Promise.all([
        modelUpdate.getAllCandra(),
        modelUpdate.getAllDataMR(),
        modelUpdate.getAllDataMR3(),
      ]);

      const [insertedCandra, insertedMR, insertedMR3] = await Promise.all([
        updateCandra(dataCandra),
        updateMR(dataMR),
        updateMR3(dataMR3),
      ]);

      return api.ok(res, {
        inserted: {
          candra: insertedCandra,
          mr: insertedMR,
          mr3: insertedMR3,
        },
      });
    }

    // === Proses file dbQty.mdb ===
    if (filename === "dbQty.mdb") {
      const newData = await modelUpdate.getQty();

      await runInBatches(newData, 20, async (data) => {
        const existing = await modelMR.dataExistingByMR(data.NoMR);
        if (existing) {
          await modelMR.updateQtyMR(data);
        }
      });

      const dataQTY = await modelMR.getQtyByMR();
      if (!dataQTY) {
        return api.error(res, "No Data on Table MR", 400);
      }

      await runInBatches(dataQTY, 20, async (qty) => {
        await modelCandra.updateCandraByMR(qty);
      });

      return api.ok(res, "UPDATE QTY SUCCESSFULLY!");
    }

    // Jika bukan file yang valid
    // await modelUpdate.clearData();
    return api.error(res, "Please Upload File dbData.mdb or dbQty.mdb");
  } catch (err) {
    console.error("❌ Internal Error:", err);
    return api.error(res, "Internal Server Error", 500);
  }
};

module.exports = { uploadFile };
