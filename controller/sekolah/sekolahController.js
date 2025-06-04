const {
  getAllSekolahService,
  createSekolahService,
  updateSekolahService,
  deleteSekolahService,
  getSekolahByIdService,
} = require("../../services/sekolah/sekolahService");

// Controller: Get all sekolah
const getAllSekolah = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const result = await getAllSekolahService(page, limit);

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Sekolah retrieved successfully",
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

// Controller: Create sekolah
const createSekolah = async (req, res) => {
  try {
    const { location, inTime, outTime } = req.body;

    const newSekolah = await createSekolahService({ location, inTime, outTime });

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

// Controller: Update sekolah
const updateSekolah = async (req, res) => {
  try {
    const { idSekolah } = req.params;
    const { location, inTime, outTime } = req.body;

    const updatedSekolah = await updateSekolahService(idSekolah, { location, inTime, outTime });

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Sekolah updated successfully",
      data: updatedSekolah,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};

// Controller: Delete sekolah
const deleteSekolah = async (req, res) => {
  try {
    const { idSekolah } = req.params;

    await deleteSekolahService(idSekolah);

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

// Controller: Get by ID
const getSekolahById = async (req, res) => {
  try {
    const { idSekolah } = req.params;

    const sekolah = await getSekolahByIdService(idSekolah);

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