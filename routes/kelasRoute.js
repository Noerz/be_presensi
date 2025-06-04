const express = require("express");
const router = express.Router();
const kelasController = require("../controller/kelas/kelasController");
const { verifyToken, isAdmin } = require("../middleware/verifyAuth");

const kelasRoutes = (router) => {
  router.post("/kelas", verifyToken, kelasController.createKelas);
  router.get("/kelas", verifyToken, kelasController.getAllKelas);
  router.get("/kelas/:idKelas", verifyToken, kelasController.getKelasById);
  router.put(
    "/kelas/:idKelas",
    verifyToken,
    isAdmin,
    kelasController.updateKelas
  );
  router.delete(
    "/kelas/:idKelas",
    verifyToken,
    isAdmin,
    kelasController.deleteKelas
  );
};

module.exports = { kelasRoutes };
