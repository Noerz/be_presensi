const db = require("../../config/database");
const initModels = require("../../models/init-models");
const models = initModels(db);
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

class ProfileService {
  static async getProfile(decoded, protocol, host) {
    const { idUser, roleCode } = decoded;
    let response;

    if ([1, 2].includes(roleCode)) {
      response = await models.user.findOne({
        where: { idUser },
        include: [{ model: models.auth, as: "auth", attributes: ["email"] }],
      });
    }

    if (!response) throw new Error("Profile not found");

    // Buat URL gambar jika ada
    if (response.image) {
      response.image = `${protocol}://${host}/uploads/${response.image}`;
    }

    return response;
  }

  static async updateProfile(decoded, data) {
    const { idUser } = decoded;

    const [updated] = await models.user.update(
      { ...data, updatedAt: new Date() },
      { where: { idUser } }
    );

    if (updated === 0) throw new Error("Profile not found");
  }

  static async changePassword(decoded, oldPassword, newPassword) {
    const { idUser } = decoded;

    const user = await models.auth.findOne({
      include: [{ model: models.user, as: "user", where: { idUser } }],
    });

    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) throw new Error("Old password is incorrect");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await models.auth.update(
      { password: hashedPassword, updatedAt: new Date() },
      { where: { idAuth: user.idAuth } }
    );
  }

  static async updateProfilePicture(decoded, file) {
    const { idUser, roleCode } = decoded;

    if (![1, 2].includes(roleCode)) throw new Error("Invalid role");

    const user = await models.user.findOne({ where: { idUser } });
    if (!user) throw new Error("User not found");

    // Hapus foto lama jika ada
    if (user.image) {
      const oldImagePath = path.join(__dirname, "../uploads", user.image);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    await models.user.update(
      { image: file.filename, updatedAt: new Date() },
      { where: { idUser } }
    );
  }

  static async getProfilePicture(decoded) {
    const { idUser, roleCode } = decoded;

    if (![1, 2].includes(roleCode)) throw new Error("Invalid role");

    const user = await models.user.findOne({ where: { idUser } });
    if (!user || !user.image) throw new Error("Profile picture not found");

    // Gunakan path.resolve untuk pastikan path benar
    const filePath = path.resolve(__dirname, "../../uploads", user.image);

    // Debugging (boleh dihapus setelah fix)
    console.log("Looking for image at:", filePath);

    if (!fs.existsSync(filePath)) throw new Error("File not found");

    return filePath;
  }
}

module.exports = ProfileService;
