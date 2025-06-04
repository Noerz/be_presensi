const { v4: uuidv4 } = require("uuid");
const models = require("../../models/init-models")(
  require("../../config/database")
);

const getAllKelas = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const { count, rows } = await models.kela.findAndCountAll({
    offset: parseInt(offset),
    limit: parseInt(limit),
    order: [["createdAt", "DESC"]],
  });

  return {
    data: rows,
    meta: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit),
    },
  };
};

const createKelas = async (nama_kelas, jumlah) => {
  if (!nama_kelas || !jumlah) {
    throw new Error("nama_kelas and jumlah are required");
  }

  if (nama_kelas.length > 2 || jumlah.length > 2) {
    throw new Error("nama_kelas and jumlah must be 2 characters long");
  }

  return await models.kela.create({
    idKelas: uuidv4(),
    nama_kelas,
    jumlah,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

const updateKelas = async (idKelas, nama_kelas, jumlah) => {
  if (!idKelas) {
    throw new Error("idKelas is required");
  }

  if (nama_kelas && nama_kelas.length > 2) {
    throw new Error("nama_kelas must be 2 characters long");
  }

  if (jumlah && jumlah.length > 2) {
    throw new Error("jumlah must be 2 characters long");
  }

  const kelas = await models.kela.findByPk(idKelas);
  if (!kelas) {
    throw new Error("Kelas not found");
  }

  return await kelas.update({
    nama_kelas,
    jumlah,
    updatedAt: new Date(),
  });
};

const deleteKelas = async (idKelas) => {
  if (!idKelas) {
    throw new Error("idKelas is required");
  }

  const deletedCount = await models.kela.destroy({
    where: { idKelas },
  });

  if (deletedCount === 0) {
    throw new Error("Kelas not found");
  }

  return deletedCount;
};

const getKelasById = async (idKelas) => {
  const kelas = await models.kela.findByPk(idKelas);
  if (!kelas) {
    throw new Error("Kelas not found");
  }
  return kelas;
};

module.exports = {
  getAllKelas,
  createKelas,
  updateKelas,
  deleteKelas,
  getKelasById,
};
