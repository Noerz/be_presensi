const db = require("../config/database");
const initModels = require("../models/init-models");
const models = initModels(db);
const { v4: uuidv4 } = require("uuid");

const getAllJadwal = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default pagination values
    const offset = (page - 1) * limit;

    const { count, rows } = await models.jadwal.findAndCountAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [["createdAt", "DESC"]],
      include: [
        { model: models.mata_pelajaran, as: "mapel" }, // Include mata_pelajaran details
        { model: models.staff, as: "guru" }, // Include staff (guru) details
        { model: models.kelas, as: "kelas" }, // Include kelas details
      ],
    });

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Jadwal retrieved successfully",
      data: rows,
      meta: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
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

const createJadwal = async (req, res) => {
  try {
    const { hari, tahun, jam_mulai, jam_selesai, mapel_id, guru_id, kelas_id } = req.body;

    if (!hari || !tahun || !jam_mulai || !jam_selesai || !mapel_id || !guru_id || !kelas_id) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "All fields are required",
      });
    }

    const newJadwal = await models.jadwal.create({
      idJadwal: uuidv4(),
      hari,
      tahun,
      jam_mulai,
      jam_selesai,
      mapel_id,
      guru_id,
      kelas_id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({
      code: 201,
      status: "success",
      message: "Jadwal created successfully",
      data: newJadwal,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};

const updateJadwal = async (req, res) => {
  try {
    const { idJadwal } = req.params;
    const { hari, tahun, jam_mulai, jam_selesai, mapel_id, guru_id, kelas_id } = req.body;

    if (!idJadwal) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "idJadwal is required",
      });
    }

    const jadwal = await models.jadwal.findByPk(idJadwal);

    if (!jadwal) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Jadwal not found",
      });
    }

    await jadwal.update({
      hari,
      tahun,
      jam_mulai,
      jam_selesai,
      mapel_id,
      guru_id,
      kelas_id,
      updatedAt: new Date(),
    });

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Jadwal updated successfully",
      data: jadwal,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};

const deleteJadwal = async (req, res) => {
  try {
    const { idJadwal } = req.params;

    if (!idJadwal) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "idJadwal is required",
      });
    }

    const deletedJadwal = await models.jadwal.destroy({
      where: { idJadwal },
    });

    if (!deletedJadwal) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Jadwal not found",
      });
    }

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Jadwal deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};

const getJadwalById = async (req, res) => {
  try {
    const { idJadwal } = req.params;

    const jadwal = await models.jadwal.findByPk(idJadwal, {
      include: [
        { model: models.mata_pelajaran, as: "mapel" },
        { model: models.staff, as: "guru" },
        { model: models.kelas, as: "kelas" },
      ],
    });

    if (!jadwal) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Jadwal not found",
      });
    }

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Jadwal retrieved successfully",
      data: jadwal,
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
  getAllJadwal,
  createJadwal,
  updateJadwal,
  deleteJadwal,
  getJadwalById,
};
