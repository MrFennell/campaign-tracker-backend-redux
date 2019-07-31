'use strict';
module.exports = (sequelize, DataTypes) => {
  const Location = sequelize.define('Location', {
    name: DataTypes.STRING,
    region: DataTypes.STRING,
    imageSrc: DataTypes.STRING
  }, {});
  Location.associate = function(models) {
    models.Location.hasMany(models.Image);
  };
  return Location;
};