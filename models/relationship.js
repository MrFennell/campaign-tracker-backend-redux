'use strict';
module.exports = (sequelize, DataTypes) => {
  const Relationship = sequelize.define('Relationship', {
    PcId: DataTypes.STRING,
    NpcId: DataTypes.STRING,
    LocationId: DataTypes.STRING,
    PcId2: DataTypes.STRING,
    NpcId2: DataTypes.STRING,
    LocationId2: DataTypes.STRING,
    PcName: DataTypes.STRING,
    NpcName: DataTypes.STRING,
    LocationName: DataTypes.STRING,
    PcName2: DataTypes.STRING,
    NpcName2: DataTypes.STRING,
    LocationName2: DataTypes.STRING,
    Relationship:DataTypes.STRING,
    Description: DataTypes.STRING,
  }, {});
  Relationship.associate = function(models) {
  };
  return Relationship;
};