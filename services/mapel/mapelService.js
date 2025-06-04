const db = require("../../config/database");
const initModels = require("../../models/init-models");
const models = initModels(db);
const { v4: uuidv4 } = require("uuid");
const {
  getPagination,
  getPagingData,
} = require("../../helper/paginationHelper");

// Service: Mendapatkan semua data mata pelajaran
const getAllMapelService = async (page, limit) => {
  const { offset, limit: parsedLimit } = getPagination(page, limit);

  const result = await models.mata_pelajaran.findAndCountAll({
    offset,
    limit: parsedLimit,
    order: [["created_at", "DESC"]],
  });

  const meta = getPagingData(result.count, page, parsedLimit);

  return {
    data: result.rows,
    meta,
  };
};

// Service: Membuat mata pelajaran baru
const createMapelService = async (nama) => {
  if (!nama) {
    throw new Error("Nama mata pelajaran is required");
  }

  const newMapel = await models.mata_pelajaran.create({
    id_mapel: uuidv4(),
    nama,
    created_at: new Date(),
    update_at: new Date(),
  });

  return newMapel;
};

// Service: Update mata pelajaran
const updateMapelService = async (id_mapel, nama) => {
  if (!id_mapel) {
    throw new Error("id_mapel is required");
  }

  const mapel = await models.mata_pelajaran.findByPk(id_mapel);
  if (!mapel) {
    throw new Error("Mata pelajaran not found");
  }

  await mapel.update({
    nama,
    update_at: new Date(),
  });

  return mapel;
};

// Service: Hapus mata pelajaran
const deleteMapelService = async (id_mapel) => {
  if (!id_mapel) {
    throw new Error("id_mapel is required");
  }

  const deleted = await models.mata_pelajaran.destroy({
    where: { id_mapel },
  });

  if (!deleted) {
    throw new Error("Mata pelajaran not found");
  }
};

// Service: Dapatkan mata pelajaran berdasarkan ID
const getMapelByIdService = async (id_mapel) => {
  const mapel = await models.mata_pelajaran.findByPk(id_mapel);
  if (!mapel) {
    throw new Error("Mata pelajaran not found");
  }
  return mapel;
};

module.exports = {
  getAllMapelService,
  createMapelService,
  updateMapelService,
  deleteMapelService,
  getMapelByIdService,
};
