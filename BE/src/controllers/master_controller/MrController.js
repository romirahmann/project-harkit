const model = require("../../models/mr.model");
const api = require("../../tools/common");

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
  const {
    NoMR,
    NamaPasien,
    Tanggal,
    Qty_Image,
    Urut,
    Mulai,
    Selesai,
    rumahsakit,
    nobox,
    filePath,
  } = req.body;

  if (!nourut || !kode_checklist)
    return api.error(res, "NoUrut and Kode_Checklist are required", 400);
  if (
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
    const result = await model.updateDataMR(nourut, kode_checklist, req.body);
    if (result > 0) return api.ok(res, "DataMR successfully updated");
    return api.error(res, "Failed to update DataMR", 500);
  } catch (error) {
    console.error("❌ Error updating DataMR:", error);
    return api.error(res, "Failed to update DataMR", 500);
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

module.exports = {
  getAllDataMR,
  getDataMRByKeys,
  createDataMR,
  updateDataMR,
  deleteDataMR,
};
