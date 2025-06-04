const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sekolah', {
    idSekolah: {
      type: DataTypes.STRING(36),
      allowNull: false,
      primaryKey: true
    },
    location: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    inTime: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    outTime: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    }
  }, {
    sequelize,
    tableName: 'sekolah',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idSekolah" },
        ]
      },
    ]
  });
};
