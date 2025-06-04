const db = require("../../config/database");
const initModels = require("../../models/init-models");
const models = initModels(db);
const { v4: uuidv4 } = require("uuid");

// Import helper pagination
const {
  getPagination,
  getPagingData,
} = require("../../helper/paginationHelper");

// Service: Mendapatkan semua data sekolah
const getAllSekolahService = async (page, limit) => {
  const { offset, limit: parsedLimit } = getPagination(page, limit);

  const result = await models.sekolah.findAndCountAll({
    offset,
    limit: parsedLimit,
    order: [["createdAt", "DESC"]],
  });

  const meta = getPagingData(result.count, page, parsedLimit);

  return {
    data: result.rows,
    meta,
  };
};

// Service: Membuat sekolah baru
const createSekolahService = async ({ location, inTime, outTime }) => {
  if (!location || !inTime || !outTime) {
    throw new Error("Location, inTime, and outTime are required");
  }

  const newSekolah = await models.sekolah.create({
    idSekolah: uuidv4(),
    location,
    inTime,
    outTime,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return newSekolah;
};

// Service: Update sekolah berdasarkan idSekolah
const updateSekolahService = async (
  idSekolah,
  { location, inTime, outTime }
) => {
  if (!idSekolah) {
    throw new Error("idSekolah is required");
  }

  const sekolah = await models.sekolah.findByPk(idSekolah);
  if (!sekolah) {
    throw new Error("Sekolah not found");
  }

  await sekolah.update({
    location,
    inTime,
    outTime,
    updatedAt: new Date(),
  });

  return sekolah;
};

// Service: Hapus sekolah berdasarkan idSekolah
const deleteSekolahService = async (idSekolah) => {
  if (!idSekolah) {
    throw new Error("idSekolah is required");
  }

  const deleted = await models.sekolah.destroy({
    where: { idSekolah },
  });

  if (!deleted) {
    throw new Error("Sekolah not found");
  }
};

// Service: Dapatkan sekolah berdasarkan ID
const getSekolahByIdService = async (idSekolah) => {
  const sekolah = await models.sekolah.findByPk(idSekolah);
  if (!sekolah) {
    throw new Error("Sekolah not found");
  }
  return sekolah;
};

module.exports = {
  getAllSekolahService,
  createSekolahService,
  updateSekolahService,
  deleteSekolahService,
  getSekolahByIdService,
};
