const { getDB } = require("../database/db.config");

const getAllLog = async (q = "") => {
  const db = getDB();
  let query = "SELECT * FROM tblLog";
  if (q) {
    const safeQ = q.replace(/'/g, "''");
    query += ` WHERE username LIKE '${safeQ}%' OR description LIKE '${safeQ}%' `;
  }
  const result = await db.query(query);
  return result;
};

const getByStatus = async (status) => {
  const db = getDB();
  let query = `SELECT * FROM tblLog WHERE status = ${status}`;
  const result = await db.query(query);
  return result;
};

const create = async (data) => {
  const db = getDB();
  const { username, description, status, createAt, action } = data;

  // Gunakan Parameterized Query untuk keamanan
  const query = `
  INSERT INTO tblLog (username, description, status, createAt, action)
  VALUES ('${username}', '${description}', ${status}, #${createAt}#, '${action}')
`;

  const result = await db.query(query);
  return result.count;
};

module.exports = {
  getAllLog,
  getByStatus,
  create,
};
