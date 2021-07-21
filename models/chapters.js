'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chapters extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Book }) {
      // define association here
      this.belongsTo(Book, { foreignKey: 'bookId', as: 'book' })
    }
  };
  Chapters.init({
    chapter_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    chapter_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    start_page: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    end_page: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'chapters',
    modelName: 'Chapters',
  });
  return Chapters;
};