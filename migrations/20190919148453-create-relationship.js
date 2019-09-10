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
      PcId2: {
        type: Sequelize.INTEGER
      },
      NpcId: {
        type: Sequelize.INTEGER
      },
      NpcId2: {
        type: Sequelize.INTEGER
      },
      LocationId: {
        type: Sequelize.INTEGER
      },
      LocationId2: {
        type: Sequelize.INTEGER
      },
      SessionId:{
        type: Sequelize.INTEGER
      },
      relationship: {
        type: Sequelize.STRING
      },
      description: {
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