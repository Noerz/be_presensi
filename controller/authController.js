const db = require("../config/database");
const initModels = require("../models/init-models");
const models = initModels(db);
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

const Register = async (req, res) => {
  const { nama, email, nisn, password, roleCode } = req.body;

  try {
    // Check if roleCode is valid
    const role = await models.role.findOne({ where: { code: roleCode } });
    if (!role) {
      return res.status(400).json({ msg: "Invalid role code" });
    }

    // Validate input based on role
    if (roleCode === 2 && !email) {
      return res.status(400).json({ msg: "Email is required for Guru" });
    }
    if (roleCode === 1 && !nisn) {
      return res.status(400).json({ msg: "NISN is required for Murid" });
    }

    // Ensure the right fields are not mixed
    if (roleCode === 2 && nisn) {
      return res
        .status(400)
        .json({ msg: "NISN should not be provided for Guru" });
    }
    if (roleCode === 1 && email) {
      return res
        .status(400)
        .json({ msg: "Email should not be provided for Murid" });
    }

    // Check for duplicates in the auth table
    let existingAuth;
    if (roleCode === 2) {
      existingAuth = await models.auth.findOne({ where: { email } });
    } else if (roleCode === 1) {
      existingAuth = await models.auth.findOne({ where: { nisn } });
    }

    if (existingAuth) {
      return res.status(400).json({ msg: "User already exists in auth table" });
    }

    // Check for duplicates in the user table (if necessary)
    const existingUser = await models.user.findOne({ where: { nama } });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists in user table" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create an entry in the auth table
    const newAuth = await models.auth.create({
      idAuth: uuidv4(),
      email: roleCode === 2 ? email : null,
      nisn: roleCode === 1 ? nisn : null,
      password: hashPassword,
      role_id: role.idRole, // Set the role_id from the role table
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create a user entry if auth entry is successful
    if (newAuth) {
      const newUser = await models.user.create({
        idUser: uuidv4(),
        nama,
        auth_id: newAuth.idAuth,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      res
        .status(201)
        .json({ msg: "User registered successfully", data: newUser });
    } else {
      res.status(400).json({ msg: "Failed to create auth entry" });
    }

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ msg: error.message });
  }
};


const login = async (req, res) => {
  try {
    const { email, nisn, password } = req.body;

    // Check if either email or nisn is provided
    if (!email && !nisn) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Email or NISN is required",
        data: null,
      });
    }

    // Find the auth record based on email or nisn and include the role using the alias
    let auth;
    if (email) {
      auth = await models.auth.findOne({
        where: { email },
        include: [{ model: models.role, as: 'role', attributes: ['code'] }] // Use the alias 'role'
      });
      if (!auth) {
        return res.status(404).json({
          code: 404,
          status: "error",
          message: "Email not found",
          data: null,
        });
      }
    } else if (nisn) {
      auth = await models.auth.findOne({
        where: { nisn },
        include: [{ model: models.role, as: 'role', attributes: ['code'] }] // Use the alias 'role'
      });
      if (!auth) {
        return res.status(404).json({
          code: 404,
          status: "error",
          message: "NISN not found",
          data: null,
        });
      }
    }

    // Check if the password matches
    const match = await bcrypt.compare(password, auth.password);
    if (!match) {
      return res.status(401).json({
        code: 401,
        status: "error",
        message: "Incorrect password",
        data: null,
      });
    }

    // Find the user record linked to the auth record
    const user = await models.user.findOne({ where: { auth_id: auth.idAuth } });
    if (!user) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "User not found",
        data: null,
      });
    }

    // Get the roleCode from the included role model
    const roleCode = auth.role ? auth.role.code : null;

    // Create the access token
    const accessToken = jwt.sign(
      { idUser: user.idUser, roleCode: roleCode }, // Include idUser and roleCode
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" } // Set token expiration
    );

    // Response object
    const result = {
      idUser: user.idUser,
      email: auth.email,
      nisn: auth.nisn,
      roleCode: roleCode, // Return roleCode in the response
      accessToken: accessToken,
    };

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
      data: null,
    });
  }
};


const resetPassword = async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.SERVICE_MAIL,
      host: process.env.HOST_MAIL,
      port: process.env.PORT_MAIL,
      secure: true,
      auth: {
        user: process.env.USER_MAIL,
        pass: process.env.PASS_MAIL,
      },
    });

    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "Email is required" });
    if (!email.includes("@"))
      return res.status(400).json({ msg: "Invalid email format" });

    let password = "HIMTIF#";
    const characters = process.env.RANDOM_PASSWORD;
    const charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await models.user.update(
      { password: hashedPassword },
      { where: { email } }
    );

    const mailOptions = {
      from: process.env.USER_MAIL,
      to: email,
      subject: "Reset Password",
      text: `Your new password: ${password}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ msg: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { Register, login, resetPassword };
