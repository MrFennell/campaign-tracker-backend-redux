'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Relationships', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      PcId: {
        type: Sequelize.INTEGER
      },
      NpcId: {
        type: Sequelize.INTEGER
      },
      LocationId: {
        type: Sequelize.INTEGER
      },
      PcId2: {
        type: Sequelize.INTEGER
      },
      NpcId2: {
        type: Sequelize.INTEGER
      },
      LocationId2: {
        type: Sequelize.INTEGER
      },
      PcName:{
        type: Sequelize.STRING
      },
      NpcName:{
        type: Sequelize.STRING
      },
      LocationName:{
        type: Sequelize.STRING
      },
      PcName2:{
        type: Sequelize.STRING
      },
      NpcName2:{
        type: Sequelize.STRING
      },
      LocationName2:{
        type: Sequelize.STRING
      },
      Relationship: {
        type: Sequelize.STRING
      },
      Description: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Relationships');
  }
};