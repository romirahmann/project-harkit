const model = require("../../models/candra.model");
const modelProses = require("../../models/proses.model");
const api = require("../../tools/common");
const { Parser } = require("json2csv");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

const getAllCandra = async (req, res) => {
  try {
    const data = await model.getAllCandra();
    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error getting all Candra:", error);
    return api.error(res, "Failed to get Candra", 500);
  }
};
const getAllCandraDayNow = async (req, res) => {
  try {
    const data = await model.getAllByDateNow();
    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error getting all Candra:", error);
    return api.error(res, "Failed to get Candra", 500);
  }
};

const getCandraByKeys = async (req, res) => {
  let { kode_checklist, idproses } = req.params;

  // Hindari SQL Injection
  kode_checklist = kode_checklist.replace(/'/g, "''");
  idproses = idproses.replace(/'/g, "''");

  if (!kode_checklist || !idproses)
    return api.error(res, "kode_checklist and idproses are required", 400);

  try {
    const data = await model.getCandraByKeys(kode_checklist, idproses);
    if (!data) return api.error(res, "Candra data not found", 404);
    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error getting Candra by keys:", error);
    return api.error(res, "Failed to get Candra", 500);
  }
};

const createCandra = async (req, res) => {
  const {
    kode_checklist,
    idproses,
    nik,
    qty_image,
    nama_proses,
    nama_karyawan,
    tanggal,
    mulai,
    selesai,
    submittedby,
  } = req.body;

  if (
    !kode_checklist ||
    !idproses ||
    !nik ||
    !qty_image ||
    !nama_proses ||
    !nama_karyawan ||
    !tanggal ||
    !mulai ||
    !selesai ||
    !submittedby
  )
    return api.error(res, "All fields are required", 400);

  try {
    const inserted = await model.createCandra(req.body);
    return api.ok(res, { inserted }, "Candra created successfully");
  } catch (error) {
    console.error("❌ Error creating Candra:", error);
    return api.error(res, "Failed to create Candra", 500);
  }
};

const addScanCandra = async (req, res) => {
  const data = req.body;

  try {
    // Cek apakah proses ini sudah ada di tblcandra
    const existingCandra = await model.dataExisting(
      data.kode_checklist,
      data.idproses
    );
    if (existingCandra) {
      return api.error(
        res,
        `Proses ${data.idproses} dengan Kode Checklist ${data.kode_checklist} sudah ada`,
        400
      );
    }

    // Ambil informasi urutan dari tblproses berdasarkan idproses
    const dataProses = await modelProses.getProsesById(data.idproses);
    const urutanProses = parseInt(dataProses.urutan, 10);

    // Jika proses ini urutan pertama, langsung tambahkan
    if (urutanProses === 1) {
      await model.createCandraFromScan(data);
      return api.ok(res, "Candra created successfully");
    }

    // Ambil semua proses dengan urutan sebelumnya
    const prosesSebelumnya = await modelProses.getProsesByUrutan(
      urutanProses - 1
    );

    if (!prosesSebelumnya || prosesSebelumnya.length === 0) {
      return api.error(
        res,
        `Tidak ditemukan proses dengan urutan sebelumnya (${urutanProses - 1})`,
        400
      );
    }

    // Ambil semua data checklist yang berhubungan dengan proses sebelumnya
    const existingPreviousPromises = prosesSebelumnya.map((proses) =>
      model.getCandraByKeys(data.kode_checklist, proses.idproses)
    );
    const finishedPreviousList = await Promise.all(existingPreviousPromises);

    // Cek apakah semua proses sebelumnya sudah selesai
    const prosesBelumSelesai = finishedPreviousList.some((finishedPrevious) => {
      if (!finishedPrevious) return true; // Jika proses sebelumnya tidak ditemukan
      return moment(finishedPrevious.selesai).format("HH:mm:ss") === "00:00:00";
    });

    if (prosesBelumSelesai) {
      return api.error(res, "Selesaikan proses sebelumnya!", 400);
    }

    // Semua proses sebelumnya sudah selesai, tambahkan proses baru
    await model.createCandraFromScan(data);
    return api.ok(res, "Candra created successfully");
  } catch (error) {
    console.error("❌ Error creating Candra:", error);
    return api.error(res, "Failed to create Candra", 500);
  }
};

const updateCandra = async (req, res) => {
  let { kode_checklist, idproses } = req.params;
  const data = req.body;

  kode_checklist = kode_checklist.replace(/'/g, "''");
  idproses = idproses.replace(/'/g, "''");

  if (!kode_checklist || !idproses)
    return api.error(res, "kode_checklist and idproses are required", 400);

  try {
    const updated = await model.updateCandra(kode_checklist, idproses, data);
    if (!updated) return api.error(res, "Candra not found or no changes", 404);
    return api.ok(res, "Candra updated successfully");
  } catch (error) {
    console.error("❌ Error updating Candra:", error);
    return api.error(res, "Failed to update Candra", 500);
  }
};
const finishedProses = async (req, res) => {
  let { kode_checklist, idproses } = req.params;
  const data = req.body;

  kode_checklist = kode_checklist.replace(/'/g, "''");
  idproses = idproses.replace(/'/g, "''");
  console.log(kode_checklist, idproses, data);
  if (!kode_checklist || !idproses)
    return api.error(res, "kode_checklist and idproses are required", 400);

  try {
    const updated = await model.finishedProses(kode_checklist, idproses, data);
    if (!updated) return api.error(res, "Candra not found or no changes", 404);
    return api.ok(res, "Candra updated successfully");
  } catch (error) {
    console.error("❌ Error updating Candra:", error);
    return api.error(res, "Failed to update Candra", 500);
  }
};

const finishedProsesScan = async (req, res) => {
  let { kode_checklist, idproses } = req.params;
  const data = req.body;

  kode_checklist = kode_checklist.replace(/'/g, "''");
  idproses = idproses.replace(/'/g, "''");

  if (!kode_checklist || !idproses)
    return api.error(res, "kode_checklist and idproses are required", 400);
  // Menambahkan properti jam
  data.selesai_formatted = moment().format("HH:mm:ss"); // Format timestamp

  try {
    const updated = await model.finishedProsesScan(
      kode_checklist,
      idproses,
      data
    );
    if (!updated) return api.error(res, "Candra not found or no changes", 404);
    return api.ok(res, "Proses Scan selesai");
  } catch (error) {
    return api.error(res, "Failed to update proses scan", 500);
  }
};

const deleteCandra = async (req, res) => {
  let { id } = req.params;

  try {
    const deleted = await model.deleteCandra(id);
    if (!deleted) return api.error(res, "Candra not found", 404);
    return api.ok(res, { deleted }, "Candra deleted successfully");
  } catch (error) {
    console.error("❌ Error deleting Candra:", error);
    return api.error(res, "Failed to delete Candra", 500);
  }
};

const exportCsv = async (req, res) => {
  try {
    const data = await model.getAllCandra();
    if (data.length === 0) {
      return api.error(res, "Data Not Found!", 400);
    }

    // Definisikan kolom yang akan diekspor
    const fields = [
      "kode_checklist",
      "idproses",
      "nik",
      "qty_image",
      "nama_proses",
      "nama_karyawan",
      "tanggal",
      "mulai_formatted",
      "selesai_formatted",
      "submittedby",
    ];
    // Konversi data ke CSV
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);
    // Simpan CSV ke file sementara
    const filePath = path.join(__dirname, "../../exports/candra_export.csv");
    fs.writeFileSync(filePath, csv);

    // Kirim file CSV ke client
    res.download(filePath, "data_candra.csv", (err) => {
      if (err) {
        console.error("Error saat mengirim file:", err);
        res.status(500).json({ message: "Gagal mengunduh file" });
      }

      // Hapus file setelah dikirim (opsional)
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    console.error("❌ Error exporting CSV:", error);
    return api.error(res, "Failed to export CSV", 500);
  }
};

module.exports = {
  getAllCandra,
  getCandraByKeys,
  createCandra,
  updateCandra,
  deleteCandra,
  exportCsv,
  addScanCandra,
  finishedProses,
  getAllCandraDayNow,
  finishedProsesScan,
};
