const authHelpers = require("../helpers/authHelper");
const AuthServices = require("../services/authServices");

const Register = async (req, res) => {
  try {
    const { nama, email, nisn, password, roleCode } = req.body;

    if (!(await AuthServices.validateRole(roleCode)))
      return res.status(400).json({ msg: "Invalid role code" });

    if ((roleCode === 2 && (!email || nisn)) || (roleCode === 1 && (!nisn || email)))
      return res.status(400).json({ msg: `Invalid input for roleCode ${roleCode}` });

    if (await AuthServices.findAuthByEmailOrNisn(email, nisn))
      return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await authHelpers.hashPassword(password);
    const newAuth = await AuthServices.createAuthEntry({
      idAuth: authHelpers.uuidv4(),
      email: roleCode === 2 ? email : null,
      nisn: roleCode === 1 ? nisn : null,
      password: hashedPassword,
      role_id: roleCode,
    });

    const newUser = await AuthServices.createUserEntry({
      idUser: authHelpers.uuidv4(),
      nama,
      auth_id: newAuth.idAuth,
    });

    res.status(201).json({
      code: 201,
      status: "success",
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({ code: 500, status: "error", message: error.message, data: null });
  }
};

const Login = async (req, res) => {
  try {
    const { email, nisn, password } = req.body;

    if (!email && !nisn)
      return res.status(400).json({ msg: "Email or NISN is required" });

    const auth = await AuthServices.findAuthByEmailOrNisn(email, nisn);
    if (!auth || !(await authHelpers.comparePassword(password, auth.password)))
      return res.status(401).json({ msg: "Invalid credentials" });

    const user = await AuthServices.findUserByAuthId(auth.idAuth);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const token = authHelpers.generateAccessToken(
      { idUser: user.idUser, roleCode: auth.role_id },
      process.env.ACCESS_TOKEN_SECRET,
      "1h"
    );

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Login successful",
      data: {
        idUser: user.idUser,
        email: auth.email,
        nisn: auth.nisn,
        roleCode: auth.role_id,
        accessToken: token,
      },
    });
  } catch (error) {
    res.status(500).json({ code: 500, status: "error", message: error.message, data: null });
  }
};

const ResetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ msg: "Email is required" });

    const newPassword = authHelpers.generateRandomPassword();
    await AuthServices.updateUserPassword(email, await authHelpers.hashPassword(newPassword));
    await authHelpers.sendEmail({
      to: email,
      subject: "Reset Password",
      text: `Your new password: ${newPassword}`,
    });

    res.status(200).json({ code: 200, status: "success", message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ code: 500, status: "error", message: error.message, data: null });
  }
};

module.exports = { Register, Login, ResetPassword };
