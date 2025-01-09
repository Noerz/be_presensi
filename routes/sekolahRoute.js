const express = require("express");
const router = express.Router();
const {
  getAllSekolah,
  createSekolah,
  updateSekolah,
  deleteSekolah,
  getSekolahById,
} = require("../controller/sekolahController");

const sekolahRoutes = (router) => {
  router.get("/sekolah", getAllSekolah); // GET semua sekolah dengan pagination
  router.post("/sekolah", createSekolah); // POST tambah sekolah
  router.put("/sekolah/:idSekolah", updateSekolah); // PUT update sekolah berdasarkan idSekolah
  router.delete("/sekolah/:idSekolah", deleteSekolah); // DELETE hapus sekolah berdasarkan idSekolah
  router.get("/sekolah/:idSekolah", getSekolahById); // GET sekolah berdasarkan idSekolah
};

module.exports = { sekolahRoutes };
