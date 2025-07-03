const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Materias = sequelize.define('boletim', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  materia: {
    type: DataTypes.JSON,
    allowNull: false
  },
});

module.exports = Materias;
