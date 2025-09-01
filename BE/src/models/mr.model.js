const { getDB } = require("../database/db.config");
const { getDBKcp } = require("../database/update.config");
const moment = require("moment");

const getAllDataMR = async (q) => {
  const db = getDB();
  let query =
    "SELECT NoUrut, NoMR, NamaPasien, Tanggal, Qty_Image, Kode_Checklist, Urut, Mulai, Selesai, rumahsakit, nobox, FilePath FROM tblDataMR";

  return await db.query(query);
};

const getAllNonaktifMR = async () => {
  const db = getDB();
  const query = `SELECT NoUrut, NoMR, NamaPasien, Tanggal, Qty_Image, Kode_Checklist, Urut, Mulai, Selesai, rumahsakit, nobox, FilePath FROM tblDataMR_Doubel`;
  const result = await db.query(query);
  return result;
};

const dataExisting = async (NoUrut, Kode_Checklist) => {
  const db = getDB();

  const query = `
    SELECT COUNT(*) AS total_count FROM tblDataMR 
     WHERE NoUrut = '${NoUrut}' AND Kode_Checklist = '${Kode_Checklist}'
  `;

  const result = await db.query(query);
  return result[0].total_count > 0;
};

const getDataMRByKeys = async (NoUrut, Kode_Checklist) => {
  const db = getDB();

  // Buat query secara langsung tanpa parameterized query
  const query = `
      SELECT NoUrut, NoMR, NamaPasien, Tanggal, Qty_Image, Kode_Checklist, Urut, Mulai, Selesai, rumahsakit, nobox, FilePath
      FROM tblDataMR
      WHERE NoUrut = '${NoUrut}' AND Kode_Checklist = '${Kode_Checklist}'
    `;

  const result = await db.query(query);
  return result.length > 0 ? result[0] : null;
};

const getDataMRByChecklist = async (Kode_Checklist) => {
  const db = getDB();

  // Buat query secara langsung tanpa parameterized query
  const query = `
      SELECT NoUrut, NoMR, NamaPasien, Tanggal, Qty_Image, Kode_Checklist, Urut, Mulai, Selesai, rumahsakit, nobox, FilePath
      FROM tblDataMR
      WHERE Kode_Checklist = '${Kode_Checklist}'
    `;

  const result = await db.query(query);
  return result;
};

const createDataMR = async (data) => {
  const db = getDB();
  const {
    NoUrut,
    NoMR,
    NamaPasien,
    Tanggal,
    Qty_Image,
    Kode_Checklist,
    Urut,
    Mulai,
    Selesai,
    rumahsakit,
    nobox,
    FilePath,
  } = data;
  // // Konversi tanggal ke format Access atau NULL
  // const formattedTanggal = Tanggal ? `#${Tanggal}#` : "NULL";
  const query = `
    INSERT INTO tblDataMR 
    (NoUrut, NoMR, NamaPasien, Tanggal, Qty_Image, Kode_Checklist, Urut, Mulai, 
     Selesai, rumahsakit, nobox, filePath) 
    VALUES ('${NoUrut}', '${NoMR}', '${NamaPasien}', '${Tanggal}' , ${Qty_Image}, '${Kode_Checklist}', '${Urut}', '${Mulai}', '${Selesai}', '${rumahsakit}', '${nobox}', '${
    FilePath || ""
  }')`;

  const result = await db.query(query);
  return result;
};

const createDataMR_Double = async (data) => {
  const db = getDB();
  const {
    NoUrut,
    NoMR,
    NamaPasien,
    Tanggal,
    Qty_Image,
    Kode_Checklist,
    Urut,
    Mulai,
    Selesai,
    rumahsakit,
    nobox,
    FilePath,
  } = data;

  const query = `
    INSERT INTO tblDataMR_Doubel 
    (NoUrut, NoMR, NamaPasien, Tanggal, Qty_Image, Kode_Checklist, Urut, Mulai, 
     Selesai, rumahsakit, nobox, filePath) 
    VALUES ('${NoUrut}', '${NoMR}', '${NamaPasien}', '${Tanggal}' , ${Qty_Image}, '${Kode_Checklist}', '${Urut}', '${Mulai}', '${Selesai}', '${rumahsakit}', '${nobox}', '${FilePath}')`;

  const result = await db.query(query);
  return result;
};

const dataExistingByMR = async (NoMR) => {
  const db = getDB();

  const query = `
    SELECT COUNT(*) AS total_count FROM tblDataMR 
     WHERE NoMR = '${NoMR}' 
  `;

  const result = await db.query(query);
  return result[0].total_count > 0;
};

