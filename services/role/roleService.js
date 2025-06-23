const { v4: uuidv4 } = require("uuid");

const Role = require("../../models/init-models").initModels(
  require("../../config/database")
).role;

const getRoles = async (limit, page) => {
  const offset = (page - 1) * limit;
  return await Role.findAndCountAll({ limit, offset });
};

const createRole = async (nama, code) => {
  const existingRole = await Role.findOne({
    where: {
      [require("sequelize").Op.or]: [{ nama }, { code }],
    },
  });

  if (existingRole) {
    throw new Error("Role with the same name or code already exists");
  }

  return await Role.create({
    idRole: uuidv4(),
    nama,
    code,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

const createMultipleRoles = async (roles) => {
  const createdRoles = [];

  for (const role of roles) {
    const { nama, code } = role;

    const existingRole = await Role.findOne({
      where: {
        [require("sequelize").Op.or]: [{ nama }, { code }],
      },
    });

    if (!existingRole) {
      const newRole = await Role.create({
        idRole: uuidv4(),
        nama,
        code,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      createdRoles.push(newRole);
    }
  }

  return createdRoles;
};

const updateRole = async (idRole, nama, code) => {
  const role = await Role.findOne({ where: { idRole } });
  if (!role) throw new Error("Role not found");

  role.nama = nama || role.nama;
  role.code = code || role.code;
  role.updatedAt = new Date();

  await role.save();
  return role;
};

const deleteRole = async (idRole) => {
  const deleted = await Role.destroy({ where: { idRole } });
  if (!deleted) throw new Error("Role not found");
};

module.exports = {
  getRoles,
  createRole,
  createMultipleRoles,
  updateRole,
  deleteRole,
  
};
