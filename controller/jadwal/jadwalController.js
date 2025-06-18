// /src/controllers/jadwal.controller.js

const {
  getAllJadwal,
  createJadwal,
  getJadwalById,
  updateJadwal,
  deleteJadwal,
} = require("../../services/jadwal/jadwalService");

const getAllJadwalController = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { count, rows } = await getAllJadwal(page, limit);

    return res.status(200).json({
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
    return res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};

const createJadwalController = async (req, res) => {
  try {
    const {
      hari,
      tahun,
      jam_mulai,
      jam_selesai,
      mapel_id,
      guru_id,
      kelas_id,
    } = req.body;

    if (
      !hari ||
      !tahun ||
      !jam_mulai ||
      !jam_selesai ||
      !mapel_id ||
      !guru_id ||
      !kelas_id
    ) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "All fields are required",
      });
    }

    const newJadwal = await createJadwal({
      hari,
      tahun,
      jam_mulai,
      jam_selesai,
      mapel_id,
      guru_id,
      kelas_id,
    });

    return res.status(201).json({
      code: 201,
      status: "success",
      message: "Jadwal created successfully",
      data: newJadwal,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};

const getJadwalByIdController = async (req, res) => {
  try {
    const { idJadwal } = req.params;
    const jadwal = await getJadwalById(idJadwal);

    if (!jadwal) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Jadwal not found",
      });
    }

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Jadwal retrieved successfully",
      data: jadwal,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};

const updateJadwalController = async (req, res) => {
  try {
    const { idJadwal } = req.params;
    const {
      hari,
      tahun,
      jam_mulai,
      jam_selesai,
      mapel_id,
      guru_id,
      kelas_id,
    } = req.body;

    const updated = await updateJadwal(idJadwal, {
      hari,
      tahun,
      jam_mulai,
      jam_selesai,
      mapel_id,
      guru_id,
      kelas_id,
    });

    if (!updated) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Jadwal not found",
      });
    }

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Jadwal updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};

const deleteJadwalController = async (req, res) => {
  try {
    const { idJadwal } = req.params;
    const deleted = await deleteJadwal(idJadwal);

    if (!deleted) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Jadwal not found",
      });
    }

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Jadwal deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  getAllJadwalController,
  createJadwalController,
  getJadwalByIdController,
  updateJadwalController,
  deleteJadwalController,
};