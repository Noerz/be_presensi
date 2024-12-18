// routes/presensiRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/verifyAuth");
const {
  createPresensi,
  updatePresensiOut,
  getPresensiByUser,
} = require("../controller/presensiController");

const presensiRoutes = (router) => {
  router.post("/presensi", verifyToken, createPresensi); // Create presensi masuk
  router.put("/presensi/:idPresensi", verifyToken, updatePresensiOut); // Update presensi keluar
  router.get("/presensi/user", verifyToken, getPresensiByUser); // Get presensi by user
};

module.exports = { presensiRoutes };
