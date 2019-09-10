'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('pcs', 'pcName', 'name');
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('pcs','name','pcName');
  }
};