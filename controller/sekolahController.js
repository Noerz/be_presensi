const db = require("../config/database");
const initModels = require("../models/init-models");
const models = initModels(db);
// Mengimpor uuid
const { v4: uuidv4 } = require("uuid");

// READ: Mendapatkan semua data sekolah dengan pagination
const getAllSekolah = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default page = 1, limit = 10
    const offset = (page - 1) * limit;

    const { count, rows } = await models.sekolah.findAndCountAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Sekolah retrieved successfully",
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

// CREATE: Menambahkan sekolah baru
const createSekolah = async (req, res) => {
  try {
    const { location, inTime, outTime } = req.body;

    if (!location || !inTime || !outTime) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Location, inTime, and outTime are required",
      });
    }

    const newSekolah = await models.sekolah.create({
      idSekolah: uuidv4(),
      location,
      inTime,
      outTime,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({
      code: 201,
      status: "success",
      message: "Sekolah created successfully",
      data: newSekolah,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};

// UPDATE: Mengubah sekolah berdasarkan idSekolah
const updateSekolah = async (req, res) => {
  try {
    const { idSekolah } = req.params;
    const { location, inTime, outTime } = req.body;

    if (!idSekolah) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "idSekolah is required",
      });
    }

    const sekolah = await models.sekolah.findByPk(idSekolah);

    if (!sekolah) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Sekolah not found",
      });
    }

    await sekolah.update({
      location,
      inTime,
      outTime,
      updatedAt: new Date(),
    });

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Sekolah updated successfully",
      data: sekolah,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};

// DELETE: Menghapus sekolah berdasarkan idSekolah
const deleteSekolah = async (req, res) => {
  try {
    const { idSekolah } = req.params;

    if (!idSekolah) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "idSekolah is required",
      });
    }

    const deletedSekolah = await models.sekolah.destroy({
      where: { idSekolah },
    });

    if (!deletedSekolah) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Sekolah not found",
      });
    }

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Sekolah deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};

// READ: Mendapatkan sekolah berdasarkan idSekolah
const getSekolahById = async (req, res) => {
  try {
    const { idSekolah } = req.params;

    const sekolah = await models.sekolah.findByPk(idSekolah);

    if (!sekolah) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Sekolah not found",
      });
    }

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Sekolah retrieved successfully",
      data: sekolah,
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
  getAllSekolah,
  createSekolah,
  updateSekolah,
  deleteSekolah,
  getSekolahById,
};
