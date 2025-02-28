const argon2 = require("argon2");
const model = require("../../models/user.model");
const api = require("../../tools/common");

const register = async (req, res) => {
  const newUser = req.body;
  try {
    newUser.password = await hashPassword(newUser.password);
    console.log(newUser);
    let data = await model.insert(newUser);
    return api.ok(res, data);
  } catch (e) {
    return api.error(res, "Internal Server Error", 500);
  }
};

const hashPassword = async (plainPassword) => {
  try {
    const hashedPassword = await argon2.hash(plainPassword, {
      type: argon2.argon2id, // Gunakan Argon2id
      memoryCost: 2 ** 16, // Jumlah memori yang digunakan (64MB)
      timeCost: 4, // Jumlah iterasi
      parallelism: 2, // Level paralelisme
    });
    return hashedPassword;
  } catch (e) {
    console.error("Error hasing password: ", e);
    throw e;
  }
};
module.exports = {
  register,
};
