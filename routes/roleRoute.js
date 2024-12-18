const express = require("express");
const router = express.Router();
const {
  createRole,
  getRole,
  updateRole,
  deleteRole,
} = require("../controller/roleController");
const { verifyToken } = require("../middleware/verifyAuth");

const roleRoutes = (router) => {
  router.post("/role", createRole);
  router.get("/role", getRole);
  router.put("/role/:idRole", updateRole);
  //   router.get("/kode", getCode);
  //   router.get("/dompet/user", verifyToken, getDompetByIdUser);

  router.delete("/role", deleteRole);
};

module.exports = { roleRoutes };
