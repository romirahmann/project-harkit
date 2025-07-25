const { getDB } = require("../database/db.config");

const getTotalKodeChecklist = async (date) => {
  const db = await getDB();

  const query = `SELECT COUNT(kode_checklist) AS total_kode_checklist 
                 FROM (SELECT DISTINCT kode_checklist 
                       FROM tblcandra 
                       WHERE idproses='1001' 
                       AND FORMAT(tanggal, 'yyyy-MM-dd') = '${date}')`;

  const result = await db.query(query);
  return result[0]?.total_kode_checklist || 0;
};

const totalNoMR = async (date) => {
  const db = await getDB();
  const query = `SELECT COUNT(*) AS total_NoMR 
                    FROM (SELECT DISTINCT tblDataMR.NoMR 
                        FROM tblDataMR 
                        LEFT JOIN tblcandra ON tblDataMR.Kode_Checklist = tblcandra.kode_checklist
                        WHERE tblcandra.kode_checklist IS NOT NULL AND idproses='1001'
                            AND FORMAT(tblcandra.tanggal, 'yyyy-mm-dd') = '${date}')`;
  const result = await db.query(query);
  return result[0].total_NoMR;
};

const totalNIKOnCandra = async (date) => {
  const db = await getDB();
  const query = `SELECT COUNT(*) AS total_nik 
                    FROM (SELECT DISTINCT nik 
                        FROM tblcandra 
                        WHERE FORMAT(tanggal, 'yyyy-mm-dd') = '${date}')`;
  const result = await db.query(query);
  return result[0].total_nik;
};

const totalImage = async (date) => {
  const db = await getDB();
  const query = `SELECT SUM(qty_image) AS total_qty_image 
                    FROM tblcandra 
                    WHERE tanggal = #${date}#
                    AND idproses = '1001'`;
  const result = await db.query(query);
  return result[0].total_qty_image;
};

const totalLembar = async (date) => {
  const db = await getDB();
  const query = `SELECT SUM(t2.qty_image) AS total_lembar
                             FROM tblcandra AS t1
                             INNER JOIN tblcandra AS t2 ON t1.kode_checklist = t2.kode_checklist
                             WHERE t1.tanggal = #${date}#
                             AND t1.idproses = '1001'
                             AND t2.idproses = '1003'`;
  const result = await db.query(query);

  return result[0].total_lembar;
};

const cekDate = async () => {
  const db = await getDB();
  const query = `SELECT tanggal FROM tblcandra WHERE idproses='1001'`;
  const result = await db.query(query);
  return result;
};

const allImage1003 = async (filterQuery = "") => {
  const db = await getDB();
  const query = `SELECT SUM(qty_image) AS total_1003 
                 FROM tblcandra 
                 WHERE idproses = '1003' ${filterQuery}`;
  const result = await db.query(query);
  return result[0].total_1003 || 0;
};

const allImage1001 = async (filterQuery = "") => {
  const db = await getDB();
  const query = `SELECT SUM(qty_image) AS total_1001 
                 FROM tblcandra 
                 WHERE idproses = '1001' ${filterQuery}`;
  const result = await db.query(query);
  return result[0].total_1001 || 0;
};

const totalDates = async (filterQuery = "") => {
  const db = await getDB();
  const query = `SELECT COUNT(*) AS total_dates 
                 FROM (SELECT DISTINCT tanggal 
                       FROM tblcandra 
                       WHERE 1=1 ${filterQuery}) AS subquery`;
  const result = await db.query(query);
  return result[0].total_dates || 0;
};

const totalMR = async (filterQuery = "") => {
  const db = await getDB();
  const query = `SELECT COUNT(*) AS total_MR 
               FROM tblDataMR 
               WHERE 1=1 ${filterQuery}`;

  const result = await db.query(query);
  return result[0].total_MR || 0;
};

const getAllTarget = async () => {
  const db = await getDB();
  const query = `SELECT * FROM tbltarget`;
  const result = await db.query(query);
  return result;
};

const targetImage = async () => {
  const db = await getDB();
  query = `SELECT nilai FROM tbltarget WHERE id = 3`;
  const result = await db.query(query);
  return result[0].nilai;
};

const targetHarian = async () => {
  const db = await getDB();
  const query = `SELECT nilai FROM tbltarget WHERE id = 4`;
  const result = await db.query(query);
  return result[0].nilai;
};

const getAllProses = async () => {
  const db = await getDB();
  const query = `SELECT idproses, nama_proses FROM tblproses`;
  const result = await db.query(query);
  return result;
};

// Ambil data dari tblcandra
const getCandraData = async () => {
  const db = await getDB();
  const query =
    "SELECT kode_checklist, idproses, selesai FROM tblcandra ORDER BY kode_checklist";
  return db.query(query);
};

// Ambil data dari tblproses
const getProsesData = async () => {
  const db = await getDB();
  const query =
    "SELECT idproses, nama_proses, urutan FROM tblproses ORDER BY urutan";
  return db.query(query);
};

const getQtyImage = async (idproses, month, year) => {
  const db = await getDB();

  const query = `
    SELECT tanggal, SUM(qty_image) AS total_qty
    FROM tblcandra
    WHERE idproses = '${idproses}'
      AND FORMAT(CDate(tanggal), 'mm') = '${month}'
      AND FORMAT(CDate(tanggal), 'yyyy') = '${year}'
    GROUP BY tanggal
  `;

  const result = await db.query(query);
  return result;
};
const totalLembarGrafik = async (month, year) => {
  const db = await getDB();

  const query = `
    SELECT t1.tanggal, SUM(t2.qty_image) AS total_qty
    FROM tblcandra AS t1
    INNER JOIN tblcandra AS t2 ON t1.kode_checklist = t2.kode_checklist
    WHERE t1.idproses = '1001' AND t2.idproses = '1003'
      AND FORMAT(CDate(t1.tanggal), 'mm') = '${month}'
      AND FORMAT(CDate(t1.tanggal), 'yyyy') = '${year}'
    GROUP BY t1.tanggal
  `;

  const result = await db.query(query);
  return result;
};

module.exports = {
  getTotalKodeChecklist,
  totalNoMR,
  totalNIKOnCandra,
  totalImage,
  totalLembar,
  cekDate,
  allImage1003,
  allImage1001,
  totalDates,
  targetImage,
  targetHarian,
  getAllProses,
  getCandraData,
  getProsesData,
  getAllTarget,
  getQtyImage,
  totalMR,
  totalLembarGrafik,
};
