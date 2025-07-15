const db = require("../../config/database");
const initModels = require("../../models/init-models");
const { v4: uuidv4 } = require("uuid");

const models = initModels(db);

/**
 * Get all jadwal with pagination
 */
const getAllJadwal = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  return await models.jadwal.findAndCountAll({
    offset,
    limit,
    order: [["createdAt", "DESC"]],
    include: [
      { model: models.mata_pelajaran, as: "mapel" },
      { model: models.user, as: "guru" },
      { model: models.kela, as: "kela" },
    ],
  });
};

/**
 * Create new jadwal
 */
const createJadwal = async ({
  hari,
  tahun,
  jam_mulai,
  jam_selesai,
  mapel_id,
  guru_id,
  kelas_id,
}) => {
  return await models.jadwal.create({
    idJadwal: uuidv4(),
    hari,
    tahun,
    jam_mulai,
    jam_selesai,
    mapel_id,
    guru_id,
    kelas_id,
  });
};

/**
 * Get jadwal by primary key
 */
const getJadwalById = async (idJadwal) => {
  return await models.jadwal.findByPk(idJadwal, {
    include: [
      { model: models.mata_pelajaran, as: "mapel" },
      { model: models.user, as: "guru" },
      { model: models.kela, as: "kela" },
    ],
  });
};

/**
 * Update existing jadwal by ID
 */
const updateJadwal = async (idJadwal, updatePayload) => {
  const jadwal = await models.jadwal.findByPk(idJadwal);
  if (!jadwal) return null;

  await jadwal.update(updatePayload);
  return jadwal;
};

/**
 * Delete jadwal by ID
 */
const deleteJadwal = async (idJadwal) => {
  const deleted = await models.jadwal.destroy({
    where: { idJadwal },
  });
  return deleted > 0;
};

module.exports = {
  getAllJadwal,
  createJadwal,
  getJadwalById,
  updateJadwal,
  deleteJadwal,
};
