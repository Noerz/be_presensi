// presensiController.js
const { v4: uuidv4 } = require("uuid");
const db = require("../config/database");
const initModels = require("../models/init-models");
const models = initModels(db);
const moment = require("moment");
const ExcelJS = require("exceljs");

// CREATE: Presensi masuk untuk staff
const createPresensiStaff = async (req, res) => {
  try {
    const { inLocation } = req.body;
    const { idUser: staff_id } = req.decoded;

    if (!inLocation || !staff_id) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "In location and staff ID are required",
      });
    }

    const sekolah = await models.sekolah.findOne();
    if (!sekolah) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "School information not found",
      });
    }

    const now = moment().utcOffset(7);
    const todayStart = now.clone().startOf("day");
    const todayEnd = now.clone().endOf("day");

    // Cek apakah staff sudah absen hari ini
    const existingPresensi = await models.presensi.findOne({
      where: {
        staff_id,
        createdAt: {
          [db.Sequelize.Op.between]: [todayStart.toDate(), todayEnd.toDate()],
        },
      },
    });

    if (existingPresensi) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Anda sudah melakukan presensi hari ini",
      });
    }

    const jamMasuk = moment(sekolah.inTime, "HH:mm:ss");

    // Tentukan keterangan
    const inStatus = now.isAfter(jamMasuk) ? "Terlambat" : "Tepat Waktu";
    const inKeterangan = now.isAfter(jamMasuk)
      ? `Terlambat ${now.diff(jamMasuk, "minutes")} menit`
      : "Tepat waktu";

    // Buat presensi masuk
    const newPresensi = await models.presensi.create({
      idPresensi: uuidv4(),
      inLocation,
      inTime: now.format("YYYY-MM-DD HH:mm:ss"),
      inStatus,
      inKeterangan,
      staff_id,
      sekolah_id: sekolah.idSekolah,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({
      code: 201,
      status: "success",
      message: "Presensi masuk berhasil",
      data: newPresensi,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};

// UPDATE: Presensi keluar untuk staff
const updatePresensiOutStaff = async (req, res) => {
  try {
    const { outLocation } = req.body;
    const { idUser: staff_id } = req.decoded;

    if (!outLocation || !staff_id) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Out location and staff ID are required",
      });
    }

    const sekolah = await models.sekolah.findOne();
    if (!sekolah) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "School information not found",
      });
    }

    // Cari presensi hari ini yang belum absen keluar
    const now = moment().utcOffset(7);
    const todayStart = now.clone().startOf("day");
    const todayEnd = now.clone().endOf("day");

    const presensi = await models.presensi.findOne({
      where: {
        staff_id,
        outTime: null,
        createdAt: {
          [db.Sequelize.Op.between]: [todayStart.toDate(), todayEnd.toDate()],
        },
      },
    });

    if (!presensi) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message:
          "Presensi masuk belum dilakukan atau sudah absen keluar hari ini",
      });
    }

    const jamPulang = moment(sekolah.outTime, "HH:mm:ss");

    const outStatus = now.isBefore(jamPulang) ? "Terlalu Cepat" : "Tepat Waktu";
    const outKeterangan = now.isBefore(jamPulang)
      ? `Terlalu cepat ${jamPulang.diff(now, "minutes")} menit`
      : "Tepat waktu";

    await presensi.update({
      outLocation,
      outTime: now.format("YYYY-MM-DD HH:mm:ss"),
      outStatus,
      outKeterangan,
      updatedAt: new Date(),
    });

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Presensi keluar berhasil",
      data: presensi,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};

// GET: Presensi staff by user
const getPresensiByUser = async (req, res) => {
  try {
    const { idUser: staff_id } = req.decoded;

    if (!staff_id) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Staff ID is required",
      });
    }

    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { staff_id };

    const { rows: presensiList, count: totalItems } =
      await models.presensi.findAndCountAll({
        where: whereClause,
        // include: [
        //   {
        //     model: models.sekolah,
        //     as: "sekolah",
        //     attributes: ["location", "inTime", "outTime"],
        //   },
        // ],
        attributes: [
          "idPresensi",
          "inTime",
          "inKeterangan",
          "outTime",
          "outKeterangan",
        ],
        order: [["createdAt", "DESC"]],
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
      });

    if (presensiList.length === 0) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Presensi not found for the user",
      });
    }

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Presensi retrieved successfully",
      data: presensiList,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: parseInt(page, 10),
      },
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};

// GET: Rekap presensi staff berdasarkan bulan dan user
const getRekapPresensiByBulanDanUser = async (req, res) => {
  try {
    const { bulan, tahun, userId } = req.query;

    if (!bulan || !tahun || !userId) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Parameter bulan, tahun, dan userId wajib diisi",
      });
    }

    const startDate = moment(`${tahun}-${bulan}-01`).startOf("month").toDate();
    const endDate = moment(`${tahun}-${bulan}-01`).endOf("month").toDate();

    const presensiList = await models.presensi.findAll({
      where: {
        staff_id: userId,
        createdAt: {
          [db.Sequelize.Op.between]: [startDate, endDate],
        },
      },
      attributes: [
        "idPresensi",
        "inTime",
        "inKeterangan",
        "outTime",
        "outKeterangan",
        "createdAt",
      ],
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Rekap presensi berhasil diambil",
      data: presensiList,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};

// GET: Export semua presensi ke Excel
const exportRekapPresensiToExcel = async (req, res) => {
  try {
    const presensiData = await models.presensi.findAll({
      include: [
        {
          model: models.user,
          as: "staff",
          attributes: ["nama"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Rekap Presensi");

    worksheet.columns = [
      { header: "Nama", key: "nama", width: 25 },
      { header: "Tanggal", key: "tanggal", width: 20 },
      { header: "Jam Masuk", key: "inTime", width: 20 },
      { header: "Keterangan Masuk", key: "inKeterangan", width: 30 },
      { header: "Jam Keluar", key: "outTime", width: 20 },
      { header: "Keterangan Keluar", key: "outKeterangan", width: 30 },
    ];

    presensiData.forEach((item) => {
      worksheet.addRow({
        nama: item.staff?.nama || "-",
        tanggal: moment(item.createdAt).format("YYYY-MM-DD"),
        inTime: item.inTime,
        inKeterangan: item.inKeterangan,
        outTime: item.outTime || "-",
        outKeterangan: item.outKeterangan || "-",
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=rekap_presensi.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Export Excel Error:", error.message);
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};
module.exports = {
  createPresensiStaff,
  updatePresensiOutStaff,
  getPresensiByUser,
  getRekapPresensiByBulanDanUser,
  exportRekapPresensiToExcel,
};
