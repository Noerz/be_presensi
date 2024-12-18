const express = require("express");
const router = express.Router();
const {
  getAllMapel,
  createMapel,
  updateMapel,
  deleteMapel,
  getMapelById,
} = require("../controller/mapelController");

const mapelRoutes = (router) => {
  router.get("/mapel", getAllMapel); // GET semua mata pelajaran dengan pagination
  router.post("/mapel", createMapel); // POST tambah mata pelajaran
  router.put("/mapel/:id_mapel", updateMapel); // PUT update mata pelajaran berdasarkan id_mapel
  router.delete("/mapel/:id_mapel", deleteMapel); // DELETE hapus mata pelajaran berdasarkan id_mapel
  router.get("/mapel/:id_mapel", getMapelById); // GET mata pelajaran berdasarkan id_mapel
};

module.exports = { mapelRoutes };
