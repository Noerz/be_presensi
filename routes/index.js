const express = require("express");

const { authRoutes } = require("./authRoute");
const { roleRoutes } = require("./roleRoute");
const { kelasRoutes } = require("./kelasRoute");
const { mapelRoutes } = require("./mapelRoute");
const { jadwalRoutes } = require("./jadwalRoute");
const { presensiRoutes } = require("./presensiRoute");
const { sekolahRoutes } = require("./sekolahRoute");
// const { transaksiRoutes } = require("./transaksiRoute");
const { profileRoutes } = require("./profileRoute");

const router = express.Router();
authRoutes(router);
roleRoutes(router);
kelasRoutes(router);
mapelRoutes(router);
jadwalRoutes(router);
presensiRoutes(router);
sekolahRoutes(router);

// dompetRoutes(router);
// transaksiRoutes(router);
profileRoutes(router);

module.exports = router;
