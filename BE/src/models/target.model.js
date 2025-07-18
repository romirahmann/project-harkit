const { getDB } = require("../database/db.config");

const getAllTargets = async (q = "") => {
  const db = getDB();

  let query = "SELECT * FROM tbltarget";

  if (q) {
    const safeQ = q.replace(/'/g, "''");
    query += ` WHERE nama LIKE '${safeQ}%' OR nilai LIKE '${safeQ}%'`;
  }

  const result = await db.query(query);
  return result;
};

const getTargetById = async (id) => {
  const db = getDB();
  const result = await db.query("SELECT * FROM tbltarget WHERE id = ?", [id]);
  return result.length > 0 ? result[0] : null;
};

const createTarget = async (data) => {
  const db = getDB();
  const { nama, nilai } = data;

  const query = `INSERT INTO tbltarget (nama, nilai) VALUES ('${nama}', ${nilai})`;
  const result = await db.query(query);

  return result;
};

const updateTarget = async (id, data) => {
  const db = getDB();
  const { nama, nilai } = data;

  const query = `UPDATE tbltarget SET nama = '${nama}', nilai = ${nilai} WHERE id = ${id}`;
  const result = await db.query(query);

  return result;
};

const deleteTarget = async (id) => {
  const db = getDB();
  const query = `DELETE FROM tbltarget WHERE id = ${id}`;
  const result = await db.query(query);

  return result;
};

module.exports = {
  getAllTargets,
  getTargetById,
  createTarget,
  updateTarget,
  deleteTarget,
};
