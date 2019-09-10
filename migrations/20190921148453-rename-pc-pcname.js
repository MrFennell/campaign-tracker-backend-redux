'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('Pcs', 'pcName', 'name');
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('Pcs','name','pcName');
  }
};