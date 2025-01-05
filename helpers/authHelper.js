const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

class authHelpers {
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async comparePassword(inputPassword, hashedPassword) {
    return bcrypt.compare(inputPassword, hashedPassword);
  }

  static generateAccessToken(payload, secret, expiresIn) {
    return jwt.sign(payload, secret, { expiresIn });
  }

  static async sendEmail({ to, subject, text }) {
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

    return transporter.sendMail({
      from: process.env.USER_MAIL,
      to,
      subject,
      text,
    });
  }

  static generateRandomPassword(length = 8) {
    const characters = process.env.RANDOM_PASSWORD;
    let password = "HIMTIF#";
    for (let i = 0; i < length; i++) {
      password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
  }
}

module.exports = authHelpers;
