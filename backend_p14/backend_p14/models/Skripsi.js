const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Skripsi', {
    nama: { type: DataTypes.STRING, allowNull: false },
    nim: { type: DataTypes.STRING, allowNull: false },
    judul: { type: DataTypes.STRING, allowNull: false },
    pembimbing: { type: DataTypes.STRING, allowNull: false },
  });
};
