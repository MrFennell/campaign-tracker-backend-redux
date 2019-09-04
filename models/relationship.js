'use strict';
module.exports = (sequelize, DataTypes) => {
  const Relationship = sequelize.define('Relationship', {
    PcId: DataTypes.STRING,
    NpcId: DataTypes.STRING,
    LocationId: DataTypes.STRING,
    PcId2: DataTypes.STRING,
    NpcId2: DataTypes.STRING,
    LocationId2: DataTypes.STRING,
    SessionId: DataTypes.STRING,
    Relationship: DataTypes.STRING,
    Description: DataTypes.STRING,
  }, {});
  Relationship.associate = function(models) {
  };
  return Relationship;
};