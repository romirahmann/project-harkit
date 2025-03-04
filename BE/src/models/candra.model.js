const { getDB } = require("../database/db.config");

const getAllCandra = async () => {
  const db = getDB();
  const query = `
    SELECT 
      id,
      kode_checklist, 
      idproses, 
      nik, 
      qty_image, 
      nama_proses, 
      nama_karyawan, 
      tanggal, 
      FORMAT(mulai, 'HH:nn:ss') AS mulai_formatted, 
      FORMAT(selesai, 'HH:nn:ss') AS selesai_formatted, 
      submittedby,
      editBy
    FROM tblcandra
  `;
  const result = await db.query(query);
  return result;
};

const dataExisting = async (kode_checklist, idproses) => {
  const db = getDB();

  const query = `
    SELECT COUNT(*) as count FROM tblcandra 
    WHERE kode_checklist = '${kode_checklist}' AND idproses = '${idproses}'
  `;

  const result = await db.query(query);
  return result[0].count > 0;
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
    mulai_formatted,
    selesai_formatted,
    submittedby,
  } = data;

  const query = `
    INSERT INTO tblcandra (kode_checklist, idproses, nik, qty_image, nama_proses, nama_karyawan, tanggal, mulai, selesai, submittedby)
    VALUES ('${kode_checklist}', '${idproses}', '${nik}', ${parseInt(
    qty_image
  )}, '${nama_proses}', '${nama_karyawan}', #${
    tanggal || ""
  }#, '${mulai_formatted}', '${selesai_formatted}', '${submittedby}')
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

  if (qty_image === null) {
    qty_image = 0;
  }
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

const updateCandraByMR = async (data) => {
  const db = getDB();
  const { Kode_Checklist, totalPages } = data;
  if (totalPages === null) {
    totalPages = 0;
  }
  const query = `UPDATE tblcandra SET qty_image = ${totalPages} WHERE kode_checklist = '${Kode_Checklist}'`;
  const result = await db.query(query);
  return result;
};

const deleteCandra = async (id) => {
  const db = getDB();
  const query = `
    DELETE FROM tblcandra WHERE id = ${id}
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
  dataExisting,
  updateCandraByMR,
};
