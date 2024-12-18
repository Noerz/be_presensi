const db = require("../config/database");
const initModels = require("../models/init-models");
const models = initModels(db);
// Mengimpor uuid
const { v4: uuidv4 } = require("uuid");

const getAllKelas = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default page = 1, limit = 10
    const offset = (page - 1) * limit;

    const { count, rows } = await models.kelas.findAndCountAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Kelas retrieved successfully",
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

const createKelas = async (req, res) => {
  try {
    const { nama_kelas, jumlah } = req.body;

    if (!nama_kelas || !jumlah) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "nama_kelas, and jumlah are required",
      });
    }

    const newKelas = await models.kelas.create({
      idKelas: uuidv4(),
      nama_kelas,
      jumlah,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({
      code: 201,
      status: "success",
      message: "Kelas created successfully",
      data: newKelas,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};

const updateKelas = async (req, res) => {
  try {
    const { idKelas } = req.params;
    const { nama_kelas, jumlah } = req.body;

    if (!idKelas) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "idKelas is required",
      });
    }

    const kelas = await models.kelas.findByPk(idKelas);

    if (!kelas) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Kelas not found",
      });
    }

    await kelas.update({
      nama_kelas,
      jumlah,
      updatedAt: new Date(),
    });

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Kelas updated successfully",
      data: kelas,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};

const deleteKelas = async (req, res) => {
  try {
    const { idKelas } = req.params;

    if (!idKelas) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "idKelas is required",
      });
    }

    const deletedKelas = await models.kelas.destroy({
      where: { idKelas },
    });

    if (!deletedKelas) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Kelas not found",
      });
    }

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Kelas deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};

const getKelasById = async (req, res) => {
  try {
    const { idKelas } = req.params;

    const kelas = await models.kelas.findByPk(idKelas);

    if (!kelas) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Kelas not found",
      });
    }

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Kelas retrieved successfully",
      data: kelas,
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
  getAllKelas,
  createKelas,
  updateKelas,
  deleteKelas,
  getKelasById,
};
