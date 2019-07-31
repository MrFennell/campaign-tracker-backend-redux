'use strict';
module.exports = (sequelize, DataTypes) => {
  const CampaignPc = sequelize.define('CampaignPc', {
  }, {});
  CampaignPc.associate = function(models) {
    models.Pc.belongsToMany(models.Campaign, {through: 'CampaignPc'});
    models.Campaign.belongsToMany(models.Pc, {through: 'CampaignPc'});
  };
  return CampaignPc;
};