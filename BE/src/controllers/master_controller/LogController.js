const moment = require("moment");
const LogModel = require("../../models/log.model");
const api = require("../../tools/common");

const getAllLog = async (req, res) => {
  const { query } = req.params;
  try {
    let result = await LogModel.getAllLog(query);
    return api.ok(res, result);
  } catch (error) {
    console.log(error);
    return api.error(res, "GET LOG FAILED", 500);
  }
};

const getByStatus = async (req, res) => {
  const { status } = req.params;
  try {
    let result = await LogModel.getByStatus(status);
    return api.ok(res, result);
  } catch (error) {
    console.log(error);
    return api.error(res, error, 500);
  }
};

const addLog = async (req, res) => {
  let newData = req.body;
  try {
    newData.createAt = moment().format("YYYY-MM-DD HH:mm:ss");
    await LogModel.create(newData);
    return api.ok(res, "Log added successfully");
  } catch (error) {
    console.log(error);
    return api.error(res, "Log added failed", 500);
  }
};

module.exports = {
  addLog,
  getAllLog,
  getByStatus,
};
