const model = require("../../models/target.model");
const api = require("../../tools/common");

const getAllTargets = async (req, res) => {
  try {
    const data = await model.getAllTargets();
    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error getting targets:", error);
    return api.error(res, "Failed to get targets", 500);
  }
};

const getTargetById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return api.error(res, "ID is required", 400);
  }

  try {
    const data = await model.getTargetById(id);
    if (!data) {
      return api.error(res, "Target not found", 404);
    }
    return api.ok(res, data);
  } catch (error) {
    console.error("❌ Error getting target by ID:", error);
    return api.error(res, "Failed to get target", 500);
  }
};

const createTarget = async (req, res) => {
  const { nama, nilai } = req.body;

  if (!nama || !nilai) {
    return api.error(res, "All fields are required", 400);
  }

  try {
    const result = await model.createTarget({ nama, nilai });
    if (result > 0) {
      return api.ok(res, "Target successfully added");
    }
    return api.error(res, "Failed to add target", 500);
  } catch (error) {
    console.error("❌ Error creating target:", error);
    return api.error(res, "Failed to add target", 500);
  }
};

const updateTarget = async (req, res) => {
  const { id } = req.params;
  const { nama, nilai } = req.body;

  if (!id) {
    return api.error(res, "ID is required", 400);
  }
  if (!nama || !nilai) {
    return api.error(res, "All fields are required", 400);
  }

  try {
    const result = await model.updateTarget(id, { nama, nilai });
    if (result > 0) {
      return api.ok(res, "Target successfully updated");
    }
    return api.error(res, "Failed to update target", 500);
  } catch (error) {
    console.error("❌ Error updating target:", error);
    return api.error(res, "Failed to update target", 500);
  }
};

const deleteTarget = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return api.error(res, "ID is required", 400);
  }

  try {
    const result = await model.deleteTarget(id);
    if (result > 0) {
      return api.ok(res, "Target successfully deleted");
    }
    return api.error(res, "Failed to delete target", 500);
  } catch (error) {
    console.error("❌ Error deleting target:", error);
    return api.error(res, "Failed to delete target", 500);
  }
};

module.exports = {
  getAllTargets,
  getTargetById,
  createTarget,
  updateTarget,
  deleteTarget,
};
