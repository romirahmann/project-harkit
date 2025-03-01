const { getDB } = require("../database/db.config");

const getAllCandra = async () => {
  const db = getDB();
  const query = "SELECT * FROM tblcandra";
  const result = await db.query(query);
  return result;
};

const getCandraByKeys = async (kode_checklist, idproses) => {
  const db = getDB();

  const query = `
    SELECT * FROM tblcandra 
    WHERE kode_checklist = '${kode_checklist}' AND idproses = '${idproses}'
  `;

  const result = await db.query(query);
  return result.length > 0 ? result[0] : null;
};

const createCandra = async (data) => {
  const db = getDB();
  const {
    kode_checklist,
    idproses,
    nik,
    qty_image,
    nama_proses,
    nama_karyawan,
    tanggal,
    mulai,
    selesai,
    submittedby,
  } = data;

  const query = `
    INSERT INTO tblcandra (kode_checklist, idproses, nik, qty_image, nama_proses, nama_karyawan, tanggal, mulai, selesai, submittedby)
    VALUES ('${kode_checklist}', '${idproses}', '${nik}', ${qty_image}, '${nama_proses}', '${nama_karyawan}', '${tanggal}', '${mulai}', '${selesai}', '${submittedby}')
  `;

  const result = await db.query(query);
  return result.count; // ✅ Return jumlah baris yang ditambahkan
};

const updateCandra = async (kode_checklist, idproses, data) => {
  const db = getDB();
  const {
    nik,
    qty_image,
    nama_proses,
    nama_karyawan,
    tanggal,
    mulai,
    selesai,
    editby,
  } = data;

  const query = `
    UPDATE tblcandra
    SET nik = '${nik}', qty_image = ${qty_image}, nama_proses = '${nama_proses}', 
        nama_karyawan = '${nama_karyawan}', tanggal = '${tanggal}', mulai = '${mulai}', 
        selesai = '${selesai}', editby = '${editby}'
    WHERE kode_checklist = '${kode_checklist}' AND idproses = '${idproses}'
  `;

  const result = await db.query(query);
  return result.count; // ✅ Return jumlah baris yang diperbarui
};

const deleteCandra = async (kode_checklist, idproses) => {
  const db = getDB();
  const query = `
    DELETE FROM tblcandra WHERE kode_checklist = '${kode_checklist}' AND idproses = '${idproses}'
  `;

  const result = await db.query(query);
  return result.count; // ✅ Return jumlah baris yang dihapus
};

module.exports = {
  getAllCandra,
  getCandraByKeys,
  createCandra,
  updateCandra,
  deleteCandra,
};
