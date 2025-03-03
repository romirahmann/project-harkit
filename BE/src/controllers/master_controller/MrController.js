const model = require("../../models/mr.model");
const api = require("../../tools/common");
const { Parser } = require("json2csv");
const fs = require("fs");
const path = require("path");

const getAllDataMR = async (req, res) => {
  try {
    const data = await model.getAllDataMR();
    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error getting DataMR:", error);
    return api.error(res, "Failed to get DataMR", 500);
  }
};

const getDataMRByKeys = async (req, res) => {
  let { nourut, kode_checklist } = req.params;

  nourut = nourut.replace(/'/g, "''");
  kode_checklist = kode_checklist.replace(/'/g, "''");

  if (!nourut || !kode_checklist)
    return api.error(res, "NoUrut and Kode_Checklist are required", 400);

  try {
    const data = await model.getDataMRByKeys(nourut, kode_checklist);
    if (!data) return api.error(res, "DataMR not found", 404);
    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error getting DataMR by keys:", error);
    return api.error(res, "Failed to get DataMR", 500);
  }
};

const createDataMR = async (req, res) => {
  const {
    NoUrut,
    NoMR,
    NamaPasien,
    Tanggal,
    Qty_Image,
    Kode_Checklist,
    Urut,
    Mulai,
    Selesai,
    rumahsakit,
    nobox,
    filePath,
  } = req.body;

  if (
    !NoUrut ||
    !Kode_Checklist ||
    !NoMR ||
    !NamaPasien ||
    !Tanggal ||
    !Qty_Image ||
    !Urut ||
    !Mulai ||
    !Selesai ||
    !rumahsakit ||
    !nobox ||
    !filePath
  ) {
    return api.error(res, "All fields are required", 400);
  }

  try {
    const result = await model.createDataMR(req.body);
    if (result > 0) return api.ok(res, "DataMR successfully added");
    return api.error(res, "Failed to add DataMR", 500);
  } catch (error) {
    console.error("❌ Error creating DataMR:", error);
    return api.error(res, "Failed to add DataMR", 500);
  }
};

const updateDataMR = async (req, res) => {
  const { nourut, kode_checklist } = req.params;
  const { NoMR, NamaPasien, Tanggal, nobox } = req.body;

  if (!nourut || !kode_checklist) {
    return api.error(res, "NoUrut and Kode_Checklist are required", 400);
  }

  if (!NoMR || !NamaPasien || !Tanggal || !nobox) {
    return api.error(
      res,
      "All fields (NoMR, NamaPasien, Tanggal, nobox) are required",
      400
    );
  }

  try {
    const result = await model.updateDataMR(nourut, kode_checklist, {
      NoMR,
      NamaPasien,
      Tanggal,
      nobox,
    });

    if (result > 0) {
      return api.ok(res, "Data MR successfully updated");
    }

    return api.error(res, "Failed to update Data MR", 500);
  } catch (error) {
    console.error("❌ Error updating Data MR:", error);
    return api.error(res, "An error occurred while updating Data MR", 500);
  }
};

const deleteDataMR = async (req, res) => {
  const { nourut, kode_checklist } = req.params;
  if (!nourut || !kode_checklist)
    return api.error(res, "NoUrut and Kode_Checklist are required", 400);

  try {
    const result = await model.deleteDataMR(nourut, kode_checklist);
    if (result > 0) return api.ok(res, "DataMR successfully deleted");
    return api.error(res, "Failed to delete DataMR", 500);
  } catch (error) {
    console.error("❌ Error deleting DataMR:", error);
    return api.error(res, "Failed to delete DataMR", 500);
  }
};

const exportCsv = async (req, res) => {
  try {
    const data = await model.getAllDataMR();
    if (data.length === 0) {
      return api.error(res, "Data Not Found!", 400);
    }

    // Definisikan kolom yang akan diekspor
    const fields = [
      "NoUrut",
      "NoMR",
      "Kode_Checklist",
      "NamaPasien",
      "Tanggal",
      "Qty_Image",
      "Urut",
      "Mulai",
      "Selesai",
      "nobox",
      "rumahsakit",
      "FilePath",
    ];
    // Konversi data ke CSV
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);
    // Simpan CSV ke file sementara
    const filePath = path.join(__dirname, "../../exports/candra_export.csv");
    fs.writeFileSync(filePath, csv);

    // Kirim file CSV ke client
    res.download(filePath, "data_MR.csv", (err) => {
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
  getAllDataMR,
  getDataMRByKeys,
  createDataMR,
  updateDataMR,
  deleteDataMR,
  exportCsv,
};
