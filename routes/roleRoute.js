const express = require("express");
const router = express.Router();
const roleController = require("../controller/role/roleController");
const { verifyToken,isAdmin } = require("../middleware/verifyAuth");

const roleRoutes = (router) => {
  router.post("/role", verifyToken, isAdmin, roleController.createRole);
  router.get("/role", verifyToken, roleController.getRole);
  router.put("/role/:idRole", verifyToken, isAdmin, roleController.updateRole);
  router.delete("/role", verifyToken, isAdmin, roleController.deleteRole);
};

module.exports = { roleRoutes };
