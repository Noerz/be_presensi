const express = require("express");
const router = express.Router();
const {
  getAllSekolah,
  createSekolah,
  updateSekolah,
  deleteSekolah,
  getSekolahById,
} = require("../controller/sekolah/sekolahController");
const { verifyToken, isAdmin } = require("../middleware/verifyAuth");

const sekolahRoutes = (router) => {
  router.get("/sekolah", verifyToken, getAllSekolah); // GET semua sekolah dengan pagination
  router.post("/sekolah", verifyToken, isAdmin, createSekolah); // POST tambah sekolah
  router.put("/sekolah/:idSekolah", verifyToken, isAdmin, updateSekolah); // PUT update sekolah berdasarkan idSekolah
  router.delete("/sekolah/:idSekolah", verifyToken, isAdmin, deleteSekolah); // DELETE hapus sekolah berdasarkan idSekolah
  router.get("/sekolah/:idSekolah", verifyToken, getSekolahById); // GET sekolah berdasarkan idSekolah
};

module.exports = { sekolahRoutes };
