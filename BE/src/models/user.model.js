const db = require("../database/db.config");

const insert = async (data) => {
  await db("users").insert(data);
};

module.exports = {
  insert,
};
