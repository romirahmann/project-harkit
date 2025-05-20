const { getDB } = require("../database/db.config");

const getAll = async () => {
  const db = getDB();
  const query = `SELECT * FROM tblBox`;
  const result = await db.query(query);
  return result;
};

const getByID = async (id) => {
  const db = getDB();
  const query = `SELECT * FROM tblBox WHERE id = ${id}`;
  const result = await db.query(query);
  return result;
};

const insert = async (data) => {
  const db = getDB();
  const query = `INSERT INTO tblBox (NoMR, NamaPasien, Kode_Checklist, NoBox) VALUES ('${data.NoMR}', '${data.NamaPasien}', '${data.Kode_Checklist}', '${data.NoBox}')`;
  const result = await db.query(query);
  return result;
};

const update = async (id, data) => {
  const db = getDB();
  const query = `UPDATE tblBox
    SET NoMR='${data.NoMR}', NamaPasien='${data.NamaPasien}', Kode_Checklist='${data.Kode_Checklist}', NoBox='${data.NoBox}' WHERE id = ${id}`;
  const result = await db.query(query);
  return result;
};

const remove = async (id) => {
  const db = getDB();
  const query = `DELETE FROM tblBox WHERE id = ${id}`;
  const result = await db.query(query);
  return result;
};

module.exports = { getAll, getByID, insert, update, remove };
