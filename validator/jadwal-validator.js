const { body } = require("express-validator");

const createJadwalValidation = [
  body("hari").notEmpty(),
  body("tahun").notEmpty().isNumeric(),
  body("jam_mulai").notEmpty(),
  body("jam_selesai").notEmpty(),
  body("mapel_id").notEmpty(),
  body("guru_id").notEmpty(),
  body("kelas_id").notEmpty(),
];

module.exports = { createJadwalValidation };
