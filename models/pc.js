'use strict';
module.exports = (sequelize, DataTypes) => {
  const Pc = sequelize.define('Pc', {
    name: DataTypes.STRING,
    playerName: DataTypes.STRING,
    pcClass: DataTypes.STRING,
    pcRace: DataTypes.STRING,
    pcDescription: DataTypes.STRING,
    pcLevel: DataTypes.STRING,
    pcLifestate: DataTypes.STRING,
    pcSharedBio: DataTypes.STRING,
    pcPrivateBio: DataTypes.STRING,
    ImageId: DataTypes.STRING,
    imageSrc: DataTypes.STRING
  }, {});
  Pc.associate = function(models) {
    models.Pc.hasMany(models.Image);
  };
  return Pc;
};