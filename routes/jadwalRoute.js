const express = require("express");
const router = express.Router();
const {
  getAllJadwal,
  createJadwal,
  updateJadwal,
  deleteJadwal,
  getJadwalById,
} = require("../controller/jadwalController");

const jadwalRoutes = (router) => {
  router.get("/jadwal", getAllJadwal); // Retrieve all jadwal with pagination
  router.get("/jadwal/:idJadwal", getJadwalById); // Retrieve jadwal by ID
  router.post("/jadwal", createJadwal); // Create new jadwal
  router.put("/jadwal/:idJadwal", updateJadwal); // Update jadwal by ID
  router.delete("/jadwal/:idJadwal", deleteJadwal); // Delete jadwal by ID
};

module.exports = { jadwalRoutes };
