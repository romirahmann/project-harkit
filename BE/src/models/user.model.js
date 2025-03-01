const { getDB } = require("../database/db.config");

const getAllUsers = async () => {
  const db = getDB();
  const result = await db.query("SELECT * FROM Users");
  return result;
};

const getUserById = async (id) => {
  const db = getDB();
  const result = await db.query("SELECT * FROM Users WHERE id = ?", [id]);
  return result.length > 0 ? result[0] : null;
};

const createUser = async (data) => {
  const db = getDB();
  const { username, email, password, jabatan, trn_date } = data;
  const result = await db.query(
    `INSERT INTO Users (username, email, password, jabatan, trn_date) VALUES ('${username}', '${email}', '${password}', '${jabatan}', ${trn_date})`
  );
  console.log(result);
  return result.count;
};

const updateUser = async (id, data) => {
  const db = getDB();
  const { username, email, password, jabatan, trn_date } = data;
  const result = await db.query(
    "UPDATE Users SET username = ?, email = ?, password = ?, jabatan = ?, trn_date = ? WHERE id = ?",
    [username, email, password, jabatan, trn_date, id]
  );
  return result;
};

const deleteUser = async (id) => {
  const db = getDB();
  const result = await db.query("DELETE FROM Users WHERE id = ?", [id]);
  return result;
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
