'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Npcs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      race: {
        type: Sequelize.STRING
      },
      profession: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      lifeState: {
        type: Sequelize.STRING
      },
      ImageId:{
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      imageSrc:{
        type: Sequelize.STRING,
        allowNull: true,
      },
      sharedBio: {
        type: Sequelize.STRING
      },
      privateBio: {
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
    return queryInterface.dropTable('Npcs');
  }
};