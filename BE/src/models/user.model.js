const { getDB } = require("../database/db.config");

const getAllUsers = async () => {
  const db = getDB(); // Panggil `getDB()` setelah koneksi berhasil
  return db.query("SELECT * FROM Users"); // Tambahkan return
};

module.exports = { getAllUsers };
