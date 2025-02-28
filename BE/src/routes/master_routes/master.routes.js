const express = require("express");
const router = express.Router();
const Joi = require("joi");

const routesData = require("./routes.data.json");
const UserController = require("../../controllers/master_controller/UserController");

const controllers = {
  UserController,
};

// Definisikan skema validasi untuk setiap rute
const routeSchema = Joi.object({
  method: Joi.string().valid("get", "post", "put", "delete").required(),
  path: Joi.string().required(),
  controller: Joi.string().required(),
});

// Validasi setiap routeData dengan skema yang telah ditentukan
routesData.forEach((route) => {
  const { error } = routeSchema.validate(route);
  if (error) {
    console.error(
      `Invalid route configuration for path '${route.path}': ${error.details[0].message}`
    );
    return; // Mengabaikan rute yang invalid dan melanjutkan ke rute berikutnya
  }

  // Mendaftarkan route jika valid
  const [controllerName, methodName] = route.controller.split(".");
  const controller = controllers[controllerName];

  if (controller && typeof controller[methodName] === "function") {
    // Menambahkan route ke router jika controller dan method ditemukan
    router[route.method](route.path, controller[methodName]);
  }
});

module.exports = router;
