const { DataTypes } = require('sequelize');
const sequelize = require('../database/connection');

const ImagenProducto = sequelize.define('ImagenProducto', {
  id_imagen_producto: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'producto',
      key: 'id_producto',
    },
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'imagen_producto',
  timestamps: false,
});

module.exports = ImagenProducto;
