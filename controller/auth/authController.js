const AuthService = require("../../services/auth/authService");

const Register = async (req, res) => {
  const { nama, email, password, roleCode } = req.body;

  try {
    const result = await AuthService.registerUser({
      nama,
      email,
      password,
      roleCode,
    });
    res.status(result.status).json(result.response);
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ msg: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "Email and password are required",
      });
    }

    const result = await AuthService.loginUser({ email, password });

    return res.status(result.status).json(result.response);
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      code: 500,
      status: "error",
      message: "Internal server error",
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
