'use strict';
module.exports = (sequelize, DataTypes) => {
  const Npc = sequelize.define('Npc', {
    name: DataTypes.STRING,
    race: DataTypes.STRING,
    profession: DataTypes.STRING,
    description: DataTypes.STRING,
    lifeState: DataTypes.STRING,
    sharedBio: DataTypes.STRING,
    privateBio: DataTypes.STRING,
    ImageId: DataTypes.STRING,
    imageSrc: DataTypes.STRING
  }, {});
  Npc.associate = function(models) {
    models.Npc.hasMany(models.Image);
  };
  return Npc;
};