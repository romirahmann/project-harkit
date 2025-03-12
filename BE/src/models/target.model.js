const { getDB } = require("../database/db.config");

const getAllTargets = async () => {
  const db = getDB();
  const result = await db.query("SELECT * FROM tbltarget");
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

  const query = `INSERT INTO tbltarget (nama, nilai) VALUES (?, ?)`;
  const result = await db.query(query, [nama, nilai]);

  return result.count; // ✅ Mengembalikan jumlah baris yang terpengaruh
};

const updateTarget = async (id, data) => {
  const db = getDB();
  const { nama, nilai } = data;

  const query = `UPDATE tbltarget SET nama = '${nama}', nilai = ${nilai} WHERE id = ${id}`;
  const result = await db.query(query);

  return result.count; // ✅ Mengembalikan jumlah baris yang diperbarui
};

const deleteTarget = async (id) => {
  const db = getDB();
  const query = `DELETE FROM tbltarget WHERE id = ?`;
  const result = await db.query(query, [id]);

  return result.count; // ✅ Mengembalikan jumlah baris yang dihapus
};

module.exports = {
  getAllTargets,
  getTargetById,
  createTarget,
  updateTarget,
  deleteTarget,
};
