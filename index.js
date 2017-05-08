//Set Global
require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
var db = require('./models');
var methods = require('methods');
var flash = require('connect-flash');
var request = require('request');
var session = require('express-session');
var passport = require('passport');
var isloggedin = require('./middleware/isloggedin');

var app = express();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(flash());


//Initalize the passport and session config as middleware
app.use(passport.initialize());
app.use(passport.session());

//
app.use(function(req, res, next) {
    res.locals.alerts = req.flash();
    res.locals.currentUser = req.user;
    next();
});

app.get("/", function(req, res) {
    res.render('home');
});


app.get("/recipes", function(req, res) {
    var qs = {
        app_id: process.env.APP_ID,
        app_key: process.env.APP_KEY,
        q: 'filipino',
        from: 0,
        to: 50,

    };
    request({
        url: 'https://api.edamam.com/search',
        qs: qs
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var dataObj = JSON.parse(body);
            res.render("recipes", { recipes: dataObj.hits });
            // res.send(dataObj.hits);

        }
    });
});

app.get("/addRecipes", function(req, res) {
    res.render('addRecipes');
});

app.get("/profile", isloggedin, function(req, res) {
    res.render('profile');
});

app.delete('/addRecipe/:name', function(req, res) {
    var nameOfTheRecipe = req.params.name;

    db.newRecipe.destroy({
        where: { name: nameOfTheRecipe }
    }).then(function() {
        res.status(204).redirect('/home'); // http://stackoverflow.com/a/17093684
        res.send({ message: 'success' });
    });
});

//controllers
app.use('/auth', require('./controllers/auth'));


//Set Listen
app.listen(process.env.PORT || 3000);
