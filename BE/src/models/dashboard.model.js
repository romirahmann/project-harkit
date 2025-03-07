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

const allImage1003 = async () => {
  const db = await getDB();
  const query = `SELECT SUM(qty_image) AS total_1003 
                    FROM tblcandra 
                    WHERE idproses = '1003'`;
  const result = await db.query(query);
  return result[0].total_1003;
};
const allImage1001 = async () => {
  const db = await getDB();
  const query = `SELECT SUM(qty_image) AS total_1001 
                    FROM tblcandra 
                    WHERE idproses = '1001'`;
  const result = await db.query(query);
  return result[0].total_1001;
};
const totalDates = async () => {
  const db = await getDB();
  const query = `SELECT COUNT(*) AS total_dates 
                    FROM (SELECT DISTINCT tanggal FROM tblcandra)`;
  const result = await db.query(query);
  return result[0].total_dates;
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

const getDataRealTime = async (dataProses) => {
  const db = await getDB();
  const query = `
        SELECT t.kode_checklist, 
               SUM(IIF(t.idproses IN (${dataProses}) 
                    AND t.selesai <> #00:00:00#, 1, 0)) AS total_idproses
        FROM tblcandra AS t
        GROUP BY t.kode_checklist
        ORDER BY MIN(t.selesai) ASC
      `;
  const result = await db.query(query);
  return result;
};

const getOnProgresProses = async (kode_checklist) => {
  const db = await getDB();
  const query = `
      SELECT idproses FROM tblcandra WHERE kode_checklist = '${kode_checklist}' AND TIMEVALUE(selesai) <> #00:00:00#
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
  getDataRealTime,
  getOnProgresProses,
};
