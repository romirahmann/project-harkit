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
    const backupDir = path.join(__dirname, "../../database/backupDB");
    if (!fs.existsSync(sourceFile)) {
      throw new Error(`File sumber tidak ditemukan: ${sourceFile}`);
    }

    // Buat folder backup jika belum ada
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Nama file backup dengan timestamp + random 4 char
    const timestamp = moment().format("YYYYMMDD");
    const randomChar = Math.random().toString(36).substring(2, 6);
    const backupFileName = `Backup_${path.basename(
      sourceFile,
      ".mdb"
    )}_${timestamp}_${randomChar}.mdb`;
    const backupFilePath = path.join(backupDir, backupFileName);

    // Salin file MDB ke folder backup
    fs.copyFileSync(sourceFile, backupFilePath);
  } catch (err) {
    console.error("❌ Gagal membackup database:", err.message);
    throw new Error(`Gagal membackup database: ${err.message}`);
  }
};

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filename = req.file.originalname;
    const mdbFilePath = process.env.DB_PATH;

    backupMDB(mdbFilePath);

    if (filename === "dbData.mdb") {
      let newDataCandra = await modelUpdate.getAllCandra();
      let newDataMR = await modelUpdate.getAllDataMR();
      let newDataMR3 = await modelUpdate.getAllDataMR3();

      // UPDATE DATA CANDRA
      for (const candra of newDataCandra) {
        const existing = await modelCandra.dataExisting(
          candra.kode_checklist,
          candra.idproses
        );

        if (!existing) {
          try {
            await modelCandra.createCandra(candra);
            // console.log("DATA CANDRA UPDATE SUCCESSFULLY!");
          } catch (error) {
            console.log(error);
            return api.error(res, "Failed To Update Candra!", 401);
          }
        }
      }

      // UPDATE DATA MR
      for (const dataMR of newDataMR) {
        const existing = await modelMR.dataExisting(
          dataMR.NoUrut,
          dataMR.Kode_Checklist
        );

        if (!existing) {
          try {
            await modelMR.createDataMR(dataMR);
            // console.log("DATA MR UPDATE SUCCESSFULLY!");
          } catch (error) {
            console.log(error);
            return api.error(res, "Failed To Update MR!", 401);
          }
        }
      }

      // UPDATE MRT3
      for (const dataMR3 of newDataMR3) {
        const existing = await modelMR.dataExistingT3(
          dataMR3.NoUrut,
          dataMR3.Kode_Checklist
        );

        if (!existing) {
          try {
            await modelMR.createDataMRt3(dataMR3);
            // console.log("DATA MRT3 UPDATE SUCCESSFULLY!");
          } catch (error) {
            console.log(error);
            return api.error(res, "Failed To Update MRT3!", 401);
          }
        }
      }

      return api.ok(res, "Update All Data Successfully!");
    }

    if (filename === "dbQty.mdb") {
      let newData = await modelUpdate.getQty();
      // console.log(newData);
      for (const data of newData) {
        let existing = await modelMR.dataExistingByMR(data.NoMR);
        if (existing) {
          let result = await modelMR.updateQtyMR(data);
        }
      }
      const dataQTY = await modelMR.getQtyByMR();
      // console.log(dataQTY);
      if (!dataQTY) {
        return api.error(res, "No Data on Table MR", 400);
      }

      for (const qty of dataQTY) {
        let res = await modelCandra.updateCandraByMR(qty);
      }

      return api.ok(res, "UPDATE QTY SUCCESFULLY!");
    }

    return api.error(res, "Please Upload File dbData.mdb or dbQty.mdb");
  } catch (err) {
    console.log(err);
    return api.error(res, "Internal Server Error", 500);
  }
};

module.exports = { uploadFile };
