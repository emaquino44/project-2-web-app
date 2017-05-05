'use strict';
var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
    var user = sequelize.define('user', {
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: {
                    msg: "Invalid email address"
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            validate: {
                len: {
                    args: [4, 32],
                    msg: "Password must be between 4 and 32 characters in length"
                },
                isAlphanumeric: {
                    msg: "No special characters allowed in password!!"
                }
            }
        }
    }, {
        hooks: {
            beforeCreate: function(user, options, cb) {
                if (user && user.password) {
                    var hash = bcrypt.hashSync(user.password, 10);
                    user.password = hash; //change password value to the hash BEFORE inserting into the DB
                }
                cb(null, user);
            }
        },

        classMethods: {
            associate: function(models) {
                // associations can be defined here
                models.user.hasMany(models.newRecipe);
            }
        },
        instanceMethods: {
            isValidPassword: function(passwordTyped) {
                return bcrypt.compareSync(passwordTyped, this.password);
            },
            toJSON: function() {
                var data = this.get();
                delete data.password;
                return data;
            },
            getFullName: function() {
                return this.firstName + " " + this.lastName;
            }
        }
    });
    return user;
};
