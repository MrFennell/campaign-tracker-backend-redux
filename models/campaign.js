'use strict';
module.exports = (sequelize, DataTypes) => {
  const Campaign = sequelize.define('Campaign', {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    createdBy: DataTypes.STRING
  }, {});
  Campaign.associate = function(models) {
    // Campaign.belongsToMany(models.User, {through: 'UserCampaign'});
  };
  return Campaign;
};