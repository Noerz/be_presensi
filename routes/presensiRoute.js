// routes/presensiRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/verifyAuth");
const {
  getPresensiByUser,
  createPresensiStaff,
  updatePresensiOutStaff,
} = require("../controller/presensiController");

const presensiRoutes = (router) => {
  router.get("/presensi/user", verifyToken, getPresensiByUser); // Get presensi by user

  router.post("/presensi/staff", verifyToken, createPresensiStaff); // Create presensi masuk for staff
  router.put("/presensi/staff", verifyToken, updatePresensiOutStaff); // Update presensi keluar for staff
};

module.exports = { presensiRoutes };
