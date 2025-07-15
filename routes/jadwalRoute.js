const express = require("express");
const router = express.Router();
const {
  getAllJadwalController,
  createJadwalController,
  getJadwalByIdController,
  updateJadwalController,
  deleteJadwalController,
} = require("../controller/jadwal/jadwalController");
const { createJadwalValidation } = require("../validator/jadwal-validator");
const validateRequest = require("../middleware/validateRequest");

const jadwalRoutes = (router) => {
  router.get("/jadwal", getAllJadwalController);
  router.post(
    "/jadwal",
    createJadwalValidation,
    validateRequest,
    createJadwalController
  );
  router.get("/jadwal/:idJadwal", getJadwalByIdController);
  router.put("/jadwal/:idJadwal", updateJadwalController);
  router.delete("/jadwal/:idJadwal", deleteJadwalController);
};

module.exports = { jadwalRoutes };
