module.exports = function(req, res, next) {
    if (!req.user) {
        req.flash('error', 'You must be logged in to view this page'); //Alert that you need to login in first
        res.redirect('/auth/login'); //Redirect back to Login page
    } else {
        next(); //Continue!)
    }
};
