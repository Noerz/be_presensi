const express = require("express");
const router = express.Router();
const {
  getProfile,
  getProfilePicture,
  updateProfile,
  changePassword,
  updateProfilePicture,
} = require("../controller/profileController");
const { verifyToken, upload } = require("../middleware/verifyAuth");

const profileRoutes = (router) => {
  router.get("/profile", verifyToken, getProfile);
  router.get("/profile/picture", verifyToken, getProfilePicture);
  router.put("/profile", verifyToken, updateProfile);
  router.put("/profile/change-password", verifyToken, changePassword);
  router.put(
    "/profile/change-picture",
    upload.single("image"),
    verifyToken,
    updateProfilePicture
  );
};

module.exports = { profileRoutes };
