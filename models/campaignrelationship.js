'use strict';
module.exports = (sequelize, DataTypes) => {
  const CampaignRelationship = sequelize.define('CampaignRelationship', {
  }, {});
  CampaignRelationship.associate = function(models) {
    models.Relationship.belongsToMany(models.Campaign, {through: 'CampaignRelationship'});
    models.Campaign.belongsToMany(models.Relationship, {through: 'CampaignRelationship'});
  };
  return CampaignRelationship;
};