const nodemailer = require("nodemailer");

class MailService {
  static async sendResetPasswordEmail(email, password) {
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

    const mailOptions = {
      from: process.env.USER_MAIL,
      to: email,
      subject: "Reset Password",
      text: `Your new password: ${password}`,
    };

    await transporter.sendMail(mailOptions);
  }
}

module.exports = MailService;