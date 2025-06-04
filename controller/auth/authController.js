const AuthService = require("../../services/auth/authService");

const Register = async (req, res) => {
  const { nama, email, password, roleCode } = req.body;

  try {
    const result = await AuthService.registerUser({ nama, email, password, roleCode });
    res.status(result.status).json(result.response);
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ msg: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.loginUser({ email, password });
    res.status(result.status).json(result.response);
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ msg: error.message });
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