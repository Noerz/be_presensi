const AuthService = require("../services/authService");
const UserService = require("../services/userService");
const MailService = require("../services/mailService");

const Register = async (req, res) => {
  const { nama, email, nisn, password, roleCode } = req.body;

  try {
    const result = await AuthService.registerUser({ nama, email, nisn, password, roleCode });
    res.status(result.status).json(result.response);
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ msg: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, nisn, password } = req.body;
    const result = await AuthService.loginUser({ email, nisn, password });
    res.status(result.status).json(result.response);
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
    const { email } = req.body;
    const result = await AuthService.resetPassword(email);
    res.status(result.status).json(result.response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { Register, login, resetPassword };