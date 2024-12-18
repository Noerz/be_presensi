const db = require("../config/database");
const initModels = require("../models/init-models");
const models = initModels(db);
// Mengimpor uuid
const { v4: uuidv4 } = require("uuid");

const getRole = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // default limit
    const page = parseInt(req.query.page) || 1; // default page
    const offset = (page - 1) * limit;

    const { count, rows } = await models.role.findAndCountAll({
      limit,
      offset,
    });
    const totalPages = Math.ceil(count / limit);
    res.status(200).json({
      code: 200,
      status: "success",
      message: "Role retrieved successfully",
      data: rows,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: page,
      },
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
      data: null,
    });
  }
};

const createRole = async (req, res) => {
  try {
    const { nama, code } = req.body;

    // Periksa apakah 'nama' atau 'code' sudah ada di database
    const existingRole = await models.role.findOne({
      where: {
        [db.Sequelize.Op.or]: [{ nama: nama }, { code: code }],
      },
    });

    if (existingRole) {
      return res.status(409).json({
        code: 409,
        status: "conflict",
        message: "Role with the same name or code already exists",
      });
    }

    // Jika tidak ada duplikat, buat role baru
    const newRole = await models.role.create({
      idRole: uuidv4(),
      nama,
      code,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({
      code: 201,
      status: "success",
      message: "Role created successfully",
      data: newRole,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
      data: null,
    });
  }
};

const updateRole = async (req, res) => {
  try {
    const { idRole } = req.params; // Mengambil idRole dari req.params
    const role = await models.role.findOne({ where: { idRole } });

    if (!role) {
      return res.status(404).json({ msg: "Role tidak ditemukan" });
    }

    const body = {
      nama: req.body.nama,
      code: req.body.code,
      updatedAt: new Date(),
    };

    await models.role.update(body, { where: { idRole } });

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Role updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};

const deleteRole = async (req, res) => {
  const { idRole } = req.query;
  if (!idRole) {
    return res.status(400).json({
      code: 400,
      status: "error",
      message: "idRole is required",
      data: null,
    });
  }
  try {
    const deleteRole = await models.role.destroy({ where: { idRole } });
    if (!deleteRole) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Role not found",
      });
    }
    res.status(200).json({
      code: 200,
      status: "success",
      message: "Dompet deleted successfully",
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
  createRole,
  getRole,
  updateRole,
  deleteRole,
};
