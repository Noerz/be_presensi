const jadwalService = require("../../services/jadwal/jadwalService");
const { successResponse, errorResponse } = require("../../helper/response");

const getAllJadwalController = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { count, rows } = await jadwalService.getAllJadwal(+page, +limit);
    return successResponse(res, 200, "Jadwal retrieved successfully", rows, {
      total: count,
      page: +page,
      limit: +limit,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    next(err);
  }
};

const createJadwalController = async (req, res, next) => {
  try {
    const newJadwal = await jadwalService.createJadwal(req.body);
    return successResponse(res, 201, "Jadwal created successfully", newJadwal);
  } catch (err) {
    next(err);
  }
};

const getJadwalByIdController = async (req, res, next) => {
  try {
    const jadwal = await jadwalService.getJadwalById(req.params.idJadwal);
    if (!jadwal) return errorResponse(res, 404, "Jadwal not found");
    return successResponse(res, 200, "Jadwal retrieved successfully", jadwal);
  } catch (err) {
    next(err);
  }
};

const updateJadwalController = async (req, res, next) => {
  try {
    const updated = await jadwalService.updateJadwal(req.params.idJadwal, req.body);
    if (!updated) return errorResponse(res, 404, "Jadwal not found");
    return successResponse(res, 200, "Jadwal updated successfully", updated);
  } catch (err) {
    next(err);
  }
};

const deleteJadwalController = async (req, res, next) => {
  try {
    const deleted = await jadwalService.deleteJadwal(req.params.idJadwal);
    if (!deleted) return errorResponse(res, 404, "Jadwal not found");
    return successResponse(res, 200, "Jadwal deleted successfully");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllJadwalController,
  createJadwalController,
  getJadwalByIdController,
  updateJadwalController,
  deleteJadwalController,
};
