const modelBox = require("../../models/nobox.model");
const api = require("../../tools/common");

const getAllBox = async (req, res) => {
  try {
    let data = await modelBox.getAll();
    return api.ok(res, data);
  } catch (err) {
    console.log(err);
    return api.error(res, "Internal Server Error", 500);
  }
};

const getBoxById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return api.error(res, "ID is required", 400);
  }

  try {
    const data = await modelBox.getByID(id);
    if (!data) {
      return api.error(res, "BOX not found", 404);
    }
    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error getting Box by ID:", error);
    return api.error(res, "Failed to get box", 500);
  }
};
const createBox = async (req, res) => {
  const data = req.body;
  try {
    if (!data.NoMR || !data.NamaPasien || !data.Kode_Checklist || !data.NoBox)
      return api.error(res, "All Data Require!", 401);

    let result = await modelBox.insert(data);
    return api.ok(res, result);
  } catch (error) {
    console.error("❌ Error Insert:", error);
    return api.error(res, "Failed to Insert", 500);
  }
};

const updateBox = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    if (!id || !data) return api.error(res, "ID and data are required", 400);
    let result = await modelBox.update(id, data);
    return api.ok(res, result);
  } catch (error) {
    console.error("❌ Error Updated:", error);
    return api.error(res, "Failed to update", 500);
  }
};

const deleteBox = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) return api.error(res, "ID  are required", 400);
    let result = await modelBox.remove(id);
    return api.ok(res, result);
  } catch (error) {
    console.error("❌ Error Remove:", error);
    return api.error(res, "Failed to Delete", 500);
  }
};

module.exports = { getAllBox, getBoxById, updateBox, deleteBox, createBox };
