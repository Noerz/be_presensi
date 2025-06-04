// presensiController.js
const { v4: uuidv4 } = require("uuid");
const db = require("../config/database");
const initModels = require("../models/init-models");
const models = initModels(db);
const moment = require("moment");

// CREATE: Presensi masuk
const createPresensi = async (req, res) => {
  try {
    const { mapel, inLocation } = req.body;
    const { idMurid: siswa_id } = req.decoded;

    if (!mapel || !inLocation || !siswa_id) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "All fields are required",
      });
    }

    // Find the jadwal based on the mapel and siswa_id
    const jadwal = await models.jadwal.findOne({
      include: [{
        model: models.mata_pelajaran,
        as: 'mapel',
        where: { nama: mapel },
        attributes: ['nama'],
      }],
    });

    if (!jadwal) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Jadwal not found for the given mapel",
      });
    }

    // Check if today is the correct day for this jadwal
    const now = moment();
    now.locale("id");
    const today = now.format("dddd").toLowerCase();
    if (jadwal.hari.toLowerCase() !== today) {
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
        jadwal_id: jadwal.idJadwal,
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
      jadwal_id: jadwal.idJadwal,
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
    const { outLocation, mapel } = req.body;
    const { idMurid: siswa_id } = req.decoded;

    if (!outLocation || !mapel) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Out location and mapel are required",
      });
    }

    // Find the jadwal based on the mapel and siswa_id
    const jadwal = await models.jadwal.findOne({
      include: [{
        model: models.mata_pelajaran,
        as: 'mapel',
        where: { nama: mapel },
        attributes: ['nama'],
      }],
      
    });
console.log("isi dari jadwal "+jadwal);
    if (!jadwal) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Jadwal not found for the given mapel",
      });
    }

    // Find the presensi based on the jadwal_id and siswa_id
    const presensi = await models.presensi.findOne({
      where: {
        jadwal_id: jadwal.idJadwal,
        siswa_id,
        outTime: null, // Ensure we only update presensi that hasn't been checked out
      },
    });

    if (!presensi) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Presensi not found or already checked out",
      });
    }

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
    const { idMurid: siswa_id, idStaff: staff_id } = req.decoded;

    if (!siswa_id && !staff_id) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "User ID is required",
      });
    }

    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = siswa_id ? { siswa_id } : { staff_id };

    const { rows: presensiList, count: totalItems } =
      await models.presensi.findAndCountAll({
        where: whereClause,
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

// CREATE: Presensi masuk for staff
const createPresensiStaff = async (req, res) => {
  try {
    const { inLocation } = req.body;
    const { idStaff: staff_id } = req.decoded;

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
    const todayStart = now.clone().startOf('day');
    const todayEnd = now.clone().endOf('day');

    // Check if staff already checked in today
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

    // Determine keterangan
    const inStatus = now.isAfter(jamMasuk) ? "Terlambat" : "Tepat Waktu";
    const inKeterangan = now.isAfter(jamMasuk)
      ? `Terlambat ${now.diff(jamMasuk, "minutes")} menit`
      : "Tepat waktu";

    // Create presensi
    const newPresensi = await models.presensi.create({
      idPresensi: uuidv4(),
      inLocation,
      inTime: now.format("YYYY-MM-DD HH:mm:ss"),
      inStatus,
      inKeterangan,
      staff_id,
      school_id: sekolah.idSekolah,
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

// UPDATE: Presensi keluar for staff
const updatePresensiOutStaff = async (req, res) => {
  try {
    const { outLocation } = req.body;
    const { idStaff: staff_id } = req.decoded;

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

    const presensi = await models.presensi.findOne({
      where: {
        staff_id,
        outTime: null, // Ensure we only update presensi that hasn't been checked out
      },
    });

    if (!presensi) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Presensi not found or already checked out",
      });
    }

    const now = moment();
    const jamPulang = moment(sekolah.outTime, "HH:mm:ss");

    const outStatus = now.isBefore(jamPulang)
      ? "Terlalu Cepat"
      : "Tepat Waktu";
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

module.exports = {
  createPresensi,
  updatePresensiOut,
  getPresensiByUser,
  createPresensiStaff,
  updatePresensiOutStaff,
};
