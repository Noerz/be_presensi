const express = require("express");
const router = express.Router();
const {
  createDompet,
  getDompet,
  getDompetByIdUser,
  updateDompet,
  deleteDompet,
  getCode
} = require("../controller/dompetController");
const { verifyToken } = require("../middleware/verifyAuth");

const dompetRoutes = (router) => {
  router.post("/dompet", verifyToken, createDompet);
  router.get("/dompet", verifyToken, getDompet);
  router.get("/kode", getCode);
  router.get("/dompet/user", verifyToken, getDompetByIdUser);
  router.put("/dompet/:idDompet", verifyToken, updateDompet);

  router.delete("/dompet", deleteDompet);
};

module.exports = { dompetRoutes };
