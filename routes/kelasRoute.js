const express = require("express");
const router = express.Router();
const {
  getAllKelas,
  createKelas,
  updateKelas,
  deleteKelas,
  getKelasById,
} = require("../controller/kelasController");
const { verifyToken } = require("../middleware/verifyAuth");

const kelasRoutes = (router) => {
  // CREATE: Tambah kelas baru
  router.post("/kelas", verifyToken, createKelas);

  // READ: Dapatkan semua kelas dengan pagination
  router.get("/kelas", verifyToken, getAllKelas);

  // READ: Dapatkan kelas berdasarkan ID
  router.get("/kelas/:idKelas", verifyToken, getKelasById);

  // UPDATE: Update kelas berdasarkan ID
  router.put("/kelas/:idKelas", verifyToken, updateKelas);

  // DELETE: Hapus kelas berdasarkan ID
  router.delete("/kelas/:idKelas", verifyToken, deleteKelas);
};

module.exports = { kelasRoutes };
