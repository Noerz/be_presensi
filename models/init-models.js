var DataTypes = require("sequelize").DataTypes;
var _auth = require("./auth");
var _jadwal = require("./jadwal");
var _kelas = require("./kelas");
var _mata_pelajaran = require("./mataPelajaran");
var _presensi = require("./presensi");
var _role = require("./role");
var _user = require("./user");

function initModels(sequelize) {
  var auth = _auth(sequelize, DataTypes);
  var jadwal = _jadwal(sequelize, DataTypes);
  var kelas = _kelas(sequelize, DataTypes);
  var mata_pelajaran = _mata_pelajaran(sequelize, DataTypes);
  var presensi = _presensi(sequelize, DataTypes);
  var role = _role(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  user.belongsTo(auth, { as: "auth", foreignKey: "auth_id"});
  auth.hasMany(user, { as: "users", foreignKey: "auth_id"});
  presensi.belongsTo(jadwal, { as: "jadwal", foreignKey: "jadwal_id"});
  jadwal.hasMany(presensi, { as: "presensis", foreignKey: "jadwal_id"});
  jadwal.belongsTo(kelas, { as: "kelas", foreignKey: "kelas_id"});
  kelas.hasMany(jadwal, { as: "jadwals", foreignKey: "kelas_id"});
  jadwal.belongsTo(mata_pelajaran, { as: "mapel", foreignKey: "mapel_id"});
  mata_pelajaran.hasMany(jadwal, { as: "jadwals", foreignKey: "mapel_id"});
  auth.belongsTo(role, { as: "role", foreignKey: "role_id"});
  role.hasMany(auth, { as: "auths", foreignKey: "role_id"});
  jadwal.belongsTo(user, { as: "guru", foreignKey: "guru_id"});
  user.hasMany(jadwal, { as: "jadwals", foreignKey: "guru_id"});
  presensi.belongsTo(user, { as: "siswa", foreignKey: "siswa_id"});
  user.hasMany(presensi, { as: "presensis", foreignKey: "siswa_id"});

  return {
    auth,
    jadwal,
    kelas,
    mata_pelajaran,
    presensi,
    role,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
