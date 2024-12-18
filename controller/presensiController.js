// presensiController.js
const { v4: uuidv4 } = require("uuid");
const db = require("../config/database");
const initModels = require("../models/init-models");
const models = initModels(db);
const moment = require("moment");

// CREATE: Presensi masuk
// presensiController.js
const createPresensi = async (req, res) => {
  try {
    const { jadwal_id, inLocation } = req.body;
    const { idUser: siswa_id } = req.decoded;

    if (!jadwal_id || !inLocation) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "All fields are required",
      });
    }

    const jadwal = await models.jadwal.findByPk(jadwal_id);
    if (!jadwal) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Jadwal not found",
      });
    }

    // Check if today is the correct day for this jadwal
    const now = moment();
    // Set the locale to Indonesian
    now.locale("id");
    const today = now.format("dddd"); // Get the current day of the week (e.g., 'Monday')
    console.log("Hari ini" + today);
    if (jadwal.hari !== today) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: `Presensi hanya bisa dilakukan pada hari ${jadwal.hari}`,
      });
    }

    const startOfWeek = now.clone().startOf("isoWeek");
    const endOfWeek = now.clone().endOf("isoWeek");

    // Check if user already presensi this week
    const existingPresensi = await models.presensi.findOne({
      where: {
        siswa_id,
        jadwal_id,
        createdAt: {
          [db.Sequelize.Op.between]: [startOfWeek.toDate(), endOfWeek.toDate()],
        },
      },
    });

    if (existingPresensi) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Anda sudah melakukan presensi minggu ini",
      });
    }

    // Check if it's time for presensi
    const jamMulai = moment(jadwal.jam_mulai, "HH:mm:ss");
    if (!now.isBetween(jamMulai.clone().subtract(20, "minutes"))) {
        return res.status(400).json({
          code: 400,
          status: "error",
          message: "Presensi masuk hanya dapat dilakukan mendekati waktu jadwal",
        });
      }

    // Determine keterangan
    const inStatus = now.isAfter(jamMulai) ? "Terlambat" : "Tepat Waktu";
    const inKeterangan = now.isAfter(jamMulai)
      ? `Terlambat ${now.diff(jamMulai, "minutes")} menit`
      : "Tepat waktu";

    // Create presensi
    const newPresensi = await models.presensi.create({
      idPresensi: uuidv4(),
      inLocation,
      inTime: now.format("YYYY-MM-DD HH:mm:ss"),
      inStatus,
      inKeterangan,
      siswa_id,
      jadwal_id,
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

const updatePresensiOut = async (req, res) => {
  try {
    const { idPresensi } = req.params;
    const { outLocation } = req.body;

    if (!outLocation) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Out location is required",
      });
    }

    const presensi = await models.presensi.findByPk(idPresensi);
    if (!presensi) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Presensi not found",
      });
    }

    if (presensi.outTime) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Presensi keluar sudah dilakukan",
      });
    }

    const jadwal = await models.jadwal.findByPk(presensi.jadwal_id);
    const now = moment();
    const jamSelesai = moment(jadwal.jam_selesai, "HH:mm:ss");

    const outStatus = now.isBefore(jamSelesai)
      ? "Terlalu Cepat"
      : "Tepat Waktu";
    const outKeterangan = now.isBefore(jamSelesai)
      ? `Terlalu cepat ${jamSelesai.diff(now, "minutes")} menit`
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

const getPresensiByUser = async (req, res) => {
  try {
    const { idUser: siswa_id } = req.decoded;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const { rows: presensiList, count: totalItems } =
      await models.presensi.findAndCountAll({
        where: { siswa_id },
        include: [
          {
            model: models.jadwal,
            as: "jadwal",
            include: [
              {
                model: models.mata_pelajaran,
                as: "mapel",
                attributes: ["nama"],
              },
            ],
          },
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

module.exports = {
  createPresensi,
  updatePresensiOut,
  getPresensiByUser,
};
