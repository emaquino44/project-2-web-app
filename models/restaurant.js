'use strict';
module.exports = function(sequelize, DataTypes) {
  var restaurant = sequelize.define('restaurant', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    website: DataTypes.STRING,
    phone: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return restaurant;
};