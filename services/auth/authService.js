const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const db = require("../../config/database");
const models = require("../../models/init-models")(db);
const MailService = require("./mailService");
const UserService = require("./userService");

class AuthService {
  static async registerUser({ nip, nama, email, password, roleCode }) {
    console.log("nip:", nip);
    try {
      // Validasi Role
      const role = await models.role.findOne({ where: { code: roleCode } });
      if (!role) return { status: 400, response: { msg: "Invalid role code" } };

      // Cek apakah email sudah digunakan
      const existingAuth = await models.auth.findOne({ where: { email } });
      if (existingAuth)
        return { status: 409, response: { msg: "Email already exists" } };

      // Cek apakah NIP sudah digunakan
      if (nip) {
        const existingUser = await models.user.findOne({ where: { nip } });
        if (existingUser)
          return { status: 409, response: { msg: "NIP already exists" } };
      }

      // Enkripsi password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      // Buat user di tabel auth
      const newAuth = await models.auth.create({
        idAuth: uuidv4(),
        email,
        password: hashPassword,
        role_id: role.idRole,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Buat profil user sesuai role
      let newUser;
      if ([1, 2].includes(roleCode)) {
        newUser = await UserService.createStaff({
          nama,
          nip,
          auth_id: newAuth.idAuth,
        });
      }

      return {
        status: 201,
        response: {
          code: 201,
          status: "success",
          message: "User registered successfully",
          data: newUser || null,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async loginUser({ email, password }) {
    try {
      const auth = await models.auth.findOne({
        where: { email },
        include: [{ model: models.role, as: "role" }],
      });

      if (!auth)
        return {
          status: 404,
          response: {
            code: 404,
            status: "error",
            message: "User not found",
          },
        };

      const match = await bcrypt.compare(password, auth.password);
      if (!match)
        return {
          status: 400,
          response: {
            code: 400,
            status: "error",
            message: "Incorrect password",
          },
        };

      const user = await models.user.findOne({
        where: { auth_id: auth.idAuth },
      });
      if (!user)
        return {
          status: 404,
          response: {
            code: 404,
            status: "error",
            message: "Profile not found",
          },
        };

      const accessToken = jwt.sign(
        {
          idUser: user.idUser,
          roleCode: auth.role.code,
          idStaff: user.idStaff,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h", algorithm: "HS256" }
      );
      console.log("Access Token:", accessToken);
      const result = {
        // idUser: user.idUser,
        // email: auth.email,
        // roleCode: auth.role.code,
        accessToken,
        roleCode: auth.role.code, // tambahkan roleCode di sini
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
      if (!email)
        return { status: 400, response: { msg: "Email is required" } };
      if (!email.includes("@"))
        return { status: 400, response: { msg: "Invalid email format" } };

      const newPassword = generateRandomPassword();

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await models.auth.update(
        { password: hashedPassword },
        { where: { email } }
      );

      await MailService.sendResetPasswordEmail(email, newPassword);

      return {
        status: 200,
        response: {
          code: 200,
          status: "success",
          message: "Password reset successful",
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

function generateRandomPassword() {
  const chars =
    process.env.RANDOM_PASSWORD ||
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "HIMTIF#";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

module.exports = AuthService;
