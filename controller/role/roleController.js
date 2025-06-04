const {
  getRoles,
  createRole,
  updateRole,
  deleteRole,
} = require("../../services/role/roleService")

// Get All Roles
const getRole = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const { count, rows } = await getRoles(limit, page);
    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
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
    return res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
      data: null,
    });
  }
};

// Create Role
const createRoleController = async (req, res) => {
  try {
    const { nama, code } = req.body;
    const newRole = await createRole(nama, code);

    return res.status(201).json({
      code: 201,
      status: "success",
      message: "Role created successfully",
      data: newRole,
    });
  } catch (error) {
    return res.status(error.message.includes("already exists") ? 409 : 500).json({
      code: 500,
      status: "error",
      message: error.message,
      data: null,
    });
  }
};

// Update Role
const updateRoleController = async (req, res) => {
  try {
    const { idRole } = req.params;
    const { nama, code } = req.body;

    const updatedRole = await updateRole(idRole, nama, code);

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Role updated successfully",
      data: updatedRole,
    });
  } catch (error) {
    if (error.message === "Role not found") {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: error.message,
      });
    }
    return res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};

// Delete Role
const deleteRoleController = async (req, res) => {
  const { idRole } = req.query;

  if (!idRole) {
    return res.status(400).json({
      code: 400,
      status: "error",
      message: "idRole is required",
    });
  }

  try {
    await deleteRole(idRole);

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Role deleted successfully",
    });
  } catch (error) {
    if (error.message === "Role not found") {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: error.message,
      });
    }
    return res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  getRole,
  createRole: createRoleController,
  updateRole: updateRoleController,
  deleteRole: deleteRoleController,
};