'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Chapters }) {
      // define association here
      this.hasMany(Chapters, { foreignKey: 'bookId', as: 'chapters' })
    }
  };
  Book.init({
    book_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
      allowNull: false
    },
    book_file: {
      type: DataTypes.STRING(),
      allowNull: false
    },
  }, {
    sequelize,
    tableName: 'books',
    modelName: 'Book',
  });
  return Book;
};