const { getDB } = require("../database/db.config");

const getAllUsers = async (q = "") => {
  const db = getDB();
  let query = "SELECT * FROM Users";

  if (q) {
    const safeQ = q.replace(/'/g, "''");
    query += ` WHERE username LIKE '${safeQ}%' OR email LIKE '${safeQ}%' OR jabatan LIKE '${safeQ}%'`;
  }

  const result = await db.query(query);
  return result;
};

const getUserById = async (id) => {
  const db = getDB();
  const query = `SELECT * FROM Users WHERE id = ${id}`;
  const result = await db.query(query);
  return result.length > 0 ? result[0] : null;
};

const createUser = async (data) => {
  const db = getDB();
  const { username, email, password, jabatan, trn_date } = data;
  const result = await db.query(
    `INSERT INTO Users (username, email, password, jabatan, trn_date) VALUES ('${username}', '${email}', '${password}', '${jabatan}', ${trn_date})`
  );

  return result.count;
};

const updateUser = async (id, data) => {
  const db = getDB();
  const { username, email, password, jabatan, trn_date } = data;

  const query = `
    UPDATE Users 
    SET 
      username = '${username}', 
      email = '${email}', 
      password = '${password}', 
      jabatan = '${jabatan}', 
      trn_date = '${trn_date}'
    WHERE id = ${id}
  `;

  const result = await db.query(query);
  return result;
};

const deleteUser = async (id) => {
  const db = getDB();
  const query = `DELETE FROM Users WHERE id = ${id}`;
  const result = await db.query(query);
  return result;
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
