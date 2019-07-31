'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Pcs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      pcName: {
        type: Sequelize.STRING
      },
      playerName: {
        type: Sequelize.STRING
      },
      pcClass: {
        type: Sequelize.STRING
      },
      pcDescription: {
        type: Sequelize.STRING
      },
      pcLevel: {
        type: Sequelize.STRING,
      },
      pcLifestate: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pcSharedBio: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pcPrivateBio: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pcRace: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ImageId:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      imageSrc:{
        type: Sequelize.STRING,
        allowNull: true,
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
    return queryInterface.dropTable('Pcs');
  }
};