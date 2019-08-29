'use strict';
module.exports = (sequelize, DataTypes) => {
  const PcNpcRelationship = sequelize.define('PcNpcRelationship', {
    PcName: DataTypes.STRING,
    NpcName: DataTypes.STRING,
    Relationship: DataTypes.STRING,
  }, {});
  PcNpcRelationship.associate = function(models) {
    // models.Pc.belongsToMany(models.Npc, {through: 'PcNpcRelationship'});
    // models.PcNpcRelationship.belongsToMany(models.Pc, {through: 'PcNpcRelationship'});
  };
  return PcNpcRelationship;
};