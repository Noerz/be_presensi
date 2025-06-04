const {
  getAllMapelService,
  createMapelService,
  updateMapelService,
  deleteMapelService,
  getMapelByIdService,
} = require("../../services/mapel/mapelService");

// Controller: Get all mapel
const getAllMapel = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const result = await getAllMapelService(page, limit);

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Mata pelajaran retrieved successfully",
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

// Controller: Create mapel
const createMapel = async (req, res) => {
  try {
    const { nama } = req.body;

    const newMapel = await createMapelService(nama);

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

// Controller: Update mapel
const updateMapel = async (req, res) => {
  try {
    const { id_mapel } = req.params;
    const { nama } = req.body;

    const updatedMapel = await updateMapelService(id_mapel, nama);

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Mata pelajaran updated successfully",
      data: updatedMapel,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};

// Controller: Delete mapel
const deleteMapel = async (req, res) => {
  try {
    const { id_mapel } = req.params;

    await deleteMapelService(id_mapel);

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

// Controller: Get by ID
const getMapelById = async (req, res) => {
  try {
    const { id_mapel } = req.params;

    const mapel = await getMapelByIdService(id_mapel);

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