'use strict';
module.exports = (sequelize, DataTypes) => {
  const CampaignNpc = sequelize.define('CampaignNpc', {
    // NpcId: DataTypes.STRING,
    // CampaignId: DataTypes.STRING
  }, {});
  CampaignNpc.associate = function(models) {
    models.Npc.belongsToMany(models.Campaign, {through: 'CampaignNpc'});
    models.Campaign.belongsToMany(models.Npc, {through: 'CampaignNpc'});
  };
  return CampaignNpc;
};