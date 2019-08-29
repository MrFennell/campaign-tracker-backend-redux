'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('PcNpcRelationships', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      PcId: {
        type: Sequelize.INTEGER,
      },
      NpcId: {
        type: Sequelize.INTEGER,
      },
      PcName:{
        type: Sequelize.STRING
      },
      NpcName:{
        type: Sequelize.STRING
      },
      Relationship: {
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
    return queryInterface.dropTable('PcNpcRelationships');
  }
};