const updateQtyMR = async (data) => {
  const db = getDB();
  const { NoMR, totalPages, nobox } = data; // Ambil properti yang tidak ada spasi
  const filePath = data["File Path"]; // Ambil "File Path" menggunakan bracket notation

  const query = `
  UPDATE tblDataMR 
  SET Qty_Image = '${totalPages}', 
      FilePath = '${filePath}'
      
  WHERE NoMR = '${NoMR}' AND Qty_Image IS NULL
`;

  const result = await db.query(query);
  return result;
};

const getQtyByMR = async () => {
  const db = getDB();
  const query = `SELECT Kode_Checklist, SUM(Qty_Image) AS totalPages FROM tblDataMR GROUP BY Kode_Checklist;`;
  const result = await db.query(query);
  return result;
};

const updateDataMR = async (NoUrut, Kode_Checklist, data) => {
  const db = getDB();
  const { NoMR, NamaPasien, formatedTanggal, nobox } = data;

  const query = `
    UPDATE tblDataMR
    SET NoMR = '${NoMR}',
        NamaPasien = '${NamaPasien}',
        Tanggal = '${formatedTanggal}',
        nobox = '${nobox}'
    WHERE NoUrut = '${NoUrut}' AND Kode_Checklist = '${Kode_Checklist}'
  `;

  const result = await db.query(query);
  return result;
};

const deleteDataMR = async (NoUrut, Kode_Checklist) => {
  const db = getDB();
  const query = `DELETE FROM tblDataMR WHERE NoUrut = '${NoUrut}' AND Kode_Checklist = '${Kode_Checklist}'`;
  const result = await db.query(query);
  return result;
};

const deleteMRDouble = async (NoUrut, Kode_Checklist) => {
  const db = getDB();
  const query = `DELETE FROM tblDataMR_Doubel WHERE NoUrut = '${NoUrut}' AND Kode_Checklist = '${Kode_Checklist}'`;
  const result = await db.query(query);
  return result;
};

const getAllMRt3 = async () => {
  const db = getDBKcp();
  let query = `
    SELECT 
      NoUrut, NoMR, NamaPasien, Tanggal, Kode_Checklist, 
      namadokumen, Periode_Ranap
    FROM tblDataMRt3
  `;
  // if (q && q.trim() !== "") {
  //   let safeQ = q.replace(/'/g, "''");
  //   query += ` WHERE Kode_Checklist LIKE '%${safeQ}%'`;
  // }

  // // ⚠️ tanpa ORDER BY
  return db.query(query);
};

const getMRt3ByKodeChecklist = async (kode_checklist) => {
  const db = getDBKcp();
  let query = `
    SELECT NoUrut, Periode_Ranap, NoMR, NamaPasien, Tanggal, Kode_Checklist, namadokumen 
    FROM tblDataMRt3
    WHERE Kode_Checklist = '${kode_checklist}'
  `;
  const result = await db.query(query);

  // Urutkan manual di Node.js
  result.sort((a, b) => {
    const partsA = (a.NoUrut || "").split("-");
    const partsB = (b.NoUrut || "").split("-");
    const numA1 = parseInt(partsA[1] || "0", 10);
    const numB1 = parseInt(partsB[1] || "0", 10);
    const numA2 = parseInt(partsA[2] || "0", 10);
    const numB2 = parseInt(partsB[2] || "0", 10);

    return numA1 - numB1 || numA2 - numB2;
  });

  return result;
};
const getMRt3ByKodeChecklistA2 = async (kode_checklist) => {
  const db = ggetDBKcp();
  const query = `SELECT NoUrut, Periode_Ranap, NoMR, NamaPasien, Tanggal,  Kode_Checklist, namadokumen FROM tblDataMRt3_A2 WHERE Kode_Checklist = '${kode_checklist}'`;
  const result = await db.query(query);
  return result;
};
const createDataMRt3 = async (data) => {
  const db = getDBKcp();
  console.log(db);
  const {
    NoUrut,
    NoMR,
    NamaPasien,
    Tanggal,
    layanan,
    Qty_Image,
    Kode_Checklist,
    Mulai,
    Selesai,
    namadokumen,
    Periode_Ranap,
  } = data;

  const query = `
    INSERT INTO tblDataMRt3 (
      NoUrut, NoMR, NamaPasien, [Tanggal], [Layanan], Qty_Image,
      Kode_Checklist, [Mulai], [Selesai], namadokumen, Periode_Ranap
    ) VALUES (
      '${NoUrut}',
      '${NoMR}',
      '${NamaPasien}',
      '${Tanggal}',
      '${layanan || ""}',
      '${Qty_Image || ""}',
      '${Kode_Checklist}',
      '${Mulai || ""}',
      '${Selesai || ""}',
      '${namadokumen}',
      '${Periode_Ranap}'
    )
  `;

  const result = await db.query(query);
  return result;
};

