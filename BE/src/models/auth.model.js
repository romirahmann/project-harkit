const db = require("../database/db.config");

const login = async (username) =>
  await db
    .select("username", "password")
    .from("users")
    .where("username", username);

module.exports = {
  login,
};
