const model = require("../../models/dokumen.model");
const api = require("../../tools/common");
const moment = require("moment");

// 🔍 GET semua dokumen
const getAllDokumen = async (req, res) => {
  try {
    const data = await model.getAllDokumen();
    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error getting all dokumen:", error);
    return api.error(res, "Failed to get dokumen", 500);
  }
};

// 🔍 GET dokumen by query (search by nama_karyawan or nik)
const getFilterDokumen = async (req, res) => {
  let { query } = req.params;

  try {
    const data = await model.getAllDokumen(query);
    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error filtering dokumen:", error);
    return api.error(res, "Failed to filter dokumen", 500);
  }
};

// 🔍 GET dokumen by kode
const getDokumenByKode = async (req, res) => {
  let { kodedok } = req.params;

  if (!kodedok) return api.error(res, "Kode dokumen diperlukan", 400);

  try {
    const data = await model.getByKode(kodedok);
    if (!data) return api.error(res, "Dokumen tidak ditemukan", 404);

    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error getting dokumen by kode:", error);
    return api.error(res, "Failed to get dokumen", 500);
  }
};

// 🆕 CREATE dokumen
const createDokumen = async (req, res) => {
  const { kodedok, namadok, kategori } = req.body;

  if (!kodedok || !namadok) {
    return api.error(res, "Field Kodedok dan namadok harus diisi", 400);
  }

  try {
    // Cek apakah sudah ada
    const existing = await model.getByKode(kodedok);
    if (existing) {
      return api.error(res, `Dokumen dengan kode '${kodedok}' sudah ada`, 400);
    }

    const created = await model.createDokumen({
      kodedok,
      namadok,
      kategori,
    });

    return api.ok(res, { created });
  } catch (error) {
    console.error("❌ Error creating dokumen:", error);
    return api.error(res, "Gagal membuat dokumen", 500);
  }
};

// ✏️ UPDATE dokumen
const updateDokumen = async (req, res) => {
  const { kodedok } = req.params;
  const { namadok, kategori } = req.body;

  if (!kodedok || !namadok) {
    return api.error(res, "Filed kodedok dan namadok harus di isi", 400);
  }

  try {
    const updated = await model.updateDokumen(kodedok, { namadok, kategori });

    if (!updated) return api.error(res, "Dokumen tidak ditemukan", 404);

    return api.ok(res, "Dokumen berhasil diupdate");
  } catch (error) {
    console.error("❌ Error updating dokumen:", error);
    return api.error(res, "Gagal mengupdate dokumen", 500);
  }
};

// ❌ DELETE dokumen
const deleteDokumen = async (req, res) => {
  const { kodedok } = req.params;

  if (!kodedok) return api.error(res, "Kode dokumen diperlukan", 400);

  try {
    const deleted = await model.deleteDokumen(kodedok);
    if (!deleted) return api.error(res, "Dokumen tidak ditemukan", 404);

    return api.ok(res, { deleted }, "Dokumen berhasil dihapus");
  } catch (error) {
    console.error("❌ Error deleting dokumen:", error);
    return api.error(res, "Gagal menghapus dokumen", 500);
  }
};

module.exports = {
  getAllDokumen,
  getFilterDokumen,
  getDokumenByKode,
  createDokumen,
  updateDokumen,
  deleteDokumen,
};
