const jwt = require("jsonwebtoken");
const db = require("../config/database");
const initModels = require("../models/init-models");
const models = initModels(db);

/**
 * Verifikasi token JWT
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      code: 401,
      status: "error",
      message: "Access token not provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.decoded = decoded;
    next();
    console.log("Decoded JWT:", decoded);
  } catch (err) {
    return res.status(403).json({
      code: 403,
      status: "error",
      message: "Invalid or expired token",
    });
  }
};

const checkRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const { idUser } = req.decoded;

      // 1. Dapatkan data user beserta auth_id
      const user = await models.user.findByPk(idUser);
      if (!user) {
        return res.status(403).json({
          code: 403,
          status: "error",
          message: "User not found",
        });
      }
       console.log("User", user);
      // 2. Dapatkan data auth beserta role
      const auth = await models.auth.findOne({
        where: { idAuth: user.auth_id },
        include: [
          {
            model: models.role,
            as: "role",
            attributes: ["code"], // Ambil hanya kolom code (kode role)
          },
        ],
      });
      console.log("Auth", auth);
      if (!auth || !auth.role_id) {
        return res.status(403).json({
          code: 403,
          status: "error",
          message: "User does not have a role assigned",
        });
      }

      // 3. Dapatkan kode role dari kolom 'code'
      const userRoleCode = auth.role.code;

      // 4. Verifikasi role
      if (!allowedRoles.includes(userRoleCode)) {
        return res.status(403).json({
          code: 403,
          status: "error",
          message: `Forbidden: Role ${userRoleCode} is not authorized for this action`,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        code: 500,
        status: "error",
        message: error.message,
      });
    }
  };
};

// Alias untuk middleware role spesifik
const isAdmin = checkRole([1]); // node=1 = administrator
const isAdminTU = checkRole([2]); // node=2 = admin TU
const isStaff = checkRole([3]); // node=3 = staff/guru

module.exports = {
  verifyToken,
  isAdmin,
  isAdminTU,
  isStaff,
  checkRole,
};
