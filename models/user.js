const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    idUser: {
      type: DataTypes.STRING(36),
      allowNull: false,
      primaryKey: true
    },
    nama: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    nip: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    noHp: {
      type: DataTypes.STRING(15),
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
    jabatan: {
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
      type: DataTypes.CHAR(2),
      allowNull: true,
      defaultValue: "1"
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('current_timestamp')
    }
  }, {
    sequelize,
    tableName: 'user',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idUser" },
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
