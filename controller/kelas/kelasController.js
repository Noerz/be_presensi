const kelasService = require("../../services/kelas/kelasService");

const getAllKelas = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await kelasService.getAllKelas(page, limit);

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Kelas retrieved successfully",
      data: result.data,
      meta: result.meta,
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
    const newKelas = await kelasService.createKelas(nama_kelas, jumlah);

    res.status(201).json({
      code: 201,
      status: "success",
      message: "Kelas created successfully",
      data: newKelas,
    });
  } catch (error) {
    const statusCode = error.message.includes("required") ? 400 : 500;
    res.status(statusCode).json({
      code: statusCode,
      status: "error",
      message: error.message,
    });
  }
};

const updateKelas = async (req, res) => {
  try {
    const { idKelas } = req.params;
    const { nama_kelas, jumlah } = req.body;
    const updatedKelas = await kelasService.updateKelas(
      idKelas,
      nama_kelas,
      jumlah
    );

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Kelas updated successfully",
      data: updatedKelas,
    });
  } catch (error) {
    const statusCode = error.message.includes("not found")
      ? 404
      : error.message.includes("required")
      ? 400
      : 500;
    res.status(statusCode).json({
      code: statusCode,
      status: "error",
      message: error.message,
    });
  }
};

const deleteKelas = async (req, res) => {
  try {
    const { idKelas } = req.params;
    await kelasService.deleteKelas(idKelas);

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Kelas deleted successfully",
    });
  } catch (error) {
    const statusCode = error.message.includes("not found")
      ? 404
      : error.message.includes("required")
      ? 400
      : 500;
    res.status(statusCode).json({
      code: statusCode,
      status: "error",
      message: error.message,
    });
  }
};

const getKelasById = async (req, res) => {
  try {
    const { idKelas } = req.params;
    const kelas = await kelasService.getKelasById(idKelas);

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Kelas retrieved successfully",
      data: kelas,
    });
  } catch (error) {
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      code: statusCode,
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
