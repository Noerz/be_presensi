const db = require("../config/database");
const initModels = require("../models/init-models");
const models = initModels(db);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const UserService = require("./userService");
const MailService = require("./mailService");

class AuthService {
  static async registerUser({ nama, email, nisn, password, roleCode }) {
    try {
      const role = await models.role.findOne({ where: { code: roleCode } });
      if (!role) {
        return { status: 400, response: { msg: "Invalid role code" } };
      }

      if (roleCode === 2 && !email) {
        return { status: 400, response: { msg: "Email is required for Guru" } };
      }
      if (roleCode === 1 && !nisn) {
        return { status: 400, response: { msg: "NISN is required for Murid" } };
      }

      if (roleCode === 2 && nisn) {
        return { status: 400, response: { msg: "NISN should not be provided for Guru" } };
      }
      if (roleCode === 1 && email) {
        return { status: 400, response: { msg: "Email should not be provided for Murid" } };
      }

      let existingAuth;
      if (roleCode === 2) {
        existingAuth = await models.auth.findOne({ where: { email } });
      } else if (roleCode === 1) {
        existingAuth = await models.auth.findOne({ where: { nisn } });
      }

      if (existingAuth) {
        return { status: 400, response: { msg: "User already exists in auth table" } };
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const newAuth = await models.auth.create({
        idAuth: uuidv4(),
        email: roleCode === 2 ? email : null,
        nisn: roleCode === 1 ? nisn : null,
        password: hashPassword,
        role_id: role.idRole,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      let newUser;
      if (roleCode === 2) {
        newUser = await UserService.createStaff({ nama, auth_id: newAuth.idAuth, gender: req.body.gender });
      } else if (roleCode === 1) {
        newUser = await UserService.createMurid({ nama, auth_id: newAuth.idAuth });
      }

      return { status: 201, response: { msg: "User registered successfully", data: newUser } };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async loginUser({ email, nisn, password }) {
    try {
      if (!email && !nisn) {
        return {
          status: 400,
          response: {
            code: 400,
            status: "error",
            message: "Email or NISN is required",
          },
        };
      }

      let auth;
      if (email) {
        auth = await models.auth.findOne({
          where: { email },
          include: [{ model: models.role, as: "role" }],
        });
      } else if (nisn) {
        auth = await models.auth.findOne({
          where: { nisn },
          include: [{ model: models.role, as: "role" }],
        });
      }

      if (!auth) {
        return {
          status: 404,
          response: {
            code: 404,
            status: "error",
            message: "User not found",
            data: null,
          },
        };
      }

      const match = await bcrypt.compare(password, auth.password);
      if (!match) {
        return {
          status: 400,
          response: {
            code: 400,
            status: "error",
            message: "Incorrect password",
            data: null,
          },
        };
      }

      let user;
      if (auth.role.code === 2) {
        user = await models.staff.findOne({ where: { auth_id: auth.idAuth } });
      } else if (auth.role.code === 1) {
        user = await models.murid.findOne({ where: { auth_id: auth.idAuth } });
      }

      if (!user) {
        return {
          status: 404,
          response: {
            code: 404,
            status: "error",
            message: "User not found",
            data: null,
          },
        };
      }

      const roleCode = auth.role ? auth.role.code : null;

      const accessToken = jwt.sign(
        {
          idUser: user.idUser,
          roleCode: roleCode,
          idStaff: auth.role.code === 2 ? user.idStaff : null,
          idMurid: auth.role.code === 1 ? user.idMurid : null,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h", algorithm: "HS256" }
      );

      const result = {
        idUser: user.idUser,
        email: auth.email,
        nisn: auth.nisn,
        roleCode: roleCode,
        accessToken: accessToken,
      };

      return {
        status: 200,
        response: {
          code: 200,
          status: "success",
          message: "Login successful",
          data: result,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async resetPassword(email) {
    try {
      if (!email) return { status: 400, response: { msg: "Email is required" } };
      if (!email.includes("@")) return { status: 400, response: { msg: "Invalid email format" } };

      let password = "HIMTIF#";
      const characters = process.env.RANDOM_PASSWORD;
      const charactersLength = characters.length;
      for (let i = 0; i < 8; i++) {
        password += characters.charAt(Math.floor(Math.random() * charactersLength));
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await models.auth.update({ password: hashedPassword }, { where: { email } });

      await MailService.sendResetPasswordEmail(email, password);

      return { status: 200, response: { msg: "Password reset successful" } };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = AuthService;
