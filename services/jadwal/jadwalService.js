// /src/services/jadwal.service.js

const db = require("../../config/database");
const initModels = require("../../models/init-models");
const models = initModels(db);
const { v4: uuidv4 } = require("uuid");

const getAllJadwal = async (page, limit) => {
  const offset = (page - 1) * limit;
  return await models.jadwal.findAndCountAll({
    offset: parseInt(offset),
    limit: parseInt(limit),
    order: [["createdAt", "DESC"]],
    include: [
      { model: models.mata_pelajaran, as: "mapel" },
      { model: models.user, as: "guru" },
      { model: models.kela, as: "kela" },
    ],
  });
};

const createJadwal = async (payload) => {
  // Pastikan field sesuai model
  const {
    hari,
    tahun,
    jam_mulai,
    jam_selesai,
    mapel_id,
    guru_id,
    kelas_id,
  } = payload;

  return await models.jadwal.create({
    idJadwal: uuidv4(),
    hari,
    tahun,
    jam_mulai,
    jam_selesai,
    mapel_id,
    guru_id,
    kelas_id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

const getJadwalById = async (idJadwal) => {
  return await models.jadwal.findByPk(idJadwal, {
    include: [
      { model: models.mata_pelajaran, as: "mapel" },
      { model: models.user, as: "guru" },
      { model: models.kela, as: "kela" },
    ],
  });
};

const updateJadwal = async (idJadwal, payload) => {
  const jadwal = await models.jadwal.findByPk(idJadwal);
  if (!jadwal) return null;

  // Hanya update field yang ada di model
  await jadwal.update({
    hari: payload.hari,
    tahun: payload.tahun,
    jam_mulai: payload.jam_mulai,
    jam_selesai: payload.jam_selesai,
    mapel_id: payload.mapel_id,
    guru_id: payload.guru_id,
    kelas_id: payload.kelas_id,
    updatedAt: new Date(),
  });

  return jadwal;
};

const deleteJadwal = async (idJadwal) => {
  const deleted = await models.jadwal.destroy({ where: { idJadwal } });
  return deleted > 0;
};

module.exports = {
  getAllJadwal,
  createJadwal,
  getJadwalById,
  updateJadwal,
  deleteJadwal,
};