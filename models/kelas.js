const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('kelas', {
    idKelas: {
      type: DataTypes.STRING(36),
      allowNull: false,
      primaryKey: true
    },
    nama_kelas: {
      type: DataTypes.STRING(2),
      allowNull: false
    },
    jumlah: {
      type: DataTypes.STRING(2),
      allowNull: false
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
    tableName: 'kelas',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idKelas" },
        ]
      },
    ]
  });
};
