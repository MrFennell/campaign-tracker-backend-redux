'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserCampaign = sequelize.define('UserCampaign', {
    role: DataTypes.STRING
  }, {
  });
  UserCampaign.associate = function(models) {
    models.User.belongsToMany(models.Campaign, {through: 'UserCampaign'});
    models.Campaign.belongsToMany(models.User, {through: 'UserCampaign'});
  };
  return UserCampaign;
};