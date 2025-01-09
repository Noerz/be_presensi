const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('jadwal', {
    idJadwal: {
      type: DataTypes.STRING(36),
      allowNull: false,
      primaryKey: true
    },
    hari: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    tahun: {
      type: DataTypes.STRING(4),
      allowNull: false
    },
    jam_mulai: {
      type: DataTypes.STRING(6),
      allowNull: false
    },
    jam_selesai: {
      type: DataTypes.STRING(6),
      allowNull: false
    },
    mapel_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: 'mata_pelajaran',
        key: 'idMapel'
      }
    },
    guru_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: 'staff',
        key: 'idStaff'
      }
    },
    kelas_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: 'kelas',
        key: 'idKelas'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'jadwal',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idJadwal" },
        ]
      },
      {
        name: "mapel_id",
        using: "BTREE",
        fields: [
          { name: "mapel_id" },
        ]
      },
      {
        name: "guru_id",
        using: "BTREE",
        fields: [
          { name: "guru_id" },
        ]
      },
      {
        name: "kelas_id",
        using: "BTREE",
        fields: [
          { name: "kelas_id" },
        ]
      },
    ]
  });
};
