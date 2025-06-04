const profileController = require("../controller/profile/profileController");
const { verifyToken} = require("../middleware/verifyAuth");
const upload = require("../middleware/upload")

const profileRoutes = (router) => {
  router.get("/profile", verifyToken, profileController.getProfile);
  router.get("/profile/picture", verifyToken, profileController.getProfilePicture);
  router.put("/profile", verifyToken, profileController.updateProfile);
  router.put("/profile/change-password", verifyToken, profileController.changePassword);
  router.put(
    "/profile/change-picture",
    upload.single("image"),
    verifyToken,
    profileController.updateProfilePicture
  );
};

module.exports = { profileRoutes };
