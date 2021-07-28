'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('books', {
      book_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,

      },
      author: {
        type: DataTypes.STRING,
        allowNull: false
      },
      published_date: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING(1000),
        allowNull: false
      },
      thumbnail_url: {
        type: DataTypes.STRING,
        allowNull: true
      },
      book_file: {
        type: DataTypes.STRING,
        allowNull: false
      },
      donator: {
        type: DataTypes.STRING,
        allowNull: false
      },
      donator_phone_number: {
        type: DataTypes.STRING,
        allowNull: false
      },
      is_ready: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('books');
  }
};