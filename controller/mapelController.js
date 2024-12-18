const db = require("../config/database");
const initModels = require("../models/init-models");
const models = initModels(db);
// Mengimpor uuid
const { v4: uuidv4 } = require("uuid");

// READ: Mendapatkan semua data mata pelajaran dengan pagination
const getAllMapel = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default page = 1, limit = 10
    const offset = (page - 1) * limit;

    const { count, rows } = await models.mata_pelajaran.findAndCountAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Mata pelajaran retrieved successfully",
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

// CREATE: Menambahkan mata pelajaran baru
const createMapel = async (req, res) => {
  try {
    const { nama } = req.body;

    if (!nama) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Nama mata pelajaran is required",
      });
    }

    const newMapel = await models.mata_pelajaran.create({
      id_mapel: uuidv4(),
      nama,
      created_at: new Date(),
      update_at: new Date(),
    });

    res.status(201).json({
      code: 201,
      status: "success",
      message: "Mata pelajaran created successfully",
      data: newMapel,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};

// UPDATE: Mengubah mata pelajaran berdasarkan id_mapel
const updateMapel = async (req, res) => {
  try {
    const { id_mapel } = req.params;
    const { nama } = req.body;

    if (!id_mapel) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "id_mapel is required",
      });
    }

    const mapel = await models.mata_pelajaran.findByPk(id_mapel);

    if (!mapel) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Mata pelajaran not found",
      });
    }

    await mapel.update({
      nama,
      update_at: new Date(),
    });

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Mata pelajaran updated successfully",
      data: mapel,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};

// DELETE: Menghapus mata pelajaran berdasarkan id_mapel
const deleteMapel = async (req, res) => {
  try {
    const { id_mapel } = req.params;

    if (!id_mapel) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "id_mapel is required",
      });
    }

    const deletedMapel = await models.mata_pelajaran.destroy({
      where: { id_mapel },
    });

    if (!deletedMapel) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Mata pelajaran not found",
      });
    }

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Mata pelajaran deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};

// READ: Mendapatkan mata pelajaran berdasarkan id_mapel
const getMapelById = async (req, res) => {
  try {
    const { id_mapel } = req.params;

    const mapel = await models.mata_pelajaran.findByPk(id_mapel);

    if (!mapel) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Mata pelajaran not found",
      });
    }

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Mata pelajaran retrieved successfully",
      data: mapel,
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
  getAllMapel,
  createMapel,
  updateMapel,
  deleteMapel,
  getMapelById,
};
