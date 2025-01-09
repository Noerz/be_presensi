const express = require("express");
const router = express.Router();
const {
  getAllKelas,
  createKelas,
  updateKelas,
  deleteKelas,
  getKelasById,
} = require("../controller/kelasController");
const { verifyToken, isAdmin } = require("../middleware/verifyAuth");

const kelasRoutes = (router) => {
  router.post("/kelas", verifyToken, createKelas);
  router.get("/kelas", verifyToken, getAllKelas);
  router.get("/kelas/:idKelas", verifyToken, getKelasById);
  router.put("/kelas/:idKelas", verifyToken, isAdmin, updateKelas);
  router.delete("/kelas/:idKelas", verifyToken, isAdmin, deleteKelas);
};

module.exports = { kelasRoutes };
