const { getDB } = require("../database/db.config");

const getAllDataMR = async () => {
  const db = getDB();
  return await db.query(
    "SELECT NoUrut, NoMR, NamaPasien, Tanggal, Qty_Image, Kode_Checklist, Urut, Mulai, Selesai, rumahsakit,nobox,FilePath FROM tblDataMR"
  );
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
    filePath,
  } = data;

  const query = `
    INSERT INTO tblDataMR 
    (NoUrut, NoMR, NamaPasien, Tanggal, Qty_Image, Kode_Checklist, Urut, Mulai, 
     Selesai, rumahsakit, nobox, filePath) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
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
    filePath,
  ];

  const result = await db.query(query, values);
  return result.count;
};

const updateDataMR = async (NoUrut, Kode_Checklist, data) => {
  const db = getDB();
  const {
    NoMR,
    NamaPasien,
    Tanggal,
    Qty_Image,
    Urut,
    Mulai,
    Selesai,
    rumahsakit,
    nobox,
    filePath,
  } = data;

  const query = `
    UPDATE tblDataMR 
    SET NoMR = ?, NamaPasien = ?, Tanggal = ?, Qty_Image = ?, 
        Urut = ?, Mulai = ?, Selesai = ?, rumahsakit = ?, nobox = ?, filePath = ?
    WHERE NoUrut = ? AND Kode_Checklist = ?`;

  const values = [
    NoMR,
    NamaPasien,
    Tanggal,
    Qty_Image,
    Urut,
    Mulai,
    Selesai,
    rumahsakit,
    nobox,
    filePath,
    NoUrut,
    Kode_Checklist,
  ];

  const result = await db.query(query, values);
  return result.count;
};

const deleteDataMR = async (NoUrut, Kode_Checklist) => {
  const db = getDB();
  const result = await db.query(
    "DELETE FROM tblDataMR WHERE NoUrut = ? AND Kode_Checklist = ?",
    [NoUrut, Kode_Checklist]
  );
  return result.count;
};

module.exports = {
  getAllDataMR,
  getDataMRByKeys,
  createDataMR,
  updateDataMR,
  deleteDataMR,
};