const dataExistingT3 = async (NoUrut, Kode_Checklist) => {
  const db = getDBKcp();

  const escapeString = (str) => (str ? String(str).replace(/'/g, "''") : "");

  const query = `
    SELECT COUNT(*) AS total_count FROM tblDataMRt3 
    WHERE NoUrut = '${escapeString(NoUrut)}'
      AND Kode_Checklist = '${escapeString(Kode_Checklist)}'
  `;

  const result = await db.query(query);
  return result[0].total_count > 0;
};

const updateDataMRt3 = async (data) => {
  const db = getDBKcp();
  const {
    NoUrut,
    NoMR,
    NamaPasien,
    Tanggal,
    Layanan,
    Qty_Image,
    Kode_Checklist,
    Mulai,
    Selesai,
    namadokumen,
  } = data;

  const formDateToString = moment(Tanggal, "YYYY-MM-DD").format("DDMMYYYY");

  const query = `UPDATE tblDataMRt3 
  SET NoUrut = '${NoUrut}',
      NoMR = '${NoMR}', 
      NamaPasien = '${NamaPasien}', 
      Tanggal = '${formDateToString}', 
      Layanan = '${Layanan}',
      Qty_Image = '${Qty_Image}' ,
      Mulai = '${Mulai}',
      Selesai = '${Selesai}',
      namadokumen = '${namadokumen}'
  WHERE NoUrut = '${NoUrut}' AND Kode_Checklist = '${Kode_Checklist}'`;
  const result = await db.query(query);
  return result;
};

const deleteMRt3 = async (data) => {
  const db = getDBKcp();
  const { NoUrut, Kode_Checklist } = data;
  const query = `DELETE FROM tblDataMRt3 WHERE NoUrut = '${NoUrut}' AND Kode_Checklist = '${Kode_Checklist}' `;
  const result = await db.query(query);
  return result;
};

// MRt3 A2
const getAllMRt3A2 = async () => {
  const db = getDBKcp();
  const query = `SELECT NoUrut, NoMR, NamaPasien, Tanggal, Qty_Image, Kode_Checklist, Mulai, Selesai, namadokumen, Periode_Ranap FROM tblDataMRt3_A2 `;
  const result = await db.query(query);
  return result;
};

const updateDataMRt3A2 = async (data) => {
  const db = getDBKcp();
  const {
    NoUrut,
    NoMR,
    NamaPasien,
    Tanggal,
    Layanan,
    Qty_Image,
    Kode_Checklist,
    Mulai,
    Selesai,
    namadokumen,
  } = data;

  const formDateToString = moment(Tanggal, "YYYY-MM-DD").format("DDMMYYYY");

  const query = `UPDATE tblDataMRt3_A2 
  SET NoUrut = '${NoUrut}',
      NoMR = '${NoMR}', 
      NamaPasien = '${NamaPasien}', 
      Tanggal = '${formDateToString}', 
      Layanan = '${Layanan}',
      Qty_Image = '${Qty_Image}' ,
      Mulai = '${Mulai}',
      Selesai = '${Selesai}',
      namadokumen = '${namadokumen}'
  WHERE NoUrut = '${NoUrut}' AND Kode_Checklist = '${Kode_Checklist}'`;
  const result = await db.query(query);
  return result;
};

const deleteMRt3A2 = async (data) => {
  const db = getDB();
  const { NoUrut, Kode_Checklist } = data;
  const query = `DELETE FROM tblDataMRt3_A2 WHERE NoUrut = '${NoUrut}' AND Kode_Checklist = '${Kode_Checklist}' `;
  const result = await db.query(query);
  return result;
};

const deletAllRowMrt3 = async () => {
  const db = getDB();
  const query = `DELETE FROM tblDataMRt3;`;
  const result = await db.query(query);
  return result;
};

module.exports = {
  getAllDataMR,
  getDataMRByKeys,
  createDataMR,
  updateDataMR,
  deleteDataMR,
  dataExisting,
  createDataMRt3,
  dataExistingT3,
  dataExistingByMR,
  updateQtyMR,
  getQtyByMR,
  getAllMRt3,
  getMRt3ByKodeChecklist,
  deleteMRt3,
  updateDataMRt3,
  getDataMRByChecklist,
  getAllNonaktifMR,
  createDataMR_Double,
  deleteMRDouble,
  getAllMRt3A2,
  getMRt3ByKodeChecklistA2,
  updateDataMRt3A2,
  deleteMRt3A2,
  deletAllRowMrt3,
};
