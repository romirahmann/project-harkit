const {
  getDBData,
  getDBQty,
  getDbRealQty,
} = require("../database/update.config");
const moment = require("moment");

const getAllCandra = async (q) => {
  const db = getDBData();

  let query = `
    SELECT 
      id,
      kode_checklist, 
      idproses, 
      nik, 
      qty_image, 
      nama_proses, 
      nama_karyawan, 
      tanggal, 
      mulai, 
      selesai
    FROM tblcandra
  `;

  if (q) {
    const safeQ = q.replace(/'/g, "''");
    query += `
      WHERE kode_checklist LIKE '${safeQ}%' 
      OR idproses LIKE '${safeQ}%' 
      OR nama_karyawan LIKE '${safeQ}%' 
      OR nama_proses LIKE '${safeQ}%'
    `;
  }

  const rows = await db.query(query);

  // Format waktu di Node.js agar lebih cepat
  return rows.map((row) => ({
    ...row,
    mulai_formatted: row.mulai ? moment(row.mulai).format("HH:mm:ss") : null,
    selesai_formatted: row.selesai
      ? moment(row.selesai).format("HH:mm:ss")
      : null,
  }));
};

const getAllDataMR = async () => {
  const db = getDBData();
  const query = `SELECT * FROM tblDataMR`;

  const result = await db.query(query);
  return result;
};
const getAllDataMR3 = async () => {
  const db = getDBData();
  const query = `SELECT * FROM tblDataMRt3`;

  const result = await db.query(query);
  return result;
};

const getQty = async () => {
  const db = getDBQty();
  const query = `
      SELECT subquery.NoMR, subquery.totalPages, Query1.[File Path] 
      FROM (
          SELECT NoMR, IIF(ISNULL(SUM(Pages)), 0, SUM(Pages)) AS totalPages
          FROM Query1 
          GROUP BY NoMR, [File Path]
      ) AS subquery
      INNER JOIN Query1 ON subquery.NoMR = Query1.NoMR
    `;

  const result = await db.query(query);
  return result;
};

const clearData = async () => {
  const db = getDbRealQty();
  let query = `DELETE FROM ExportTable;`;
  const result = await db.query(query);
  return result;
};

module.exports = {
  getAllCandra,
  getQty,
  getAllDataMR,
  getAllDataMR3,
  clearData,
};
