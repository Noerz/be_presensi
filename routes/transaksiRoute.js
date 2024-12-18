const express = require("express");
const router = express.Router();
const { addSaldo, reduceSaldo,getAllTransaksi,getAllTransaksiByIdDompet } = require("../controller/transaksiController");
const { verifyToken } = require("../middleware/verifyAuth");

const transaksiRoutes = (router) => {
    router.get("/transaksi",verifyToken, getAllTransaksi);
    router.get("/transaksi/byDompet", verifyToken,getAllTransaksiByIdDompet);
    router.post("/transaksi/pemasukan", verifyToken,addSaldo);
    router.post("/transaksi/pengeluaran", verifyToken,reduceSaldo);

}


module.exports={transaksiRoutes}