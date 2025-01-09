const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('presensi', {
    idPresensi: {
      type: DataTypes.STRING(36),
      allowNull: false,
      primaryKey: true
    },
    inLocation: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    inTime: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    inStatus: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    inKeterangan: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    outLocation: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    outTime: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    outStatus: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    outKeterangan: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    siswa_id: {
      type: DataTypes.STRING(36),
      allowNull: true,
      references: {
        model: 'murid',
        key: 'idMurid'
      }
    },
    staff_id: {
      type: DataTypes.STRING(36),
      allowNull: true,
      references: {
        model: 'staff',
        key: 'idStaff'
      }
    },
    jadwal_id: {
      type: DataTypes.STRING(36),
      allowNull: true,
      references: {
        model: 'jadwal',
        key: 'idJadwal'
      }
    },
    school_id: {
      type: DataTypes.STRING(36),
      allowNull: true,
      references: {
        model: 'sekolah',
        key: 'idSekolah'
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
    tableName: 'presensi',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idPresensi" },
        ]
      },
      {
        name: "siswa_id",
        using: "BTREE",
        fields: [
          { name: "siswa_id" },
        ]
      },
      {
        name: "staff_id",
        using: "BTREE",
        fields: [
          { name: "staff_id" },
        ]
      },
      {
        name: "school_id",
        using: "BTREE",
        fields: [
          { name: "school_id" },
        ]
      },
      {
        name: "jadwal_id",
        using: "BTREE",
        fields: [
          { name: "jadwal_id" },
        ]
      },
    ]
  });
};
