'use strict';
module.exports = function(sequelize, DataTypes) {
  var review = sequelize.define('review', {
    review: DataTypes.STRING,
    ratings: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return review;
};