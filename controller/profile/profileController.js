const ProfileService = require("../../services/profile/profileService");

const getProfile = async (req, res) => {
  try {
    const { decoded } = req;
    const profile = await ProfileService.getProfile(decoded, req.protocol, req.get("host"));

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Profile retrieved successfully",
      data: profile,
    });
  } catch (error) {
    console.error("Error in getProfile:", error.message);
    return res.status(404).json({
      code: 404,
      status: "error",
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { decoded } = req;
    const { nama, alamat, noHp, status } = req.body;

    await ProfileService.updateProfile(decoded, { nama, alamat, noHp, status });

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error in updateProfile:", error.message);
    return res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { decoded } = req;
    const { oldPassword, newPassword } = req.body;

    await ProfileService.changePassword(decoded, oldPassword, newPassword);

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error in changePassword:", error.message);
    return res.status(error.message.includes("incorrect") ? 400 : 500).json({
      code: error.message.includes("incorrect") ? 400 : 500,
      status: "error",
      message: error.message,
    });
  }
};

const updateProfilePicture = async (req, res) => {
  try {
    const { decoded } = req;
    console.log(req.file);
    if (!req.file) {
      return res.status(400).json({
        code: 400,
        status: "error",
        message: "No file uploaded",
      });
    }

    await ProfileService.updateProfilePicture(decoded, req.file);

    return res.status(200).json({
      code: 200,
      status: "success",
      message: "Profile picture updated successfully",
    });
  } catch (error) {
    console.error("Error in updateProfilePicture:", error.message);
    return res.status(500).json({
      code: 500,
      status: "error",
      message: error.message,
    });
  }
};

const getProfilePicture = async (req, res) => {
  try {
    const { decoded } = req;
    const filePath = await ProfileService.getProfilePicture(decoded);

    return res.sendFile(filePath);
  } catch (error) {
    console.error("Error in getProfilePicture:", error.message);
    return res.status(404).json({
      code: 404,
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  updateProfilePicture,
  getProfilePicture,
};