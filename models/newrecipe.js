'use strict';
module.exports = function(sequelize, DataTypes) {
  var newRecipe = sequelize.define('newRecipe', {
    name: DataTypes.STRING,
    ingredients: DataTypes.TEXT,
    directions: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return newRecipe;
};