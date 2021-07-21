'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('chapters', {
      chapter_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      chapter_name: {
        type: Sequelize.STRING
      },
      start_page: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      end_page: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      bookId: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('chapters');
  }
};