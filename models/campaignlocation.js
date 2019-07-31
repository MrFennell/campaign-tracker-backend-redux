'use strict';
module.exports = (sequelize, DataTypes) => {
  const CampaignLocation = sequelize.define('CampaignLocation', {
  }, {});
  CampaignLocation.associate = function(models) {
    models.Location.belongsToMany(models.Campaign, {through: 'CampaignLocation'});
    models.Campaign.belongsToMany(models.Location, {through: 'CampaignLocation'});
  };
  return CampaignLocation;
};