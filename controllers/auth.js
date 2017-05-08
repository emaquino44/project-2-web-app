var express = require('express');
var passport = require('../config/passportConfig');
// var LocalStrategy = require('passport-local').Strategy;

var db = require('../models');
var router = express.Router();

//Routes
router.get('/login', function(req, res) {
    res.render('loginform');
});


//POST - Login
router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    successFlash: 'You are now Logged In',
    failureRedirect: '/auth/login',
    failureFlash: 'Please Try Again'
}));

//GET -

router.get('/signup', function(req, res) {
    res.render('signform');
});


//Post - Create a new User
router.post('/signup', function(req, res, next) {
    db.user.findOrCreate({
        where: { email: req.body.email },
        defaults: {
            'firstName': req.body.firstName,
            'lastName': req.body.lastName,
            'password': req.body.password
        }
    }).spread(function(user, wasCreated) {
        if (wasCreated) {
            //GOOD! log them in
            passport.authenticate('local', {
                successRedirect: '/profile',
                successFlash: 'Account created and logged in!',
                failureRedirect: '/login',
                failureFlash: 'Unknown error occured, please re-login. :('
            })(req, res, next);
        } else {
            //BAD!
            req.flash('error', 'Email already exists! Please Login.');
            res.redirect('/auth/login');
        }
    }).catch(function(error) {
        req.flash('error', error.message);
        res.redirect('/auth/signup');
    });
});


//GET - User will get a message to that they successfully logged out
router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success', 'You Successfully Logged Out');
    res.redirect('/');

});

router.get('/recipes', function(req, res) {
    res.render('recipes');
});


//GET - User is requesting a form to add a new recipe

router.get('/addRecipes', function(req, res) {
    res.render('addRecipes');
});


//POST - User will Add new recipe

router.post('/addRecipes', function(req, res) {
    db.newRecipe.create({
            name: req.body.name,
            ingredients: req.body.ingredients,
            directions: req.body.directions
        })
        .then(function(newRecipe) {
            res.render('show', { newRecipe: newRecipe });
        })
        .catch(function(error) {
            res.status(404).render('main/404');
        });
});

//DELETE - User can delete a recipe
router.delete('/:name', function(req, res) {
    var name = req.params.name;

    db.newRecipe.destroy({
        where: { name: name }
    }).then(function() {
        res.status(204).redirect('/home');
    });
});


//Export
module.exports = router;
