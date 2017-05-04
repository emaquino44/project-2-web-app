var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var db = require('../models');


//Able to take User info and covert to Id and store in database
passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

//User Id is converted so that you can look them up in the database

passport.deserializeUser(function(id, cb) {
    db.user.findById(id).then(function(user) {
        cb(null, user);
    }).catch(cb);
});


//User is able to use their Passwords
passport.use(new localStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function(email, password, cb) {
    db.user.findOne({
        where: { email: email }
    }).then(function(user) {
        if (!user || !user.isValidPassword(password)) {
            cb(null, false);
        } else {
            cb(null, user); //User has permission
        }
    }).catch(cb);
}));

module.exports = passport;
