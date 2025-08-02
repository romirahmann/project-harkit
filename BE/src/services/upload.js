const multer = require("multer");
const path = require("path");

// Validasi ekstensi file (hanya MDB yang boleh di-upload)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".mdb"];
  const fileExt = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(fileExt)) {
    return cb(
      new Error("File format not allowed. Only MDB files are accepted."),
      false
    );
  }
  cb(null, true);
};

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      path.join(
        "\\\\192.168.9.251\\padaprima\\DBASE\\RSAB. HARAPAN KITA\\DBASE\\dbTemp"
      )
    ); // Simpan di folder uploads
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter,
});

module.exports = { upload };
