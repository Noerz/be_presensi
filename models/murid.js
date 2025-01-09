const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('murid', {
    idMurid: {
      type: DataTypes.STRING(36),
      allowNull: false,
      primaryKey: true
    },
    nama: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    noHp: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(6),
      allowNull: true
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    kelas: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    auth_id: {
      type: DataTypes.STRING(36),
      allowNull: false,
      references: {
        model: 'auth',
        key: 'idAuth'
      }
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true
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
    tableName: 'murid',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idMurid" },
        ]
      },
      {
        name: "auth_id",
        using: "BTREE",
        fields: [
          { name: "auth_id" },
        ]
      },
    ]
  });
};
