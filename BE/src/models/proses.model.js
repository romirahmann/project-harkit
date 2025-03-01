const { getDB } = require("../database/db.config");

const getAllProses = async () => {
  const db = getDB();
  const result = await db.query("SELECT * FROM tblproses ORDER BY urutan ASC");
  return result;
};

const getProsesById = async (idproses) => {
  const db = getDB();
  const result = await db.query(
    `SELECT * FROM tblproses WHERE idproses = ${idproses}`
  );
  return result.length > 0 ? result[0] : null;
};

const createProses = async (data) => {
  const db = getDB();
  const { nama_proses, urutan, trn_date } = data;

  const safeNamaProses = nama_proses.replace(/'/g, "''"); // Escape single quotes

  const query = `INSERT INTO tblproses (nama_proses, urutan, trn_date) 
                 VALUES ('${safeNamaProses}', ${urutan}, #${trn_date}#)`;

  const result = await db.query(query);
  return result.count; // ✅ Return jumlah baris yang terpengaruh
};

const updateProses = async (idproses, data) => {
  const db = getDB();
  const { nama_proses, urutan, trn_date } = data;

  const safeNamaProses = nama_proses.replace(/'/g, "''");

  const query = `UPDATE tblproses 
                 SET nama_proses = '${safeNamaProses}', 
                     urutan = ${urutan}, 
                     trn_date = #${trn_date}# 
                 WHERE idproses = ${idproses}`;

  const result = await db.query(query);
  return result.count; // ✅ Return jumlah baris yang diperbarui
};

const deleteProses = async (idproses) => {
  const db = getDB();
  const query = `DELETE FROM tblproses WHERE idproses = ${idproses}`;
  const result = await db.query(query);
  return result.count; // ✅ Return jumlah baris yang dihapus
};

module.exports = {
  getAllProses,
  getProsesById,
  createProses,
  updateProses,
  deleteProses,
};
