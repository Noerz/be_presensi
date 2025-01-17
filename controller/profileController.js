const db = require("../config/database");
const initModels = require("../models/init-models");
const models = initModels(db);
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Mendapatkan data profil
const getProfile = async (req, res) => {
  try {
    const { idMurid: siswa_id,idStaff:staff_id, roleCode } = req.decoded;
    let response;

    if (roleCode === 2) {
      response = await models.staff.findOne({
        where: { idStaff: staff_id },
        include: [
          { model: models.auth, as: "auth", attributes: ["email"] },
        ],
      });
    } else if (roleCode === 1) {
      response = await models.murid.findOne({
        where: { idMurid: siswa_id },
        include: [
          { model: models.auth, as: "auth", attributes: ["nisn"] },
        ],
      });
    }

    if (!response) {
      return res.status(404).json({
        code: 404,
        status: "error",
        message: "Profile tidak ditemukan",
        data: null,
      });
    }

    // Buat URL gambar jika ada
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    if (response.image) {
      response.image = `${baseUrl}/uploads/${response.image}`;
    }

    res.status(200).json({
      code: 200,
      status: "success",
      message: "Profile retrieved successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ msg: error.message });
  }
};

// Memperbarui data profil
const updateProfile = async (req, res) => {
  try {
    const { idUser } = req.decoded;
    const { nama, alamat, noHp, kelas } = req.body;

   

    const result = await models.user.update(
      { nama, alamat, noHp, kelas, updatedAt: new Date() },
      { where: { idUser } }
    );

    if (result[0] === 0) {
      return res.status(404).json({ msg: "Profile tidak ditemukan" });
    }

    res.status(200).json({ msg: "Profile berhasil diperbarui" });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ msg: error.message });
  }
};

// Mengubah password
const changePassword = async (req, res) => {
  try {
    const { idUser } = req.decoded;
    const { oldPassword, newPassword } = req.body;

    const user = await models.auth.findOne({
      include: [{ model: models.user, as: "user", where: { idUser } }],
    });

    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Password lama salah" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await models.auth.update(
      { password: hashedPassword, updatedAt: new Date() },
      { where: { idAuth: user.idAuth } }
    );

    res.status(200).json({ msg: "Password berhasil diubah" });
  } catch (error) {
    console.error("Error in changePassword:", error);
    res.status(500).json({ msg: error.message });
  }
};

// Memperbarui foto profil
const updateProfilePicture = async (req, res) => {
  try {
    const { idMurid: siswa_id, idStaff: staff_id, roleCode } = req.decoded;
    const { file } = req;

    if (!file) {
      return res.status(400).json({ msg: "Tidak ada file yang diunggah" });
    }

    let user;
    if (roleCode === 2) {
      user = await models.staff.findOne({ where: { idStaff: staff_id } });
    } else if (roleCode === 1) {
      user = await models.murid.findOne({ where: { idMurid: siswa_id } });
    }

    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    // Menghapus file lama jika ada
    if (user.image) {
      const oldImagePath = path.join(__dirname, "../uploads", user.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Menyimpan file baru
    if (roleCode === 2) {
      await models.staff.update(
        { image: file.filename, updatedAt: new Date() },
        { where: { idStaff: staff_id } }
      );
    } else if (roleCode === 1) {
      await models.murid.update(
        { image: file.filename, updatedAt: new Date() },
        { where: { idMurid: siswa_id } }
      );
    }

    res.status(200).json({ msg: "Foto profil berhasil diperbarui" });
  } catch (error) {
    console.error("Error in updateProfilePicture:", error);
    res.status(500).json({ msg: error.message });
  }
};

// Mendapatkan foto profil
const getProfilePicture = async (req, res) => {
  try {
    const { idMurid: siswa_id, idStaff: staff_id, roleCode } = req.decoded;
    let user;

    if (roleCode === 2) {
      user = await models.staff.findOne({ where: { idStaff: staff_id } });
    } else if (roleCode === 1) {
      user = await models.murid.findOne({ where: { idMurid: siswa_id } });
    }

    if (!user || !user.image) {
      return res.status(404).json({ msg: "Foto profil tidak ditemukan" });
    }

    const filePath = path.join(__dirname, "../uploads", user.image);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ msg: "File tidak ditemukan" });
    }

    res.setHeader('Content-Type', 'image/jpeg');
    res.sendFile(filePath);
  } catch (error) {
    console.error("Error in getProfilePicture:", error);
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  updateProfilePicture,
  getProfilePicture,
};
