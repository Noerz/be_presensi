var DataTypes = require("sequelize").DataTypes;
var _auth = require("./auth");
var _jadwal = require("./jadwal");
var _mata_pelajaran = require("./mataPelajaran");
var _murid = require("./murid");
var _presensi = require("./presensi");
var _role = require("./role");
var _sekolah = require("./sekolah");
var _staff = require("./staff");

function initModels(sequelize) {
  var auth = _auth(sequelize, DataTypes);
  var jadwal = _jadwal(sequelize, DataTypes);
  var mata_pelajaran = _mata_pelajaran(sequelize, DataTypes);
  var murid = _murid(sequelize, DataTypes);
  var presensi = _presensi(sequelize, DataTypes);
  var role = _role(sequelize, DataTypes);
  var sekolah = _sekolah(sequelize, DataTypes);
  var staff = _staff(sequelize, DataTypes);

  murid.belongsTo(auth, { as: "auth", foreignKey: "auth_id"});
  auth.hasMany(murid, { as: "murids", foreignKey: "auth_id"});
  staff.belongsTo(auth, { as: "auth", foreignKey: "auth_id"});
  auth.hasMany(staff, { as: "staffs", foreignKey: "auth_id"});
  presensi.belongsTo(jadwal, { as: "jadwal", foreignKey: "jadwal_id"});
  jadwal.hasMany(presensi, { as: "presensis", foreignKey: "jadwal_id"});
  jadwal.belongsTo(mata_pelajaran, { as: "mapel", foreignKey: "mapel_id"});
  mata_pelajaran.hasMany(jadwal, { as: "jadwals", foreignKey: "mapel_id"});
  presensi.belongsTo(murid, { as: "siswa", foreignKey: "siswa_id"});
  murid.hasMany(presensi, { as: "presensis", foreignKey: "siswa_id"});
  auth.belongsTo(role, { as: "role", foreignKey: "role_id"});
  role.hasMany(auth, { as: "auths", foreignKey: "role_id"});
  presensi.belongsTo(sekolah, { as: "school", foreignKey: "school_id"});
  sekolah.hasMany(presensi, { as: "presensis", foreignKey: "school_id"});
  jadwal.belongsTo(staff, { as: "guru", foreignKey: "guru_id"});
  staff.hasMany(jadwal, { as: "jadwals", foreignKey: "guru_id"});
  presensi.belongsTo(staff, { as: "staff", foreignKey: "staff_id"});
  staff.hasMany(presensi, { as: "presensis", foreignKey: "staff_id"});

  return {
    auth,
    jadwal,
    mata_pelajaran,
    murid,
    presensi,
    role,
    sekolah,
    staff,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
