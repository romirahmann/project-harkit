const { getDB } = require("../database/db.config");

const getAllDokumen = async (q) => {
  const db = getDB();
  let query = "SELECT * FROM tbldokumen";
  if (q) {
    const safeQ = q.replace(/'/g, "''");
    query += ` WHERE kodedok LIKE '${safeQ}%' OR namadok LIKE '${safeQ}%' `;
  }
  const result = await db.query(query);
  return result;
};

const getByKode = async (kode) => {
  const db = getDB();
  const result = await db.query(
    `SELECT * FROM tbldokumen WHERE kodedok = '${kode}'`
  );
  return result.length > 0 ? result[0] : null;
};

const createDokumen = async (data) => {
  const db = getDB();
  const { kodedok, namadok, kategori } = data;

  const query = `
    INSERT INTO tbldokumen (kodedok, namadok, kategori)
    VALUES ('${kodedok}', '${namadok}', '${kategori}')
  `;

  const result = await db.query(query);
  return result.count;
};

const updateDokumen = async (kode, data) => {
  const db = getDB();
  const { namadok, kategori } = data;

  const query = `
    UPDATE tbldokumen
    SET namadok = '${namadok}', kategori = '${kategori}'
    WHERE kodedok = '${kode}'
  `;

  const result = await db.query(query);
  return result.count;
};

const deleteDokumen = async (kode) => {
  const db = getDB();

  const query = `DELETE FROM tbldokumen WHERE kodedok = '${kode}'`;

  const result = await db.query(query);
  return result.count;
};

module.exports = {
  getAllDokumen,
  getByKode,
  createDokumen,
  updateDokumen,
  deleteDokumen,
};
